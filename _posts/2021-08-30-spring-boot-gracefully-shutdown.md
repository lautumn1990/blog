---
title: spring boot 优雅停机
tags: [ java, spring, springboot, shutdown, linux ]
categories: [ java ]
key: spring-boot-gracefully-shutdown
pageview: true
---

## kill命令

linux 信号[^linux-signal]

[^linux-signal]: [kill命令](https://wangchujiang.com/linux-command/c/kill.html)

发送信号到进程。

<!--more-->

```shell
[user2@pc] kill -l 9
KILL

# 列出所有信号名称：
[user2@pc] kill -l
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL
 5) SIGTRAP      6) SIGABRT      7) SIGBUS       8) SIGFPE
 9) SIGKILL     10) SIGUSR1     11) SIGSEGV     12) SIGUSR2
13) SIGPIPE     14) SIGALRM     15) SIGTERM     16) SIGSTKFLT
17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU
25) SIGXFSZ     26) SIGVTALRM   27) SIGPROF     28) SIGWINCH
29) SIGIO       30) SIGPWR      31) SIGSYS      34) SIGRTMIN
35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3  38) SIGRTMIN+4
39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12
47) SIGRTMIN+13 48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14
51) SIGRTMAX-13 52) SIGRTMAX-12 53) SIGRTMAX-11 54) SIGRTMAX-10
55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7  58) SIGRTMAX-6
59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX

# 下面是常用的信号。
# 只有第9种信号(SIGKILL)才可以无条件终止进程，其他信号进程都有权利忽略。

HUP     1    终端挂断
INT     2    中断（同 Ctrl + C）
QUIT    3    退出（同 Ctrl + 反斜杠）
KILL    9    强制终止
TERM   15    终止
CONT   18    继续（与STOP相反，fg/bg命令）
STOP   19    暂停（同 Ctrl + Z）
```

```shell
# 以下发送KILL信号的形式等价。当然还有更多的等价形式，在此不一一列举了。
[user2@pc] kill -s SIGKILL PID
[user2@pc] kill -s KILL PID
[user2@pc] kill -n 9 PID
[user2@pc] kill -9 PID

[user2@pc] sleep 90 &
[1] 178420

# 终止作业标识符为1的作业。
[user2@pc] kill -9 %1

[user2@pc] jobs -l
[1]+ 178420 KILLED                  ssh 192.168.1.4

[user2@pc] sleep 90 &
[1] 181357

# 发送停止信号。
[user2@pc] kill -s STOP 181357

[user2@pc] jobs -l
[1]+ 181537 Stopped (signal)        sleep 90

# 发送继续信号。
[user2@pc] kill -s CONT 181357

[user2@pc] jobs -l
[1]+ 181537 Running                 sleep 90 &
```

## 什么是优雅停机

```java
@RestController
public class DemoController {
    @GetMapping("/demo")
    public String demo() throws InterruptedException {
        // 模拟业务耗时处理流程
        Thread.sleep(20 * 1000L);
        return "hello";
    }
}
```

当我们流量请求到此接口执行业务逻辑的时候，若服务端此时执行关机 （kill），spring boot 默认情况会直接关闭容器（tomcat 等），导致此业务逻辑执行失败。在一些业务场景下：会出现数据不一致的情况，事务逻辑不会回滚。

## spring boot graceful shutdown

在最新的 spring boot 2.3 版本，内置此功能，不需要再自行扩展容器线程池来处理，目前 spring boot 嵌入式支持的 web 服务器（Jetty、Reactor Netty、Tomcat 和 Undertow）以及反应式和基于 Servlet 的 web 应用程序都支持优雅停机功能。我们来看下如何使用:

当使用 `server.shutdown=graceful` 启用时，在 web 容器关闭时，web 服务器将不再接收新请求，并将等待活动请求完成的缓冲期。[^spring-boot-gracefully-shutdown]

[^spring-boot-gracefully-shutdown]: [graceful-shutdown](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.graceful-shutdown)

> Graceful shutdown is supported with all four embedded web servers (Jetty, Reactor Netty, Tomcat, and Undertow) and with both reactive and Servlet-based web applications. It occurs as part of closing the application context and is performed in the earliest phase of stopping SmartLifecycle beans. This stop processing uses a timeout which provides a grace period during which existing requests will be allowed to complete but no new requests will be permitted. The exact way in which new requests are not permitted varies depending on the web server that is being used. Jetty, Reactor Netty, and Tomcat will stop accepting requests at the network layer. Undertow will accept requests but respond immediately with a service unavailable (503) response.
>
>> Graceful shutdown with Tomcat requires Tomcat 9.0.33 or later.
>
> To enable graceful shutdown, configure the server.shutdown property, as shown in the following example:
>
>> `server.shutdown=graceful`
>
> To configure the timeout period, configure the spring.lifecycle.timeout-per-shutdown-phase property, as shown in the following example:
>
>> `spring.lifecycle.timeout-per-shutdown-phase=20s`
>
> Using graceful shutdown with your IDE may not work properly if it does not send a proper SIGTERM signal. Refer to the documentation of your IDE for more details.

原理

```java
//ApplicationContext
@Override
public void registerShutdownHook() {
    if (this.shutdownHook == null) {
        // No shutdown hook registered yet.
        this.shutdownHook = new Thread(SHUTDOWN_HOOK_THREAD_NAME) {
            @Override
            public void run() {
                synchronized (startupShutdownMonitor) {
                    doClose();
                }
            }
        };
        Runtime.getRuntime().addShutdownHook(this.shutdownHook);
    }
}
```

- kill -9，暴力强制杀死进程，不会执行 ShutdownHook
- windows 只能通过`ctrl+c`模拟优雅停机, 因为windows本身不支持kill命令, 没有信号的概念, 可以通过`Intellij Idea`的`run`tab中的`Exit`, 模拟`ctrl+c`

### 通过 actuator 端点实现优雅停机

POST 请求 `/actuator/shutdown` 即可执行优雅关机。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```conf
management.endpoints.web.exposure.include=*
management.endpoint.shutdown.enabled=true
endpoints.shutdown.enabled=true
```

```java
@Endpoint(id = "shutdown", enableByDefault = false)
public class ShutdownEndpoint implements ApplicationContextAware {

    @WriteOperation
    public Map<String, String> shutdown() {
        Thread thread = new Thread(this::performShutdown);
        thread.setContextClassLoader(getClass().getClassLoader());
        thread.start();
    }

    private void performShutdown() {
        try {
            Thread.sleep(500L);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }

        // 此处close 逻辑和上边 shutdownhook 的处理一样
        this.context.close();
    }
}
```

### 不同 web 容器优雅停机行为区别

容器停机行为取决于具体的 web 容器行为

| web容器名称    | 行为说明                             |
| -------------- | ------------------------------------ |
| tomcat 9.0.33+ | 停止接受请求,客户端新请求等待超时    |
| reactor netty  | 停止接受请求,客户端新请求等待超时    |
| undertow       | 停止接受请求,客户端新请求直接返回503 |

## k8s中的liveness和readiness配置[^k8s]

[^k8s]: [Configuring Graceful-Shutdown, Readiness and Liveness Probe in Spring Boot 2.3.0](https://dzone.com/articles/configuring-graceful-shutdown-readiness-and-livene)

```conf
management.endpoint.health.probes.enabled=true
```

```shell
$ curl http://localhost:8080/actuator/health
{"status":"UP","groups":["liveness","readiness"]}
$ curl http://localhost:8080/actuator/health/liveness
{"status":"UP"}
$ curl http://localhost:8080/actuator/health/readiness
{"status":"UP"}
```

```java
// 修改readniess状态, 200, ACCEPTING_TRAFFIC, {"status":"UP"}
AvailabilityChangeEvent.publish(eventPublisher, this, ReadinessState.ACCEPTING_TRAFFIC);
// 修改readniess状态, 503, REFUSING_TRAFFIC, {"status":"OUT_OF_SERVICE"}
AvailabilityChangeEvent.publish(eventPublisher, this, ReadinessState.REFUSING_TRAFFIC);
// 修改readniess状态, 503, CORRECT, {"status":"UP"}
AvailabilityChangeEvent.publish(eventPublisher, this, LivenessState.CORRECT);
// 修改readniess状态, 503, BROKEN, {"status":"DOWN"}
AvailabilityChangeEvent.publish(eventPublisher, this, LivenessState.BROKEN);
```

参考

- [Spring Boot如何优雅停机？](https://zhuanlan.zhihu.com/p/144659953)
- [Spring boot 2.3优雅下线，距离生产还有多远？](https://developer.aliyun.com/article/776108)
- [Shutdown a Spring Boot Application](https://www.baeldung.com/spring-boot-shutdown)
- [Web Server Graceful](https://www.baeldung.com/spring-boot-web-server-shutdown)
