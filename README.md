# Graph-based Movie Application


This application is a movie content browser powered by Neo4j. All movie content is consumed from a Neo4j REST API endpoint built using Neo4j Swagger.

Tools:

* Neo4j: [http://www.neo4j.org/download/](http://www.neo4j.org/download/)
* Swagger: [http://neo4j-swagger.tinj.com/](http://neo4j-swagger.tinj.com/)
* Node.js: [http://nodejs.org/](http://nodejs.org/)
* Bootstrap: [http://getbootstrap.com/](http://getbootstrap.com/)
* Angular.js: [http://angularjs.org/](http://angularjs.org/)


## Documentation

*Read the full project documentation here: Doesn’t exist yet.*

## Architecture

* Front-end web-based dashboard in Node.js and Bootstrap
* REST API via Neo4j Swagger in Node.js
* Data import services in Node.js
* Data storage in a Neo4j graph database

## Getting Started

If you haven’t done so already, download or clone this repository and navigate to it using your Terminal (if on a Mac) or command line.


## Setting up Node.js

If you’ve never used node, this is a good first step as it verifies you have the correct libraries for running the web application. 

* Install Node.js either via homebrew using `brew install node` or directly from [http://nodejs.org/](http://nodejs.org/)
* Navigate to the `api` and `web` folders and install dependencies running  `npm install` in each.
* Navigate to the `web` folder and run `node app.js`
* Take a look at `http://localhost:5000/`
* If you see some awesome movies there, success! :D

## Setting up Neo4j

### Installation
So Node.js is set up and you can see the boilerplate Movies application running on `http://localhost:5000/`, great. Now we want to set up an instance of Neo4j locally so we can look at and modify the data. 

* Download Neo4j [here](http://www.neo4j.org/download)
* Extract Neo4j to a convenient location and rename the folder to something less cumbersome, like ‘Neo4j’, if you want
* Navigate to the extracted folder and run `./bin/neo4j start` 
* If all goes well, you should see the Neo4j web application running at `http://localhost:7474/`

### Adding the Movie data

Right now your Neo4j Database does not contain the Movie data.  Let’s fix that. 

* Navigate to your Neo4j directory
* If you have Neo4j running, stop it with `./bin/neo4j stop` in the Neo4j directory
* If you want to make sure you killed it good, check by running `launchctl list | grep neo` and `launchctl remove` any processes that might be listed
* If you `ls data`, you’ll see a file called `graph.db`.
* Delete the existing `graph.db`.
* Grab the zipped movies graph database file from the `databases` folder in the web app
* Unzip it into the `data` folder
* Run Neo4j! You should be able to see some nodes at `http://localhost:7474/`

### Setting up Swagger

You can see the demonstration web app is GETing information about movies and people from [http://movieapi-neo4j.herokuapp.com](http://movieapi-neo4j.herokuapp.com). However, we want to be able to run the web application locally or from another server. To do that, we need our own API.

[Learn more about Swagger.](Learn more about Swagger.)

### Putting it all together

First, let's make a change to our local database so we know which database we're looking at. 

Run the following query:
 
```
MATCH (n:Movie) WHERE n.`title` = 'The Matrix' SET n.rated = 'awesome' RETURN n
```

### Swagger
Open to the `api/neo4j/cypher.js` file. You’ll see:

```
var neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase('http://162.243.116.40/'),
    //db = new neo4j.GraphDatabase('http://neo4jmovies_backup:s85HZuuCPlaS6T6y7H8f@neo4jmoviesbackup.sb01.stations.graphenedb.com:24789/'),
    //db = new neo4j.GraphDatabase('http://localhost:7474/'),
    _ = require('underscore')
;
```

Replace the above with:

```
var neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase('http://localhost:7474/'),
    _ = require('underscore')
;
```

In the `api/app.js` file, change `BASE_URL` to `http://localhost:3000`

From your parent directory, run `node api/app.js` to get Swagger started.

Head on over to `http://localhost:3000/docs/`, GET The Matrix [you can do a search by title, for instance](http://localhost:3000/docs/#!/movies/getMovieByTitle_get_3), and verify that this movie is now rated `awesome`.

### The Front-end (needs work)

Although Swagger is giving us the correct information, the web app running locally is still pointed to a remote server. 

Head on over to `web/dist/assets/js/controller.js` and replace all instances of 

* `http://movieapi-neo4j.herokuapp.com/` with `http://localhost:3000/`
* more stuff

Again run `node web/app.js` in the `neo4j-movies-template` directory, and `.\bin\neo4j start` from your Neo4j directory, if it isn’t already running. 

Verify that *The Matrix* is indeed rated *awesome*, and have fun. 
