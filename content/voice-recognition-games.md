+++
date = "2017-07-26T14:50:34+07:00"
title = "Games based on Voice Recognition"
tags = [ "Go", "Google Speech API", "Voice Recognition", "Wizeline" ]
type = "post"
+++
Hi folks!

Last Saturday I was very inspired by [Alexa skills using server-side Swift](http://academy.wizeline.com/alexa-skills-using-server-side-swift/) talk organized by Wizeline Vietnam team. Speakers made a demo of how can we use Alex Skill in League of Legends (LoL). This Skill enables a user to retrieve the statistics of the enemy team mid-match using voice-enabled commands.

I went home with an idea of building a game fully based on voice recognition, without any interface. In past I had experience with Google Speech API and Google Translate API, so I decided to try with it.

And of course Go!

I created a [PoC open source project](https://github.com/plutov/games) to implement a `20 questions` game, simple fun game where you should guess a noun by asking a maximum of 20 questions. Question can be answered only with "Yes", "No" and "Don't know". Demo page is located [here](http://pliutau.com/games/).

For now I am doing voice recognition using webkit technologies, but I have plans to move it to backend and use Google Speech API. Also in plans I want to support all possible languages using Google Translate API.

Please join a project if you're interested!
