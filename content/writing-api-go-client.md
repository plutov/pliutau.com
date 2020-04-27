+++
title = "Writing REST API Client in Go"
date = "2020-04-27T12:36:20+02:00"
type = "post"
tags = ["go", "golang", "api"]
og_image = "/api-client.jpg"
+++
![Writing REST API Client in Go](/api-client.jpg)

API clients are very helpful when you're shipping your REST APIs to the public. And Go makes it easy, for you as a developer, as well as for your users, thanks to its idiomatic design and type system. But what defines a good API client?

In this tutorial, we're going to review some best practices of writing a good SDK in Go.

We'll be using [Facest.io API](https://docs.facest.io) as an example.

Before we begin to write any code, we should study the API to understand the main aspects of it such as:

- What is the Base URL of the API and can it be changed later?
- Does it support versioning?
- What are the possible errors?
- How clients should authenticate?

Understanding all of this will help you to put a right structure.

Let's start with the basics. Create a repository, pick a correct name, ideally matching the API service name. Initialize go modules. And create our main struct to hold user-specific information. This struct will contain API endpoints as functions later.

This struct should be flexible but also limited so the user can't see internal fields.

We make fields `BaseURL` and `HTTPClient` exportable, so users can use their own HTTP client if necessary.

{{< gist plutov 56eb72d31852807b3e8883e539e38197 >}}

Now let's move on and implement "Get Faces" endpoint, which returns the list of results and supports pagination, which means our function should support pagination options as input.

As I noticed in API, success responses and error responses always follow the same structure, so we can define them separately from data types and don't make them exported since this is not relevant information to the user.

{{< gist plutov 50be7bf3066137765fc7e1969028bb3c >}}

Make sure you don't write all endpoints in the same .go file, but group them and use separate files. For example you may group by resource type, anything that starts with `/v1/faces` goes into `faces.go` file.

I usually start by defining the types, you can do it manually or by converting JSON to go using [JSON-to-Go tool](https://mholt.github.io/json-to-go/).

{{< gist plutov eea2eec7ed862bcacf65beb456e8ec90 >}}

The `GetFaces` function should support pagination and we can do this by adding func arguments, but these arguments are optional, and they may be changed in the future. So it makes sense to group them into a special struct:

{{< gist plutov cce836297a0489e1deb51d0cd6de9db5 >}}

One more argument our function should support, and it's the context, which will let users control the API call. Users can create a Context, pass it to our func. Simple use case: cancel API call if it takes more than 5 seconds.

Now it's time to make API call itself:

{{< gist plutov 9fc659650dbdcfae06598e611e8d0983 >}}

Since all API endpoints act in the same manner, helper function `sendRequest` is created to avoid code duplication. It will set common headers (content type, auth header), make request, check for errors, parse response.

Note that we're considering status codes < 200 and >= 400 as errors and parse response into `errorResponse`. It depends on the API design though, your API may handle errors differently.

{{< gist plutov 04c317b4f20addaeba009e98d2e12a18 >}}

## Tests

So now we have SDK with single API endpoint covered, which is enough for this example, but is it enough to be able to ship this to users? Probably yes, but let's focus on few more things.

Tests are almost required here, and there can be 2 types of them: unit tests and integration tests. For the second one we'll call real API. Let's write a simple test.

{{< gist plutov a5f3e60575b05a6e44c239442cd707e8 >}}

Note that this test uses env. var where API Key is set. By doing this, we're making sure that they are not public. And later we can configure our build system to propagate this env. var using secrets.

Also, these tests are separated from unit tests (because they take longer to execute):

```
go test -v -tags=integration
```

### Documentation.

Make your SDK self-explanatory with clear types and abstractions, don't expose too much information. Usually, it's enough to provide `godoc` link as main documentation.

### Compatibility and Versioning.

Version your SDK updates by publishing new semver to your repository. But make sure you're not breaking anything with new minor/patch releases. Usually your SDK library should follow API updates, so if API releases v2, then there should be an SDK v2 release as well.

## Conclusion

That's it.

One question though: what are the best API Go clients have you seen so far? Please share them in the comments.

You can find the full source code [here](https://github.com/facest/facest-go).

[Original video on "packagemain" YT channel](https://youtu.be/evorkFq3Y5k)