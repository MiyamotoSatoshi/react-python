/**
 * Module dependencies.
 */
var express = require('express')
  , url = require('url')
  , routes = require('./routes')
  , fs = require('fs')
  , nconf = require('./config')
  , swagger = require('swagger-node-express')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , setAuthUser = require('./middlewares/setAuthUser')
  , neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup');

var app = express()
  , subpath = express();

app.use(nconf.get('api_path'), subpath);

// configure /api/v0 subpath for api versioning
subpath.use(bodyParser.json()); // just using json for the api
subpath.use(methodOverride());

//custom middlewares:
subpath.use(setAuthUser);
subpath.use(neo4jSessionCleanup);

// all environments
app.set('port', nconf.get('PORT'));

// just using json for the api
app.use(bodyParser.json());
app.use(methodOverride());

// development only
if ('development' == nconf.get('NODE_ENV')) {
  app.use(logger('dev'));
  app.use(errorHandler());
}

// Set the main handler in swagger to the express subpath
swagger.setAppHandler(subpath);

swagger.configureSwaggerPaths("", "/api-docs", "");

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `special-key`.  All other HTTP ops are A-OK
swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      if (!apiKey) {
        apiKey = url.parse(req.url, true).query["api_key"];
      }

      return "special-key" == apiKey;
    }
    return true;
  }
);


var models = require("./models/swagger_models");

// Add models and methods to swagger
swagger.addModels(models)
  .addPost(routes.users.registerUser)
  .addPost(routes.users.login)
  .addGet(routes.users.userMe)
  .addGet(routes.genres.list)
  .addGet(routes.movies.list)
  .addGet(routes.movies.findMoviesRatedByMe)
  .addGet(routes.movies.findById)
  .addGet(routes.movies.findMoviesByDateRange)
  .addGet(routes.movies.findMoviesByActor)
  .addGet(routes.movies.findByGenre)
  .addPost(routes.movies.rateMovie)
  .addDelete(routes.movies.deleteMovieRating)
  .addGet(routes.people.getBaconPeople)
  .addGet(routes.people.list)
  .addGet(routes.movies.findMoviesByWriter)
  .addGet(routes.movies.findMoviesbyDirector)
  .addGet(routes.people.findById);

// Configures the app's base path and api version.
console.log(nconf.get('base_url') + nconf.get('api_path'));
swagger.configure(nconf.get('base_url') + nconf.get('api_path'), "0.0.10");

// Routes

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/node_modules/neo4j-swagger-ui/dist/');
app.get(/^\/docs(\/.*)?$/, (req, res, next) => {
  if (req.url === '/docs') { 
    // express static barfs on root url w/o trailing slash
    res.writeHead(302, {'Location': req.url + '/'});
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

// redirect to /docs
app.get('/', (req, res) => {
  res.redirect('./docs');
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port') + ' see docs at /docs');
});