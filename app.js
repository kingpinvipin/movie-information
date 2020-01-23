var express = require('express'),
    app = express(),
    path = require('path'),
    movies = require('./routes/movie'),
    bodyparser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    validator = require('express-validator'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('express-flash') ;
    multer = require('multer');
    upload = multer();
    url = "mongodb://localhost:27017"; 

app.set('views', path.join(__dirname, 'views')) ;
app.set('view engine', 'ejs');
    
var middleware = [
    express.static(path.join(__dirname, 'public')),
    bodyparser.urlencoded({ extended: true }), 
    cookieParser(), 
    bodyparser.json(), 
    upload.array(),
    session({
      secret: 'super-secret-key',
      key: 'super-secret-cookie', 
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    }),
    flash()
] ;

app.use(middleware) ;
app.use('/',movies);

app.use(function(req, res, next) {  
  res.status(404).send("Sorry can't find that!") ;
}) ;

app.use(function(err, req, res, next){
  console.error(err.stack) ;
  res.status(500).send('Something broke!') ;
}) ;

app.listen(3000,function() {
  console.log('listening at port 3000') ;
}) ;  
    

