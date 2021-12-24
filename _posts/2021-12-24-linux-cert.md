---
title: linux安装根证书
tags: [ linux ]
categories: [ linux ]
key: linux-cert
pageview: true
---

各个系统安装根证书

<!--more-->

## mac os x

添加

```sh
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/new-root-certificate.crt
```

删除

```sh
sudo security delete-certificate -c "<name of existing certificate>"
```

## windows

添加

```sh
certutil -addstore -f "ROOT" new-root-certificate.crt
```

删除

```sh
certutil -delstore "ROOT" serial-number-hex
```

## linux

添加

```sh
sudo cp foo.crt /usr/local/share/ca-certificates/foo.crt
sudo update-ca-certificates
```

删除

```sh
sudo rm /usr/local/share/ca-certificates/foo.crt
sudo update-ca-certificates --fresh
```

----

## 参考

- [Adding trusted root certificates to the server](https://manuals.gfi.com/en/kerio/connect/content/server-configuration/ssl-certificates/adding-trusted-root-certificates-to-the-server-1605.html)
