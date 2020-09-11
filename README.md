# Peer Code Review App

> A web app that matches programmers to a mentor to review their code.

## About

A web app that matches programmers to a mentor to review their code. Programmers earn credits by giving code reviews, and you can spend credits on getting your code reviewed (by someone a level up from you).

### Who’s it for?

Programmers who are looking for a mentor to provide code feedback!

### User Journey

Context: I’m a bootcamp grad and I’m new to the field! To improve my coding skills, I want to get feedback from people more experienced than me to make sure I’m following best practices and learn where I can improve.

I sign on to the platform and create an account. I input my details in my profile (i.e. beginner with <1 year of work experience).

I begin with 3 credits (1 credit = 1 code review)

I upload a snippet of my code with context around what I’m writing to submit for review.

In some time I get a notification that someone has reviewed my code and I can review their notes!

---

## Table of Contents

- [Peer Code Review App](#peer-code-review-app)
  - [About](#about)
    - [Who’s it for?](#whos-it-for)
    - [User Journey](#user-journey)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Running MongoDB locally](#running-mongodb-locally)
    - [Running Redis locally](#running-redis-locally)
    - [Gif tool to use](#gif-tool-to-use)
  - [Features](#features)
  - [Usage](#usage)
  - [Documentation](#documentation)
  - [Technologies (STACK)](#technologies-stack)
  - [Team](#team)
  - [FAQ](#faq)
  - [Support](#support)

## Installation

### Running MongoDB locally

1. Go to [MongoDB](https://docs.mongodb.com/manual/installation/)
2. Follow instructions on installing MongoDB Community
3. Run MongoDB server from terminal
4. Connect to local url: mongodb://localhost:{DEFAULT_PORT=27017}/{LOCAL_DB_NAME}

### Running Redis locally

1. On terminal, install [Homebrew](https://brew.sh/)
2. Run `brew install redis`
3. Start redis service `brew services start redis`
4. Run redis server `redis-server`
5. To check if redis server is running, enter `redis-cli ping` and command line will output `PONG`
6. Stop redis server by pressing **CONTROL+C**
7. Stop redis service `brew services stop redis`

## Features

- Login/sign up flow with e-mail address
- Create profile
- Buy credits
- Rich text editor with real time code highlighting
- Notifications center
- Instant messages with Sockets.io
- Upload code
- Receive code review
- Send code review
- Upload projects to show

## Usage

I propose here we walk through the app and add Gifs and Screenshots.

## Documentation

Here may be some documentation

## Technologies (STACK)

- JavaScript
- React
- MongoDB
- Node.js
- Express.js
- Redis
- Sockets.io
- Material-UI

## Team

> Team of developers worked on the Peer Code Review App

|               <a href="http://fvcproductions.com" target="_blank">**Vitalii Sidorok**</a>                |               <a href="http://fvcproductions.com" target="_blank">**Affeeq Ismail**</a>                |                  <a href="http://fvcproductions.com" target="_blank">**Tyler Poor**</a>                  |
| :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| [![Vitalii Sidorok](https://avatars0.githubusercontent.com/u/22850021?s=200)](http://github.com/svitaly) | [![Affeeq Ismail](https://avatars1.githubusercontent.com/u/48659449?s=200)](https://github.com/Affeeq) | [![Tyler Poor](https://avatars1.githubusercontent.com/u/43526510?s=200)](http://github.com/LiveBacteria) |
|               <a href="http://github.com/svitaly" target="_blank">`github.com/svitaly`</a>               |              <a href="https://github.com/Affeeq" target="_blank">`github.com/affeeq`</a>               |          <a href="http://github.com/LiveBacteria" target="_blank">`github.com/LiveBacteria`</a>          |

## FAQ

- **Do we need a FAQ section?**
  - I included all sections I could come with. Feel free to delete or modify any of them.

## Support

Reach to any of the team members at one of the following places:

- Vitalii Sidorok at <a href="http://github.com/svitaly" target="_blank">`github.com/svitaly`</a>
- Affeeq Ismail at <a href="https://github.com/Affeeq" target="_blank">`github.com/affeeq`</a>
- Tyler Poor at <a href="http://github.com/LiveBacteria" target="_blank">`github.com/LiveBacteria`</a>

---

Copyright 2020 © <a href="https://github.com/hatchways/team-blueberry" target="_blank">Team Blueberry</a>.
