+++
title = "Deploying Facebox to AWS ECS"
date = "2018-08-09T14:35:51+07:00"
type = "post"
tags = ["machinebox", "facebox", "aws", "docker"]
og_image = "/facebox-ecs.png"
+++
![Deploying Facebox to AWS ECS](/facebox-ecs.png)

Currently I am building a product on top of face recognition functionality and I am using [Facebox](https://machinebox.io/docs/facebox) with [go-sdk](https://github.com/machinebox/sdk-go/tree/master/facebox) as it's the easiest way to add face recognition features to your project. And it's super developer friendly:

```
docker run -p 8080:8080 -e "MB_KEY=$MB_KEY" machinebox/facebox
```

Today it's time for me to deploy the project. And since we use AWS I have to deploy my Facebox instance to ECS (Elastic Container Service). In this article I'll show you how to do in a few minutes.

### Create Cluster

Go to Services -> ECS and click [Get Started](https://console.aws.amazon.com/ecs/home?region=us-east-1#/firstRun) (I am using N. Virginia region but it should work for other regions also).

Select `custom` image and click `Configure`.

### Container Configuration

![Deploying Facebox to AWS ECS](/facebox-ecs1.png)

Set the container name and `machinebox/facebox` image, ECS will pull the one from Docker Hub. Machine Box team is [suggesting](https://machinebox.io/docs/setup/docker) to set at least 4GM RAM for your boxes, so we will set the memory limit as 4096. Facebox API is running on container port 8080, so we should expose it.

![Deploying Facebox to AWS ECS](/facebox-ecs2.png)

When you sign up on [machinebox.io](https://machinebox.io) you will get a MB_KEY, which you should set as environment variable in `Advanced container configuration` section.

![Deploying Facebox to AWS ECS](/facebox-ecs3.png)

### Task Definition

Click Task Definition -> Edit and set `Task memory: 4GB (4096)` and `Task CPU: 2 vCPU (2048)`, also give a name to our task definition. Click `Next`.

### Service Definition

Here you just need to enable Application Load Balancing with a listener port 8080 and give your service a name.

![Deploying Facebox to AWS ECS](/facebox-ecs4.png)

### Done

Set a cluster name, and click `Create`. It will take few minutes for ECS to pull an image and run it, after some time you will see your cluster is up and task is running:

![Deploying Facebox to AWS ECS](/facebox-ecs5.png)

### Check it out

As we enabled Application Load Balancing you will be able to access your Facebox Console by public IP (do not forget to add `:8080`).

![Deploying Facebox to AWS ECS](/facebox-ecs5.png)