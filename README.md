
# CertMe

CertMe is a certificate generator web application in which data is provwided in the form of an excel file containing tags and a template providing biolerplate that fills the tag, e.g., {d.TAG} ( here TAG is one of the cell representing a column in the excel sheet ). The created file is bulk-emailed to the individuals using the email addresses mentioned in the excel file.

## Installation

You are required to install [Node JS]  version 16.15.1 to run and choose your platform accordingly 👍🏼.

Clone the repository to open the project in your code editor, I prefer [Visual Studio] 🤪.
```sh
$ git init
$ git clone https://github.com/anasvemmully/CertMe.git
```

## Setup

Start the server at port:3000 by moving inside the client React application folder (default) 

```sh
$ cd CertMe\client
$ npm i
$ npm start
```

Now start the node server at port :8000

```sh
$ cd CertMe\server
$ mkdir public
$ npm i
$ npm start
```

Keep sure the client url is specified in the CORS in node server, if you encounter with CORS issue in future.

```sh
# CertMe\server\app.js

app.use(
  cors({
    origin: "http://localhost:3000", # client url
    credentials: true,
  })
);
``` 

Next, you must add the.env file inside node server and set the following variables in order for your node server to run smoothly.

```sh
MONGO_URL=
 
SESSION_SECRET=

EMAIL=
CLIENT_ID=
CLIENT_SCRET=
REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=
```

`SESSION_SECRET` is the secrert for your cookie 🍪. `EMAIL`, `CLIENT_ID`, `CLIENT_SCRET`, `REDIRECT_URI` and `REFRESH_TOKEN` is used to send emails (refer this [youtube video]).

## Deployment

I deployed the application in Heroku using [docker] containers. First, build the [react] application ei,. `/client/` .

```sh
$ cd client
$ npm run build
```

After building [react] application the build folder is generated inside the client folder, place the folder inside the server public folder (make sure nothing is there except the build). 
Now, using the [Dockerfile] inside the server folder

```sh
# Dockerfile for Node Express Server
FROM node:16.15.1
WORKDIR /usr/src/app
COPY package.json ./
ADD . ./
RUN npm install
RUN rm -rf ./node_modules
RUN npm update
EXPOSE 8000
RUN apt-get update --fix-missing
RUN apt-get install libreoffice -y 
CMD ["npm","start"]
```

use the following command to push and release the [docker] container; [see the doc].

```sh
$ heroku container:push web
$ heroku container:release web
```

Now open your browser

```sh
$ heroku open
```

See my deployment on Heroku [Click Here 👆🏼](https://cert-me.herokuapp.com/)

## Technology used

[<code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png"></code>](https://developer.mozilla.org/en-US/docs/Web/HTML) 
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png"></code>](https://developer.mozilla.org/en-US/docs/Web/CSS)
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"></code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 
&nbsp;&nbsp;
[<code><img height="30" src="https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-512.png"></code>](https://git-scm.com/downloads)
&nbsp;&nbsp;
[<code><img height="30" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"></code>](https://code.visualstudio.com/)
&nbsp;&nbsp;
[<code><img height="30" src="https://github.com/devicons/devicon/blob/v2.15.1/icons/heroku/heroku-plain.svg"></code>](https://heroku.com)
&nbsp;&nbsp;
[<code><img height="30" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"></code>](https://reactjs.org/)
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg"></code>](https://nodejs.org/en/)
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg"></code>](https://expressjs.com/)
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"></code>](https://www.mongodb.com/)
&nbsp;&nbsp;
[<code><img height="30" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg"></code>](https://www.docker.com/)
&nbsp;&nbsp;
[<code><img height="30" src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"></code>](https://www.postman.com/)
&nbsp;&nbsp;

## Future Improvements

- Need to fix page refresh issue.
- Need to transform the CertMe to  Q&A CertMe.
- Need to improve the UI and implement Dark Theme.
- Need to Optimize the build.
- Need to implement Token based Authentication.
- Need to implement OAuth.
- Need to implement Forgot Password Mechanism.  

## License

Free to use and modify, just follow me ⭐.

<p align="center">
 <img src="https://c.tenor.com/f2DhQ5_c6EcAAAAM/iron-man-iron-man-infinity-war.gif" /> </br>  
 <span><b>made with ❤</b></span>      
</p>




[see the doc]: <https://devcenter.heroku.com/articles/container-registry-and-runtime>
[Dockerfile]: <https://docs.docker.com/engine/reference/builder/>
[react]: <https://reactjs.org/>
[docker]: <https://docs.docker.com/desktop/windows/install/>
[Heroku]: <https://heroku.com>
[youtube video]: <https://www.youtube.com/watch?v=-rcRf7yswfM>
[Node JS]: <https://nodejs.org/en/download/>
[Visual Studio]: <https://code.visualstudio.com/download>
