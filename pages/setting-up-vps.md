---
title: VPS 的初始化
description: ' '
date: 2019-04-08 13:54:18
categories:
  - notes
tags:
  - vps
  - server
---

以下内容来自 [Jem Young's Full Stack for Front-Ends](https://frontendmasters.com/courses/full-stack/)，发布在 [FrontendMaster](https://frontendmasters.com/) 上。

系统：Ubuntu 18.04 LTS

1. 更新系统

```bash
apt update # 更新系统的包
apt upgrade # apt update 相当于 fetch 的作用，把新的包给下载到本地，所以需要执行 upgrade 安装这些包
```

1. 给 root 添加 ssh key

```bash
passwd # 修改 root 的密码
cat ~/.ssh/<your public key> | ssh root@<server ip> "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys" # 添加 ssh public key 到 root
```

1. 创建新用户

```bash
adduser <username> # 添加新用户，会要求设置密码
usermod -aG sudo <username> # 为用户添加 sudo 权限

su <username> # 切换到新用户
cat ~/.ssh/<your public key> | ssh <username>@<server ip> "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys" # 为新用户添加 ssh public key
```

1. 修改 ssh 配置

```bash
sudo vi /etc/ssh/sshd_config # 更改 ssh 设置，禁止 root 登入和用密码登入
```

```config
port 22
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo service sshd restart # 重启 ssh 服务
```
