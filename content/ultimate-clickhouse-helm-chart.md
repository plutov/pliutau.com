+++
title = "Ultimate ClickHouse Helm Chart"
date = "2019-01-02T13:29:37+01:00"
type = "post"
tags = ["clickhouse", "helm", "kubernetes"]
og_image = "/clickhouse-helm.jpg"
+++
![clickhouse-helm.jpg](/clickhouse-helm.jpg)

Seems like ClickHouse is experiencing growth in industries like IoT, Web Analytics, AdTech, Log Management, because of its robustness with big amounts of data.

IMO it's a great tool but missing developer community support. For example there is no built-in UI, no official Helm Chart, etc. But is it a problem? I don't think it is, it's possible to build a robust dev / prod environment using the right tools.

In this article I am going to explain the [Helm Chart I prepared](https://github.com/plutov/clickhouse-helm) for the ClickHouse.

## Environment requirements

Let's list what do we need to have in our ClickHouse Kubernetes-based environment.

### Scalability

Since you decided to use ClickHouse you're expecting a lot of data in your system. You have to prepare your cluster to be able to read and write this data. ClickHouse has different ways to setup the replication, for example [circular replication cluster topology](https://www.altinity.com/blog/2018/5/10/circular-replication-cluster-topology-in-clickhouse), or [data distribution](https://www.altinity.com/blog/2017/6/5/clickhouse-data-distribution). What's common here is that you need an easy way to scale your cluster, add/remove shards, or add/remove replicas.

### Monitoring

It's crucial to have a monitoring of everything when you deployed it, because you don't want to be blind with TBs of data.

### GUI (or optional?)

Sometimes it's very handy to have web-based gui to run some queries, of course with limited access. It is also fine to use ClickHouse CLI.

### Security

Noone should be able to access your cluster from outside. Your services should also access CH with strict access level.

### Make it easy to run locally

Reuse the same setup on all environments, except the scale.

### Persistence

Data should persist after any possible crash.

## Tools we're going to use

- Kubernetes
- [Helm](https://helm.sh/)
- [Official ClickHouse Server Docker image](https://hub.docker.com/r/yandex/clickhouse-server/)
- [Official ClickHouse Client Docker image](https://hub.docker.com/r/yandex/clickhouse-client/)
- [Tabix](https://tabix.io/)
- [Graphite](https://graphiteapp.org/)

## Helm Chart

Thanks to Helm we can spin up the whole environment with a single command. Also we can configure each environment using `values.yaml` config files.

### Custom ClickHouse image

I had to modify the official Docker image a little bit, so it gets the NODE_ID of stateful set and puts it into macros.xml. We need macros.xml across all our servers when we use replicated tables.

### Zookeeper

ClickHouse uses Zookeeper for replication / distribution, so we have to prepare k8s statefulset, pvc and service for it (`clickhouse/templates/zookeeper.yaml`).

### Configd

`clickhouse/templates/configd.yaml` contains all configuration of ClickHouse:

- Cluster. 2 replicas by default
- Zookeeper. 2 replicas by default
- Graphite. 1 replica
- Users. writer and reader

### Statefulset with PVC

ClickHouse is deployed using statefulset with k8s persistent volume attached to each pod.

### CLI

ClickHouse client is deployed to the same environment.

### GUI

For GUI I added [Tabix.UI](http://tabix.io), where you can connect to your ClickHouse server and execute queries.

### Graphite

ClickHouse does not have a tool for monitoring packaged, but there are several 3rd-party monitoring solutions that can be used. Graphite is one of the popular options, and it can be natively integrated with ClickHouse.

## Run it

It's not an official chart yet, so we have to clone the repo first:

```bash
git clone git@github.com:plutov/clickhouse-helm.git
cd clickhouse-helm
```

Run with default values:

```bash
helm install -f ./clickhouse/values.yaml --name ch --namespace=default ./clickhouse
```

## Conclusion

Feel free to use this Helm Chart and propose any improvements. And let's make an official Chart soon!