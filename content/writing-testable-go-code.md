+++
title = "Writing testable Go code"
date = "2020-05-04T21:34:44+02:00"
type = "post"
tags = ["go", "golang", "testing", "unittesting"]
og_image = "/testable-go.jpg"
+++
![Writing testable Go code](/testable-go.jpg)

When I say "testable code", what I mean is code that can be easily programmatically verified. We can say that code is testable when we don't have to change the code itself when we're adding a unit test to it. It doesn't matter if you're following test-driven development or not, testable code makes your program more flexible and maintainable, due to its modularity.

Go has robust built-in testing functionality, so in most cases you don't need to import any third-party testing packages. So start clean in the beginning, and if it's not enough, you can add helper package later ([assert](https://pkg.go.dev/github.com/stretchr/testify/assert) for example).

### SOLID

First of all, understanding of SOLID principles will help you with writing testable code. I won't go into details, but Single Responsibility and Dependency Inversion will help you a lot.

For example, it's much easier and cleaner to test small function which does only one thing. For example, function `StrInSlice` is perfectly testable function, it's determenistic, so for any given input there is only one correct output.

{{< gist plutov 4c59b0e6b76055c04292406849ff4624 >}}

{{< gist plutov a5a4d910838730e37107a905918ba8b5 >}}

This function is very simple, and there are only few test cases for it. However, real-world functions need more test cases and table tests are very helpful here:

{{< gist plutov ed527201345322d66d28c264ad4ba7f1 >}}

Now let's take more complex code which calls external API and does something with the response. In this example we calculate average stars count per repo of the specified GitHub user:

{{< gist plutov 932e1e9315012a65031bf41dfd9c21ee >}}

And test for it:

{{< gist plutov f2d7815a9064694c090955aa62776d4e >}}

It may work well in the beginning, however it's not a good test, it can be flaky, because API may not be available, or testing server has no external connectivity, or simply API response may change (amount of stars).

So how do we call this function in a test, but also avoid testing the HTTP call? We have to restructure our program and make it more modular, create an interface for GitHub API and mock it.

{{< gist plutov 78fb62adc5cece9e48b3581692435251 >}}

The `GetAverageStarsPerRepo` function now has to accept the instance of API as the first argument, which can be replaced by Mock in tests:

{{< gist plutov 6db67bf090a9ec626b8d318af7b46647 >}}

As you can see the function now is much smaller and easier to read. Also tests will be much faster which is very important in bigger complex systems, developers usually don't like to wait long times for their tests to complete (or fail).

And tests would change a bit as well:

{{< gist plutov 8ed204222d2451c358de1133d463691a >}}

If we would do this from the beginning, it would save us some time of restructuring the program. That's what I mean when I say "testable code".

Another good practice for testing in Go is to put your tests into a separate `_test` package, this prevents access to private variables, which also allows you to write tests as though you were a real user of the package.

{{< gist plutov beb1d37d1b7cd3c0b6e3dda1a3352b51 >}}

There are few more global good practices that can be applied to any language, but we won't go into the details. Such can be:

- Don't use global state, it makes tests difficult to write and make them flaky by default.
- Separate unit tests from integration tests, the latter one doesn't use Mocks and is slower.

And yes, testable code is definitely a good code!

This tutorial was originally posted on ["package main" YouTube channel](https://youtu.be/q1FeRvC82j0).