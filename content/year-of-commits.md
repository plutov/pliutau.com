+++
title = "Year Of Commits: simple systray program in Go"
date = "2018-01-02T14:35:14+07:00"
type = "post"
tags = ["go", "systray", "html/template" , "go-bindata", "github"]
+++
Happy New Year Gophers! One of my goals for 2018 is to commit a code to GitHub every single day. So "Contributions" on GitHub will look like this:

![Contributions](/yearofcommits-full.jpg)

To track this process I decided to write a Go program, which will be always in my tray, and which will show how many days in a row I committed something to Github.

Tadaa! [yearofcommits](https://github.com/plutov/yearofcommits)

It's a single-file command line tool using the following packages:

 - github.com/getlantern/systray
 - github.com/google/go-github/github
 - golang.org/x/oauth2

We're installing them using [dep](https://github.com/golang/dep).

[systray](https://github.com/getlantern/systray) is a cross-platform package to place an icon and menu into notification area. Though I tested it only on Mac.

Then application uses GitHub API with help of [go-github/github](github.com/google/go-github/github) Go package. GitHub API doesn't have contributions endpoint, so we need to get all repositories and get all commits made by specified user.

```
client.Repositories.List(ctx, user, reposOpts)
client.Repositories.ListCommits(ctx, user, repo.GetName(), commitsOpts)
```

The rest is easy, count days.

![Contributions](/yearofcommits.png)

To run it in locally you need to install `dep` and run:
```
dep ensure
go install
yearofcommits -u github_user -t github_api_token
```

Also, if you want keep it running even after you restart your Mac, you can configure `launchctl`. Create `/Library/LaunchAgents/yearofcommits.plist` file with the following XML:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>yearofcommits</string>

    <key>OnDemand</key>
    <false/>

    <key>UserName</key>
    <string>MAC_USER</string>

    <key>GroupName</key>
    <string>MAC_GROUP</string>

    <key>ProgramArguments</key>
    <array>
            <string>/go/bin/yearofcommits</string>
            <string>-u</string>
            <string>GITHUB_USER</string>
            <string>-t</string>
            <string>GITHUB_TOKEN</string>
    </array>
</dict>
</plist>
```

Change `/go/bin/yearofcommits` to the absolute path inside your $GOBIN.

Run:
```
sudo launchctl load /Library/LaunchAgents/yearofcommits.plist
```