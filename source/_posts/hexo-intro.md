---
title: Hexo 入门
description: ' '
date: 2019-04-08 13:50:44
categories:
  - hexo notes
tags:
  - hexo
  - blog
---

## 准备

在安装之前需要确保系统已经安装了：

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/zh-cn/)

```bash
# 检查 git 是否安装
git --version

# 检查 nodejs 是否安装
node --version
```

如果没有安装，请跳转至 [Git](https://git-scm.com/downloads) 和 [Node.js](https://nodejs.org/zh-cn/) 官方网站安装，

## 安装

安装 `Hexo` 的命令行工具：

```bash
npm i -g hexo-cli
```

创建工作目录：

```bash
hexo init [folder name] && cd [folder name]
```

安装依赖包：

```bash
npm i
```

这里我们拿 [Next theme](https://theme-next.org/) 做个例子。

安装 Next theme：

```bash
git clone https://github.com/theme-next/hexo-theme-next themes/next
```

然后在 `_config.yml` 中更改属性 `theme`：

```yml
theme: next
```

`Next theme`配置：

- 创建 `source/_data/next.yml` 文件。
- 在 `themes/next` 目录下有个默认的配置文件 `_config.yml`，可以根据自己的需求从 `_config.yml` 选择需要的配置复制到 `source/_data/next.yml` 中进行修改。
- [Next 文档](https://theme-next.org/docs/getting-started/) 中有非常详细的配置介绍。

## 其他指令

创建新的 post：

```bash
hexo new post [file name]
```

创建新的 draft:

```bash
hexo new draft [file name]
```

从 draft 发布新的 post：

```bash
hexo publish post [file name]
```

运行本地服务 `hexo server`：

```bash
# run dev server
hexo server

# or

# render drafts
hexo server -d
```

`-d` 是 `--draft` 的简写，默认是不渲染 draft 文章的。

## 发布到 Github

下载 `hexo-deployer-git`：

```bash
npm i hexo-deployer-git
```

在 `_config.yml` 中添加 `deploy` 属性：

```yml
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
  message: [message]
```

发布：

```bash
hexo deploy --generate
```
