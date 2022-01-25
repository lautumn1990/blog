---
title: 证书
tags: [ linux, OpenSSL ]
categories: [ linux ]
key: ssl-certificate
pageview: true
---

常见的证书格式太多, 整理如下

<!--more-->

## 证书编码格式

1. `DER`格式 : (Distinguished Encoding Rules) 二进制格式。
1. `PEM`格式 : (Privacy-Enhanced Mail) ASCII文本格式。在DER格式或者其他二进制数据的基础上，使用base64编码为ASCII文本，以便于在仅支持ASCII的环境中使用二进制的DER编码的数据。

## 结构

一个具体的X.509 v3数字证书结构大致如下:

```text
Certificate
  Version Number
  Serial Number
  Signature Algorithm ID
  Issuer Name
  Validity period
  Not Before
  Not After
  Subject name
  Subject Public Key Info
  Public Key Algorithm
  Subject Public Key
  Issuer Unique Identifier (optional)
  Subject Unique Identifier (optional)
  Extensions (optional)
...
Certificate Signature Algorithm
Certificate Signature
```

## 文件后缀名

1. `.pem`: PEM格式。
1. `.key`: PEM格式的私钥文件。
1. `.pub`: PEM格式的公钥文件。
1. `.crt`: PEM格式的公钥证书文件，也可能是DER。
1. `.cer`: DER格式的公钥证书文件，也可能是PEM。
1. `.csr`: PEM格式的CSR文件，也可能是DER。
1. `.pfx`, `.p12`: 二进制的PKCS#12格式的证书
1. `.p7b`, `.p7c`: PEM的PKCS#7格式的证书

## 名词

### 公钥证书

[Public Key Certificate](https://en.wikipedia.org/wiki/Public_key_certificate)=公钥证书。

### CA

[CA](https://en.wikipedia.org/wiki/Certificate_authority)=Certificate Authority=证书颁发机构。

### DER

[DER](https://en.wikipedia.org/wiki/X.690#DER_encoding)=Distinguished Encoding Rules是# X.690标准中的一种二进制编码格式。

### PEM

[PEM](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)=Privacy Enhanced Mail=隐私增强邮件。

PEM是一种事实上的标准文件格式，采用base64来编码密钥或证书等其他二进制数据，以便在仅支持ASCII文本的环境中使用二进制数据。PEM在RFC7468中被正式标准化。具体格式如下:

```text
-----BEGIN label 1-----
base64 string...
-----END label 1-----
-----BEGIN label 2-----
base64 string...
-----END label 2-----
```

常见label, [pem string](https://github.com/openssl/openssl/blob/master/include/openssl/pem.h)

```c++
# define PEM_STRING_X509_OLD     "X509 CERTIFICATE"
# define PEM_STRING_X509         "CERTIFICATE"
# define PEM_STRING_X509_TRUSTED "TRUSTED CERTIFICATE"
# define PEM_STRING_X509_REQ_OLD "NEW CERTIFICATE REQUEST"
# define PEM_STRING_X509_REQ     "CERTIFICATE REQUEST"
# define PEM_STRING_X509_CRL     "X509 CRL"
# define PEM_STRING_EVP_PKEY     "ANY PRIVATE KEY"
# define PEM_STRING_PUBLIC       "PUBLIC KEY"
# define PEM_STRING_RSA          "RSA PRIVATE KEY"
# define PEM_STRING_RSA_PUBLIC   "RSA PUBLIC KEY"
# define PEM_STRING_DSA          "DSA PRIVATE KEY"
# define PEM_STRING_DSA_PUBLIC   "DSA PUBLIC KEY"
# define PEM_STRING_PKCS7        "PKCS7"
# define PEM_STRING_PKCS7_SIGNED "PKCS #7 SIGNED DATA"
# define PEM_STRING_PKCS8        "ENCRYPTED PRIVATE KEY"
# define PEM_STRING_PKCS8INF     "PRIVATE KEY"
# define PEM_STRING_DHPARAMS     "DH PARAMETERS"
# define PEM_STRING_DHXPARAMS    "X9.42 DH PARAMETERS"
# define PEM_STRING_SSL_SESSION  "SSL SESSION PARAMETERS"
# define PEM_STRING_DSAPARAMS    "DSA PARAMETERS"
# define PEM_STRING_ECDSA_PUBLIC "ECDSA PUBLIC KEY"
# define PEM_STRING_ECPARAMETERS "EC PARAMETERS"
# define PEM_STRING_ECPRIVATEKEY "EC PRIVATE KEY"
# define PEM_STRING_PARAMETERS   "PARAMETERS"
# define PEM_STRING_CMS          "CMS"
```

### CSR

[CSR](https://en.wikipedia.org/wiki/Certificate_signing_request)=Certificate Signing Request=证书签名请求。

### CRL

[CRL](https://en.wikipedia.org/wiki/Certificate_revocation_list)=Certificate Revocation List=证书吊销列表。

### X.690

X.690是一个ITU-T标准，规定了几种ASN.1编码格式:

- [BER](https://en.wikipedia.org/wiki/X.690#BER_encoding)=Basic Encoding Rules
- [CER](https://en.wikipedia.org/wiki/X.690#CER_encoding)=Canonical Encoding Rules
- [DER](https://en.wikipedia.org/wiki/X.690#DER_encoding)=Distinguished Encoding Rules

### ASN.1

[ASN.1](https://en.wikipedia.org/wiki/Abstract_Syntax_Notation_One)=Abstract Syntax Notation 1=抽象标记语法1。

## 常用命令

### 生成证书

```sh
# 生成CA证书
openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout my_ca.key.pem -out my_ca.crt.pem -subj "/CN=myca/O=myca"
# 生成私钥
openssl genrsa -out my.key.pem 4096
# 生成csr请求
openssl req -subj "/CN=my.demo.com" -sha256 -new -key my.key.pem -out my.csr.pem
# 生成附件
cat << EOF > extfile.cnf
subjectAltName = DNS:my.demo.com
extendedKeyUsage = serverAuth
EOF
# 签发证书
openssl x509 -req -days 365 -sha256 -in my.csr.pem -CA my_ca.crt.pem -CAkey my_ca.key.pem -CAcreateserial -out my.crt.pem -extfile extfile.cnf
# 查看证书
openssl x509 -noout -text -in my.crt.pem
```

证书格式转换

- PEM
  - 最常用的格式, base64编码, 在 "-----BEGIN CERTIFICATE-----" 和 "-----END CERTIFICATE-----" 中间
  - 常用后缀`.pem`, `.crt`, `.cer` 和 `.key`
  - 常用作Apache服务的证书
- DER
  - pem的二进制格式
  - 常用后缀`.der`,`.cer`
  - 常用作java服务器的证书
- PKCS#7 AND P7B FORMAT
  - pem格式, base64编码, 在 "-----BEGIN PKCS7-----" 和 "-----END PKCS7-----" 中间
  - P7B文件仅包含证书和链证书，而不包含私钥
  - 常用后缀`.p7b`,`.p7c`
  - 常用作Microsoft windows 和 Java Tomcat证书
- PKCS#12 AND PFX FORMAT
  - 二进制格式
  - 用于将服务器证书，任何中间证书和私钥存储在一个可加密文件中。
  - 常用后缀`.pfx`,`.p12`
  - PFX文件通常在Windows计算机上用于导入和导出证书和私钥。

```sh
# ====== CONVERT PEM ======
# PEM TO DER
openssl x509 -outform der -in certificate.pem -out certificate.der
# PEM TO P7B
openssl crl2pkcs7 -nocrl -certfile certificate.cer -out certificate.p7b -certfile CACert.cer
# PEM TO PFX
openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt -certfile CACert.crt

# ====== CONVERT DER ======
# DER(.CRT .CER .DER) TO PEM
openssl x509 -inform der -in certificate.cer -out certificate.pem

# ====== CONVERT P7B ======
# P7B TO PEM
openssl pkcs7 -print_certs -in certificate.p7b -out certificate.cer
# P7B TO PFX
openssl pkcs7 -print_certs -in certificate.p7b -out certificate.cer
openssl pkcs12 -export -in certificate.cer -inkey privateKey.key -out certificate.pfx -certfile CACert.cer

# ====== CONVERT PFX ======
# PFX TO PEM
openssl pkcs12 -in certificate.pfx -out certificate.cer -nodes
```

私钥格式转换

```sh
# 生成pkcs1
openssl genrsa -out pkcs1.pem 2048
# 生成pkcs8
openssl genpkey -out pkcs8.pem -algorithm RSA -pkeyopt rsa_keygen_bits:2048
# pkcs1转pkcs8
openssl pkcs8 -topk8 -inform pem -in pkcs1.pem -outform pem -nocrypt -out pkcs8.pem
# pkcs8转pkcs1
openssl rsa -in pkcs8.pem -out pkcs1.pem
```

### 生成ANS.1格式的der编码相关命令

参考[asn1parse](https://www.openssl.org/docs/man1.1.1/man1/openssl-asn1parse.html) 和 [ASN1_generate_nconf](https://www.openssl.org/docs/man1.1.1/man3/ASN1_generate_nconf.html)

```sh
# 生成维基百科上的asn1码 `30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f`
# 创建配置文件
cat << EOF > asn1.demo.cnf
asn1 = SEQUENCE:FooQuestion
[FooQuestion]
trackingNumber = INTEGER:05
question = UTF8:Anybody there?
EOF

openssl asn1parse -genconf asn1.demo.cnf -out asn1.demo.der

# 查看二进制码
hexdump -C asn1.demo.der
# 查看der格式的asn1文件
openssl asn1parse -in asn1.demo.der -inform der
```

----

## 参考

- [SSL证书中pem der cer crt csr pfx的区别](https://blog.csdn.net/gx11251143/article/details/113245218)
- [那些证书(SSL,X.509,PEM,DER,CRT,CER,KEY,CSR,P12等)](https://www.jianshu.com/p/2dad7c95b6af)
- [PKCS1与PKCS8的小知识](https://www.jianshu.com/p/a428e183e72e)
- [数字证书常见标准](https://www.cnblogs.com/cuimiemie/p/6442685.html)
- [PKCS](https://en.wikipedia.org/wiki/PKCS)
- [X.509 公钥证书的格式标准](https://linianhui.github.io/information-security/05-x.509/)
- [使用 openssl 生成证书](https://www.cnblogs.com/littleatp/p/5878763.html)
- [X.509系列（一）：X.509 v3格式下的证书](https://www.jianshu.com/p/d120204cc06a)
- [X.509系列（二）：ASN.1编解码标准X.690](https://www.jianshu.com/p/81e6e73b5c81)
- [Sign and verify text/files to public keys via the OpenSSL Command Line](https://raymii.org/s/tutorials/Sign_and_verify_text_files_to_public_keys_via_the_OpenSSL_Command_Line.html)
