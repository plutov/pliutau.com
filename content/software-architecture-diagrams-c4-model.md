+++
date = "2024-03-04T11:00:00+02:00"
title = "Software Architecture Diagrams using the C4 model"
tags = [ "C4", "diagrams", "architecture" ]
type = "post"
og_image = "/c4.png"
+++
![C4 Model](/c4.png)

A picture is worth a thousand words. If you've ever joined a new complex project, you'd know what that means. Sure, most engineers are great at reading code, but when there's so much of it, it's tough to see the big picture. That's when it's a good idea to take a step back and look at the architecture.

If you're lucky, you might find a nice architecture diagram from a few years ago. The problem is these diagrams aren't usually kept up-to-date, so they get old pretty fast.

I believe that making and updating diagrams should be easy and quick, so nobody gets stuck with outdated info.

## C4 Model

The C4 model was created as a way to help software development teams describe and communicate software architecture.

C4 stands for "Context, Containers, Components, and Code". Those are four levels that should be enough to describe a complex system.
SLIDE 4

The best way to explain the concept is to think about how we use Google Maps. When we are exploring an area in Google Maps, we will often start zoomed out to help us get context. Once we find the rough area we are interested in we can zoom in to get a little more detail.

## Context

This level is the most zoomed out, it is a bird’s eye view of the system in the context of the world. The diagram concentrates on actors and systems.

## Container

The container level is a more detailed view of your system (don’t confuse C4 containers with the Docker containers). If you have microservice architecture then each microservice would be a container.

Examples of containers are:
- Single page applications
- Web servers
- Serverless functions
- Databases
- APIs
- Message buses

## Component

The next level of zoom is the component diagram. This shows the major structural building blocks of your application, it is often a conceptual view of your application. The term component is loose here. It could represent a controller, or service containing business logic.


## Code

The deepest level of zoom is the code diagram. Although this diagram exists, it is often not used as the code paints a very similar picture.

## Diagrams as code

The power of C4 comes with a diagram-as-code approach, it is a way of creating and maintaining diagrams the same way you treat your code. There are many advantages to it, you can keep them in a source control system and collaborate on them using the same approach that developers use for code, collaborate using pull requests and build automated pipelines. Since we can host our models on Github, it is very easy to automate the pipeline for rendering the diagrams in the tools of your choice.

There are few tools to help with modeling and diagramming, however the most popular nowadays is Structurizr with their custom DSL.

All you need is to get familiar with the DSL syntax, which is pretty simple. As long as you get used to it you will be able to create or update diagrams in no time.

## Example

I created a simple example of Task Management Software to demonstrate the C4 model and Structurizr DSL.

```
workspace {

    model {
        customer = person "Customer" "" "person"
        admin = person "Admin User" "" "person"

        emailSystem = softwareSystem "Email System" "Mailgun" "external"
        calendarSystem = softwareSystem "Calendar System" "Calendly" "external"

        taskManagementSystem  = softwareSystem "Task Management System"{
            webContainer = container "User Web UI" "" "" "frontend"
            adminContainer = container "Admin Web UI" "" "" "frontend"
            dbContainer = container "Database" "PostgreSQL" "" "database"
            apiContainer = container "API" "Go" {
                authComp = component "Authentication"
                crudComp = component "CRUD"
            }
        }

        # Relationships between people and software systems
        customer -> webContainer "Manages tasks"
        admin -> adminContainer "Manages users"
        apiContainer -> emailSystem "Sends emails"
        apiContainer -> calendarSystem "Creates tasks in Calendar"

        # Relationships between containers
        webContainer -> apiContainer "Uses"
        adminContainer -> apiContainer "Uses"
        apiContainer -> dbContainer "Persists data"

        # Relationships to/from components
        crudComp -> dbContainer "Reads from and writes to"
        webContainer -> authComp "Authenticates using"
        adminContainer -> authComp "Authenticates using"
    }

    views {
        systemContext taskManagementSystem {
            include *
            autolayout
        }

        container taskManagementSystem {
            include *
            autolayout
        }

        component apiContainer {
            include *
            autolayout
        }

        # Dynamic diagram can be used to showcase a specific feature or process
        dynamic taskManagementSystem "LoginFlow" {
            webContainer -> apiContainer "Sends login request with username and password"
            apiContainer -> webContainer "Returns JWT token"
            webContainer -> customer "Persists JWT token in local storage"
            autolayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }

            element "person" {
                shape Person
            }

            element "external" {
                background #eeeeee
                border dashed
                color #000000
            }

            element "frontend" {
                shape WebBrowser
            }

            element "database" {
                shape Cylinder
            }
        }
    }
}
```

[Source code on Gihub](https://github.com/plutov/c4-diagram-example)