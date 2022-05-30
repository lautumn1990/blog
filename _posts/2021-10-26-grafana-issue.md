---
title: grafana 问题汇总
tags: [ grafana ]
categories: [ grafana ]
key: grafana-issue
pageview: true
---

grafana问题汇总

<!--more-->

## docker安装

可以参考[VictoriaMetrics](https://github.com/VictoriaMetrics/VictoriaMetrics/tree/master/deployment/docker)中的`docker-compose.yml`安装方式,
进行 `grafana` 和类似 `Prometheus` 的 `VictoriaMetrics` 安装

## 使用多个数据源

在 `panel` 中的 `Data source` 标签中使用 `--Mixed--`, 进行多个数据源选择

## 重置admin密码

```shell
# grafana 重置密码
grafana-cli admin reset-admin-password <new password>
# docker grafana 重置密码
docker exec -it <grafana-container> grafana-cli admin reset-admin-password <new password>
```

## grafana 的 mysql 时区问题

通过`UNIX_TIMESTAMP()`, 进行`unix时间戳`的转换

[grafana 安装与 mysql 时区](https://codeantenna.com/index.php/a/R1qBLO2mYn)

```sql
SELECT
  created_at AS "time",
  metric AS metric,
  value
FROM test
WHERE
  $__timeFilter(created_at)
ORDER BY created_at
```

修改为

```sql
SELECT
  UNIX_TIMESTAMP(created_at) AS "time",
  metric AS metric,
  value
FROM test
WHERE
  $__timeFilter(created_at)
ORDER BY created_at
```

## grafana 批量下载图片

```sh
#!/bin/bash

HOST='http://localhost:3000'
KEY="<add-valid-key>"
DIR="grafana_dashboards"

# Iterate through dashboards using the current API Key
for dashboard_uid in $(curl -sS -H "Authorization: Bearer $KEY" $HOST/api/search\?query\=\& | jq -r '.[] | select( .type | contains("dash-db")) | .uid'); do
    url=$(echo $HOST/api/dashboards/uid/$dashboard_uid | tr -d '\r')
    dashboard_json=$(curl -sS -H "Authorization: Bearer $KEY" $url)
    dashboard_title=$(echo $dashboard_json | jq -r '.dashboard | .title' | sed -r 's/[ \/]+/_/g')
    dashboard_version=$(echo $dashboard_json | jq -r '.dashboard | .version')
    folder_title="$(echo $dashboard_json | jq -r '.meta | .folderTitle')"

    echo "Creating: ${DIR}/${folder_title}/${dashboard_title}_v${dashboard_version}.json"
    mkdir -p "${DIR}/${folder_title}"
    echo ${dashboard_json} | jq -r {meta:.meta}+.dashboard > "${DIR}/${folder_title}/${dashboard_title}_v${dashboard_version}.json"
done
```

----

## 参考

- [Reset admin password grafana docker](https://community.victronenergy.com/questions/73260/reset-admin-password-grafana-docker.html)
- [grafana 安装与 mysql 时区](https://codeantenna.com/index.php/a/R1qBLO2mYn)
- [Export Grafana dashboard via API](https://stackoverflow.com/a/70853238/9304033)