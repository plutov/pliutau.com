+++
title = "Google Cloud Functions in Go"
date = "2019-01-21T09:15:41+01:00"
type = "post"
tags = ["go", "gcp", "google cloud functions"]
og_image = "/googlecloudfu.png"
+++
![googlecloudfu.png](/googlecloudfu.png)

Earlier this month Google Cloud Functions team finally announced beta support of Go, the runtime uses Go 1.11, which includes go modules as we know.

In this post I am going to show how to write and deploy 2 types of functions: HTTP function and background function.

HTTP functions are functions that are invoked by HTTP requests. They follow the http.HandlerFunc type from the standard library.

In contrast, background functions are triggered in response to an event. Your function might, for example, run every time there is new message in Cloud Pub/Sub service.

The first step is to ensure that you have a Google Cloud Platform account with Billing setup. Remember that there is an always free tier when you sign up for Google Cloud and you could use that too.

Once you have setup your project, the next step is to enable the Google Cloud Functions API for your project. You can do it from Cloud Console or from your terminal using `gcloud` tool.

{{< gist plutov 17e2f63ab56913ce3c8babf5b6a3fa23 >}}

## HTTP function

It will be a simple HTTP function which generates a random number and sends it to Cloud Pub/Sub topic.

Let's create our topic first:

{{< gist plutov 6ea3a4903bbdfe8f55e461f6c137518b >}}

I will create a separate folder / package for this function.

{{< gist plutov d4fffa879b7b2bd73043b0a8b7733d48 >}}

Our package uses `cloud.google.com/go/pubsub` package, so let's initialize go modules.

{{< gist plutov 0ac661fa07ad18118c7d3e3a4fc312bc >}}

If you have external dependencies, you have to vendor them under the library package locally before deploying.

{{< gist plutov 4af5afc694ea50b8bd7ba2c8bc529902 >}}

Now it's time to deploy it:

{{< gist plutov a111d43568788da8c32da8220b0b99b3 >}}

Where `api` is a name, `Send` is an entrypoint function, `--trigger-http` tells that it is HTTP function. And we also set a PROJECT_ID env var.

The deployment may take few minutes.

HTTP functions can be reached without an additional API gateway layer. Cloud Functions give you an HTTPS URL. After the function is deployed, you can invoke the function by entering the URL into your browser.

{{< gist plutov a45bf5dde07e65023c9f771beb9d0319 >}}

## Background function

Since Google Cloud background functions can be triggered from Pub/Sub, let's just write a function which will simply log a payload of event triggering it.

{{< gist plutov 6abea7a8aa2ad97637d04527bac2405d >}}

Note: we don't need go modules in consumer.

The deployment part is very similar to HTTP function, except how we're triggering this function.

{{< gist plutov ae95d2bd55104383edc747df5285b1b4 >}}

Let's check logs now after execution.

{{< gist plutov 3a6842564d0bc07a38dfe0b4d8a193ff >}}

## Conclusion

Please share your experience with Google Cloud Functions in Go, are you missing any functionality there, any issues you encountered.

## Cleanup

To cleanup let's delete everything we created: function and pub/sub topic.

{{< gist plutov 78ec3ac0b91d1820628de6f5459c8d52 >}}

## Video

This post is a text version of [packagemain #15: Google Cloud Functions in Go](https://youtu.be/RitskkjSih0).