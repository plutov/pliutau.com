+++
title = "Google Cloud Functions in Go"
date = "2019-01-21T09:15:41+01:00"
type = "post"
tags = ["golang", "google cloud", "google cloud functions"]
og_image = "/googlecloudfu.png"
+++
![googlecloudfu.png](/googlecloudfu.png)

Earlier this month Google Cloud Functions team finally announced beta support of Go, the runtime uses Go 1.11, which includes go modules as we know.

In this post I am going to show how to write and deploy 2 types of functions: HTTP function and background function.

HTTP functions are functions that are invoked by HTTP requests. They follow the http.HandlerFunc type from the standard library.

In contrast, background functions are triggered in response to an event. Your function might, for example, run every time there is new message in Cloud Pub/Sub service.

The first step is to ensure that you have a Google Cloud Platform account with Billing setup. Remember that there is an always free tier when you sign up for Google Cloud and you could use that too.

Once you have setup your project, the next step is to enable the Google Cloud Functions API for your project. You can do it from Cloud Console or from your terminal using `gcloud` tool.

```
gcloud services enable cloudfunctions.googleapis.com
```

## HTTP function

It will be a simple HTTP function which generates a random number and sends it to Cloud Pub/Sub topic.

Let's create our topic first:

```
gcloud pubsub topics create randomNumbers
```

I will create a separate folder / package for this function.

```go
package api

import (
	"context"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"cloud.google.com/go/pubsub"
)

const topicName = "randomNumbers"

// Send generates random integer and sends it to Cloud Pub/Sub
func Send(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client, err := pubsub.NewClient(ctx, os.Getenv("PROJECT_ID"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	topic := client.Topic(topicName)

	rand.Seed(time.Now().UnixNano())

	result := topic.Publish(ctx, &pubsub.Message{
		Data: []byte(strconv.Itoa(rand.Intn(1000))),
	})
	id, err := result.Get(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(id))
}
```

Our package uses `cloud.google.com/go/pubsub` package, so let's initialize go modules.

```
go mod init
go mod tidy
```

Now it's time to deploy it:

```
gcloud functions deploy api --entry-point Send --runtime go111 --trigger-http --set-env-vars PROJECT_ID=projectname-227718
```

Where `api` is a name, `Send` is an entrypoint function, `--trigger-http` tells that it is HTTP function. And we also set a PROJECT_ID env var.

The deployment may take few minutes.

HTTP functions can be reached without an additional API gateway layer. Cloud Functions give you an HTTPS URL. After the function is deployed, you can invoke the function by entering the URL into your browser.

```
availableMemoryMb: 256
entryPoint: Send
environmentVariables:
  PROJECT_ID: projectname-227718
httpsTrigger:
  url: https://us-central1-projectname-227718.cloudfunctions.net/api
```

## Background function

Since Google Cloud background functions can be triggered from Pub/Sub, let's just write a function which will simply log a payload of event triggering it.

```go
package consumer

import (
	"context"
	"log"
)

type event struct {
	Data []byte
}

// Receive func logs an event payload
func Receive(ctx context.Context, e event) error {
	log.Printf("%s", string(e.Data))

	return nil
}
```

Note: we don't need go modules in consumer.

The deployment part is very similar to HTTP function, except how we're triggering this function.

```
gcloud functions deploy consumer --entry-point Receive --runtime go111 --trigger-topic=randomNumbers
```

Let's check logs now after execution.

```
gcloud functions logs read consumer
```

## Conclusion

Please share your experience with Google Cloud Functions in Go, are you missing any functionality there, any issues you encountered.

## Cleanup

To cleanup let's delete everything we created: function and pub/sub topic.

```
gcloud functions delete api
gcloud functions delete consumer
gcloud pubsub topics delete randomNumbers
```

## Video

This post is a text version of [packagemain #15: Google Cloud Functions in Go](https://youtu.be/RitskkjSih0).
