---
title: 如何利用ipfs部署图床
slug: deploy-image-hosting-on-ipfs
description: ' '
categories:
  - ipfs
tags:
  - ipfs
  - server
date: 2019-04-20 17:25:12
---

## 前言

写博客不久就遇到了需要引用大量图片的尴尬境地。

如果所有图片都上传至 github，会使得后期代码仓库越来越臃肿，在天朝这个网速让人捉急的地方，需要更好的方法去解决这个问题。

第一反应想到的是使用对象储存服务，然后配合 CDN，部署一个图床。

通过多方面了解，七牛和腾讯云都是不错的选择（阿里云太贵，直接被我 pass 了）。

随之而来的是一波波让人蛋疼之事 😭 。

七牛会免费送 10GB 的空间，但是它的临时域名只有 30 天的寿命，每 30 天会刷新一次 🤒 。

如果想要永久的，需要自己买一个域名，并且进行公安网备案。（备案真的很折腾。。。）

腾讯云好一点，临时域名是没有限制的，搞了一下配置，勉强能用了。

过了几天，想着是不是有更好的办法。

因为工作关系，接触了 ipfs，之前也对此有一定了解，果断着手开始尝试，能不能通过 ipfs 在自己的服务器上开个节点，把图片传到 ipfs 公网上去，这样就可以随时随地访问了，类似于实现了 CDN 的作用。

## 准备工作

你只需要有一台至少 10GB 硬盘的服务器，当然内存越大越好，ipfs 非常占用内存。

## 正文

首先我们需要通过 ssh 登录服务器安装 ipfs。

我的服务器是 Ubuntu 18.04。

如果使用了其他的系统，可以跳转至官方[安装介绍](https://docs.ipfs.io/introduction/install/)进行安装。

```bash
# update packages
sudo apt update

# install golang
sudo apt install golang-go -y

# install git
sudo apt install git -y

# install ipfs-update
go get -u github.com/ipfs/ipfs-update

# add ~/go/bin into .bash_profile
echo "export PATH=$PATH:$HOME/go/bin" >> .bash_profile

# add GOPATH into .bash_profile
echo "export GOPATH=$HOME/go" >> .bash_profile

source .bash_profile
```

安装 ipfs：

```bash
$ ipfs-update install latest
fetching go-ipfs version v0.4.20
binary downloaded, verifying...
success! tests all passed.
installing new binary to /home/Like/go/bin/ipfs
checking if repo migration is needed...

Installation complete!
```

初始化 ipfs：

```bash
$ ipfs init
initializing IPFS node at /home/Like/.ipfs
generating 2048-bit RSA keypair...done
peer identity: QmS5DQXifPi4cBRDYhVLWbSAYcMEvt4J6RdBs4mCMr7oUP
to get started, enter:

        ipfs cat /ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme
```

`QmS5DQXifPi4cBRDYhVLWbSAYcMEvt4J6RdBs4mCMr7oUP`这串长长的字符就是你得到的节点 id。

不用担心会丢失，你可以随时用`ipfs id`命令行来查看。

接下来我们就可以开启 ipfs 进程了：

```bash
$ ipfs daemon
Initializing daemon...
go-ipfs version: 0.4.20-
Repo version: 7
System version: amd64/linux
Golang version: go1.12.4
Swarm listening on /ip4/10.152.0.2/tcp/4001
Swarm listening on /ip4/127.0.0.1/tcp/4001
Swarm listening on /ip6/::1/tcp/4001
Swarm listening on /p2p-circuit
Swarm announcing /ip4/10.152.0.2/tcp/4001
Swarm announcing /ip4/127.0.0.1/tcp/4001
Swarm announcing /ip6/::1/tcp/4001
API server listening on /ip4/127.0.0.1/tcp/5001
WebUI: http://127.0.0.1:5001/webui
Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
Daemon is ready
```

我们可以得到这几个信息：

1. 官方提供了一个 `WebUI: http://127.0.0.1:5001/webui`，它可以让我们拜托指令操作。
2. 我们有个本地网关 `Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080`，让我们可以通过 CID 访问公网上的文件。

接下来就简单了，我们只要开启`nginx`服务，使我们能从外网访问到这两个地址，就实现了相当于对象储存的功能。

首先我们`ctrl+c`退出当前运行的 ipfs 进程。

实现后台运行：

```bash
$ ipfs daemon --enable-gc > ipfs.log &
[1] 5497
```

接下来我们安装`nginx`:

```bash
sudo apt install nginx -y
```

安装完成后，通过`vim`修改配置，下面提供了配置，直接照抄就好。

```bash
sudo vim /etc/nginx/sites-available/default
```

```bash
server {
  server_name _;
  location / {
    proxy_pass http://127.0.0.1:5001;
  }
  location /ipfs/
  {
    proxy_pass http://127.0.0.1:8080;
  }
}
```

启动`nginx`服务：

```bash
sudo service nginx start
```

在本地浏览器访问 `[your server ip]/webui` 就可以看到 ipfs 的 UI 界面了 😃 。

第一次加载可能会有些慢，请耐心等待。

如果加载失败，请重启`nginx`。

```bash
sudo service nginx restart
```

{% cdn ipfs-webui.png %}

在 UI 界面上可以看到两行命令，复制他们，并在服务器上执行。

```bash
# excute copied command
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://[your server ip]", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'

# restart ipfs daemon
kill -9 $(ps | grep 'ipfs' | cut -d' ' -f1)
ipfs daemon --enable-gc > ipfs.log &
```

重新访问`[your server ip]/webui`，可以看到 UI 界面变了，你可以在这里上传文件，并通过`[your server ip]/ipfs/[CID]` 访问你上传的文件 🎉。
