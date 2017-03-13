+++
date = "2016-09-08T10:17:34+07:00"
title = "Go templates. Helper to render a struct"
tags = [ "Go" ]
type = "post"
+++

The Go language comes with a powerful built-in template engine. In Go, we have the [template](https://golang.org/pkg/html/template/) package to help handle templates. We can use functions like `Parse`, `ParseFile` and `Execute` to load templates from plain text or files, then evaluate the dynamic parts. Also it's possible to create user-defined functions and call it from templates.


In real world (or good Go app architecture) all objects are described with help of Go structs. One type can be used in multiple places, can be rendered to HTML on different pages, etc.

For example we have a service with videos, they can be rendered on various pages. Let's describe our Video type in Go:
```
type Video struct {
	ID   int
	Name string
    URL  string
}
```

Then how we render it in HTML with help of `html/template` (`index.html`). In this example we have 2 videos:
```
{{define "base"}}
<div class="video">
    <img src="{{ .Video1.URL }}">
    <h3><a href="/v/{{ .Video1.ID }}">{{ .Video1.Name }}</a></h3>
</div>

<div class="video">
    <img src="{{ .Video2.URL }}">
    <h3><a href="/v/{{ .Video2.ID }}">{{ .Video2.Name }}</a></h3>
</div>
{{end}}
```

And we can have more pages with the same Video layout, so we need some kind of helper. It can be done by creating a new template and parse it, but I prefer (and I'll show) a struct helper-function. The idea is that renderable structs must have a function(s) to render a struct in the specific way, it's very similar to `ToString()` function, but let's call our function `HTML()`.
```
func (v *Video) HTML() template.HTML {
	var out bytes.Buffer
	t := template.Must(template.ParseFiles("partials/video.html"))
	t.Execute(&out, v)
	return template.HTML(out.String())
}
```

And put our video's div into `partials/video.html`:
```
<div class="video">
    <img src="{{ .URL }}">
    <h3><a href="/v/{{ .ID }}">{{ .Name }}</a></h3>
</div>
```

So let's see how our `index.html` has been changed.
```
{{define "base"}}
{{ .Video1.HTML }}
{{ .Video2.HTML }}
{{end}}
```

Or if somewhere we have a loop of videos:
```
{{range .Videos}}
    {{ .HTML }}
{{end}}
```

Of course it's not a single way to do it, you can share in the comments how you do it.
