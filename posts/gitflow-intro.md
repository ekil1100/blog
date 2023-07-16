---
title: Gitflow 介绍
description: ' '
date: 2019-04-08 13:51:51
categories:
  - notes
tags:
  - git
  - gitflow
  - version control
---

## Gitflow 分支介绍

### Master 和 Develop 分支

- master - 主分支，用于产品发布
- develop - 开发分支，用于日常的开发

_**PS：以上两个分支都是唯一的，且无限长的**_

```bash
# 当git建立一个库以后
# 默认分支一般为master
# 所以我们只需要创建一个名为develop的新分支
# 作为我们的开发分支

# 创建develop分支
git checkout -b develop master
# 把本地的内容推到远程仓库
git push -u origin develop
```

### Feature 分支

- 用于日常的功能开发
- 一般一个功能分支代表一个功能

> 继承分支：develop
> 合并分支：develop
> 命名规则：任何名字除了 master, develop, release-\*, hotfix-\*

#### 创建新的 feature 分支

```bash
# 从 develop 创建 feature 分支，并切换到 feature 分支
git checkout -b feature-* develop
```

#### 提交 feature 分支

```bash
# 合并 feature 到 develop 分支
git merge --no-ff feature-*
# 删除 feature 分支
git branch -d feature-*
# 推送 develop 到 upstream
git push origin develop
```

上面合并的时候我们用到了 `--no-ff`, 作用是禁用 git merge 默认的快进式合并（fast forward merge）模式。

在 fast forward 模式下被合并的分支所有的提交都会合并进主分支中，使得在提交历史中很难区分哪些提交是从新的分支中合并进来的。

例如，在一个 feature 分支中有很多次提交记录，当这个 feature 分支合并进了主分支，我们将很难再找出哪些提交组成了之前的 feature 分支。

禁用 fast forward 模式后，合并永远会在主分支上生成一个新的提交对象。这样我们就能更轻松的区分各个分支的提交了。

下面是两者的对比图：
![`--no-ff` 和默认模式的对比](https://user-gold-cdn.xitu.io/2019/1/16/168549cbb7a5c440?w=956&h=846&f=png&s=21852)

### Release 分支

- 当需要发布新版本时使用
- 主要用于测试
- 可在此分支上直接开发功能，修复 bug

> 继承分支：develop
> 合并分支：develop master
> 命名规则：release-\*

#### 创建 release 分支

```bash
git checkout -b release-* develop
```

#### 提交 release 分支

```bash
git checkout master
git merge --no-ff release-*

# 给当前提交打上版本标签
git tag -a [version]
git push --tags

# 把 release 上的内容合并回 develop
git checkout develop
git merge --no-ff release-*

git push
git branch -d release-*
```

### Hotfix 分支

- 用于修复线上的 bug
- 务必同时合并到 develop 和 master

> 继承分支：master
> 合并分支：develop master
> 命名规则：hotfix-\*

#### 创建 hotfix 分支

```bash
git checkout master
git checkout -b hotfix-* master
```

#### 提交 hotfix 分支

```bash
git checkout master
git merge --no-ff hotfix-*

git tag -a [version]
git push --tags

git checkout develop
git merge --no-ff hotfix-*

git push
git branch -d hotfix-1.2.1
```

## 其他指令

```bash
# 推送分支到 upstream
git push -u origin [some-branch]

# 删除 upstream 上的分支
git push -D origin [some-branch]
```

## 插件

- [git-flow](https://github.com/nvie/gitflow/) 是一款可以使整个 git flow 流程变得更加的便捷的插件。

## 参考资料

- ["A successful Git branching model"](http://nvie.com/posts/a-successful-git-branching-model/) By _Vincent Driessen_
- [git-flow repository](https://github.com/nvie/gitflow/)
