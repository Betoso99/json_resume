# json_resume
A simple Web Server that uses the basic commands
   *  GET
   *  HEAD
   *  POST
   *  PUT
   *  PATCH
   *  DELETE

Using the plugin of Rest Client in Visual Studio Code

## Commands 
 **You should have instaled by terminal**
 * Espress.js writing `npm i express`
 * Nodemon writing `npm i -g nodemon`
 * Espress Basic Authorization writing `npm express-basic-auth`
 * Redis for the cache writing `npm i express node-fetch redis`

 **On a terminal write** 
 *  `nodemon index.js` to run the server
 
 **On another terminal write**
 * `sudo service redis-server start` to run a redis server that will make a cache

### Schema
This app was developed based on this [schema][1]

#### Pre-requisites
 *  "express": "^4.17.1",
 *  "express-basic-auth": "^1.2.0",
 *  "node-fetch": "^2.6.1",
 *  "redis": "^3.1.2"

Alberto Osorio - 1085998
[1]: https://jsonresume.org/schema/
