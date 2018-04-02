+++
title = "Building Google Home Action in Go"
date = "2018-04-02T16:07:19+07:00"
type = "post"
tags = ["go","google home","google assistant","google cloud platform"]
og_image = "/grpc-json.png"
+++
![Building Google Home Action in Go](/GoogleHome1.jpg)

### Google Home

This is a text version of this video: [packagemain #10: Building Google Home Action in Go](https://youtu.be/LeGuJo7QBbI).

Google Home is a voice Assistant, similar to Amazon Alexa, but working with Google services. It has a lot of built-in integrations, but what is interesting for us developes is that we can build our programs for it. Google call them Actions.

We will build an Action, which will help user to find an air quality index of the city user is located in. It's not necessary to have Google Home device to be able to build and test it, Google has very nice Similuator.

Google Home Actions are using DialogFlow (previously it called api.ai) to setup conversation flow using NLU. And we will build a simple backend API to get data, which we'll deploy to Google Cloud.

### Dialogflow

We have to login with our Google Account to [https://dialogflow.com](https://dialogflow.com). Go to Console and create your first project. You can choose to use existing Google Cloud project or create a new one.

We will use DialogFlow API V1, V2 is slightly different in terms of request/response format.

Now let's decide the future user flow.

There are 2 ways to start to talk to our Action: explicit invocation and implicit invocation. Explicit one is triggered when we tell Google "Talk to <action name>". In implicit invocation we can set up custom messages, but we will skip this option for our demo program. Basically you need to create an intent and describe possible sentences user may say.

We need to know user's location to get information, so first of all we need to ask for this permission. Google Action has functionality to ask for location permission. We need to send specific response to DialogFlow after user started to talk to Action.

Let's define it in welcome intent. We need to set the action name `location_permission` and then in our webhook we can check it. Also we need to `Enable webhook call for this intent`.

Let's describe our fallback intent with default fallback message. This intent will be executed when action doesn't understand what user wants.

`Sorry, I can't help you with this right now. Please try later.`. Set intent as end of conversation.

Now let's define the main intent to get air quality. This intent will be triggered not by specific word but by reserved event: `actions_intent_PERMISSION`. So when user granted access to location info this intent will be executed. We set action name as `get` and will handle it later in API. Also we need to enable webhook call for this. And set end of conversation.

Ok, we're almost done with configuration, let's define how Google Action will get data.

Go to Fulfillment. There are 2 options to write a backend logic: using custom webhook or to use inline editor powered by cloud functions on Firebase, but it's node.js so we will go with first one and provide endpoint to API deployed to Google Cloud.

### API

You should already have Google Cloud project and `gcloud` SDK installed, so we can write `app.yaml` file to describe handlers and runtime:

```golang
runtime: go
api_version: go1

handlers:
- url: /
  script: _go_app
```

Dialogflow will send 2 different requests to 1 endpoint: 1 for `location_permission` and 2 to `get` results.

```golang
package app

import (
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/", handle)
}

func handle(w http.ResponseWriter, r *http.Request) {
	dfReq := DialogFlowRequest{}
	dfErr := json.NewDecoder(r.Body).Decode(&dfReq)

	if dfErr == nil && dfReq.Result.Action == "location_permission" {
		handleLocationPermissionAction(w, r, dfReq)
		return
	}

	if dfErr == nil && dfReq.Result.Action == "get" {
		handleGetAction(w, r, dfReq)
		return
	}

	json.NewEncoder(w).Encode(DialogFlowResponse{
		Speech: unknownErrMsg,
	})
}
```

### Ask for location permission

In `handleLocationPermissionAction` we need to send back a specific response which will tell Dialogflow to ask for `DEVICE_PRECISE_LOCATION` permission. We set a question message telling user why we need location.

```golang
func handleLocationPermissionAction(w http.ResponseWriter, r *http.Request, dfReq DialogFlowRequest) {
	json.NewEncoder(w).Encode(DialogFlowLocationResponse{
		Speech: "PLACEHOLDER_FOR_PERMISSION",
		Data: DialogFlowResponseData{
			Google: DialogFlowResponseGoogle{
				ExpectUserResponse: true,
				IsSsml:             false,
				SystemIntent: DialogFlowResponseSystemIntent{
					Intent: "actions.intent.PERMISSION",
					Data: DialogFlowResponseSystemIntentData{
						Type:        "type.googleapis.com/google.actions.v2.PermissionValueSpec",
						OptContext:  "To get city for air quality check",
						Permissions: []string{"DEVICE_PRECISE_LOCATION"},
					},
				},
			},
		},
	})
}
```

### Get results

When user replies that it's ok to check location, dialogflow will send us coordinates in `get` action, so we can use it to check air quality index.

```golang
func handleGetAction(w http.ResponseWriter, r *http.Request, dfReq DialogFlowRequest) {
	lat := dfReq.OriginalRequest.Data.Device.Location.Coordinates.Lat
	long := dfReq.OriginalRequest.Data.Device.Location.Coordinates.Long
	if lat == 0 || long == 0 {
		json.NewEncoder(w).Encode(DialogFlowResponse{
			Speech: unknownErrMsg,
		})
		return
	}

	index, levelDescription, aqiErr := getAirQualityByCoordinates(r, lat, long)
	if aqiErr != nil {
		json.NewEncoder(w).Encode(DialogFlowResponse{
			Speech: apiErrMsg,
		})
		return
	}

	json.NewEncoder(w).Encode(DialogFlowResponse{
		Speech: fmt.Sprintf("The air quality index in your city is %d right now. %s", index, levelDescription),
	})
}
```

Finally, let's deploy our app:

```
gcloud app deploy
```

If everything is fine, this command will give us endpoint which we should add in Fulfillment section.

### Test it with Simulator
And now it's time to try this nice Simulator I was talking about. Go to Integrations -> Assistant, setup welcome intent and click Test.

Simulator works with keyboard input and also with voice input. Currently our Action is accessible only to us, to make it public, we need to submit it for verification.

Type `Talk to my test app`.
- Yes.
- Profit!

If your Google Home device is using same Google account, you we can test it there also.

I am going to send this application for Google review, as I find this air quality information really necessary for me as I'm living in Asia.

[Full code of this program on GitHub](https://github.com/plutov/packagemain/tree/master/10-ghome-aqi)