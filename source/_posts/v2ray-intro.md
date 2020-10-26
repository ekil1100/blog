---
title: v2ray + TCP BBR 科学上网
description: ' '
date: 2019-04-08 13:54:32
categories:
  - notes
tags:
  - v2ray
  - proxy
---

**温馨提醒：如果想要更好的，更方便的科学上网体验，可以阅读[如何有效的科学上网](https://lastingman.com/2020/10/18/%E5%A6%82%E4%BD%95%E6%9C%89%E6%95%88%E7%9A%84%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/)。**

## 准备工作

首先需要有一台服务器，也就是 VPS。下面提供两个比较好用的。

- 搬瓦工
- Google cloud

当然，还有非常多的选择，可以自行百度。

搬瓦工提供了国内优化线路，可以去[搬瓦工中文网](https://banwagong.cn/)看看选择什么服务器比较合适，我使用的是最便宜的一款 CN2。

Google cloud 相对比较稳定，并且有 300 美金的免费额度，供一年使用。

{% note info %}

### 提示

系统请选择 Debian 9 ，后面安装 TCP BBR 的时候不会报错。
（Ubuntu 16.04 和 18.04 都会报错）

{% endnote %}

v2ray 简单的讲是一款代理软件，它有非常的多功能，并且支持 shadowsocks 协议，更加稳定，流量不容易被封。（我之前也用的是 SS，被封了两个 IP 就放弃了，转而使用 v2ray）

关于其详细功能介绍可以查阅[官方文档](https://www.v2ray.com)。

下面进入正题 👇

## 安装 v2ray

在官网上提供了一个在 Linux 下的自动化安装脚本。这个脚本会自动检测有没有安装过 V2Ray，如果没有，则进行完整的安装和配置；如果之前安装过 V2Ray，则只更新 V2Ray 二进制程序而不更新配置。

{% note info %}

### 提示

安装需要在 root 下进行。

{% endnote %}

切换至 root 用户：

```bash
sudo su
```

安装脚本：

```bash
bash <(curl -L -s https://install.direct/go.sh)
```

启动 v2ray：

```bash
service v2ray start
```

其他控制指令：

```bash
service v2ray start|stop|status|reload|restart|force-reload
```

### 脚本一键安装 v2ray

> 原文：[V2Ray 一键安装脚本](https://github.com/233boy/v2ray/wiki/V2Ray%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E8%84%9A%E6%9C%AC)

系统要求：Ubuntu 16+ / Debian 8+ / CentOS 7+

安装需要 curl 和 git，请确保已经安装这两个包再运行命令行。

```bash
bash <(curl -s -L https://git.io/v2ray.sh)
```

根据提示安装即可。

v2ray 的配置文件路径是`/etc/v2ray/config.json`，一般情况下不需要更改。

可以使用 `cat /etc/v2ray/config.json` 查看并自行记录下 `port` 和 `id`。

## 安装 TCP BBR 魔改版

> 原文：[Debian/Ubuntu TCP BBR 改进版/增强版/魔改版](https://moeclub.org/2017/06/24/278/?spm=80.6)

按照下面的命令顺序执行即可：

```bash
wget --no-check-certificate -qO 'BBR.sh' 'https://moeclub.org/attachment/LinuxShell/BBR.sh' && chmod a+x BBR.sh && bash BBR.sh -f
# 系统会自动重启，需要重新登录服务器

wget --no-check-certificate -qO 'BBR_POWERED.sh' 'https://moeclub.org/attachment/LinuxShell/BBR_POWERED.sh' && chmod a+x BBR_POWERED.sh && bash BBR_POWERED.sh
```

执行完毕后不需要做任何操作，BBR 已经自动开启了。

> 说明:
>
> - 执行过程中会重新编译模块。
> - 模块默认为开机自动加载。
> - 模块名称：`tcp_bbr_powered`。
> - 可用 `modprobe tcp_bbr_powered` 命令进行加载模块。
> - 可执行 `lsmod |grep 'bbr_powered'`，结果不为空,则加载模块成功。
> - 可执行 `sysctl -w net.ipv4.tcp_congestion_control=bbr_powered` 使用此模块。

## 客户端安装

### Mac

> [homebrew-v2ray](https://github.com/v2ray/homebrew-v2ray)

```bash
# 安装
brew tap v2ray/v2ray
brew install v2ray-core

# 更新
brew update
brew upgrade v2ray-core

# 卸载
brew uninstall v2ray-core
brew untap v2ray/v2ray

# 非开机自启动运行
brew services run v2ray-core

# 开机自启动运行
brew services start v2ray-core

# 查看 v2ray 是否在运行
brew services list
```

为了方便修改配置文件，我设置了一个环境变量。

```bash
export V2RAY=/usr/local/etc/v2ray
```

配置文件模板

```json
{
  "log": {
    "loglevel": "warning",
    "access": "/usr/local/etc/v2ray/access.log",
    "error": "/usr/local/etc/v2ray/error.log"
  },
  "inbounds": [
    {
      "port": 1080,
      "listen": "127.0.0.1",
      "tag": "socks-inbound",
      "protocol": "socks",
      "settings": {
        "udp": true
      }
    },
    {
      "port": 1081,
      "listen": "127.0.0.1",
      "tag": "http-inbound",
      "protocol": "http"
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "your ip",
            "port": your port,
            "users": [
              {
                "id": "id from server's config file",
                "alterId": 64
              }
            ]
          }
        ]
      }
    },
    {
      "protocol": "freedom",
      "tag": "direct",
      "settings": {}
    },
    {
      "protocol": "blackhole",
      "tag": "blocked",
      "settings": {}
    }
  ],
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",
        "outboundTag": "vmess",
        "domain": ["domain:github.com"]
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "domain": ["geosite:cn"]
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "ip": ["geoip:cn", "geoip:private"]
      },
      {
        "type": "field",
        "outboundTag": "blocked",
        "domain": ["geosite:category-ads"]
      }
    ]
  }
}
```
