+++
date = "2016-11-21T12:42:54+07:00"
title = "Use Go Fonts in Atom"
tags = [ "Go", "Atom" ]
type = "post"
og_image = "/atom_go_fonts.png"
+++
Just a few days ago Go team has announced Go font called "Go Mono". Go source code looks good when displayed in Go Mono. Also go fonts are licensed under the same open source license as the rest Go projects have.

Here is an example how it looks in my Atom.

![GoFonts](/atom_go_fonts.png)

#### Get fonts

```
git clone https://go.googlesource.com/image
```

Double-click on `font/gofont/ttfs/Go-Mono.ttf`  to open a font and click "Install":

![GoFontsInstall](/atom_go_fonts_install.png)

#### Configure Atom or any other editor

Find font settings in the editor and set a font family as "Go Mono":

![GoFontsInstall](/atom_go_fonts_find.png)
