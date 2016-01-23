+++
date = "2016-01-23T09:34:37+07:00"
title = "How to launch a LogPacker Cluster"
tags= [ "Go", "Golang", "Logs", "LogPacker" ]
+++
![LogPacker](https://logpacker.com/img/cluster.png)

#### What is it?

LogPacker – is a log management system. Application daemon is distinguished by simplicity, reliability and resource efficiency. Now you don’t have to spend a lot of time for service setting and support, and also to create a great number of “kludges”. LogPacker already contains “kludge” solutions...

#### Download Daemons

Each LogPacker plan provides you with unique License (even free plan). You can have multiple plans under one account. And you can find it on [my.logpacker.com](https://my.logpacker.com).

Once you got a license, you can download LogPacker as DEB/RPM or TAR file and deliver/install to your server(s).
<!--more-->
#### Environment

Let's imagine that you have a website running on N Linux servers: some are for PHP app, some are for DB, etc.

#### Agents

On each server where we may to have a system logs we must to install a LogPacker Agent per server. Agent has no dependencies and works as a standalone app, which scans your system for logs data in all popular locations, aggregate it and save (we'll talk about LogPacker Server later).

The following command will start Agent with default configuration:
```
./logpacker_daemon --agent -v

LogPacker Daemon version 0.4.1
Daemon ID: servername-20160123101652

Daemon started as: Agent

Agent uses logpacker_daemon/configs/agent.ini for configuration
Notify config file logpacker_daemon/configs/notify.ini in use
Found 0 Nodes in the Cluster (Network API: 127.0.0.1:9999)
Active Cluster Node not found for Agent
Started to tail 5 files:
mysql : /usr/local/var/mysql/Sashas-MacBook-Pro.local.err
nginx : /usr/local/etc/nginx/logs/error.log
nginx : /usr/local/var/log/nginx/access.log
nginx : /usr/local/var/log/nginx/error.log
myapp : /tmp/myapp/error.log
Failed events resending enabled
Snapshot of failed events to disk enabled
```

If you have a specific locations for your logs data, you can modify *configs/services.ini* file and add new one. No app restart is required. For example you want to track logs of your application:

*configs/services.ini* (wildcards are available):
```
[myapp]
paths=/tmp/myapp/*.log
```

*configs/agent.ini*:
```
services=mysql,nginx,myapp
```

#### Servers

Agents scan, collect and send logs to the LogPacker Servers, while Servers receive logs and save it to the Storage. So LogPacker Server has a dependency in Storage (ElasticSearch, MySQL, Postgresql, MongoDB, etc.).

How to start a server (logpacker_daemon can be used to start Agent or Server or both):
```
./logpacker_daemon --server -v

LogPacker Daemon version 0.4.1
Daemon ID: servername-20160123101902

Daemon started as: Server

Notify config file logpacker_daemon/configs/notify.ini in use
Server uses logpacker_daemon/configs/server.ini for configuration
TCP Server started on 127.0.0.1:9999
Elasticsearch is ready via localhost:9200
Binding Public API to 0.0.0.0:9997
```

Change *provider* option in *configs/server.ini* to choose another Storage type, or change connection settings there. Multiple Storages are available, Server can write logs in parallel to one or more Storages.

You can daemonize your Agents or Servers with [supervisord](http://supervisord.org/) or your favorite launch manager:
```
[program:logpacker_daemon]
command=logpacker_daemon --agent --server
autostart=true
autorestart=true
startretries=10
```

#### Clusterization

You can up few Servers and configure they to work together in Cluster, so Agents will select best node to store data. Edit configs/server.ini (cluster.nodes) of any Server and add another Server to the network.

```
cluster.nodes=127.0.0.1:9999,127.0.0.1:10000
```

Then tell Agent where to get Network Info:
```
networkapi=127.0.0.1:9999
```

#### Visualize your logs

There are 3 ways now to visualize your logs data:

* Use Kibana with ElasticSearch provider. Go to Kibana Settings, enter index "logpacker", [download/import configuration file](https://logpacker.com/samples/kibana.conf.json)
* Use logpacker_api package (./logpacker_api -v)
* Use your own driver to select data from Storage

#### Track JS errors from your website

When you start a Server you can choose an Public API endpoint, it's used to receive data from outer networks.

How-to configure:

* Edit *configs/server.ini* in any Server of your Cluster (PublicAPI section, Daemon restart is necessary if you did some changes)
* By default PublicAPI will be binded to 9997 port. Open this port on the server to be accessible from outside, or configure it via proxy_pass nginx's option.
* Then you should generate a JS script in User Panel and include it to your website's html.

Proxy_pass example:
```
server {
    listen 80;
    server_name logpacker.mywebsite.com;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://localhost:9997;
    }
}
```
JS include example:
```
<script type="text/javascript">
var clusterURL = "http://logpacker.mywebsite.com";
var userID = "";
var userName = "";

(function() {
var lp = document.createElement("script"); lp.type = "text/javascript"; lp.async = true;
lp.src = ("https:" == document.location.protocol ? "https://" : "http://") + "logpacker.com/js/logpacker.js";
var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(lp, s);
})();
</script>
```

#### Read more

[Read more about LogPacker configuration here](https://logpacker.com/resources)
