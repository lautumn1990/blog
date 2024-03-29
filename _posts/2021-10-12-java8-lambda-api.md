---
title: Java 8 lambda 用法
tags: [ java ]
categories: [ java ]
key: java8-lambda-api
pageview: true
---

Java 8 lambda 用法

<!--more-->

## Lambda and Anonymous Classes(I)

### 前言

Java *Lambda表达式*的一个重要用法是简化某些*匿名内部类*（`Anonymous Classes`）的写法。实际上Lambda表达式并不仅仅是匿名内部类的语法糖，JVM内部是通过*invokedynamic*指令来实现Lambda表达式的。具体原理放到下一篇。本篇我们首先感受一下使用Lambda表达式带来的便利之处。

### 取代某些匿名内部类

本节将介绍如何使用Lambda表达式简化匿名内部类的书写，但Lambda表达式并不能取代所有的匿名内部类，只能用来取代**函数接口（Functional Interface）**的简写。先别在乎细节，看几个例子再说。

#### 例子1：无参函数的简写

如果需要新建一个线程，一种常见的写法是这样：

```java
// JDK7 匿名内部类写法
new Thread(new Runnable(){// 接口名
    @Override
    public void run(){// 方法名
        System.out.println("Thread run()");
    }
}).start();
```

上述代码给`Tread`类传递了一个匿名的`Runnable`对象，重载`Runnable`接口的`run()`方法来实现相应逻辑。这是JDK7以及之前的常见写法。匿名内部类省去了为类起名字的烦恼，但还是不够简化，在Java 8中可以简化为如下形式：

```java
// JDK8 Lambda表达式写法
new Thread(
        () -> System.out.println("Thread run()")// 省略接口名和方法名
).start();
```

上述代码跟匿名内部类的作用是一样的，但比匿名内部类更进一步。这里连**接口名和函数名都一同省掉**了，写起来更加神清气爽。如果函数体有多行，可以用大括号括起来，就像这样：

```java
// JDK8 Lambda表达式代码块写法
new Thread(
        () -> {
            System.out.print("Hello");
            System.out.println(" Hoolee");
        }
).start();
```

#### 例子2：带参函数的简写

如果要给一个字符串列表通过自定义比较器，按照字符串长度进行排序，Java 7的书写形式如下：

```java
// JDK7 匿名内部类写法
List<String> list = Arrays.asList("I", "love", "you", "too");
Collections.sort(list, new Comparator<String>(){// 接口名
    @Override
    public int compare(String s1, String s2){// 方法名
        if(s1 == null)
            return -1;
        if(s2 == null)
            return 1;
        return s1.length()-s2.length();
    }
});
```

上述代码通过内部类重载了`Comparator`接口的`compare()`方法，实现比较逻辑。采用Lambda表达式可简写如下：

```java
// JDK8 Lambda表达式写法
List<String> list = Arrays.asList("I", "love", "you", "too");
Collections.sort(list, (s1, s2) ->{// 省略参数表的类型
    if(s1 == null)
        return -1;
    if(s2 == null)
        return 1;
    return s1.length()-s2.length();
});
```

上述代码跟匿名内部类的作用是一样的。除了省略了接口名和方法名，代码中把参数表的类型也省略了。这得益于`javac`的**类型推断**机制，编译器能够根据上下文信息推断出参数的类型，当然也有推断失败的时候，这时就需要手动指明参数类型了。注意，Java是强类型语言，每个变量和对象都必需有明确的类型。

### 简写的依据

也许你已经想到了，**能够使用Lambda的依据是必须有相应的函数接口**（函数接口，是指内部只有一个抽象方法的接口）。这一点跟Java是强类型语言吻合，也就是说你并不能在代码的任何地方任性的写Lambda表达式。实际上*Lambda的类型就是对应函数接口的类型*。**Lambda表达式另一个依据是类型推断机制**，在上下文信息足够的情况下，编译器可以推断出参数表的类型，而不需要显式指名。Lambda表达更多合法的书写形式如下：

```java
// Lambda表达式的书写形式
Runnable run = () -> System.out.println("Hello World");// 1 无参
ActionListener listener = event -> System.out.println("button clicked");// 2 有参
Runnable multiLine = () -> {// 3 代码块
    System.out.print("Hello");
    System.out.println(" Hoolee");
};
BinaryOperator<Long> add = (Long x, Long y) -> x + y;// 4 类型推断, 指定
BinaryOperator<Long> addImplicit = (x, y) -> x + y;// 5 类型推断
```

上述代码中，1展示了无参函数的简写；2处展示了有参函数的简写，以及类型推断机制；3是代码块的写法；4和5再次展示了类型推断机制。

### 自定义函数接口

自定义函数接口很容易，只需要编写一个只有一个抽象方法的接口即可。

```java
// 自定义函数接口
@FunctionalInterface
public interface ConsumerInterface<T>{
    void accept(T t);
}
```

上面代码中的@FunctionalInterface是可选的，但加上该标注编译器会帮你检查接口是否符合函数接口规范。就像加入@Override标注会检查是否重载了函数一样。

有了上述接口定义，就可以写出类似如下的代码：

`ConsumerInterface<String> consumer = str -> System.out.println(str);`

进一步的，还可以这样使用：

```java
class MyStream<T>{
    private List<T> list;
    ...
    public void myForEach(ConsumerInterface<T> consumer){// 1
        for(T t : list){
            consumer.accept(t);
        }
    }
}
MyStream<String> stream = new MyStream<String>();
stream.myForEach(str -> System.out.println(str));// 使用自定义函数接口书写Lambda表达式
```

### 参考文献1

1. [The Java® Language Specification](https://docs.oracle.com/javase/specs/jls/se8/html/index.html)
2. [lambda-expressions-java-tutorial](http://viralpatel.net/blogs/lambda-expressions-java-tutorial/)
3. [《Java 8函数式编程 [英]沃伯顿》](https://www.amazon.cn/Java-8%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B-%E8%8B%B1-%E6%B2%83%E4%BC%AF%E9%A1%BF/dp/B00VDSW7AE)

----

## Lambda and Anonymous Classes(II)

### 前言2

读过上一篇之后，相信对Lambda表达式的语法以及基本原理有了一定了解。对于编写代码，有这些知识已经够用。本文将**进一步区分Lambda表达式和匿名内部类在JVM层面的区别，如果对这一部分不感兴趣，可以跳过**。

### 不是匿名内部类的简写

经过第一篇的的介绍，我们看到Lambda表达式似乎只是为了简化匿名内部类书写，这看起来仅仅通过语法糖在编译阶段把所有的Lambda表达式替换成匿名内部类就可以了。但实时并非如此。在JVM层面，Lambda表达式和匿名内部类有着明显的差别。

#### 匿名内部类实现

**匿名内部类仍然是一个类，只是不需要程序员显示指定类名，编译器会自动为该类取名**。因此如果有如下形式的代码，编译之后将会产生两个class文件：

```java
public class MainAnonymousClass {
    public static void main(String[] args) {
        new Thread(new Runnable(){
            @Override
            public void run(){
                System.out.println("Anonymous Class Thread run()");
            }
        }).start();;
    }
}
```

编译之后文件分布如下，两个class文件分别是主类和匿名内部类产生的：

![2-AnonymousClass.png](/assets/images/2021/10/lambda_2-AnonymousClass.png)

进一步分析主类MainAnonymousClass.class的字节码，可发现其创建了匿名内部类的对象：

```java
// javap -c MainAnonymousClass.class
public class MainAnonymousClass {
  ...
  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class java/lang/Thread
       3: dup
       4: new           #3                  // class MainAnonymousClass$1 /*创建内部类对象*/
       7: dup
       8: invokespecial #4                  // Method MainAnonymousClass$1."<init>":()V
      11: invokespecial #5                  // Method java/lang/Thread."<init>":(Ljava/lang/Runnable;)V
      14: invokevirtual #6                  // Method java/lang/Thread.start:()V
      17: return
}

```

#### Lambda表达式实现

**Lambda表达式通过*invokedynamic*指令实现，书写Lambda表达式不会产生新的类**。如果有如下代码，编译之后只有一个class文件：

```java
public class MainLambda {
    public static void main(String[] args) {
        new Thread(
                () -> System.out.println("Lambda Thread run()")
            ).start();;
    }
}
```

编译之后的结果：

![2-Lambda](/assets/images/2021/10/lambda_2-Lambda.png)

通过javap反编译命名，我们更能看出Lambda表达式内部表示的不同：

```java
// javap -c -p MainLambda.class
public class MainLambda {
  ...
  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class java/lang/Thread
       3: dup
       4: invokedynamic #3,  0              // InvokeDynamic #0:run:()Ljava/lang/Runnable; /*使用invokedynamic指令调用*/
       9: invokespecial #4                  // Method java/lang/Thread."<init>":(Ljava/lang/Runnable;)V
      12: invokevirtual #5                  // Method java/lang/Thread.start:()V
      15: return

  private static void lambda$main$0();  /*Lambda表达式被封装成主类的私有方法*/
    Code:
       0: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #7                  // String Lambda Thread run()
       5: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}

```

反编译之后我们发现Lambda表达式被封装成了主类的一个私有方法，并通过*invokedynamic*指令进行调用。

#### 推论，this引用的意义

既然Lambda表达式不是内部类的简写，那么Lambda内部的`this`引用也就跟内部类对象没什么关系了。在Lambda表达式中`this`的意义跟在表达式外部完全一样。因此下列代码将输出两遍`Hello Hoolee`，而不是两个引用地址。

```java
public class Hello {
    Runnable r1 = () -> { System.out.println(this); };
    Runnable r2 = () -> { System.out.println(toString()); };
    public static void main(String[] args) {
        new Hello().r1.run();
        new Hello().r2.run();
    }
    public String toString() { return "Hello Hoolee"; }
}
```

#### 参考文献2

- [State of the Lambda](http://cr.openjdk.java.net/~briangoetz/lambda/lambda-state-final.html)

----

## Lambda and Collections

### 前言3

我们先从最熟悉的*Java集合框架(Java Collections Framework, JCF)*开始说起。

为引入Lambda表达式，Java8新增了`java.util.function`包，里面包含常用的**函数接口**，这是Lambda表达式的基础，Java集合框架也新增部分接口，以便与Lambda表达式对接。

首先回顾一下Java集合框架的接口继承结构：

![JCF_Collection_Interfaces](/assets/images/2021/10/lambda_JCF_Collection_Interfaces.png)

上图中绿色标注的接口类，表示在Java8中加入了新的接口方法，当然由于继承关系，他们相应的子类也都会继承这些新方法。下表详细列举了这些方法。

| 接口名     | Java8新加入的方法                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Collection | removeIf() spliterator() stream() parallelStream() forEach()                                                                  |
| List       | replaceAll() sort()                                                                                                           |
| Map        | getOrDefault() forEach() replaceAll() putIfAbsent() remove() replace() computeIfAbsent() computeIfPresent() compute() merge() |

这些新加入的方法大部分要用到`java.util.function`包下的接口，这意味着这些方法大部分都跟Lambda表达式相关。我们将逐一学习这些方法。

### Collection中的新方法

如上所示，接口`Collection`和`List`新加入了一些方法，我们以是`List`的子类`ArrayList`为例来说明。了解[Java7`ArrayList`实现原理](https://github.com/CarpenterLee/JCFInternals/blob/master/markdown/2-ArrayList.md)，将有助于理解下文。

#### forEach()

该方法的签名为`void forEach(Consumer<? super E> action)`，作用是对容器中的每个元素执行`action`指定的动作，其中`Consumer`是个函数接口，里面只有一个待实现方法`void accept(T t)`（后面我们会看到，这个方法叫什么根本不重要，你甚至不需要记忆它的名字）。

需求：*假设有一个字符串列表，需要打印出其中所有长度大于3的字符串.*

Java7及以前我们可以用增强的for循环实现：

```java
// 使用曾强for循环迭代
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
for(String str : list){
    if(str.length()>3)
        System.out.println(str);
}
```

现在使用`forEach()`方法结合匿名内部类，可以这样实现：

```java
// 使用forEach()结合匿名内部类迭代
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.forEach(new Consumer<String>(){
    @Override
    public void accept(String str){
        if(str.length()>3)
            System.out.println(str);
    }
});
```

上述代码调用`forEach()`方法，并使用匿名内部类实现`Comsumer`接口。到目前为止我们没看到这种设计有什么好处，但是不要忘记Lambda表达式，使用Lambda表达式实现如下：

```java
// 使用forEach()结合Lambda表达式迭代
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.forEach( str -> {
        if(str.length()>3)
            System.out.println(str);
    });
```

上述代码给`forEach()`方法传入一个Lambda表达式，我们不需要知道`accept()`方法，也不需要知道`Consumer`接口，类型推导帮我们做了一切。

#### removeIf()

该方法签名为`boolean removeIf(Predicate<? super E> filter)`，作用是**删除容器中所有满足`filter`指定条件的元素**，其中`Predicate`是一个函数接口，里面只有一个待实现方法`boolean test(T t)`，同样的这个方法的名字根本不重要，因为用的时候不需要书写这个名字。

需求：*假设有一个字符串列表，需要删除其中所有长度大于3的字符串。*

我们知道如果需要在迭代过程冲对容器进行删除操作必须使用迭代器，否则会抛出`ConcurrentModificationException`，所以上述任务传统的写法是：

```java
// 使用迭代器删除列表元素
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
Iterator<String> it = list.iterator();
while(it.hasNext()){
    if(it.next().length()>3) // 删除长度大于3的元素
        it.remove();
}
```

现在使用`removeIf()`方法结合匿名内部类，我们可是这样实现：

```java
// 使用removeIf()结合匿名名内部类实现
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.removeIf(new Predicate<String>(){ // 删除长度大于3的元素
    @Override
    public boolean test(String str){
        return str.length()>3;
    }
});
```

上述代码使用`removeIf()`方法，并使用匿名内部类实现`Precicate`接口。相信你已经想到用Lambda表达式该怎么写了：

```java
// 使用removeIf()结合Lambda表达式实现
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.removeIf(str -> str.length()>3); // 删除长度大于3的元素
```

使用Lambda表达式不需要记忆`Predicate`接口名，也不需要记忆`test()`方法名，只需要知道此处需要一个返回布尔类型的Lambda表达式就行了。

#### replaceAll()

该方法签名为`void replaceAll(UnaryOperator<E> operator)`，作用是**对每个元素执行`operator`指定的操作，并用操作结果来替换原来的元素**。其中`UnaryOperator`是一个函数接口，里面只有一个待实现函数`T apply(T t)`。

需求：*假设有一个字符串列表，将其中所有长度大于3的元素转换成大写，其余元素不变。*

Java7及之前似乎没有优雅的办法：

```java
// 使用下标实现元素替换
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
for(int i=0; i<list.size(); i++){
    String str = list.get(i);
    if(str.length()>3)
        list.set(i, str.toUpperCase());
}
```

使用`replaceAll()`方法结合匿名内部类可以实现如下：

```java
// 使用匿名内部类实现
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.replaceAll(new UnaryOperator<String>(){
    @Override
    public String apply(String str){
        if(str.length()>3)
            return str.toUpperCase();
        return str;
    }
});
```

上述代码调用`replaceAll()`方法，并使用匿名内部类实现`UnaryOperator`接口。我们知道可以用更为简洁的Lambda表达式实现：

```java
// 使用Lambda表达式实现
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.replaceAll(str -> {
    if(str.length()>3)
        return str.toUpperCase();
    return str;
});
```

#### sort()

该方法定义在`List`接口中，方法签名为`void sort(Comparator<? super E> c)`，该方法**根据`c`指定的比较规则对容器元素进行排序**。`Comparator`接口我们并不陌生，其中有一个方法`int compare(T o1, T o2)`需要实现，显然该接口是个函数接口。

需求：*假设有一个字符串列表，按照字符串长度增序对元素排序。*

由于Java7以及之前`sort()`方法在`Collections`工具类中，所以代码要这样写：

```java
// Collections.sort()方法
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
Collections.sort(list, new Comparator<String>(){
    @Override
    public int compare(String str1, String str2){
        return str1.length()-str2.length();
    }
});
```

现在可以直接使用`List.sort()方法`，结合Lambda表达式，可以这样写：

```java
// List.sort()方法结合Lambda表达式
ArrayList<String> list = new ArrayList<>(Arrays.asList("I", "love", "you", "too"));
list.sort((str1, str2) -> str1.length()-str2.length());
```

#### spliterator()

方法签名为`Spliterator<E> spliterator()`，该方法返回容器的**可拆分迭代器**。从名字来看该方法跟`iterator()`方法有点像，我们知道`Iterator`是用来迭代容器的，`Spliterator`也有类似作用，但二者有如下不同：

1. `Spliterator`既可以像`Iterator`那样逐个迭代，也可以批量迭代。批量迭代可以降低迭代的开销。
2. `Spliterator`是可拆分的，一个`Spliterator`可以通过调用`Spliterator<T> trySplit()`方法来尝试分成两个。一个是`this`，另一个是新返回的那个，这两个迭代器代表的元素没有重叠。

可通过（多次）调用`Spliterator.trySplit()`方法来分解负载，以便多线程处理。

#### stream()和parallelStream()

`stream()`和`parallelStream()`分别**返回该容器的`Stream`视图表示**，不同之处在于`parallelStream()`返回并行的`Stream`。**`Stream`是Java函数式编程的核心类**，我们会在后面章节中学习。

### Map中的新方法

相比`Collection`，`Map`中加入了更多的方法，我们以`HashMap`为例来逐一探秘。了解[Java7`HashMap`实现原理](https://github.com/CarpenterLee/JCFInternals/blob/master/markdown/6-HashSet%20and%20HashMap.md)，将有助于理解下文。

#### forEach()方法

该方法签名为`void forEach(BiConsumer<? super K,? super V> action)`，作用是**对`Map`中的每个映射执行`action`指定的操作**，其中`BiConsumer`是一个函数接口，里面有一个待实现方法`void accept(T t, U u)`。`BinConsumer`接口名字和`accept()`方法名字都不重要，请不要记忆他们。

需求：*假设有一个数字到对应英文单词的Map，请输出Map中的所有映射关系．*

Java7以及之前经典的代码如下：

```java
// Java7以及之前迭代Map
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
for(Map.Entry<Integer, String> entry : map.entrySet()){
    System.out.println(entry.getKey() + "=" + entry.getValue());
}
```

使用`Map.forEach()`方法，结合匿名内部类，代码如下：

```java
// 使用forEach()结合匿名内部类迭代Map
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.forEach(new BiConsumer<Integer, String>(){
    @Override
    public void accept(Integer k, String v){
        System.out.println(k + "=" + v);
    }
});
```

上述代码调用`forEach()`方法，并使用匿名内部类实现`BiConsumer`接口。当然，实际场景中没人使用匿名内部类写法，因为有Lambda表达式：

```java
// 使用forEach()结合Lambda表达式迭代Map
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.forEach((k, v) -> System.out.println(k + "=" + v));
}
```

#### getOrDefault()

该方法跟Lambda表达式没关系，但是很有用。方法签名为`V getOrDefault(Object key, V defaultValue)`，作用是**按照给定的`key`查询`Map`中对应的`value`，如果没有找到则返回`defaultValue`**。使用该方法程序员可以省去查询指定键值是否存在的麻烦．

需求；*假设有一个数字到对应英文单词的Map，输出4对应的英文单词，如果不存在则输出NoValue*

```java
// 查询Map中指定的值，不存在时使用默认值
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
// Java7以及之前做法
if(map.containsKey(4)){ // 1
    System.out.println(map.get(4));
}else{
    System.out.println("NoValue");
}
// Java8使用Map.getOrDefault()
System.out.println(map.getOrDefault(4, "NoValue")); // 2
```

#### putIfAbsent()

该方法跟Lambda表达式没关系，但是很有用。方法签名为`V putIfAbsent(K key, V value)`，作用是只有在**不存在`key`值的映射或映射值为`null`时**，才将`value`指定的值放入到`Map`中，否则不对`Map`做更改．该方法将条件判断和赋值合二为一，使用起来更加方便．

#### remove()

我们都知道`Map`中有一个`remove(Object key)`方法，来根据指定`key`值删除`Map`中的映射关系；Java8新增了`remove(Object key, Object value)`方法，只有在当前`Map`中**`key`正好映射到`value`时**才删除该映射，否则什么也不做．

#### replace()

在Java7及以前，要想替换`Map`中的映射关系可通过`put(K key, V value)`方法实现，该方法总是会用新值替换原来的值．为了更精确的控制替换行为，Java8在`Map`中加入了两个`replace()`方法，分别如下：

- `replace(K key, V value)`，只有在当前`Map`中**`key`的映射存在时**才用`value`去替换原来的值，否则什么也不做．
- `replace(K key, V oldValue, V newValue)`，只有在当前`Map`中**`key`的映射存在且等于`oldValue`时**才用`newValue`去替换原来的值，否则什么也不做．

#### replaceAll()方法

该方法签名为`replaceAll(BiFunction<? super K,? super V,? extends V> function)`，作用是对`Map`中的每个映射执行`function`指定的操作，并用`function`的执行结果替换原来的`value`，其中`BiFunction`是一个函数接口，里面有一个待实现方法`R apply(T t, U u)`．不要被如此多的函数接口吓到，因为使用的时候根本不需要知道他们的名字．

需求：*假设有一个数字到对应英文单词的Map，请将原来映射关系中的单词都转换成大写．*

Java7以及之前经典的代码如下：

```java
// Java7以及之前替换所有Map中所有映射关系
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
for(Map.Entry<Integer, String> entry : map.entrySet()){
    entry.setValue(entry.getValue().toUpperCase());
}
```

使用`replaceAll()`方法结合匿名内部类，实现如下：

```java
// 使用replaceAll()结合匿名内部类实现
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.replaceAll(new BiFunction<Integer, String, String>(){
    @Override
    public String apply(Integer k, String v){
        return v.toUpperCase();
    }
});
```

上述代码调用`replaceAll()`方法，并使用匿名内部类实现`BiFunction`接口。更进一步的，使用Lambda表达式实现如下：

```java
// 使用replaceAll()结合Lambda表达式实现
HashMap<Integer, String> map = new HashMap<>();
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.replaceAll((k, v) -> v.toUpperCase());
```

简洁到让人难以置信．

#### merge()

该方法签名为`merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)`，作用是：

1. 如果`Map`中`key`对应的映射不存在或者为`null`，则将`value`（不能是`null`）关联到`key`上；
2. 否则执行`remappingFunction`，如果执行结果非`null`则用该结果跟`key`关联，否则在`Map`中删除`key`的映射．

参数中`BiFunction`函数接口前面已经介绍过，里面有一个待实现方法`R apply(T t, U u)`．

`merge()`方法虽然语义有些复杂，但该方法的用方式很明确，一个比较常见的场景是将新的错误信息拼接到原来的信息上，比如：

```java
map.merge(key, newMsg, (v1, v2) -> v1+v2);
```

#### compute()

该方法签名为`compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`，作用是把`remappingFunction`的计算结果关联到`key`上，如果计算结果为`null`，则在`Map`中删除`key`的映射．

要实现上述`merge()`方法中错误信息拼接的例子，使用`compute()`代码如下：

```java
map.compute(key, (k,v) -> v==null ? newMsg : v.concat(newMsg));
```

#### computeIfAbsent()

该方法签名为`V computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)`，作用是：只有在当前`Map`中**不存在`key`值的映射或映射值为`null`时**，才调用`mappingFunction`，并在`mappingFunction`执行结果非`null`时，将结果跟`key`关联．

`Function`是一个函数接口，里面有一个待实现方法`R apply(T t)`．

`computeIfAbsent()`常用来对`Map`的某个`key`值建立初始化映射．比如我们要实现一个多值映射，`Map`的定义可能是`Map<K,Set<V>>`，要向`Map`中放入新值，可通过如下代码实现：

```java
Map<Integer, Set<String>> map = new HashMap<>();
// Java7及以前的实现方式
if(map.containsKey(1)){
    map.get(1).add("one");
}else{
    Set<String> valueSet = new HashSet<String>();
    valueSet.add("one");
    map.put(1, valueSet);
}
// Java8的实现方式
map.computeIfAbsent(1, v -> new HashSet<String>()).add("yi");
```

使用`computeIfAbsent()`将条件判断和添加操作合二为一，使代码更加简洁．

#### computeIfPresent()

该方法签名为`V computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`，作用跟`computeIfAbsent()`相反，即，只有在当前`Map`中**存在`key`值的映射且非`null`时**，才调用`remappingFunction`，如果`remappingFunction`执行结果为`null`，则删除`key`的映射，否则使用该结果替换`key`原来的映射．

这个函数的功能跟如下代码是等效的：

```java
// Java7及以前跟computeIfPresent()等效的代码
if (map.get(key) != null) {
    V oldValue = map.get(key);
    V newValue = remappingFunction.apply(key, oldValue);
    if (newValue != null)
        map.put(key, newValue);
    else
        map.remove(key);
    return newValue;
}
return null;
```

使用场景

```java
Map<String, Collection<String>> strings = new HashMap<>();
// Java7及以前的实现方式
void addString(String a) {
    String index = a.substring(0, 1);
    if(strings.containsKey(index)){
        strings.get(index).add(a);
    } else {
        Collection<String> valueSet = new HashSet<>();
        valueCol.add(a);
        strings.put(index, valueSet);
    }
}
    
void removeString(String a) {
    String index = a.substring(0, 1);
    if(strings.containsKey(index)){
        Collection<String> valueSet =  strings.get(index);
        valueSet.remove(a);
        if(valueSet.isEmpty()){
            strings.remove(index);
        }
    }
}


// Java8的实现方式
void addString(String a) {
    String index = a.substring(0, 1);
    strings.computeIfAbsent(index, ign -> new HashSet<>()).add(a);
}

void removeString(String a) {
    String index = a.substring(0, 1);
    strings.computeIfPresent(index, (i, c) -> c.remove(a) && c.isEmpty() ? null : c);
}

// 结果
                         // {}
addString("a1");         // {a=[a1]}      <-- collection dynamically created
addString("a2");         // {a=[a1, a2]}
removeString("a1");      // {a=[a2]}
removeString("a2");      // {}            <-- both key and collection removed
```

### 总结3

1. Java8为容器新增一些有用的方法，这些方法有些是为**完善原有功能**，有些是为**引入函数式编程**，学习和使用这些方法有助于我们写出更加简洁有效的代码．
2. **函数接口**虽然很多，但绝大多数时候我们根本不需要知道它们的名字，书写Lambda表达式时类型推断帮我们做了一切．

----

## Streams API(I)

你可能没意识到Java对函数式编程的重视程度，看看Java 8加入函数式编程扩充多少功能就清楚了。Java 8之所以费这么大功夫引入函数式编程，原因有二：

1. **代码简洁**函数式编程写出的代码简洁且意图明确，使用*stream*接口让你从此告别*for*循环。
2. **多核友好**，Java函数式编程使得编写并行程序从未如此简单，你需要的全部就是调用一下`parallel()`方法。

这一节我们学习*stream*，也就是Java函数式编程的主角。对于Java 7来说*stream*完全是个陌生东西，*stream*并不是某种数据结构，它只是数据源的一种视图。这里的数据源可以是一个数组，Java容器或I/O channel等。正因如此要得到一个*stream*通常不会手动创建，而是调用对应的工具方法，比如：

- 调用`Collection.stream()`或者`Collection.parallelStream()`方法
- 调用`Arrays.stream(T[] array)`方法

常见的*stream*接口继承关系如图：

![Java_stream_Interfaces](/assets/images/2021/10/lambda_Java_stream_Interfaces.png)

图中4种*stream*接口继承自`BaseStream`，其中`IntStream, LongStream, DoubleStream`对应三种基本类型（`int, long, double`，注意不是包装类型），`Stream`对应所有剩余类型的*stream*视图。为不同数据类型设置不同*stream*接口，可以1.提高性能，2.增加特定接口函数。

![WRONG_Java_stream_Interfaces](/assets/images/2021/10/lambda_WRONG_Java_stream_Interfaces.png)

你可能会奇怪为什么不把`IntStream`等设计成`Stream`的子接口？毕竟这接口中的方法名大部分是一样的。答案是这些方法的名字虽然相同，但是返回类型不同，如果设计成父子接口关系，这些方法将不能共存，因为Java不允许只有返回类型不同的方法重载。

虽然大部分情况下*stream*是容器调用`Collection.stream()`方法得到的，但*stream*和*collections*有以下不同：

- **无存储**。*stream*不是一种数据结构，它只是某种数据源的一个视图，数据源可以是一个组，Java容器或I/O channel等。
- **为函数式编程而生**。对*stream*的任何修改都不会修改背后的数据源，比如对*stream*执行过滤操作并不会删除被过滤的元素，而是会产生一个不包含被过滤元素的新*stream*。
- **惰式执行**。*stream*上的操作并不会立即执行，只有等到用户真正需要结果的时候才会执行。
- **可消费性**。*stream*只能被“消费”一次，一旦遍历过就会失效，就像容器的迭代器那样，想要再次遍历必须重新生成。

对*stream*的操作分为为两类，**中间操作(*intermediate operations*)和结束操作(*terminal operations*)**，二者特点是：

1. __中间操作总是会惰式执行__，调用中间操作只会生成一个标记了该操作的新*stream*，仅此而已。
2. __结束操作会触发实际计算__，计算发生时会把所有中间操作积攒的操作以*pipeline*的方式执行，这样可以减少迭代次数。计算完成之后*stream*就会失效。

如果你熟悉Apache Spark RDD，对*stream*的这个特点应该不陌生。

下表汇总了`Stream`接口的部分常见方法：

| 操作类型 | 接口方法                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 中间操作 | concat() distinct() filter() flatMap() limit() map() peek() skip() sorted() parallel() sequential() unordered()                     |
| 结束操作 | allMatch() anyMatch() collect() count() findAny() findFirst() forEach() forEachOrdered() max() min() noneMatch() reduce() toArray() |

区分中间操作和结束操作最简单的方法，就是看方法的返回值，返回值为*stream*的大都是中间操作，否则是结束操作。

### stream方法使用

*stream*跟函数接口关系非常紧密，没有函数接口*stream*就无法工作。回顾一下：__函数接口是指内部只有一个抽象方法的接口__。通常函数接口出现的地方都可以使用Lambda表达式，所以不必记忆函数接口的名字。

#### forEach()方法2

我们对`forEach()`方法并不陌生，在`Collection`中我们已经见过。方法签名为`void forEach(Consumer<? super E> action)`，作用是对容器中的每个元素执行`action`指定的动作，也就是对元素进行遍历。

```java
// 使用Stream.forEach()迭代
Stream<String> stream = Stream.of("I", "love", "you", "too");
stream.forEach(str -> System.out.println(str));
```

由于`forEach()`是结束方法，上述代码会立即执行，输出所有字符串。

#### filter()

![Stream filter](/assets/images/2021/10/lambda_Stream.filter.png)

函数原型为`Stream<T> filter(Predicate<? super T> predicate)`，作用是返回一个只包含满足`predicate`条件元素的`Stream`。

```java
// 保留长度等于3的字符串
Stream<String> stream= Stream.of("I", "love", "you", "too");
stream.filter(str -> str.length()==3)
    .forEach(str -> System.out.println(str));
```

上述代码将输出为长度等于3的字符串`you`和`too`。注意，由于`filter()`是个中间操作，如果只调用`filter()`不会有实际计算，因此也不会输出任何信息。

#### distinct()

![Stream distinct](/assets/images/2021/10/lambda_Stream.distinct.png)

函数原型为`Stream<T> distinct()`，作用是返回一个去除重复元素之后的`Stream`。

```java
Stream<String> stream= Stream.of("I", "love", "you", "too", "too");
stream.distinct()
    .forEach(str -> System.out.println(str));
```

上述代码会输出去掉一个`too`之后的其余字符串。

#### sorted()

排序函数有两个，一个是用自然顺序排序，一个是使用自定义比较器排序，函数原型分别为`Stream<T>　sorted()`和`Stream<T>　sorted(Comparator<? super T> comparator)`。

```java
Stream<String> stream= Stream.of("I", "love", "you", "too");
stream.sorted((str1, str2) -> str1.length()-str2.length())
    .forEach(str -> System.out.println(str));
```

上述代码将输出按照长度升序排序后的字符串，结果完全在预料之中。

#### map()

![Stream map](/assets/images/2021/10/lambda_Stream.map.png)

函数原型为`<R> Stream<R> map(Function<? super T,? extends R> mapper)`，作用是返回一个对当前所有元素执行执行`mapper`之后的结果组成的`Stream`。直观的说，就是对每个元素按照某种操作进行转换，转换前后`Stream`中元素的个数不会改变，但元素的类型取决于转换之后的类型。

```java
Stream<String> stream　= Stream.of("I", "love", "you", "too");
stream.map(str -> str.toUpperCase())
    .forEach(str -> System.out.println(str));
```

上述代码将输出原字符串的大写形式。

#### flatMap()

![Stream flatMap](/assets/images/2021/10/lambda_Stream.flatMap.png)

函数原型为`<R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)`，作用是对每个元素执行`mapper`指定的操作，并用所有`mapper`返回的`Stream`中的元素组成一个新的`Stream`作为最终返回结果。说起来太拗口，通俗的讲`flatMap()`的作用就相当于把原*stream*中的所有元素都"摊平"之后组成的`Stream`，转换前后元素的个数和类型都可能会改变。

```java
Stream<List<Integer>> stream = Stream.of(Arrays.asList(1,2), Arrays.asList(3, 4, 5));
stream.flatMap(list -> list.stream())
    .forEach(i -> System.out.println(i));
```

上述代码中，原来的`stream`中有两个元素，分别是两个`List<Integer>`，执行`flatMap()`之后，将每个`List`都“摊平”成了一个个的数字，所以会新产生一个由5个数字组成的`Stream`。所以最终将输出1~5这5个数字。

### 结语4

截止到目前我们感觉良好，已介绍`Stream`接口函数理解起来并不费劲儿。如果你就此以为函数式编程不过如此，恐怕是高兴地太早了。下一节对`Stream`归约操作的介绍将刷新你现在的认识。

----

## Streams API(II)

上一节介绍了部分*Stream*常见接口方法，理解起来并不困难，但*Stream*的用法不止于此，本节我们将仍然以*Stream*为例，介绍流的归约操作。

归约操作（*reduction operation*）又被称作折叠操作（*fold*），是通过某个连接动作将所有元素汇总成一个汇总结果的过程。元素求和、求最大值或最小值、求出元素总个数、将所有元素转换成一个列表或集合，都属于归约操作。*Stream*类库有两个通用的归约操作`reduce()`和`collect()`，也有一些为简化书写而设计的专用归约操作，比如`sum()`、`max()`、`min()`、`count()`等。

最大或最小值这类归约操作很好理解（至少方法语义上是这样），我们着重介绍`reduce()`和`collect()`，这是比较有魔法的地方。

### 多面手reduce()

*reduce*操作可以实现从一组元素中生成一个值，`sum()`、`max()`、`min()`、`count()`等都是*reduce*操作，将他们单独设为函数只是因为常用。`reduce()`的方法定义有三种重写形式：

- `Optional<T> reduce(BinaryOperator<T> accumulator)`
- `T reduce(T identity, BinaryOperator<T> accumulator)`
- `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`

虽然函数定义越来越长，但语义不曾改变，多的参数只是为了指明初始值（参数*identity*），或者是指定并行执行时多个部分结果的合并方式（参数*combiner*）。`reduce()`最常用的场景就是从一堆值中生成一个值。用这么复杂的函数去求一个最大或最小值，你是不是觉得设计者有病。其实不然，因为“大”和“小”或者“求和"有时会有不同的语义。

需求：*从一组单词中找出最长的单词*。这里“大”的含义就是“长”。

```java
// 找出最长的单词
Stream<String> stream = Stream.of("I", "love", "you", "too");
Optional<String> longest = stream.reduce((s1, s2) -> s1.length()>=s2.length() ? s1 : s2);
//Optional<String> longest = stream.max((s1, s2) -> s1.length()-s2.length());
System.out.println(longest.get());
```

上述代码会选出最长的单词*love*，其中*Optional*是（一个）值的容器，使用它可以避免*null*值的麻烦。当然可以使用`Stream.max(Comparator<? super T> comparator)`方法来达到同等效果，但`reduce()`自有其存在的理由。

![Stream.reduce_parameter](/assets/images/2021/10/lambda_Stream.reduce_parameter.png)

需求：*求出一组单词的长度之和*。这是个“求和”操作，操作对象输入类型是*String*，而结果类型是*Integer*。

```java
// 求单词长度之和
Stream<String> stream = Stream.of("I", "love", "you", "too");
Integer lengthSum = stream.reduce(0,　// 初始值　// (1)
        (sum, str) -> sum+str.length(), // 累加器 // (2)
        (a, b) -> a+b);　// 部分和拼接器，并行执行时才会用到 // (3)
// int lengthSum = stream.mapToInt(str -> str.length()).sum();
System.out.println(lengthSum);
```

上述代码标号(2)处将i. 字符串映射成长度，ii. 并和当前累加和相加。这显然是两步操作，使用`reduce()`函数将这两步合二为一，更有助于提升性能。如果想要使用`map()`和`sum()`组合来达到上述目的，也是可以的。

`reduce()`擅长的是生成一个值，如果想要从*Stream*生成一个集合或者*Map*等复杂的对象该怎么办呢？终极武器`collect()`横空出世！

### >> 终极武器collect() <<

不夸张的讲，如果你发现某个功能在*Stream*接口中没找到，十有八九可以通过`collect()`方法实现。`collect()`是*Stream*接口方法中最灵活的一个，学会它才算真正入门`Java函数式编程`{:.info}。先看几个热身的小例子：

```java
// 将Stream转换成容器或Map
Stream<String> stream = Stream.of("I", "love", "you", "too");
List<String> list = stream.collect(Collectors.toList()); // (1)
// Set<String> set = stream.collect(Collectors.toSet()); // (2)
// Map<String, Integer> map = stream.collect(Collectors.toMap(Function.identity(), String::length)); // (3)
```

上述代码分别列举了如何将*Stream*转换成*List*、*Set*和*Map*。虽然代码语义很明确，可是我们仍然会有几个疑问：

1. `Function.identity()`是干什么的？
2. `String::length`是什么意思？
3. *Collectors*是个什么东西？

### 接口的静态方法和默认方法

*Function*是一个接口，那么`Function.identity()`是什么意思呢？这要从两方面解释：

1. Java 8允许在接口中加入具体方法。接口中的具体方法有两种，*default*方法和*static*方法，`identity()`就是*Function*接口的一个静态方法。
2. `Function.identity()`返回一个输出跟输入一样的Lambda表达式对象，等价于形如`t -> t`形式的Lambda表达式。

上面的解释是不是让你疑问更多？不要问我为什么接口中可以有具体方法，也不要告诉我你觉得`t -> t`比`identity()`方法更直观。我会告诉你接口中的*default*方法是一个无奈之举，在Java 7及之前要想在定义好的接口中加入新的抽象方法是很困难甚至不可能的，因为所有实现了该接口的类都要重新实现。试想在*Collection*接口中加入一个`stream()`抽象方法会怎样？*default*方法就是用来解决这个尴尬问题的，直接在接口中实现新加入的方法。既然已经引入了*default*方法，为何不再加入*static*方法来避免专门的工具类呢！

### 方法引用

诸如`String::length`的语法形式叫做方法引用（*method references*），这种语法用来替代某些特定形式Lambda表达式。如果Lambda表达式的全部内容就是调用一个已有的方法，那么可以用方法引用来替代Lambda表达式。方法引用可以细分为四类：

| 方法引用类别       | 举例             |
| ------------------ | ---------------- |
| 引用静态方法       | `Integer::sum`   |
| 引用某个对象的方法 | `list::add`      |
| 引用某个类的方法   | `String::length` |
| 引用构造方法       | `HashMap::new`   |

我们会在后面的例子中使用方法引用。

### 收集器

相信前面繁琐的内容已彻底打消了你学习Java函数式编程的热情，不过很遗憾，下面的内容更繁琐。但这不能怪Stream类库，因为要实现的功能本身很复杂。

![Stream.collect_parameter](/assets/images/2021/10/lambda_Stream.collect_parameter.png)

收集器（*Collector*）是为`Stream.collect()`方法量身打造的工具接口（类）。考虑一下将一个*Stream*转换成一个容器（或者*Map*）需要做哪些工作？我们至少需要两样东西：

1. 目标容器是什么？是*ArrayList*还是*HashSet*，或者是个*TreeMap*。
2. 新元素如何添加到容器中？是`List.add()`还是`Map.put()`。  
如果并行的进行归约，还需要告诉*collect()*
3. 多个部分结果如何合并成一个。

结合以上分析，*collect()*方法定义为`<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)`，三个参数依次对应上述三条分析。不过每次调用*collect()*都要传入这三个参数太麻烦，收集器*Collector*就是对这三个参数的简单封装,所以*collect()*的另一定义为`<R,A> R collect(Collector<? super T,A,R> collector)`。*Collectors*工具类可通过静态方法生成各种常用的*Collector*。举例来说，如果要将*Stream*归约成*List*可以通过如下两种方式实现：

```java
//　将Stream归约成List
Stream<String> stream = Stream.of("I", "love", "you", "too");
List<String> list = stream.collect(ArrayList::new, ArrayList::add, ArrayList::addAll);// 方式１
//List<String> list = stream.collect(Collectors.toList());// 方式2
System.out.println(list);
```

通常情况下我们不需要手动指定*collect()*的三个参数，而是调用`collect(Collector<? super T,A,R> collector)`方法，并且参数中的*Collector*对象大都是直接通过*Collectors*工具类获得。实际上传入的**收集器的行为决定了`collect()`的行为**。

### 使用collect()生成Collection

前面已经提到通过`collect()`方法将*Stream*转换成容器的方法，这里再汇总一下。将*Stream*转换成*List*或*Set*是比较常见的操作，所以*Collectors*工具已经为我们提供了对应的收集器，通过如下代码即可完成：

```java
// 将Stream转换成List或Set
Stream<String> stream = Stream.of("I", "love", "you", "too");
List<String> list = stream.collect(Collectors.toList()); // (1)
Set<String> set = stream.collect(Collectors.toSet()); // (2)
```

上述代码能够满足大部分需求，但由于返回结果是接口类型，我们并不知道类库实际选择的容器类型是什么，有时候我们可能会想要人为指定容器的实际类型，这个需求可通过`Collectors.toCollection(Supplier<C> collectionFactory)`方法完成。

```java
// 使用toCollection()指定归约容器的类型
ArrayList<String> arrayList = stream.collect(Collectors.toCollection(ArrayList::new));// (3)
HashSet<String> hashSet = stream.collect(Collectors.toCollection(HashSet::new));// (4)
```

上述代码(3)处指定归约结果是*ArrayList*，而(4)处指定归约结果为*HashSet*。一切如你所愿。

### 使用collect()生成Map

前面已经说过*Stream*背后依赖于某种数据源，数据源可以是数组、容器等，但不能是*Map*。反过来从*Stream*生成*Map*是可以的，但我们要想清楚*Map*的*key*和*value*分别代表什么，根本原因是我们要想清楚要干什么。通常在三种情况下`collect()`的结果会是*Map*：

1. 使用`Collectors.toMap()`生成的收集器，用户需要指定如何生成*Map*的*key*和*value*。
2. 使用`Collectors.partitioningBy()`生成的收集器，对元素进行二分区操作时用到。
3. 使用`Collectors.groupingBy()`生成的收集器，对元素做*group*操作时用到。

情况1：使用`toMap()`生成的收集器，这种情况是最直接的，前面例子中已提到，这是和`Collectors.toCollection()`并列的方法。如下代码展示将学生列表转换成由<学生，GPA>组成的*Map*。非常直观，无需多言。

```java
// 使用toMap()统计学生GPA
Map<Student, Double> studentToGPA =
     students.stream().collect(Collectors.toMap(Function.identity(),// 如何生成key
                                     student -> computeGPA(student)));// 如何生成value
```

情况2：使用`partitioningBy()`生成的收集器，这种情况适用于将`Stream`中的元素依据某个二值逻辑（满足条件，或不满足）分成互补相交的两部分，比如男女性别、成绩及格与否等。下列代码展示将学生分成成绩及格或不及格的两部分。

```java
// Partition students into passing and failing
Map<Boolean, List<Student>> passingFailing = students.stream()
         .collect(Collectors.partitioningBy(s -> s.getGrade() >= PASS_THRESHOLD));
```

情况3：使用`groupingBy()`生成的收集器，这是比较灵活的一种情况。跟SQL中的*group by*语句类似，这里的*groupingBy()*也是按照某个属性对数据进行分组，属性相同的元素会被对应到*Map*的同一个*key*上。下列代码展示将员工按照部门进行分组：

```java
// Group employees by department
Map<Department, List<Employee>> byDept = employees.stream()
            .collect(Collectors.groupingBy(Employee::getDepartment));
```

以上只是分组的最基本用法，有些时候仅仅分组是不够的。在SQL中使用*group by*是为了协助其他查询，比如*1. 先将员工按照部门分组，2. 然后统计每个部门员工的人数*。Java类库设计者也考虑到了这种情况，增强版的`groupingBy()`能够满足这种需求。增强版的`groupingBy()`允许我们对元素分组之后再执行某种运算，比如求和、计数、平均值、类型转换等。这种先将元素分组的收集器叫做**上游收集器**，之后执行其他运算的收集器叫做**下游收集器**(*downstream Collector*)。

```java
// 使用下游收集器统计每个部门的人数
Map<Department, Integer> totalByDept = employees.stream()
                    .collect(Collectors.groupingBy(Employee::getDepartment,
                                                   Collectors.counting()));// 下游收集器
```

上面代码的逻辑是不是越看越像SQL？高度非结构化。还有更狠的，下游收集器还可以包含更下游的收集器，这绝不是为了炫技而增加的把戏，而是实际场景需要。考虑将员工按照部门分组的场景，如果*我们想得到每个员工的名字（字符串），而不是一个个*Employee*对象*，可通过如下方式做到：

```java
// 按照部门对员工分布组，并只保留员工的名字
Map<Department, List<String>> byDept = employees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment,
                        Collectors.mapping(Employee::getName,// 下游收集器
                                Collectors.toList())));// 更下游的收集器
```

如果看到这里你还没有对Java函数式编程失去信心，恭喜你，你已经顺利成为Java函数式编程大师了。

### 使用collect()做字符串join

这个肯定是大家喜闻乐见的功能，字符串拼接时使用`Collectors.joining()`生成的收集器，从此告别*for*循环。`Collectors.joining()`方法有三种重写形式，分别对应三种不同的拼接方式。无需多言，代码过目难忘。

```java
// 使用Collectors.joining()拼接字符串
Stream<String> stream = Stream.of("I", "love", "you");
//String joined = stream.collect(Collectors.joining());// "Iloveyou"
//String joined = stream.collect(Collectors.joining(","));// "I,love,you"
String joined = stream.collect(Collectors.joining(",", "{", "}"));// "{I,love,you}"
```

### collect()还可以做更多

除了可以使用*Collectors*工具类已经封装好的收集器，我们还可以自定义收集器，或者直接调用`collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)`方法，**收集任何形式你想要的信息**。不过*Collectors*工具类应该能满足我们的绝大部分需求，手动实现之间请先看看文档。

### 参考文献5

1. [package-summary](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html#package.description)
2. [methodreferences](https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html)
3. [Collector](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collector.html)
4. [Stream](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)
5. [Collectors](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html)

----

## Stream Pipelines

前面我们已经学会如何使用Stream API，用起来真的很爽，但简洁的方法下面似乎隐藏着无尽的秘密，如此强大的API是如何实现的呢？比如Pipeline是怎么执行的，每次方法调用都会导致一次迭代吗？自动并行又是怎么做到的，线程个数是多少？本节我们学习Stream流水线的原理，这是Stream实现的关键所在。

首先回顾一下容器执行Lambda表达式的方式，以`ArrayList.forEach()`方法为例，具体代码如下：

```java
// ArrayList.forEach()
public void forEach(Consumer<? super E> action) {
    ...
    for (int i=0; modCount == expectedModCount && i < size; i++) {
        action.accept(elementData[i]);// 回调方法
    }
    ...
}
```

我们看到`ArrayList.forEach()`方法的主要逻辑就是一个*for*循环，在该*for*循环里不断调用`action.accept()`回调方法完成对元素的遍历。这完全没有什么新奇之处，回调方法在Java GUI的监听器中广泛使用。Lambda表达式的作用就是相当于一个回调方法，这很好理解。

Stream API中大量使用Lambda表达式作为回调方法，但这并不是关键。理解Stream我们更关心的是另外两个问题：流水线和自动并行。使用Stream或许很容易写入如下形式的代码：

```java
int longestStringLengthStartingWithA
        = strings.stream()
              .filter(s -> s.startsWith("A"))
              .mapToInt(String::length)
              .max();
```

上述代码求出以字母*A*开头的字符串的最大长度，一种直白的方式是为每一次函数调用都执一次迭代，这样做能够实现功能，但效率上肯定是无法接受的。类库的实现着使用流水线（*Pipeline*）的方式巧妙的避免了多次迭代，其基本思想是在一次迭代中尽可能多的执行用户指定的操作。为讲解方便我们汇总了Stream的所有操作。

Stream操作分类

| 操作                              | 状态                       | 方法                                                                                                                              |
| --------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 中间操作(Intermediate operations) | 无状态(Stateless)          | unordered() filter() map() mapToInt() mapToLong() mapToDouble() flatMap() flatMapToInt() flatMapToLong() flatMapToDouble() peek() |
|                                   | 有状态(Stateful)           | distinct() sorted() sorted() limit() skip()                                                                                       |
| 结束操作(Terminal operations)     | 非短路操作                 | forEach() forEachOrdered() toArray() reduce() collect() max() min() count()                                                       |
|                                   | 短路操作(short-circuiting) | anyMatch() allMatch() noneMatch() findFirst() findAny()                                                                           |

Stream上的所有操作分为两类：中间操作和结束操作，中间操作只是一种标记，只有结束操作才会触发实际计算。中间操作又可以分为无状态的(*Stateless*)和有状态的(*Stateful*)，无状态中间操作是指元素的处理不受前面元素的影响，而有状态的中间操作必须等到所有元素处理之后才知道最终结果，比如排序是有状态操作，在读取所有元素之前并不能确定排序结果；结束操作又可以分为短路操作和非短路操作，短路操作是指不用处理全部元素就可以返回结果，比如*找到第一个满足条件的元素*。之所以要进行如此精细的划分，是因为底层对每一种情况的处理方式不同。

为了更好的理解流的中间操作和终端操作，可以通过下面的两段代码来看他们的执行过程。

```java
IntStream.range(1, 10)
   .peek(x -> System.out.print("\nA" + x))
   .limit(3)
   .peek(x -> System.out.print("B" + x))
   .forEach(x -> System.out.print("C" + x));
```

输出为：

```text
A1B1C1
A2B2C2
A3B3C3
```

中间操作是懒惰的，也就是中间操作不会对数据做任何操作，直到遇到了最终操作。而最终操作，都是比较热情的。他们会往前回溯所有的中间操作。也就是当执行到最后的forEach操作的时候，它会回溯到它的上一步中间操作，上一步中间操作，又会回溯到上上一步的中间操作，...，直到最初的第一步。

第一次forEach执行的时候，会回溯peek 操作，然后peek会回溯更上一步的limit操作，然后limit会回溯更上一步的peek操作，顶层没有操作了，开始自上向下开始执行，输出：A1B1C1

第二次forEach执行的时候，然后会回溯peek 操作，然后peek会回溯更上一步的limit操作，然后limit会回溯更上一步的peek操作，顶层没有操作了，开始自上向下开始执行，输出：A2B2C2

...

当第四次forEach执行的时候，然后会回溯peek 操作，然后peek会回溯更上一步的limit操作，到limit的时候，发现limit(3)这个job已经完成，这里就相当于循环里面的break操作，跳出来终止循环。

再来看第二段代码：

```java
IntStream.range(1, 10)
   .peek(x -> System.out.print("\nA" + x))
   .skip(6)
   .peek(x -> System.out.print("B" + x))
   .forEach(x -> System.out.print("C" + x));
```

输出为：

```text
A1
A2
A3
A4
A5
A6
A7B7C7
A8B8C8
A9B9C9
```

第一次forEach执行的时候，会回溯peek操作，然后peek会回溯更上一步的skip操作，skip回溯到上一步的peek操作，顶层没有操作了，开始自上向下开始执行，执行到skip的时候，因为执行到skip，这个操作的意思就是跳过，下面的都不要执行了，也就是就相当于循环里面的continue，结束本次循环。输出：A1

第二次forEach执行的时候，会回溯peek操作，然后peek会回溯更上一步的skip操作，skip回溯到上一步的peek操作，顶层没有操作了，开始自上向下开始执行，执行到skip的时候，发现这是第二次skip，结束本次循环。输出：A2

...

第七次forEach执行的时候，会回溯peek操作，然后peek会回溯更上一步的skip操作，skip回溯到上一步的peek操作，顶层没有操作了，开始自上向下开始执行，执行到skip的时候，发现这是第七次skip，已经大于6了，它已经执行完了skip(6)的job了。这次skip就直接跳过，继续执行下面的操作。输出：A7B7C7

...直到循环结束。

### 一种直白的实现方式

![Stream_pipeline_naive](/assets/images/2021/10/lambda_Stream_pipeline_naive.png)

仍然考虑上述求最长字符串的程序，一种直白的流水线实现方式是为每一次函数调用都执一次迭代，并将处理中间结果放到某种数据结构中（比如数组，容器等）。具体说来，就是调用`filter()`方法后立即执行，选出所有以*A*开头的字符串并放到一个列表list1中，之后让list1传递给`mapToInt()`方法并立即执行，生成的结果放到list2中，最后遍历list2找出最大的数字作为最终结果。程序的执行流程如如所示：

这样做实现起来非常简单直观，但有两个明显的弊端：

1. 迭代次数多。迭代次数跟函数调用的次数相等。
2. 频繁产生中间结果。每次函数调用都产生一次中间结果，存储开销无法接受。

```java
// 多次迭代
List<String> strings = Arrays.asList("Apple", "Bug", "ABC", "Dog");
List<String> aList = strings.stream().filter(str -> str.startsWith("A")).collect(Collectors.toList());
List<Integer> lengths = aList.stream().map(String::length).collect(Collectors.toList());
int longest = lengths.stream().mapToInt(Integer::intValue).max().orElse(0);
```

这些弊端使得效率底下，根本无法接受。如果不使用Stream API我们都知道上述代码该如何在一次迭代中完成，大致是如下形式：

```java
int longest = 0;
for(String str : strings){
    if(str.startsWith("A")){// 1. filter(), 保留以A开头的字符串
        int len = str.length();// 2. mapToInt(), 转换成长度
        longest = Math.max(len, longest);// 3. max(), 保留最长的长度
    }
}
```

采用这种方式我们不但减少了迭代次数，也避免了存储中间结果，显然这就是流水线，因为我们把三个操作放在了一次迭代当中。只要我们事先知道用户意图，总是能够采用上述方式实现跟Stream API等价的功能，但问题是Stream类库的设计者并不知道用户的意图是什么。如何在无法假设用户行为的前提下实现流水线，是类库的设计者要考虑的问题。

### Stream流水线解决方案

我们大致能够想到，应该采用某种方式记录用户每一步的操作，当用户调用结束操作时将之前记录的操作叠加到一起在一次迭代中全部执行掉。沿着这个思路，有几个问题需要解决：

1. 用户的操作如何记录？
2. 操作如何叠加？
3. 叠加之后的操作如何执行？
4. 执行后的结果（如果有）在哪里？

#### >> 操作如何记录

![Java_stream_pipeline_classes](/assets/images/2021/10/lambda_Java_stream_pipeline_classes.png)

注意这里使用的是“*操作(operation)*”一词，指的是“Stream中间操作”的操作，很多Stream操作会需要一个回调函数（Lambda表达式），因此一个完整的操作是<*数据来源，操作，回调函数*>构成的三元组。Stream中使用Stage的概念来描述一个完整的操作，并用某种实例化后的*PipelineHelper*来代表Stage，将具有先后顺序的各个Stage连到一起，就构成了整个流水线。跟Stream相关类和接口的继承关系图示。

还有*IntPipeline, LongPipeline, DoublePipeline*没在图中画出，这三个类专门为三种基本类型（不是包装类型）而定制的，跟*ReferencePipeline*是并列关系。图中*Head*用于表示第一个Stage，即调用调用诸如*Collection.stream()*方法产生的Stage，很显然这个Stage里不包含任何操作；*StatelessOp*和*StatefulOp*分别表示无状态和有状态的Stage，对应于无状态和有状态的中间操作。

Stream流水线组织结构示意图如下：

![Stream_pipeline_example](/assets/images/2021/10/lambda_Stream_pipeline_example.png)

图中通过`Collection.stream()`方法得到*Head*也就是stage0，紧接着调用一系列的中间操作，不断产生新的Stream。**这些Stream对象以双向链表的形式组织在一起，构成整个流水线，由于每个Stage都记录了前一个Stage和本次的操作以及回调函数，依靠这种结构就能建立起对数据源的所有操作**。这就是Stream记录操作的方式。

#### >> 操作如何叠加

以上只是解决了操作记录的问题，要想让流水线起到应有的作用我们需要一种将所有操作叠加到一起的方案。你可能会觉得这很简单，只需要从流水线的head开始依次执行每一步的操作（包括回调函数）就行了。这听起来似乎是可行的，但是你忽略了前面的Stage并不知道后面Stage到底执行了哪种操作，以及回调函数是哪种形式。换句话说，只有当前Stage本身才知道该如何执行自己包含的动作。这就需要有某种协议来协调相邻Stage之间的调用关系。

这种协议由*Sink*接口完成，*Sink*接口包含的方法如下表所示：

| 方法名                          | 作用                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| void begin(long size)           | 开始遍历元素之前调用该方法，通知Sink做好准备。                                                                                                              |
| void end()                      | 所有元素遍历完成之后调用，通知Sink没有更多的元素了。                                                                                                        |
| boolean cancellationRequested() | 是否可以结束操作，可以让短路操作尽早结束。                                                                                                                  |
| void accept(T t)                | 遍历元素时调用，接受一个待处理元素，并对元素进行处理。Stage把自己包含的操作和回调方法封装到该方法里，前一个Stage只需要调用当前Stage.accept(T t)方法就行了。 |

有了上面的协议，相邻Stage之间调用就很方便了，每个Stage都会将自己的操作封装到一个Sink里，前一个Stage只需调用后一个Stage的`accept()`方法即可，并不需要知道其内部是如何处理的。当然对于有状态的操作，Sink的`begin()`和`end()`方法也是必须实现的。比如Stream.sorted()是一个有状态的中间操作，其对应的Sink.begin()方法可能创建一个盛放结果的容器，而accept()方法负责将元素添加到该容器，最后end()负责对容器进行排序。对于短路操作，`Sink.cancellationRequested()`也是必须实现的，比如Stream.findFirst()是短路操作，只要找到一个元素，cancellationRequested()就应该返回*true*，以便调用者尽快结束查找。Sink的四个接口方法常常相互协作，共同完成计算任务。**实际上Stream API内部实现的的本质，就是如何重写Sink的这四个接口方法**。

有了Sink对操作的包装，Stage之间的调用问题就解决了，执行时只需要从流水线的head开始对数据源依次调用每个Stage对应的Sink.{begin(), accept(), cancellationRequested(), end()}方法就可以了。一种可能的Sink.accept()方法流程是这样的：

```java
void accept(U u){
    1. 使用当前Sink包装的回调函数处理u
    2. 将处理结果传递给流水线下游的Sink
}
```

Sink接口的其他几个方法也是按照这种[处理->转发]的模型实现。下面我们结合具体例子看看Stream的中间操作是如何将自身的操作包装成Sink以及Sink是如何将处理结果转发给下一个Sink的。先看Stream.map()方法：

```java
// Stream.map()，调用该方法将产生一个新的Stream
public final <R> Stream<R> map(Function<? super P_OUT, ? extends R> mapper) {
    ...
    return new StatelessOp<P_OUT, R>(this, StreamShape.REFERENCE,
                                 StreamOpFlag.NOT_SORTED | StreamOpFlag.NOT_DISTINCT) {
        @Override /*opWripSink()方法返回由回调函数包装而成Sink*/
        Sink<P_OUT> opWrapSink(int flags, Sink<R> downstream) {
            return new Sink.ChainedReference<P_OUT, R>(downstream) {
                @Override
                public void accept(P_OUT u) {
                    R r = mapper.apply(u);// 1. 使用当前Sink包装的回调函数mapper处理u
                    downstream.accept(r);// 2. 将处理结果传递给流水线下游的Sink
                }
            };
        }
    };
}
```

上述代码看似复杂，其实逻辑很简单，就是将回调函数*mapper*包装到一个Sink当中。由于Stream.map()是一个无状态的中间操作，所以map()方法返回了一个StatelessOp内部类对象（一个新的Stream），调用这个新Stream的opWripSink()方法将得到一个包装了当前回调函数的Sink。

再来看一个复杂一点的例子。Stream.sorted()方法将对Stream中的元素进行排序，显然这是一个有状态的中间操作，因为读取所有元素之前是没法得到最终顺序的。抛开模板代码直接进入问题本质，sorted()方法是如何将操作封装成Sink的呢？sorted()一种可能封装的Sink代码如下：

```java
// Stream.sorted()方法用到的Sink实现
class RefSortingSink<T> extends AbstractRefSortingSink<T> {
    private ArrayList<T> list;// 存放用于排序的元素
    RefSortingSink(Sink<? super T> downstream, Comparator<? super T> comparator) {
        super(downstream, comparator);
    }
    @Override
    public void begin(long size) {
        ...
        // 创建一个存放排序元素的列表
        list = (size >= 0) ? new ArrayList<T>((int) size) : new ArrayList<T>();
    }
    @Override
    public void end() {
        list.sort(comparator);// 只有元素全部接收之后才能开始排序
        downstream.begin(list.size());
        if (!cancellationWasRequested) {// 下游Sink不包含短路操作
            list.forEach(downstream::accept);// 2. 将处理结果传递给流水线下游的Sink
        }
        else {// 下游Sink包含短路操作
            for (T t : list) {// 每次都调用cancellationRequested()询问是否可以结束处理。
                if (downstream.cancellationRequested()) break;
                downstream.accept(t);// 2. 将处理结果传递给流水线下游的Sink
            }
        }
        downstream.end();
        list = null;
    }
    @Override
    public void accept(T t) {
        list.add(t);// 1. 使用当前Sink包装动作处理t，只是简单的将元素添加到中间列表当中
    }
}
```

上述代码完美的展现了Sink的四个接口方法是如何协同工作的：

1. 首先begin()方法告诉Sink参与排序的元素个数，方便确定中间结果容器的的大小；
2. 之后通过accept()方法将元素添加到中间结果当中，最终执行时调用者会不断调用该方法，直到遍历所有元素；
3. 最后end()方法告诉Sink所有元素遍历完毕，启动排序步骤，排序完成后将结果传递给下游的Sink；
4. 如果下游的Sink是短路操作，将结果传递给下游时不断询问下游cancellationRequested()是否可以结束处理。

#### >> 叠加之后的操作如何执行

![Stream_pipeline_Sink](/assets/images/2021/10/lambda_Stream_pipeline_Sink.png)

Sink完美封装了Stream每一步操作，并给出了[处理->转发]的模式来叠加操作。这一连串的齿轮已经咬合，就差最后一步拨动齿轮启动执行。是什么启动这一连串的操作呢？也许你已经想到了启动的原始动力就是结束操作(Terminal Operation)，一旦调用某个结束操作，就会触发整个流水线的执行。

结束操作之后不能再有别的操作，所以结束操作不会创建新的流水线阶段(Stage)，直观的说就是流水线的链表不会在往后延伸了。结束操作会创建一个包装了自己操作的Sink，这也是流水线中最后一个Sink，这个Sink只需要处理数据而不需要将结果传递给下游的Sink（因为没有下游）。对于Sink的[处理->转发]模型，结束操作的Sink就是调用链的出口。

我们再来考察一下上游的Sink是如何找到下游Sink的。一种可选的方案是在*PipelineHelper*中设置一个Sink字段，在流水线中找到下游Stage并访问Sink字段即可。但Stream类库的设计者没有这么做，而是设置了一个`Sink AbstractPipeline.opWrapSink(int flags, Sink downstream)`方法来得到Sink，该方法的作用是返回一个新的包含了当前Stage代表的操作以及能够将结果传递给downstream的Sink对象。为什么要产生一个新对象而不是返回一个Sink字段？这是因为使用opWrapSink()可以将当前操作与下游Sink（上文中的downstream参数）结合成新Sink。试想只要从流水线的最后一个Stage开始，不断调用上一个Stage的opWrapSink()方法直到最开始（不包括stage0，因为stage0代表数据源，不包含操作），就可以得到一个代表了流水线上所有操作的Sink，用代码表示就是这样：

```java
// AbstractPipeline.wrapSink()
// 从下游向上游不断包装Sink。如果最初传入的sink代表结束操作，
// 函数返回时就可以得到一个代表了流水线上所有操作的Sink。
final <P_IN> Sink<P_IN> wrapSink(Sink<E_OUT> sink) {
    ...
    for (AbstractPipeline p=AbstractPipeline.this; p.depth > 0; p=p.previousStage) {
        sink = p.opWrapSink(p.previousStage.combinedFlags, sink);
    }
    return (Sink<P_IN>) sink;
}
```

现在流水线上从开始到结束的所有的操作都被包装到了一个Sink里，执行这个Sink就相当于执行整个流水线，执行Sink的代码如下：

```java
// AbstractPipeline.copyInto(), 对spliterator代表的数据执行wrappedSink代表的操作。
final <P_IN> void copyInto(Sink<P_IN> wrappedSink, Spliterator<P_IN> spliterator) {
    ...
    if (!StreamOpFlag.SHORT_CIRCUIT.isKnown(getStreamAndOpFlags())) {
        wrappedSink.begin(spliterator.getExactSizeIfKnown());// 通知开始遍历
        spliterator.forEachRemaining(wrappedSink);// 迭代
        wrappedSink.end();// 通知遍历结束
    }
    ...
}
```

上述代码首先调用wrappedSink.begin()方法告诉Sink数据即将到来，然后调用spliterator.forEachRemaining()方法对数据进行迭代（Spliterator是容器的一种迭代器，[参阅](https://github.com/CarpenterLee/JavaLambdaInternals/blob/master/3-Lambda%20and%20Collections.md#spliterator)），最后调用wrappedSink.end()方法通知Sink数据处理结束。逻辑如此清晰。

#### >> 执行后的结果在哪里

最后一个问题是流水线上所有操作都执行后，用户所需要的结果（如果有）在哪里？首先要说明的是不是所有的Stream结束操作都需要返回结果，有些操作只是为了使用其副作用(*Side-effects*)，比如使用`Stream.forEach()`方法将结果打印出来就是常见的使用副作用的场景（事实上，除了打印之外其他场景都应避免使用副作用），对于真正需要返回结果的结束操作结果存在哪里呢？

> 特别说明：副作用不应该被滥用，也许你会觉得在Stream.forEach()里进行元素收集是个不错的选择，就像下面代码中那样，但遗憾的是这样使用的正确性和效率都无法保证，因为Stream可能会并行执行。大多数使用副作用的地方都可以使用[归约操作]更安全和有效的完成。

```java
// 错误的收集方式
ArrayList<String> results = new ArrayList<>();
stream.filter(s -> pattern.matcher(s).matches())
      .forEach(s -> results.add(s));  // Unnecessary use of side-effects!
// 正确的收集方式
List<String>results =
     stream.filter(s -> pattern.matcher(s).matches())
             .collect(Collectors.toList());  // No side-effects!
```

回到流水线执行结果的问题上来，需要返回结果的流水线结果存在哪里呢？这要分不同的情况讨论，下表给出了各种有返回结果的Stream结束操作。

| 返回类型 | 对应的结束操作                    |
| -------- | --------------------------------- |
| boolean  | anyMatch() allMatch() noneMatch() |
| Optional | findFirst() findAny()             |
| 归约结果 | reduce() collect()                |
| 数组     | toArray()                         |

1. 对于表中返回boolean或者Optional的操作（Optional是存放 一个 值的容器）的操作，由于值返回一个值，只需要在对应的Sink中记录这个值，等到执行结束时返回就可以了。
2. 对于归约操作，最终结果放在用户调用时指定的容器中（容器类型通过[收集器](#收集器)指定）。collect(), reduce(), max(), min()都是归约操作，虽然max()和min()也是返回一个Optional，但事实上底层是通过调用[reduce()](#多面手reduce)方法实现的。
3. 对于返回是数组的情况，毫无疑问的结果会放在数组当中。这么说当然是对的，但在最终返回数组之前，结果其实是存储在一种叫做*Node*的数据结构中的。Node是一种多叉树结构，元素存储在树的叶子当中，并且一个叶子节点可以存放多个元素。这样做是为了并行执行方便。关于Node的具体结构，我们会在下一节探究Stream如何并行执行时给出详细说明。

### 结语6

本文详细介绍了Stream流水线的组织方式和执行过程，学习本文将有助于理解原理并写出正确的Stream代码，同时打消你对Stream API效率方面的顾虑。如你所见，Stream API实现如此巧妙，即使我们使用外部迭代手动编写等价代码，也未必更加高效。

注：留下本文所用的JDK版本，以便有考究癖的人考证：

```shell
$ java -version
java version "1.8.0_101"
Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
Java HotSpot(TM) Server VM (build 25.101-b13, mixed mode)
```

----

## parallelStream 介绍

### 引言

大家应该已经对Stream有过很多的了解，对其原理及常见使用方法已经也有了一定的认识。流在处理数据进行一些迭代操作的时候确认很方便，但是在执行一些耗时或是占用资源很高的任务时候，串行化的流无法带来速度/性能上的提升，并不能满足我们的需要，通常我们会使用多线程来并行或是分片分解执行任务，而在Stream中也提供了这样的并行方法，那就是使用parallelStream()方法或者是使用stream().parallel()来转化为并行流。开箱即用的并行流的使用看起来如此简单，然后我们就可能会忍不住思考，并行流的实现原理是怎样的？它的使用会给我们带来多大的性能提升？我们可以在什么场景下使用以及使用时应该注意些什么？

首先我们看一下Java 的并行 API 演变历程基本如下：

- 1.0-1.4 中的 java.lang.Thread
- 5.0 中的 java.util.concurrent
- 6.0 中的 Phasers 等
- 7.0 中的 Fork/Join 框架
- 8.0 中的 Lambda

### parallelStream是什么？

先看一下`Collection`接口提供的并行流方法

```java
/**
 * Returns a possibly parallel {@code Stream} with this collection as its
 * source.  It is allowable for this method to return a sequential stream.
 *
 * <p>This method should be overridden when the {@link #spliterator()}
 * method cannot return a spliterator that is {@code IMMUTABLE},
 * {@code CONCURRENT}, or <em>late-binding</em>. (See {@link #spliterator()}
 * for details.)
 *
 * @implSpec
 * The default implementation creates a parallel {@code Stream} from the
 * collection's {@code Spliterator}.
 *
 * @return a possibly parallel {@code Stream} over the elements in this
 * collection
 * @since 1.8
 */
default Stream<E> parallelStream() {
    return StreamSupport.stream(spliterator(), true);
}
```

注意其中的代码注释的返回值 `@return a possibly parallel` 一句说明调用了这个方法，只是可能会返回一个并行的流，流是否能并行执行还受到其他一些条件的约束。
parallelStream其实就是一个并行执行的流，它通过默认的`ForkJoinPool`，**可能**提高你的多线程任务的速度。
引用[Custom thread pool in Java 8 parallel stream](https://stackoverflow.com/questions/21163108/custom-thread-pool-in-java-8-parallel-stream)上面的两段话：
> The parallel streams use the default `ForkJoinPool.commonPool` which [by default has one less threads as you have processors](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html), as returned by `Runtime.getRuntime().availableProcessors()` (This means that parallel streams use all your processors because they also use the main thread)。

做个实验来证明上面这句话的真实性：

```java
public static void main(String[] args) {
    IntStream list = IntStream.range(0, 10);
    Set<Thread> threadSet = new HashSet<>();
    //开始并行执行
    list.parallel().forEach(i -> {
        Thread thread = Thread.currentThread();
        System.err.println("integer：" + i + "，" + "currentThread:" + thread.getName());
        threadSet.add(thread);
    });
    System.out.println("all threads：" + Joiner.on("，").join(threadSet.stream().map(Thread::getName).collect(Collectors.toList())));
}
```

![lambda_13932958-263c866e35df81e5.png](/assets/images/2021/10/lambda_13932958-263c866e35df81e5.png)

从运行结果里面我们可以很清楚的看到parallelStream同时使用了主线程和`ForkJoinPool.commonPool`创建的线程。
值得说明的是这个运行结果并不是唯一的，实际运行的时候可能会得到多个结果，比如：

![lambda_13932958-e1836ce1a66f41ec.png](/assets/images/2021/10/lambda_13932958-e1836ce1a66f41ec.png)

甚至你的运行结果里面只有主线程。

来源于java 8 实战的书籍的一段话：
> 并行流内部使用了默认的`ForkJoinPool`（7.2节会进一步讲到分支/合并框架），它默认的线程数量就是你的处理器数量，这个值是由`Runtime.getRuntime().available- Processors()`得到的。 但是你可以通过系统属性`java.util.concurrent.ForkJoinPool.common. parallelism`来改变线程池大小，如下所示： `System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism","12");` 这是一个全局设置，因此它将影响代码中所有的并行流。反过来说，目前还无法专为某个 并行流指定这个值。一般而言，让`ForkJoinPool`的大小等于处理器数量是个不错的默认值， 除非你有很好的理由，否则我们强烈建议你不要修改它。

```java
// 设置全局并行流并发线程数
System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism", "12");
System.out.println(ForkJoinPool.getCommonPoolParallelism());// 输出 12
System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism", "20");
System.out.println(ForkJoinPool.getCommonPoolParallelism());// 输出 12
```

为什么两次的运行结果是一样的呢？上面刚刚说过了这是一个全局设置，`java.util.concurrent.ForkJoinPool.common.parallelism`是final类型的，整个JVM中只允许设置一次。既然默认的并发线程数不能反复修改，那怎么进行不同线程数量的并发测试呢？答案是：`引入ForkJoinPool`

```java
IntStream range = IntStream.range(1, 100000);
// 传入parallelism
new ForkJoinPool(parallelism).submit(() -> range.parallel().forEach(System.out::println)).get();
```

因此，使用parallelStream时需要注意的一点是，**多个parallelStream之间默认使用的是同一个线程池**，所以IO操作尽量不要放进parallelStream中，否则会阻塞其他parallelStream。
> Using a ForkJoinPool and submit for a parallel stream does not reliably use all threads. If you look at this ( [Parallel stream from a HashSet doesn't run in parallel](https://stackoverflow.com/questions/28985704/parallel-stream-from-a-hashset-doesnt-run-in-parallel) ) and this ( [Why does the parallel stream not use all the threads of the ForkJoinPool?](https://stackoverflow.com/questions/36947336/why-does-the-parallel-stream-not-use-all-the-threads-of-the-forkjoinpool) ), you'll see the reasoning.

```java
// 获取当前机器CPU处理器的数量
System.out.println(Runtime.getRuntime().availableProcessors());// 输出 4
// parallelStream默认的并发线程数
System.out.println(ForkJoinPool.getCommonPoolParallelism());// 输出 3
```

为什么parallelStream默认的并发线程数要比CPU处理器的数量少1个？文章的开始已经提过了。因为最优的策略是每个CPU处理器分配一个线程，然而主线程也算一个线程，所以要占一个名额。
这一点可以从源码中看出来：

```java
static final int MAX_CAP      = 0x7fff;        // max #workers - 1
// 无参构造函数
public ForkJoinPool() {
        this(Math.min(MAX_CAP, Runtime.getRuntime().availableProcessors()),
             defaultForkJoinWorkerThreadFactory, null, false);
}bs-channel
```

### 从parallelStream认识[Fork/Join 框架](https://www.infoq.cn/article/fork-join-introduction/)

Fork/Join 框架的核心是采用分治法的思想，将一个大任务拆分为若干互不依赖的子任务，把这些子任务分别放到不同的队列里，并为每个队列创建一个单独的线程来执行队列里的任务。同时，为了最大限度地提高并行处理能力，采用了工作窃取算法来运行任务，也就是说当某个线程处理完自己工作队列中的任务后，尝试当其他线程的工作队列中窃取一个任务来执行，直到所有任务处理完毕。所以为了减少线程之间的竞争，通常会使用双端队列，被窃取任务线程永远从双端队列的头部拿任务执行，而窃取任务的线程永远从双端队列的尾部拿任务执行。

- Fork/Join 的运行流程图

![lambda_13932958-dbceae46ea7c15c3.png](/assets/images/2021/10/lambda_13932958-dbceae46ea7c15c3.png)

简单地说就是大任务拆分成小任务，分别用不同线程去完成，然后把结果合并后返回。所以第一步是拆分，第二步是分开运算，第三步是合并。这三个步骤分别对应的就是Collector的*supplier*,*accumulator*和*combiner*。

- 工作窃取算法
Fork/Join最核心的地方就是利用了现代硬件设备多核,在一个操作时候会有空闲的CPU,那么如何利用好这个空闲的cpu就成了提高性能的关键,而这里我们要提到的工作窃取（work-stealing）算法就是整个Fork/Join框架的核心理念,工作窃取（work-stealing）算法是指某个线程从其他队列里窃取任务来执行。  

![lambda_13932958-ffe0d5ddd7101bbc.png](/assets/images/2021/10/lambda_13932958-ffe0d5ddd7101bbc.png)

### 使用parallelStream的利弊

使用parallelStream的几个好处：

1. 代码优雅，可以使用lambda表达式，原本几句代码现在一句可以搞定；
2. 运用多核特性(forkAndJoin)并行处理，大幅提高效率。

关于并行流和多线程的性能测试可以看一下下面的几篇博客：  

- [并行流适用场景-CPU密集型](https://blog.csdn.net/larva_s/article/details/90403578)
- [提交订单性能优化系列之006-普通的Thread多线程改为Java8的parallelStream并发流](https://blog.csdn.net/blueskybluesoul/article/details/82817007)

然而，任何事物都不是完美的，并行流也不例外，其中最明显的就是使用(parallel)Stream极其不便于代码的跟踪调试，此外并行流带来的不确定性也使得我们对它的使用变得格外谨慎。我们得去了解更多的并行流的相关知识来保证自己能够正确的使用这把双刃剑。

parallelStream使用时需要注意的点：

1. **parallelStream是线程不安全的；**

    ```java
    List<Integer> values = new ArrayList<>();
    IntStream.range(1, 10000).parallel().forEach(values::add);
    System.out.println(values.size());
    ```

    values集合大小可能不是10000。集合里面可能会存在null元素或者抛出下标越界的异常信息。  
    原因：List不是线程安全的集合，add方法在多线程环境下会存在并发问题。
    当执行add方法时，会先将此容器的大小增加。。即size++，然后将传进的元素赋值给新增的`elementData[size++]`，即新的内存空间。但是此时如果在size++后直接来取这个List,而没有让add完成赋值操作，则会导致此List的长度加一，，但是最后一个元素是空（null），所以在获取它进行计算的时候报了空指针异常。而下标越界还不能仅仅依靠这个来解释，如果你观察发生越界时的数组下标，分别为10、15、22、33、49和73。结合前面讲的数组自动机制，数组初始长度为10，第一次扩容为15=10+10/2，第二次扩容22=15+15/2，第三次扩容33=22+22/2...以此类推，我们不难发现，越界异常都发生在数组扩容之时。
    `grow()`方法解释了基于数组的ArrayList是如何扩容的。数组进行扩容时，会将老数组中的元素重新拷贝一份到新的数组中，通过`oldCapacity + (oldCapacity >> 1)`运算，每次数组容量的增长大约是其原容量的1.5倍。

    ```java
        /**
        * Increases the capacity to ensure that it can hold at least the
        * number of elements specified by the minimum capacity argument.
        *
        * @param minCapacity the desired minimum capacity
        */
        private void grow(int minCapacity) {
            // overflow-conscious code
            int oldCapacity = elementData.length;
            int newCapacity = oldCapacity + (oldCapacity >> 1);// 1.5倍扩容
            if (newCapacity - minCapacity < 0)
                newCapacity = minCapacity;
            if (newCapacity - MAX_ARRAY_SIZE > 0)
                newCapacity = hugeCapacity(minCapacity);
            // minCapacity is usually close to size, so this is a win:
            elementData = Arrays.copyOf(elementData, newCapacity);// 拷贝旧的数组到新的数组中
        }


        /**
        * Appends the specified element to the end of this list.
        *
        * @param e element to be appended to this list
        * @return <tt>true</tt> (as specified by {@link Collection#add})
        */
        public boolean add(E e) {
            ensureCapacityInternal(size + 1);  // Increments modCount!! 检查array容量
            elementData[size++] = e;// 赋值，增大Size的值
            return true;
        }
    ```

    解决方法：
    加锁、使用线程安全的集合或者采用`collect()`或者`reduce()`操作就是满足线程安全的了。

    ```java
    List<Integer> values = new ArrayList<>();
    for (int i = 0; i < 10000; i++) {
        values.add(i);
    }
    List<Integer> collect = values.stream().parallel().collect(Collectors.toList());
    System.out.println(collect.size());
    ```

2. parallelStream 适用的场景是CPU密集型的，只是做到别浪费CPU，假如本身电脑CPU的负载很大，那还到处用并行流，那并不能起到作用；

   - I/O密集型 磁盘I/O、网络I/O都属于I/O操作，这部分操作是较少消耗CPU资源，一般并行流中不适用于I/O密集型的操作，就比如使用并流行进行大批量的消息推送，涉及到了大量I/O，使用并行流反而慢了很多
   - CPU密集型 计算类型就属于CPU密集型了，这种操作并行流就能提高运行效率。

3. 不要在多线程中使用parallelStream，原因同上类似，大家都抢着CPU是没有提升效果，反而还会加大线程切换开销；
4. 会带来不确定性，请确保每条处理无状态且没有关联；
5. 考虑NQ模型：N可用的数据量，Q针对每个数据元素执行的计算量，乘积 `N * Q` 越大，就越有可能获得并行提速。`N * Q`>10000（大概是集合大小超过1000） 就会获得有效提升；
6. parallelStream是创建一个并行的Stream,而且它的并行操作是*不具备线程传播性*的,所以是无法获取ThreadLocal创建的线程变量的值；
7. **在使用并行流的时候是无法保证元素的顺序的，也就是即使你用了同步集合也只能保证元素都正确但无法保证其中的顺序**；
8. lambda的执行并不是瞬间完成的，所有使用parallel stream的程序都有可能成为阻塞程序的源头，并且在执行过程中程序中的其他部分将无法访问这些workers，这意味着任何依赖parallel streams的程序在什么别的东西占用着common ForkJoinPool时将会变得不可预知并且暗藏危机。

----

## Stream Performance

已经对Stream API的用法鼓吹够多了，用起简洁直观，但性能到底怎么样呢？会不会有很高的性能损失？本节我们对Stream API的性能一探究竟。

为保证测试结果真实可信，我们将JVM运行在`-server`模式下，测试数据在GB量级，测试机器采用常见的商用服务器，配置如下：

| OS  | CentOS 6.7 x86_64                                        |
|-----|----------------------------------------------------------|
| CPU | Intel Xeon X5675, 12M Cache 3.06 GHz, 6 Cores 12 Threads |
| 内存  | 96GB                                                     |
| JDK | java version 1.8.0_91, Java HotSpot(TM) 64-Bit Server VM |

### 测试方法和测试数据

性能测试并不是容易的事，Java性能测试更费劲，因为虚拟机对性能的影响很大，JVM对性能的影响有两方面：

1. GC的影响。GC的行为是Java中很不好控制的一块，为增加确定性，我们手动指定使用CMS收集器，并使用10GB固定大小的堆内存。具体到JVM参数就是`-XX:+UseConcMarkSweepGC -Xms10G -Xmx10G`
2. JIT(Just-In-Time)即时编译技术。即时编译技术会将热点代码在JVM运行的过程中编译成本地代码，测试时我们会先对程序预热，触发对测试函数的即时编译。相关的JVM参数是`-XX:CompileThreshold=10000`。

Stream并行执行时用到`ForkJoinPool.commonPool()`得到的线程池，为控制并行度我们使用Linux的`taskset`命令指定JVM可用的核数。

测试数据由程序随机生成。为防止一次测试带来的抖动，测试4次求出平均时间作为运行时间。

### 实验一 基本类型迭代

测试内容：找出整型数组中的最小值。对比for循环外部迭代和Stream API内部迭代性能。

测试结果如下图：

![perf_Stream_min_int](/assets/images/2021/10/lambda_perf_Stream_min_int.png)

图中展示的是for循环外部迭代耗时为基准的时间比值。分析如下：

1. 对于基本类型Stream串行迭代的性能开销明显高于外部迭代开销（两倍）；
2. Stream并行迭代的性能比串行迭代和外部迭代都好。

并行迭代性能跟可利用的核数有关，上图中的并行迭代使用了全部12个核，为考察使用核数对性能的影响，我们专门测试了不同核数下的Stream并行迭代效果：

![perf_Stream_min_int_par](/assets/images/2021/10/lambda_perf_Stream_min_int_par.png)

分析，对于基本类型：

1. 使用Stream并行API在单核情况下性能很差，比Stream串行API的性能还差；
2. 随着使用核数的增加，Stream并行效果逐渐变好，比使用for循环外部迭代的性能还好。

以上两个测试说明，对于基本类型的简单迭代，Stream串行迭代性能更差，但多核情况下Stream迭代时性能较好。

### 实验二 对象迭代

再来看对象的迭代效果。

测试内容：找出字符串列表中最小的元素（自然顺序），对比for循环外部迭代和Stream API内部迭代性能。

测试结果如下图：

![perf_Stream_min_String](/assets/images/2021/10/lambda_perf_Stream_min_String.png)

结果分析如下：

1. 对于对象类型Stream串行迭代的性能开销仍然高于外部迭代开销（1.5倍），但差距没有基本类型那么大。
2. Stream并行迭代的性能比串行迭代和外部迭代都好。

再来单独考察Stream并行迭代效果：

![perf_Stream_min_String_par](/assets/images/2021/10/lambda_perf_Stream_min_String_par.png)

分析，对于对象类型：

1. 使用Stream并行API在单核情况下性能比for循环外部迭代差；
2. 随着使用核数的增加，Stream并行效果逐渐变好，多核带来的效果明显。

以上两个测试说明，对于对象类型的简单迭代，Stream串行迭代性能更差，但多核情况下Stream迭代时性能较好。

### 实验三 复杂对象归约

从实验一、二的结果来看，Stream串行执行的效果都比外部迭代差（很多），是不是说明Stream真的不行了？先别下结论，我们再来考察一下更复杂的操作。

测试内容：给定订单列表，统计每个用户的总交易额。对比使用外部迭代手动实现和Stream API之间的性能。

我们将订单简化为`<userName, price, timeStamp>`构成的元组，并用`Order`对象来表示。测试结果如下图：

![perf_Stream_reduction](/assets/images/2021/10/lambda_perf_Stream_reduction.png)

分析，对于复杂的归约操作：

1. Stream API的性能普遍好于外部手动迭代，并行Stream效果更佳；

再来考察并行度对并行效果的影响，测试结果如下：

![perf_Stream_reduction_par](/assets/images/2021/10/lambda_perf_Stream_reduction_par.png)

分析，对于复杂的归约操作：

1. 使用Stream并行归约在单核情况下性能比串行归约以及手动归约都要差，简单说就是最差的；
2. 随着使用核数的增加，Stream并行效果逐渐变好，多核带来的效果明显。

以上两个实验说明，对于复杂的归约操作，Stream串行归约效果好于手动归约，在多核情况下，并行归约效果更佳。我们有理由相信，对于其他复杂的操作，Stream API也能表现出相似的性能表现。

### 结论8

上述三个实验的结果可以总结如下：

1. 对于简单操作，比如最简单的遍历，Stream串行API性能明显差于显示迭代，但并行的Stream API能够发挥多核特性。
2. 对于复杂操作，Stream串行API性能可以和手动实现的效果匹敌，在并行执行时Stream API效果远超手动实现。

所以，如果出于性能考虑，1. 对于简单操作推荐使用外部迭代手动实现，2. 对于复杂操作，推荐使用Stream API， 3. 在多核情况下，推荐使用并行Stream API来发挥多核优势，4.单核情况下不建议使用并行Stream API。

如果出于代码简洁性考虑，使用Stream API能够写出更短的代码。即使是从性能方面说，尽可能的使用Stream API也另外一个优势，那就是只要Java Stream类库做了升级优化，代码不用做任何修改就能享受到升级带来的好处。

----

## 参考

- 转载[JavaLambdaInternals](https://github.com/CarpenterLee/JavaLambdaInternals)
