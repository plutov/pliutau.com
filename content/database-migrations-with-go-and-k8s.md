+++
title = "Database Migrations with Go and Kubernetes"
date = "2019-02-18T11:41:00+01:00"
type = "post"
tags = ["go", "k8s", "golang", "kubernetes", "database"]
+++
Applications with database layer mostly need to execute database migration as part of its deployment process. Usually, running migrations is the first step when deploying the application.

I tried different tools to run migrations, I used [goose](https://github.com/pressly/goose) for a while, but later switched to [migrate](https://github.com/golang-migrate/migrate), which supports a lot of drivers and sources (you can save your migrations in S3 or Google Storage for example), also it has great CLI and Docker support.

Also, it feels very natural to containerize application migrations and tag Docker images with semver, so then we can run this container in our deployment pipeline.

If you're using Kubernetes there are multiple ways to run migrations before starting an application:

- Run container manually from your CD system (in this case you'll need to set up database access).
- Use Kubernetes Job and trigger it during the deployment.
- Use `initContainer` and run migrations before the main container starts.

I prefer the last options, as an application will always latest database snapshot, and also it will fail in case migrations are failing. Also, Kubernetes will help to make this process downtimeless for us.

Steps:

1. Prepare your migrations and store them in one of the available `migrate`'s sources (I will show an example with Google Storage)
2. Add `initContainers` section to your k8s deployment.

```yaml
initContainers:
  - name: migrations
    image: migrate/migrate:latest
    command: ['/migrate']
    args: ['-source', 'gcs://bucket/migrations', '-database', 'mongodb://mongo-0.mongo.default.svc.cluster.local:27017/db', 'up']
```

Now Kubernetes will run this container before starting the main pod. You will be able to see logs why migrations are failing.
