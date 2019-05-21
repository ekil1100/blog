---
title: v2ray 安装及配置
description: ' '
date: 2019-04-08 13:54:32
categories:
  - notes
tags:
  - server
  - v2ray
  - proxy
---

**注：这不是个新手教程，这里没有细节，只有流程。**

详细信息请移至[官方文档](https://www.v2ray.com)。

## 服务器端

### 服务器选择

- Azure
- 搬瓦工
- Google cloud

### Linux 安装脚本

V2Ray 提供了一个在 Linux 中的自动化安装脚本。这个脚本会自动检测有没有安装过 V2Ray，如果没有，则进行完整的安装和配置；如果之前安装过 V2Ray，则只更新 V2Ray 二进制程序而不更新配置。

安装需在 su 环境下进行。

切换用户

```bash
sudo su
```

安装脚本

```bash
bash <(curl -L -s https://install.direct/go.sh)
```

启动

```bash
service v2ray start
```

控制

```bash
service v2ray start|stop|status|reload|restart|force-reload
```

服务端一般不需要更改配置文件，博主至今未更改过服务端的配置文件。

配置文件：`/etc/v2ray/config.json`

## 客户端

博主用的是 Mac，所以用的是 Homebrew 安装 v2ray。

[homebrew-v2ray](https://github.com/v2ray/homebrew-v2ray)

如果用的是其他的系统，可以参考[官方文档](https://www.v2ray.com/chapter_00/install.html)。

安装

```bash
brew tap v2ray/v2ray
brew install v2ray-core
```

更新

```bash
brew update
brew upgrade v2ray-core
```

卸载

```bash
brew uninstall v2ray-core
brew untap v2ray/v2ray
```

非开机自启动运行

```bash
brew services run v2ray-core
```

开机自启动运行

```bash
brew services start v2ray-core
```

查看 v2ray 是否在运行

```bash
brew services list
```

为了方便修改配置文件，博主设置了一个环境变量。

环境变量

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

v2ray 的定位是平台，所以它的功能是非常强大的，代理只是它的其中一个小功能。
