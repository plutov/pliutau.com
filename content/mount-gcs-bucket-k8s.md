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

```Dockerfile
FROM golang:1.10.0-alpine AS gcsfuse

RUN apk add --no-cache git
ENV GOPATH /go
RUN go get -u github.com/googlecloudplatform/gcsfuse

FROM nginx:alpine

RUN apk add --no-cache ca-certificates fuse

COPY --from=gcsfuse /go/bin/gcsfuse /usr/local/bin

# Bucket files will be mounted here
RUN mkdir -p /usr/share/nginx/bucket-data

# Or any other port you use in nginx.cong
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Resources

We'll create the following resources:

- Secret with Service Account Key
- Deployment
- Service

We'll use Container Lifecycle Hooks to mount and unmount GCS bucket.

```yaml
#...

securityContext:
  privileged: true
  capabilities:
    add:
      - SYS_ADMIN
lifecycle:
  postStart:
    exec:
      command: ["gcsfuse", "-o", "nonempty,allow_other", "bucket-name", "/usr/share/nginx/bucket-data"]
  preStop:
    exec:
      command: ["fusermount", "-u", "/usr/share/nginx/bucket-data"]

#...
```

Note, that we use `allow_other` FUSE option which overrides the security measure restricting file access to the user mounting the filesystem. This is needed specifically for nginx case, when nginx process is runnning with nginx user. You may remove this option for better security.

All Kubernetes resources:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sa-secret
data:
  sa_json: YOUR_SERVICE_ACCOUNT_BASE64_KEY

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: gcs-k8s-example
  labels:
    app.kubernetes.io/name: gcs-k8s-example
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: gcs-k8s-example
  template:
    metadata:
      labels:
        app.kubernetes.io/name: gcs-k8s-example
    spec:
      volumes:
      - name: sa-volume
        secret:
          secretName: sa-secret
          items:
          - key: sa_json
            path: sa_credentials.json
      containers:
        - name: gcs-k8s-example
          image: "YOUR_IMAGE:latest"
          imagePullPolicy: Always
          volumeMounts:
          - name: sa-volume
            mountPath: /etc/gcp
            readOnly: true
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          env:
            - name: GOOGLE_APPLICATION_CREDENTIALS
              value: /etc/gcp/sa_credentials.json
          securityContext:
            privileged: true
            capabilities:
              add:
                - SYS_ADMIN
          lifecycle:
            postStart:
              exec:
                command: ["gcsfuse", "-o", "nonempty,allow_other", "bucket-name", "/usr/share/nginx/bucket-data"]
            preStop:
              exec:
                command: ["fusermount", "-u", "/usr/share/nginx/bucket-data"]
---

apiVersion: v1
kind: Service
metadata:
  name: gcs-k8s-example
  labels:
    app.kubernetes.io/name: gcs-k8s-example
spec:
  type: NodePort
  ports:
    - port: 3000
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: gcs-k8s-example
```
