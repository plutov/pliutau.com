+++
date = "2018-01-01T18:40:39+07:00"
tags = ["go"]
title = "Practice Go: Mosaic Photo"
type = "post"
og_image = "https://raw.githubusercontent.com/plutov/practice-go/master/mosaicphoto/example.jpg"
+++
![mosaicphoto](https://raw.githubusercontent.com/plutov/practice-go/master/mosaicphoto/example.jpg)

Your mission is to write a mosaic-photo generating command line program that:

 - Allows the user to select a target picture.
 - Allows the user to select a directory containing a set of tile pictures.
 - Generates a mosaic-photo of the target picture using the tile pictures.

### Requirements

 - Try not to use 3rd party libraries.
 - png-only support.
 - Size of the output photo should be the same as size of target photo.

### Test it!

This challenge doesn't contain Go tests, and should be tested by executing command line program in the following format:

```
go run main.go --in tiles/ --target tile.png --out out.png
```

Where:
 - `--in` is a folder with all possible tiles. More tiles is better.
 - `--target` is an original photo, which is the photo that will be made into a mosaic-photo.
 - `--out` is the name of output file.

[Create a Pull Request for this challenge](https://github.com/plutov/practice-go/tree/master/mosaicphoto)