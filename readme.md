## Hexo-Theme-AirCloud: 一个简洁轻量的 hexo 博客主题

> [English Document](./readme-en.md) | [预览地址](http://niexiaotao.cn/)

## 功能简介

Hexo-Theme-AirCloud 是一个简洁轻量的 hexo 博客主题，旨在将中心放在博文本身，因此：

* 默认没有大范围的主题色块、图片铺排等，也不要求每片博文配图，一方面这并不是我们记录知识的重点，另外一方面可能程序员群体并没有足够的素材，容易造成主题纠纷。
* 建议通过不冗余的内容进行传达，比如默认没有博文摘要，因为不少开发者写博客的时候没有写博文摘要，如果从博客前一部分截取往往不能表达完整思想。

另外，该主题主要实现的功能有:

* 全局搜索功能，并对搜索内容进行高亮。
* 博客评论功能，目前接入 [gitment](https://imsun.net/posts/gitment-introduction/)，之后考虑接入多种可选。
* 文章详情页文章目录功能
* 访问量统计（总体UV、PV，单页PV）
* 语言切换能力，目前支持中文和英文

## 使用方式

**建议：参考 [DEMO](https://github.com/aircloud/hexo-aircloud-blog) 进行配置，尤其是 _config.yml 部分，否则可能会造成功能缺失**

同其他博客主题使用方式相同，直接 clone 或者下载本项目，复制粘贴到 themes 文件夹下即可。

具体的 _config.yml 自定义配置，请参考[DEMO](https://github.com/aircloud/hexo-aircloud-blog)。

### 部分重点功能适配

#### 搜索功能

为了使用搜索功能，首先需要安装下列插件：

```shell
npm i hexo-generator-search --save
```

然后在 _config.yml 中进行配置，可以参考如下配置：

```
search:
  path: search.json
  field: post
```

#### `标签`页面 & `关于`页面

如果是新项目，默认是没有`标签`页面和`关于`页面的，需要在`source`文件夹下建立`tags`文件夹和`about`文件夹。

其中`tags`文件夹中新建`index.md`并写入：

```
---
layout: "tags"
title: "Tags"
---
```

`about`文件夹下`index.md`为一篇支持 markdown 格式的文件，需要在开头添加：


```
---
layout: "about"
title: "About"
date: 2016-04-21 04:48:33
comments: true
---
```

#### 评论功能

建议先在[gitment](https://imsun.net/posts/gitment-introduction/)进行了解，然后参考[DEMO](https://github.com/aircloud/hexo-aircloud-blog)进行配置，其中一些相关项目如下：

```
comment:
  type: gitment
  id: your-id-created-by-https://github.com/settings/applications/new
  secret: your-secret-created-by-https://github.com/settings/applications/new
  owner: aircloud
  repo: hexo-aircloud-blog
```

#### favicon 的配置

项目的 favicon 默认在你的博客根目录的 `/source/img` 下面，在 `/source/img` 下面添加 favicon.ico 即可，不要添加在主题文件夹内。

## 一些注意事项

由于一些hexo的历史遗留问题等，为了避免给用户在使用过程中带来太多麻烦(比如需要改动主题代码甚至hexo源码)，建议用户使用过程中遵循一些规范：

* 文章不要有跳级目录，比如一个`###`三级目录下是一个`#####`五级目录，然后又有一个`###`三级目录，这样有可能导致 hexo 解析出错，从而影响文章目录部分的展示。
* 文章的段落(p)都有默认的两个字符的首行缩进，虽然能识别 markdown 段落中的换行，但是无法对换行后的内容进行缩进，所以这里需要注意样式问题(如果需要多行缩进，建议使用多个段落或者做成列表)。
