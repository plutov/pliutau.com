+++
date = "2016-11-21T22:42:17+07:00"
title = "Add a Watermark to the image with image go package"
tags = [ "Go" ]
type = "post"
+++

Go is very rich for packages support. But I also can say that Go is a perfect language to write almost everything with help of `stdlib` only. At [Weelco](https://weelco.com) we are generating some images with watermarks in Go, and we are using only `image` package.


Here is a simplified example of this process:

```
package main

import (
	"image"
	"image/draw"
	"image/jpeg"
	"image/png"
	"os"
)

// Error handling skipped for more clear example
func main() {
	// Open and decode source JPG
	original, _ := os.Open("source.jpg")
	defer original.Close()
	// Decode it to image.Image type
	originalImage, _ := jpeg.Decode(original)

	// Open and decode watermark PNG
	watermark, _ := os.Open("watermark.png")
	defer watermark.Close()
	// Decode it to image.Image type
	watermarkImage, _ := png.Decode(watermark)

	// Watermark offset. left top corner in this example
	offset := image.Pt(0, 0)
	// Use same size as source image has
	b := originalImage.Bounds()
	m := image.NewRGBA(b)
	// Draw source
	draw.Draw(m, b, originalImage, image.ZP, draw.Src)
	// Draw watermark
	draw.Draw(m, watermarkImage.Bounds().Add(offset), watermarkImage, image.ZP, draw.Over)

	// Save final JPG
	out, _ := os.Create("source+watermark.jpg")
	defer out.Close()
	jpeg.Encode(out, m, &jpeg.Options{
		Quality: jpeg.DefaultQuality,
	})
}
```
