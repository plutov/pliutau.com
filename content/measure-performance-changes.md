+++
date = "2016-01-26T16:10:23+07:00"
title = "Measure performance changes with benchcmp"
tags = [ "golang", "benchmarking", "testing" ]
type = "post"
og_image = "/go_default.png"
+++

#### go test -bench=.

Go has a great option to write your benchmarks and run it together with *go test* with option *-bench*. To create a benchmark function you must do the following:

```
package anonymizer

import "testing"

func BenchmarkAnonymizerShortString(b *testing.B) {
	for n := 0; n < b.N; n++ {
		Anonymizer("This is a secret message with my private email john@gmail.com")
	}
}

func BenchmarkAnonymizerLongString(b *testing.B) {
	for n := 0; n < b.N; n++ {
		Anonymizer("This is a secret message with my private emails: john@gmail.com, john@gmail.com, john@gmail.com, john@gmail.com, john@gmail.com, john@gmail.com, john@gmail.com.")
	}
}
```

Anonymizer() function searchs for emails in the string and replaces it to "****".

```
go test -bench=. > old.txt && cat old.txt

PASS
BenchmarkAnonymizerShortString	   30000	     49060 ns/op
BenchmarkAnonymizerLongString 	   20000	     67854 ns/op
ok  	anonymizer	4.042s
```

#### Improve Anonymizer()

Let me show you this Anonymizer():

```
package anonymizer

import (
	"regexp"
	"strings"
)

// Anonymizer func
func Anonymizer(s string) string {
	re, err := regexp.Compile("[A-Za-z0-9](([_\\.\\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\\.\\-]?[a-zA-Z0-9]+)*)\\.([A-Za-z]{2,})")
	if err != nil {
		return s
	}

	matches := re.FindAllString(s, -1)
	for _, matchStr := range matches {
		matchStr = strings.Trim(matchStr, " ")
		if matchStr != "" {
			s = strings.Replace(s, matchStr, "****", -1)
		}
	}

	return s
}
```

Then I decided that this RegExp is a bit complicated and replaced it to the one sufficient for all practical purposes:

```
re, err := regexp.Compile("(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})")
```

And run *go test* again:

```
go test -bench=. > new.txt
```

#### Measure our improvement

So now we have 2 versions of our code and benchmark results for both, lets use [benchcmp](https://godoc.org/golang.org/x/tools/cmd/benchcmp) tool to measure a growth of performance:

```
go get golang.org/x/tools/cmd/benchcmp

benchcmp old.txt new.txt
benchmark                          old ns/op     new ns/op     delta
BenchmarkAnonymizerShortString     50225         40648         -19.07%
BenchmarkAnonymizerLongString      69017         54494         -21.04%
```

Negative values are good, it means that 1 operation calculates faster after our changes. Of cause this benchmark is artificial and values can be different even on the same environment, so don't forget it and repeat your experiments.
