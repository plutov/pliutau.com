+++
title = "Slack Stranger Bot in Go"
date = "2017-10-12T10:17:18+07:00"
type = "post"
tags = ["go","slack"]
og_image = "/wizeline-random.png"
+++
![wizeline-random.png](/wizeline-random.png)

I am enjoying writing programs in a short time, like in a Hackathon way. Here in Vietnam we don't have Hackathons often, so yesterday I decided to make one for myself with a time limit in 3 hours. The goal was to build/deploy something that will work and people can try it. I decided to go with Bot for Slack (or another messenger in the future).

So I wrote this Stranger Bot to meet strangers in your Slack, explore new people. It's anonymous and private, Bot doesn't store any data.

### How it works?

 - The User opens a private conversation with Stranger Bot.
 - Types `Hi`.
 - Stranger Bot finds random active user who doesn't participate currently in Stranger conversation.
 - Bot will forward all next messages sent by user to Bot to the Stranger user. Without mentioning who sent this message.
 - Any user can type `Bye` to finish the conversation, and type `Hi` again to start a new random one.

Here is an example of how it works a Wizeline:

> **alex.pliutau** [10:29 PM]
>
> hi
>
> **Random WizelinerAPP** [10:29 PM]
>
> Connecting to a random Stranger ...
>
> Stranger found! Say hello, and please be polite :wave: _Type bye to finish the conversation_
>
> hola!!
>
> **alex.pliutau** [10:31 PM]
>
> Nice, super private
>
> So it will work to find random person to talk :slightly_smiling_face:
>
> **Random WizelinerAPP** [10:31 PM]
>
> :wat:
>
> hahaha
>
> **alex.pliutau** [10:31 PM]
>
> bye
>
> **Random WizelinerAPP** [10:31 PM]
>
> Bye! You finished conversation with the Stranger. Type hi again if you want to start a new random one.

Random WizelinerAPP [10:31 PM]
Bye! You finished conversation with the Stranger. _Type hi again if you want to start a new random one._
```

### Try it

- Clone [slack-stranger-bot](https://github.com/wizeline/slack-stranger-bot)
- Create App in Slack and copy `API Token`
- Install [Docker](https://docs.docker.com/engine/installation/)
- Run `docker build -t stranger . && docker run stranger -e SLACK_TOKEN=<token>` with a valid token

### Contribute

All code is open sourced. Feel free to [contribute](https://github.com/wizeline/slack-stranger-bot/pulls) or raise an [issue](https://github.com/wizeline/slack-stranger-bot/issues).
