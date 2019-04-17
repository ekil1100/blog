---
title: Gitflow 介绍
description: ' '
date: 2019-04-08 13:51:51
categories:
  - notes
tags:
  - git
  - gitflow
  - version controll
---

1. [Git Flow 流程的简单介绍](#git-flow-流程的简单介绍)  
   &emsp;1.1. [Master 和 Develop 分支](#master和develop分支)  
   &emsp;1.2. [Feature 分支](#feature分支)  
   &emsp;1.3. [Release 分支](#release分支)  
   &emsp;1.4. [Hotfix 分支](#hotfix分支)  
   &emsp;1.5. [其他指令](#其他指令)
2. [轻松实现 git flow, 抛弃繁琐的指令](#轻松实现git-flow-抛弃繁琐的指令)  
   &emsp;2.1. [`git-flow`初始化](#git-flow初始化)  
   &emsp;2.2. [Feature 分支](#feature分支)  
   &emsp;2.3. [Release 分支](#release分支)  
   &emsp;2.4. [Hotfix 分支](#hotfix分支)
3. [参考资料](#参考资料)

---

## Git Flow 流程的简单介绍

### Master 和 Develop 分支

- master-主分支，用于产品发布
- develop-开发分支，用于日常的开发

_**以上两个分支都是唯一的，且无限长的**_

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

---

### Feature 分支

- 用于日常的功能开发
- 一般一个功能分支代表一个功能
- 当一个功能开发完，合并到 develop

```txt
继承分支：develop
合并分支：develop
命名规则：任何名字除了master, develop, release-*, hotfix-*
```

```bash
# 创建feature分支 #

# 保证本地的develop是最新的
git checkout develop
git pull origin develop
# 从develop创建myfeature分支，并切换到myfeature分支
git checkout -b myfeature develop
# 之后你可以在这个分支上commit新的feature

# 提交feature分支 #

# 保证本地的develop是最新的
git checkout develop
git pull origin develop
# 合并myfeature到develop分支
git merge --no-ff myfeature -m ""
# 删除myfeature分支
git branch -d myfeature
# 推送develop到upstream
git push origin develop
```

上面合并的时候我们用到了`--no-ff`, 作用是禁用 git merge 默认的快进式合并（fast forward merge）模式。

在 fast forward 模式下被合并的分支所有的提交都会合并进主分支中，使得在提交历史中很难区分哪些提交是从新的分支中合并进来的。

例如，在一个 feature 分支中有很多次提交记录，当这个 feature 分支合并进了主分支，我们将很难再找出哪些提交组成了之前的 feature 分支。

禁用 fast forward 模式后，合并永远会在主分支上生成一个新的提交对象。这样我们就能更轻松的区分各个分支的提交了。

下面是两者的对比图：
![No fast forward和默认模式的对比](https://user-gold-cdn.xitu.io/2019/1/16/168549cbb7a5c440?w=956&h=846&f=png&s=21852)

---

### Release 分支

- 当需要发布新版本时使用
- 主要用于测试
- 可在此分支上直接开发功能，修复 bug
- 务必同时合并到 develop 和 master

```txt
继承分支：develop
合并分支：develop master
命名规则：release-*
```

```bash
# 创建release分支 #

git checkout -b release-1.2 develop
# 可选，用于更新某些本地文件来跟进版本变化
./bump-version.sh 1.2
git commit -a -m "Bumped version number to 1.2"

# 提交release分支 #

git checkout master
git merge --no-ff release-1.2 -m ""
# 给当前提交打上版本标签
git tag -a 1.2 -m ""
git push
git push --tags
# 把release-1.2上的内容合并回develop
git checkout develop
git pull origin develop
git merge --no-ff release-1.2 -m ""
git push
# 删除分支
git branch -d release-1.2
```

---

### Hotfix 分支

- 用于修复线上的 bug
- 务必同时合并到 develop 和 master

```txt
继承分支：master
合并分支：develop master
命名规则：hotfix-*
```

```bash
# 创建hotfix分支 #

git checkout master
git pull origin master
git checkout -b hotfix-1.2.1 master
# 可选
./bump-version.sh 1.2.1
git commit -a -m "Bumped version number to 1.2.1"

# 提交hotfix分支 #

# 合并到master
git checkout master
git pull origin master
git merge --no-ff hotfix-1.2.1 -m ""
git tag -a 1.2.1 -m ""
git push
git push --tags
# 合并到develop
git checkout develop
git pull origin develop
git merge --no-ff hotfix-1.2.1 -m ""
git push
# 删除分支
git branch -d hotfix-1.2.1
```

---

### 其他指令

```bash
# 推送分支到upstream
git push -u origin some-branch
# 删除upstream上的分支
git push origin --delete some-branch
```

---

## 轻松实现 git flow, 抛弃繁琐的指令

`git-flow`是一款可以使整个 git flow 流程变得更加的便捷的插件，点[这里](https://github.com/nvie/gitflow/)可以查看官方的 document。

安装的方法这里就不介绍了，详细的安装教程都可以在 document 里找到。

---

### `git-flow`初始化

安装完`git-flow`后，需要初始化本地库来支持`git-flow`指令

```bash
git flow init
```

---

### Feature

```bash
# 创建feature分支
git flow feature start <name>

# 提交feature分支
git flow feature finish <name>
```

---

### Release

```bash
# 创建release分支
git flow release start <name>

# 提交release分支
git flow release finish <name>
```

提交 release 分支时会自动打上 tag。

用`git push --tags`来推送 tags 到远程仓库。

---

### Hotfix

```bash
# 创建hotfix分支
git flow hotfix start <name>

# 提交hotfix分支
git flow hotfix finish <name>
```

和 release 分支一样，提交时也会自动打上 tag。

---

## 参考资料

- ["A successful Git branching model"](http://nvie.com/posts/a-successful-git-branching-model/) By _Vincent Driessen_
- [git-flow repository](https://github.com/nvie/gitflow/)
