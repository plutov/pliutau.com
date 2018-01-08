+++
title = "Image Recognition in Go using Tensorflow"
date = "2018-01-08T17:25:16+07:00"
type = "post"
tags = ["go", "golang", "image recognition", "tensorflow", "machine learning", "docker"]
og_image = "/IRiGuTF.jpg"
+++
![LogPacker](/IRiGuTF.jpg)

This is a text version of this video: [packagemain #4: Image Recognition in Go using Tensorflow](https://youtu.be/P8MZ1Z2LHrw).

Tensorflow is a computation library that represents computations with graphs. Its core is implemented in C++ and there are also bindings for different languages, including Go.

In the last few years the field of machine learning has made tremendous progress on addressing the difficult problem of image recognition.

One of the challenges with machine learning is figuring out how to deploy trained models into production environments. After training your model, you can "freeze" it and export it to be used in a production environment.

For some common-use-cases we're beginning to see organizations sharing their trained models, you can find some in the [TensorFlow Models repo](https://github.com/tensorflow/models).

In this article we'll use one of them, called [Inception](https://github.com/tensorflow/models/tree/master/research/inception/inception) to recognize an image. 

We'll build a small command line application that takes URL to an image as input and outputs labels in order.

First of all we need to install TensorFlow, and here Docker can be really helpful, because installation of Tensorflow may be complicated. There is a Docker image with Tensorflow, but without Go, so I found an image with Tensorflow plus Go to reduce the Dockerfile.

{{< gist plutov 285947413105cac01a19da4a1e6e6639 >}}

Let's start with simple main.go which will parse command line arguments and download image from URL:

{{< gist plutov ebd8dc8edde3b9e2b29edd899be6aca5 >}}

And now we can build and run our program:

{{< gist plutov a38f01b12250f23edf475bc88412d268 >}}

Now we need to load our model. Model contains graph and labels in 2 files:

{{< gist plutov 0de9dc194bc15857db0c689ce0da4a5b >}}

Now finally we can start using tensorflow Go package.
To be able to work with our image we need to normalize it, because Inception model expects it to be in a certain format, it uses images from ImageNet, and they are 224x224. But that's a bit tricky. Let's see:

{{< gist plutov b88486ac41678a88b8edc2332f936a1f >}}

All operations in TensorFlow Go are done with sessions, so we need to initialize, run and close them. In makeTransformImageGraph we define the rules of normalization.

We need to init one more session on our initial model graph to find matches:

{{< gist plutov e0b0afbdfde3261232fa8af90008f849 >}}

It will return list of probabilities for each label. What we need now is to loop over all probabilities and find label in `labels` slice. And print top 5.

{{< gist plutov 7580d3fc5623cdc7efeb44269004fec7 >}}

That's it, we're able to test our image and find what program will say:

{{< gist plutov a38f01b12250f23edf475bc88412d268 >}}

Here we used pre-trained model but it's also possible to train our models from Go in TensorFlow, and I will definitely do a video about it.

[Full code of this program](https://github.com/plutov/packagemain/tree/master/05-tensorflow-image-recognition)