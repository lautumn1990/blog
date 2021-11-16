---
title: 开源许可证
tags: [ license, doc ]
categories: [ doc ]
key: free-software-licenses
pageview: true
---

开源许可证

<!--more-->

## [如何选择开源许可证？](http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html)

如何为代码选择开源许可证，这是一个问题。

世界上的开源许可证，大概有[上百种](https://www.gnu.org/licenses/license-list.html)。很少有人搞得清楚它们的区别。即使在最流行的六种----GPL、BSD、MIT、Mozilla、Apache和LGPL----之中做选择，也很复杂。

乌克兰程序员[Paul Bagwell](https://web.archive.org/web/20110715054752/http://pbagwl.com/post/5078147450/description-of-popular-software-licenses)，画了一张分析图，说明应该怎么选择。这是我见过的最简单的讲解，只用两分钟，你就能搞清楚这六种许可证之间的最大区别。

![free_software_licenses.png](/assets/images/2021/11/free_software_licenses.png)

## 开源协议分类

常见的开源许可证主要有 Apache、MIT、BSD、GPL、LGPL、MPL、SSPL 等，可以大致分为两大类：**宽松自由软件许可协议（“Permissive free software licence”）**和**著佐权许可证（“copyleft license”）**。

- Permissive free software licence 是一种对软件的使用、修改、传播等方式采用最低限制的自由软件许可协议条款类型。这种类型的软件许可协议将不保证原作品的派生作品会继续保持与原作品完全相同的相关限制条件，从而为原作品的自由使用、修改和传播等提供更大的空间。

- 而 Copyleft License 是在有限空间内的自由使用、修改和传播，且不得违背原作品的限制条款。如果一款软件使用 Copyleft 类型许可协议规定软件不得用于商业目的，且不得闭源，那么后续的衍生子软件也必须得遵循该条款。

**两者最大的差别**在于：

- 在软件被修改并再发行时，Copyleft License 仍然强制要求公开源代码（衍生软件需要开源），
- 而 Permissive free software licence 不要求公开源代码（衍生软件可以变为专有软件）。

其中，`Apache`、`MIT`、`BSD` 都是宽松许可证，`GPL` 是典型的强著佐权（copyleft ）许可证，`LGPL`、`MPL` 是弱著佐权（copyleft）许可证。`SSPL` 则是近年来 MongoDB 创建的一个新许可证，存在较大争议，开放源代码促进会 OSI 甚至认为 SSPL 就不是开源许可协议。

此外，还有一类是 Creative Commons（CC）知识共享协议。严格意义上说该协议并不能说是真正的开源协议，它们大多是被使用于设计类的工程上。CC 协议种类繁多，每一种都授权特定的权利。大多数的比较严格的 CC 协议会声明` “署名权，非商业用途，禁止衍生” `条款，这意味着你可以自由的分享这个作品，但你不能改变它和对其收费，而且必须声明作品的归属。这个许可协议非常的有用，它可以让你的作品传播出去，但又可以对作品的使用保留部分或完全的控制。最少限制的 CC 协议类型当属 `“署名”`协议，这意味着只要人们能维护你的名誉，他们对你的作品怎么使用都行。

## 常见开源协议

开源协议（Open Source License）就是一种用于计算机软件开源使用的许可证，目前世界上有多达上百种开源许可证，不过我们最常用的主流开源协议主要有**GPL**、**LGPL**、**EPL**、**MPL**、**Apache**、**MIT**和**BSD**这几种。

### 1.GNU General Public License (GPL)

GPL是最受欢迎的开源许可证之一。它有好几个版本，但对于新项目，你应该考虑使用最新版GPL。

GPL支持强大的版权保护，可能是最具保护性的免费软件许可证。其背后的核心理念就是任何衍生作品，也必须在GPL下发布。

具有以下特点：

- 版权约束很强
- 项目工作适合商业用途。
- 被许可方可以修改项目。
- 被许可方必须将源代码与衍生作品一起发布。
- 衍生作品必须以相同的条款发布。

#### 使用GPL协议的常见项目

GPL是自由软件基金会项目的指定许可证，包括Linux系统核心的各种GNU工具在内的很多项目都采用了GPL开源协议。大型项目，尤其是商业项目往往将GPL与一个或多个其他许可证结合使用。

- [Inkscape（GPL v2）](http://wiki.inkscape.org/wiki/index.php/Frequently_asked_questions#Under_what_license_is_Inkscape_released.3F)
- [MySQL（GPL+商业许可证）](https://mariadb.com/kb/en/mariadb/licensing-faq/)
- [MariaDB（GPL v2）](https://mariadb.com/kb/en/library/licensing-faq/)

### 2.GNU Lesser General Public License (LGPL)

GPL在某种意义上讲是非常严格的，它强制任何衍生作品在相同条款下以开源方式发布。程序库应当尤为关注GPL——库是大型软件的构建模块：在GPL协议下发布库，你将强制使用该库的任何应用程序也在GPL协议下发布。LGPL则可以解决这个问题。

对于程序库，自由软件基金会（FSF）区分了三种情况：

- 你的库执行了与非自由标准竞争的标准。在这种情况下，广泛采用你的库将有助于自由软件的发展。 对于这种情况，FSF建议使用非常宽松的Apache许可证（下文会讲到这种许可证）。
- 你的库执行了其他库已执行的标准。在这种情况下，完全放弃copyleft对于自由软件的发展没有任何好处。所以FSF推荐使用LGPL。
- 最后，如果你的库不与其它库或其他标准竞争，FSF建议使用GPL。

当然，FSF的建议大多是从道德上做的考虑，而在实际情况中，开发者还会有其他方面的顾虑，特别是很多时候想根据许可项目开展商业业务。此时将商业许可证考虑在内是可行的选择。

总的来看，LGPL具有以下特点：

- 版权约束较弱（受限于动态关联的程序库）
- 项目作品适合商业用途。
- 被许可方可以修改项目。
- 被许可方必须将源代码与衍生工作一起开源发布。
- 如果你修改了项目，则必须以相同的条款发布修改后的作品。
- 如果你使用项目作品，无需以相同的条款发布衍生作品。

#### 使用LGPL协议的常见项目

- [OpenOffice （LGPL v3）](https://www.openoffice.org/license.html), 同时也使用了 Apache License, Version 2.0
- [CUPS （LGPL v2和GPL）](https://www.cups.org/doc/license.html)
- [GNU Aspell （LGPLv2.1）](https://directory.fsf.org/wiki/Aspell#tab=Details)

### 3.Eclipse Public License（EPL）

由于版权约束比LGPL弱，因此EPL许可证更加商业友好，因为它允许转授使用许可和构建由EPL和非EPL（甚至专有）许可代码组成的软件，前提是非EPL代码是“软件的单独模块”。

此外，在包括项目工作在内的商业产品引起的诉讼/损害的情况下，EPL为EPL代码贡献者提供了额外保护。

它主要具有以下特点：

- 较弱的版权约束（受限于软件“模块”）
- 项目作品适合商业用途。
- 被许可方可以修改项目。
- 如果你修改了作品，则必须以相同的条款发布修改后的作品。
- 如果你使用了作品，无需以相同的条款发布衍生作品。
- 软件的商业分销商必须在因商业用途导致的诉讼/损害中保护或赔偿原始EPL贡献者。

#### 使用EPL协议的常见项目

- [编程语言Clojure（EPL v1.0）](https://clojure.org/community/license)
- [应用服务器Jetty（EPL v2.0）](https://www.eclipse.org/jetty/licenses.php)
- [Java测试框架（EPL v1.0）](https://junit.org/junit4/license.html)

### 4.Mozilla Public License (MPL)

MPL是Mozilla基金会开发的软件所用的许可证，当然不仅仅用于这个领域。 MPL旨在成为严格许可证（如GPL）和宽松许可证（如MIT许可证）之间的折中方案。

在MPL中，“发证单位”是源文件。许可方不得限制MPL涵盖的任何文件的用户权限和访问权限。但是同一个项目也可以包含专有的非MPL许可文件。如果授予对MPL许可文件的访问权限，则可以在任何许可下发布生成的项目。

MPL具有以下特点：

- 版权约束较弱（受限于单个文件）
- 项目作品适合商业用途。
- 被许可方可以修改项目。
- 被许可方必须提供引用说明。
- 被许可方可以根据不同条款重新发布衍生作品
- 被许可方不得重新许可MPL许可的资源
- 被许可方必须将其衍生作品与MPL许可的源代码一起分发。

#### 使用MPL协议的常见项目

- [火狐浏览器（MPL v2.0）](https://www.firefox.com/)
- [办公套件LibreOffice（MPL v2.0）](https://www.libreoffice.org/about-us/licenses/)
- [2D图形引擎Cairo（MPL v1.1）](https://cairographics.org/)

### 5.Apache License 2.0 (ASL)

ASL出现后，我们逐步进入宽松的免费许可证时代。在某些情况下，甚至FSF都建议使用Apache许可证。Apache许可证相当宽松，因为它不需要在相同的条款下分发任何衍生作品。换句话说，这是一个非版权许可证。

ASL是Apache 软件基金会项目使用的唯一许可证。广泛认为ASL对商业友好，已在该组织之外得到大量应用。在ASL下发布企业级项目并不稀奇。

Apache许可证具有以下特点：

- 非版权
- 项目作品适合商业用途。
- 被许可方可以修改项目。
- 被许可方必须提供引用说明。
- 被许可方可以根据不同条款重新分配衍生作品。
- 被许可方不必将其衍生作品和源代码一起分发。使

#### 用ASL协议的常见项目

- [安卓（ASL v2.0，某些情况例外）](https://source.android.com/source/licenses.html)
- [Apache Spark（ASL v2.0）](http://spark.apache.org/faq.html)
- [Spring Framework（ASL v2.0）](https://spring.io/projects/spring-framework)

### 6.MIT License

MIT许可证

这是一个非常受欢迎的许可证，甚至可能是最受欢迎的。它对重复使用的限制极少，可以轻松地与其他许可证相关联，包括GPL和专有许可证。

具有以下特点：

- 非版权
- 项目作品适合商业用途。
- 被许可方可以修改项目。
- 被许可方必须提供引用说明。
- 被许可方可以根据不同条款重新发布衍生作品
- 被许可方不必将其衍生作品和源代码一起发布。

#### 使用MIT协议的常见项目

- [Node.js](https://nodejs.org/en/)
- [Atom](https://atom.io/faq)
- [AngularJS](https://docs.angularjs.org/misc/faq)

### 7.BSD许可证

BSD许可证有三种版本：初版的4句版许可证，“修订版”3句版许可证和“简化版”2句版许可证。这三种版本都在使用理念上高度接近MIT许可证。事实上，2句版BSD许可证和MIT许可证之间的实际差异很小。

3句版和4句版BSD许可证增加了对名称重用和广告的更多要求。如果你想保护自己的产品或品牌名称，可以考虑使用这两版许可证。

BSD许可证具有以下特点：

- 非版权
- 项目作品适合商业用途。
- 被许可方可以修改工作。
- 被许可方必须提供引用说明。
- 被许可方可以根据不同条款重新发布衍生作品。
- 被许可方不必将其衍生作品和源代码一起发布。
- 被许可方不得使用原作者名称或商标来为衍生作品背书（3句版和4句版BSD）
- 被许可方必须在提及此项目功能或用途的所有广告材料中致谢项目原作者（4句版BSD）

#### 使用BSD协议的常见项目

- [Django（3句版BSD）](https://www.djangoproject.com/foundation/faq/)
- [Ruby（2句版BSD和自定义许可证）](https://www.ruby-lang.org/en/about/license.txt)
- [Redis（3句版BSD）](https://redis.io/topics/license)

看到这里想必大家对主流开源协议已经有了大致的了解，在维基百科上有张图更为直观的汇总了各个开源许可证在多个方面的差别：

![licenses_diff](/assets/images/2021/11/free_software_licenses_diff.jpg)

参考[wikipeida](https://zh.wikipedia.org/wiki/%E8%87%AA%E7%94%B1%E5%8F%8A%E9%96%8B%E6%94%BE%E5%8E%9F%E5%A7%8B%E7%A2%BC%E8%BB%9F%E9%AB%94%E8%A8%B1%E5%8F%AF%E8%AD%89%E6%AF%94%E8%BC%83#%E6%A2%9D%E6%AC%BE%E6%AF%94%E8%BC%83)

## 开源协议问题

### 我能不使用任何开源协议吗？

如果项目没有明确注明所适用的开源许可证，则应用项目作者司法管辖区的“默认”版权。换句话说，永远不要将“不用许可证”当成一种隐式授权，让他人随心所欲地使用你的项目。事实恰恰相反：即使没有明确的许可证，你，项目的作者，事实上并未放弃法律授予的任何权利。

但请记住，许可证既支配权利也支配义务。你有没有想过为什么这么多许可证文本中都有一份粗体大写的关于产品保证的免责声明，或者更常见的是没有保证？这是为了保护作品的所有者免受隐性担保或用户假设。你最不想看到的就是因为发布了开源项目而被起诉吧！

### 我能使用自定义开源协议吗？

你能，但最好别这么干。

作为一种合同，许可证不能（在大多数司法管辖区）凌驾于地方法律之上。因此，在全球各地难以强制执行许可权利。一旦牵扯到官司，在法官面前为“标准”开源许可证辩护会更容易（难度要低一些）。事实上，已经出现了类似的案件。显然，使用自定义许可证这官司很难打。

此外，自定义许可证可能会与其他许可证发生冲突，从而导致你的项目在法律上不利。

### 我能使用多个开源协议吗？

是的，可以，使用多个开源许可证并不罕见。特别是当你想根据开源项目开展商业业务时，最好是多考虑几个开源协议。

### 我后面能修改许可证吗？

能改。版权所有者负责许可条款，只要你是唯一的贡献者，就可以轻松更改许可证。但是举一个极端的例子，如果Linus Torvald（Linux发明者）想要在不同的许可下发布Linux内核，他可能首先需要成千上万的贡献者同意该项目。这在实际情况中是不可能完成的。当然，在合理的情况下，是可以做到的。

----

### 参考

- [如何选择开源许可证？](http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html)
- [主流开源协议之间有何异同？](https://www.zhihu.com/question/19568896/answer/507675584)
