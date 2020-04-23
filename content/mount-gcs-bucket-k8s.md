+++
title = "Mounting Google Cloud Storage bucket to Kubernetes Pod"
date = "2020-04-23T12:57:00+02:00"
type = "post"
tags = ["kubernetes", "k8s", "gcp", "gcs"]
og_image = "/gcs-k8s.png"
+++
![Mounting Google Cloud Storage bucket to Kubernetes Pod](/gcs-k8s.png)

You may ask why doing this if we can use PersistentVolume? Though there may be multiple scenarios when mounting GCS bucket to you Kubernetes Pod is a good option:

- You already have data in GCS bucket used by other services / people and you want to access it from your application deployed to k8s by using standard file system semantics.
- You want write files by using standard file system semantics directly to GCS bucket to have access later.
- Any other use case when latency doesn't matter that much.

Google Cloud Storage has an open source FUSE adapter [gcsfuse](https://cloud.google.com/storage/docs/gcs-fuse) which can be used to mount GCS bucket to Kubernetes Pod as a volume.

In this tutorial we'll deploy nginx server which will serve static files from GCS bucket (not a real-world example probably, but same logic can be applied later to any use case).

### Prerequisites

- Create Google Cloud Storage Bucket (`bucket-name` in my example)
- Create Service Account with read-only access to this bucket and download key as JSON

### Dockerfile

Our Docker image should have `gcsfuse` binary in it, so here is our Dockerfile with nginx and gcsfuse:

{{< gist plutov bb78a840a371e6e329e4ba3266b06d27 >}}

### Kubernetes Resources

We'll create the following resources:

- Secret with Service Account Key
- Deployment
- Service

We'll use Container Lifecycle Hooks to mount and unmount GCS bucket.

{{< gist plutov 4e13fd277f26d3cbe8954c359e49138c >}}

Note, that we use `allow_other` FUSE option which overrides the security measure restricting file access to the user mounting the filesystem. This is needed specifically for nginx case, when nginx process is runnning with nginx user. You may remove this option for better security.

All Kubernetes resources:

{{< gist plutov 34d904edaa07d57bc0c1b84bc42114e4 >}}