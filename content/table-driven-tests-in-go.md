+++
title = "Table driven tests in Go"
date = "2018-08-07T11:02:46+07:00"
type = "post"
tags = ["testing", "golang"]
og_image = "/table.png"
+++
![Table driven tests in Go](/table.png)

In [practice-go](https://github.com/plutov/practice-go) we often use table driven testing to be able to test all function scenarios. For example the `FindAnagrams()` function returns us a list of anagrams found in the dictionary for given input. To be able to test this function properly we need to test multiple cases, like empty input, valid input, invalid input, etc. We could right different asserts to make it, but it's much more easier to use table tests.

Imagine we have this function:

```go
FindAnagrams(string word) []string
```

Here is how our table may look like:

```go
var tests = []struct {
	name string
	word string
	want []string
}{
	{"empty input string", "", []string{}},
	{"two anagrams", "Protectionism", []string{"Cite no imports", "Nice to imports"}},
	{"input with space", "Real fun", []string{"funeral"}},
}
```

Usually table is a slice of anonymous structs, however you may define struct first or use an existing one. Also we have a `name` property describing the particular test case.

After we have a table we can simply iterate over it and do an assertion:

```go
func TestFindAnagrams(t *testing.T) {
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := FindAnagrams(tt.word)
			if got != tt.want {
				t.Errorf("FindAnagrams(%s) got %v, want %v", tt.word, got, tt.want)
			}
		})
	}
}
```

You may use another function instead of `t.Errorf()`, `t.Errorf()` just logs the error and test continues.

The [testify](https://github.com/stretchr/testify) package is very popular Go assertion package to make unit tests clear, for example:

```
assert.Equal(t, got, tt.want, "they should be equal")
```

`t.Run()` will launch a subtest, and if you run tests in verbose mode (`go test -v`) you will see each subtest result:

```
=== RUN   TestFindAnagrams
=== RUN   TestFindAnagrams/empty_input_string
=== RUN   TestFindAnagrams/two_anagrams
=== RUN   TestFindAnagrams/input_with_space
```

Since Go 1.7 testing package enables to be able to parallelize the subtests by using `(*testing.T).Parallel()`. Please make sure that it makes sense to parallelize your tests!

```go
t.Run(tt.name, func(subtest *testing.T) {
	subtest.Parallel()
	got := FindAnagrams(tt.word)
	// assertion
})
```

That's it, enjoy writing table driven tests in Go!
