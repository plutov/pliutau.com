+++
date = "2016-07-06T16:15:39+07:00"
title = "Working with ClickHouse in Go. Part 1: Basics"
tags = [ "Go", "ClickHouse" ]
type = "post"
+++
![ClickHouse](/clickhouse1.png)

[ClickHouse](https://clickhouse.yandex/) is an open-source column-oriented database management system that allows generating analytical data reports in real time. Created by [Yandex](http://yandex.ru/) developers for internal purposes, but then has migrated as open-source tool. It currently powers Yandex.Metrica, world’s second largest web analytics platform, with over 13 trillion database records and over 20 billion events a day, generating customized reports on-the-fly, directly from non-aggregated data. So it is really fast.


The reason I do really love ClickHouse is it supports SQL syntax. Now I’ll show how to start to work with it and get some basic profit.

#### Install ClickHouse on Ubuntu

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv E0C56BD4    # optional

sudo mkdir -p /etc/apt/sources.list.d
echo "deb http://repo.yandex.ru/clickhouse/trusty stable main" | sudo tee /etc/apt/sources.list.d/clickhouse.list
sudo apt-get update
sudo apt-get install clickhouse-server-common clickhouse-client

sudo service clickhouse-server start
clickhouse-client
```

clickhouse-client package contains clickhouse-client application — interactive ClickHouse client. Let’s create database and a table using this tool.

```bash
clickhouse-client
ClickHouse client version 1.1.53983.
Connecting to localhost:9000.
Connected to ClickHouse server version 1.1.53983.

:) create database golang_test;

CREATE DATABASE golang_test

Ok.

0 rows in set. Elapsed: 0.003 sec.

:) CREATE TABLE logs
(
    date Date,
    size Int32,
    message String
) ENGINE = MergeTree(date, message, 8192)

Ok.

0 rows in set. Elapsed: 0.004 sec.
```

Now we have created MergeTree table, there are few [more engines](https://clickhouse.yandex/reference_en.html#Table%20engines) supported by ClickHouse.

#### Connect from Go

There is only one driver written in Go for this RDBMS - [go-clickhouse](https://github.com/roistat/go-clickhouse). It works only with http transport (ClickHouse is accessible by tcp too). Default http address is [http://localhost:8123](http://localhost:8123).
```
go get github.com/roistat/go-clickhouse
```

Let’s establish connection:
```go
transport := clickhouse.NewHttpTransport()
conn := clickhouse.NewConn("localhost:8123", transport)
err := conn.Ping()
if err != nil {
    panic(err)
}
```

If everything is fine here we can insert some data to this table and then fetch it.
```go
q := clickhouse.NewQuery("INSERT INTO golang_test.logs VALUES (toDate(now()), ?, ?)", 1, "Log message")
q.Exec(conn)

q := clickhouse.NewQuery("SELECT `message` FROM golang_test.logs")
i := q.Iter(conn)
for {
    var message string
    scanned := i.Scan(&message)
    if scanned {
        fmt.Println(message)
    } else if err != nil {
        panic(i.Error())
    }
}
```

ClickHouse is a really nice thing, highly reliable, simple and handy, feature-rich.
