---
title: jekyll中添加图片
tags: [ TeXt, jekyll, images ]
categories: [ TeXt, images ]
key: create-images
pageview: true
lightbox: true

mode: immersive
header:
  theme: dark
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image: false
---

<!--more-->

## 图片位置

图片放在`/assets/images`, 可在此目录下再次添加子目录, 如`/assets/images/2021/08`, 做一个简单分类, 作为图片的存放位置

## 语法

参考[布局](https://tianqi.name/jekyll-TeXt-theme/docs/zh/layouts)

### 头部颜色

```md
---
layout: article
title: Page - Article Header Overlay Background Fill (Immersive + Translucent Header)
mode: immersive
header:
  theme: dark
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image: false
---
```

### 头部带标题

```md
---
layout: article
title: Page - Article Header Overlay Background Image (Immersive + Translucent Header)
mode: immersive
header:
  theme: dark
article_header:
  type: overlay
  theme: dark
  background_color: '#203028'
  background_image:
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /docs/assets/images/cover3.jpg
---
```

### 头部不带标题

```md
---
layout: article
title: Page - Article Header Image (Immersive + Translucent Header)
mode: immersive
header:
  theme: dark
article_header:
  type: cover
  image:
    src: /docs/assets/images/cover2.jpg
---
```

### 内容

```md
![图片](/assets/images/2021/08/create_images_galaxy.jpg)
```

效果

![图片](/assets/images/2021/08/create_images_galaxy.jpg)

### 样式

```md
<!-- 大小有image--md (default), image--xs, image--sm, image--lg, image--xl-->
![图片](/assets/images/2021/08/create_images_galaxy.jpg){:.image--xl}
<!-- 样式有border,shadow,rounded,circle-->
![图片](/assets/images/2021/08/create_images_galaxy.jpg){:.image--xl.rounded.shadow}
```

![图片](/assets/images/2021/08/create_images_galaxy.jpg){:.image--xl}

![图片](/assets/images/2021/08/create_images_galaxy.jpg){:.image--xl.rounded.shadow}

参考

- [附加样式](https://tianqi.name/jekyll-TeXt-theme/docs/en/additional-styles)
- [image](https://tianqi.name/jekyll-TeXt-theme/docs/en/image)

## 压缩软件

参考

- [图片批量无损压缩，我只推荐3个神器](https://zhuanlan.zhihu.com/p/343806630)
- [图压](https://tuya.xinxiao.tech/)

推荐图压

![图压](/assets/images/2021/08/create_images_tuya.png)

压缩之后

![图压压缩](/assets/images/2021/08/create_images_tuya_1.png)
