+++
date = "2017-11-26T13:23:53+07:00"
tags = ["python", "bot", "rasa]
title = "Create a bot with NLU in Python"
type = "post"

+++

![bot.png](https://raw.githubusercontent.com/plutov/bot/master/bot.png)

At [Wizeline](http://wizeline.com/) we have Python courses, and recent topic was how to build a Bot in Python. I always wanted to try Natural Language Understanding (NLU) as a subtopic of natural language processing in artificial intelligence that deals with machine reading comprehension.

As we use Python, I checked which libraries we already have to do it and I decided to try [RASA NLU](https://rasa.ai/), a tool for understanding what is being said in short pieces of text. For example, taking a short message like:

```
"I'm looking for a Mexican restaurant in the center of town"
```

Returning structured data like:

```
intent: search_restaurant
entities: 
  - cuisine : Mexican
  - location : center
```

### Idea of the Bot

The simple idea is to build a Bot which will answer (ideally) any question. See screenshot above how it works now.

### Training

First of all we need to train RASA to understand our messages. We need to define intents and entities. We will have few intents in the beginning:

 - greet
 - whatis
 - howto

You can use [rasa-nlu-trainer](https://rasahq.github.io/rasa-nlu-trainer/) to define some examples, which we will use later to train the Bot. Then you can save configuration as [JSON file](https://github.com/plutov/bot/blob/master/rasa-data.json).

### Python dependencies

This project requires few dependencies to be installed to build this idea: rasa, slackclient, sklearn, and wolfram/wikipedia to find answers.

```
pip3 install slackclient rasa_nlu scipy scikit-learn sklearn-crfsuite numpy spacy wolframalpha wikipedia
python3 -m spacy download en
```

I used Python 3, you can try to check it with this [Dockerfile](https://github.com/plutov/bot/blob/master/Dockerfile).

### Configuration

I use Slack to communicate with the bot, but I'am pretty sure it can be replaced with any other messaging service. To work with Slack we need to create a bot and get Slack API token.

Do you know what is [Wolfram](https://www.wolframalpha.com/)? Actually, very nice tool to get concise answers. So we can [create a free app](https://developer.wolframalpha.com/portal/myapps/) there with 2000req/month limit and get App ID.

In case request to Wolfram is failed, or it can't find any answer, we will use free Wikipedia API to get the answer.

Our application work with environment variables:

```
docker build -t bot . && docker run -e SLACK_TOKEN=<token> -e WOLFRAM_APP_ID=<app_id> bot
# or
SLACK_TOKEN=<token> WOLFRAM_APP_ID=<app_id> python3 bot.py
```

### Training time

RASA should be trained before using prediction, it's done on application start in [nlp/rasa.py[(https://github.com/plutov/bot/blob/master/nlp/rasa.py):

```
self.rasa_config = RasaNLUConfig(config_file)

training_data = load_data(self.data_file)
trainer = Trainer(self.rasa_config)
trainer.train(training_data)
```

### Prediction time

You can call rasa NLU directly from your python script. To do so, you need to instantiate an interpreter.

```
self.interpreter = Interpreter.load(trainer.persist(self.model_dir), self.rasa_config)
```

Now you can use this interpreter to get message from Slack and parse it:

```
self.interpreter.parse(msg)
```

For example:
```
What is the birth date of John Lennon?
```

Rasa parsed as:
```
intent: whatis
entities: 
  - query : birth date of John Lennon
```

### Data Providers

Then we send `birth date of John Lennon` to Wolfram API, easy peasy right? And Wolfram will return very short answer:

```
Wednesday, October 9, 1940
```

Now we just need to send it back to user.

### Future steps

Of course prediction currently is very basic, doesn't handle context, etc. But we can train RASA on the fly. What I want to do next is to save all unparsed questions, or questions Bot for which couldn't find an answer, and train Bot to answer those questions.

So if you are interested in this, I am open for contributions in this [GitHub repo](https://github.com/plutov/bot).