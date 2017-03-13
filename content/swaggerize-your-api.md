+++
date = "2016-10-03T12:27:19+07:00"
title = "Swaggerize your APIs"
tags = [ "Go", "Swaggger" ]
type = "post"
+++

[Swagger UI](http://swagger.io/swagger-ui/) is a great tool and a must have for any respectable API project. It has an intuitive design, all endpoints can be tested from the interface. For example, let's have a look at [Kubernetes API](http://kubernetes.io/kubernetes/third_party/swagger-ui/), where endpoints are grouped by version, and everything is accessible in easy way. In this post I'll show how to build it together with your API written in Go.


There are 2 separate parts:
 - Generate `swagger.json` containing specs from your Go's annotations
 - Render this spec using Swagger UI

To generate `swagger.json` automatically from Go's comments you have to install [go-swagger](https://github.com/go-swagger/go-swagger):

```
go get -u github.com/go-swagger/go-swagger/cmd/swagger
```

Then let's provide annotations in our API code. There are several annotations that mark a comment block as a participant for the swagger spec.

 - swagger:meta
 - swagger:route
 - swagger:parameters
 - swagger:response
 - swagger:model
 - swagger:allOf
 - swagger:strfmt
 - swagger:discriminated

First four annotations are the most importand and enough to build a specification. Define `swagger:meta` first in your API root file (it can be a main package):

```go
// Pet API
//
//     Schemes: http
//     Host: 127.0.0.1:7776
//     BasePath: /v1
//     Version: 0.1.0
//     Contact: foo@bar.com
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//
// swagger:meta
package main
// ...
```

Our Pet API will have 1 endpoint to get the list of something, `GET /list`. Let's create a route spec for this endpoint.

```go
// swagger:route GET /v1/list listParams
//
// Get list of something
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Schemes: http
//
//     Responses:
//       500: errorResponse
//       200: listResponse
func (c *Context) Lisr(w http.ResponseWriter, r *web.Request) {
// ...
```

Here we have defined types for input parameters `listParams` and response `errorResponse`, `listResponse`. Let's define `swagger:parameters` and `swagger:response` for structs.

```go
// swagger:parameters listParams
type listParams struct {}

// swagger:response errorResponse
type errorResponse struct {
    Code int
}

// swagger:response listResponse
type listResponse struct {}
```

We are already ready to run a generator:
```bash
swagger generate spec -o ./swagger.json
```

You can add a `go:generate` comment to your main file for example, so it will be regenerated on any API change:
```go
//go:generate swagger generate spec
```

We have solved first part and have a `swagger.json` file. Swagger UI works with link to this file, it's a simple html website. There are 2 ways to check your `swagger.json` in the web interface:

 - Use any other already deployed Swagger UI, for example this one - http://petstore.swagger.io/ and insert the link to your `swagger.json` with help of `?url=` param. http://petstore.swagger.io/?url=http://example.com/swagger.json
 - Or [download](https://github.com/swagger-api/swagger-ui/releases) and unpack Swagger UI into your webserver and edit `index.html` file and paste your default `swaggger.json` location.
