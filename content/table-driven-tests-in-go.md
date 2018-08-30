+++
title = "Table driven tests in Go"
date = "2018-08-07T11:02:46+07:00"
type = "post"
tags = ["testing", "go"]
og_image = "/table.png"
+++
![Table driven tests in Go](/table.png)

In [practice-go](https://github.com/plutov/practice-go) we often use table driven testing to be able to test all function scenarios. For example the `FindAnagrams()` function returns us a list of anagrams found in the dictionary for given input. To be able to test this function properly we need to test multiple cases, like empty input, valid input, invalid input, etc. We could right different asserts to make it, but it's much more easier to use table tests.

Imagine we have this function:

{{< gist plutov 396aeefea0c461344ff69ec796367e0b >}}

Here is how our table may look like:

{{< gist plutov 667342606fa7a18bc32580b1eaa4a016 >}}

Usually table is a slice of anonymous structs, however you may define struct first or use an existing one. Also we have a `name` property describing the particular test case.

After we have a table we can simply iterate over it and do an assertion:

{{< gist plutov 90be9480c5ab9e73c8f36cc23a98de0d >}}

You may use another function instead of `t.Errorf()`, `t.Errorf()` just logs the error and test continues.

The [testify](https://github.com/stretchr/testify) package is very popular Go assertion package to make unit tests clear, for example:

{{< gist plutov 4f44253927bd26fcf3897115f1eb5fd5 >}}

`t.Run()` will launch a subtest, and if you run tests in verbose mode (`go test -v`) you will see each subtest result:

{{< gist plutov 930892d47a1c3a283bd49e6ea9ccf85c >}}

Since Go 1.7 testing package enables to be able to parallelize the subtests by using `(*testing.T).Parallel()`. Please make sure that it makes sense to parallelize your tests!

{{< gist plutov eeb79ecf4df510700a3b2e965b350241 >}}

That's it, enjoy writing table driven tests in Go!