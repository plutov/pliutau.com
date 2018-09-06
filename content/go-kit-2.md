+++
title = "Microservices with go-kit. Part 2"
date = "2018-08-14T16:29:32+07:00"
type = "post"
tags = ["go", "packagemain", "microservices", "grpc", "docker"]
+++
This is a text version of [the "packagemain #13: Microservices with go-kit. Part 2"](https://youtu.be/SU9t6fUQltE) video.

 - [Part 1](https://pliutau.com/gi-kit-1/)

In the previous video we prepared a local environment for our services using kit command line tool. In this video we'll continue to work with this code.

Let's implement our Notificator service first by writing the proto definition as it's supposed to be a gRPC service. We aleady have pre-generated file `notificator/pkg/grpc/pb/notificator.pb`, let's make it really simple.

{{< gist plutov 187576b2142c61ec6e281eb2427a9525 >}}

Now we need to generate server and client stubs, we can use the `compile.sh` script already given us by kit tool, it basically contains the `protoc` command.

```
cd notificator/pkg/grpc/pb
./compile.sh
```

If we check `notificator.pb.go` - it was updated.

Now we need to implement the service itself. Instead of sending a real email let's generate a uuid only and return it, pretending that it's sent. But first we have to edit a bit the service to match our Request / Response formats (new `id` return argument).

{{< gist plutov b0c2b697dea745704f3a6c46ea0daa4b >}}

{{< gist plutov 604598aebd68f510658dee6348b916d2 >}}

{{< gist plutov 62ae4ddae9fc7c4ac7b4cc26ea1225c6 >}}

If we search for TODO `grep -R "TODO" notificator` we can see that we still need to implement Encoder and Decoder for gRPC request and response.

{{< gist plutov 70f7d087505be4983d2bfd1fae787aa8 >}}

### Service discovery

The SendEmail will be invoked by User service, so User service needs to know the address of Notificator, the typical service discovery problem. Of course in our local environment we know how to connect to the service as we use Docker Compose, but it may be more difficult in real distributed environment.

Let's start with registering our Notificator service in the etcd. Basically etcd is a distributed reliable key-value store, widely used for service discovery. go-kit supports other technologies for service discovery: eureka, consul, zookeeper, etc.

Let's add it to our Docker Compose so it will be available for our servers. Copied from Internet:

{{< gist plutov 67785366196bc3d16861f50ba8ace169 >}}

Let's register Notificator in etcd:

{{< gist plutov 89bff9da6099b59b0f4d7c4b27123127 >}}

We should always remember to deregister service when our program is stopped or crashed. Now etcd knows about our service, in this example we have only 1 instance, but in real life it could be more of course.

Now let's test our Notificator service and check if it is able to register in etcd:

```
docker-compose up -d etcd
docker-compose up -d notificator
```

Now let's get back to our Users service and invoke the Notificator service, basically we're going to send a fictional notification to user after it's created.

As Notificator is a gRPC service, so we need to share a client stub file with our client, in our case Users service.

The protobuf client stub code is located in `notificator/pkg/grpc/pb/notificator.pb.go`, and we can just import this package to our cient.

{{< gist plutov 224de0fd545246cb9b9d49329c5fa909 >}}

But as we registered Notificator in etcd we can replace hardcoded Notificator address by getting it from etcd.

{{< gist plutov c76c0a1d24c07f0d038d534ae56ae98d >}}

We get the first entry as we have only one, but in real system it may be hundreads of entries, so we can apply some logic for instance selection, for example Round Robin.

Now let's start our Users service and test this out:

```
docker-compose up users
```

We're going to call the http endpoint to create a user:

```
curl -XPOST http://localhost:8802/create -d '{"email": "test"}'
```

### Conclusion

In this video we have implemented fictional Notificator gRPC service, registered it in etcd and invoked from another service Users.

In the next video we're going to review the service authorization through JWT (SON Web Tokens).