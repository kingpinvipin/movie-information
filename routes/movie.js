var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    url = "mongodb://localhost:27017/";
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('home');
});
 
router.get('/search/:movie/:releaseyear?',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    var query = {movie:req.params.movie,releaseyear:parseInt(req.params.releaseyear)};
    if(!parseInt(req.params.releaseyear)) query = {movie:req.params.movie} ;
    dbo.collection("movies").find(query).toArray(function(err,movie){
      if(err) throw err;
      res.render('result',{movie:movie});
      db.close();
    });
  });

});

router.post('/search-result',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    var query = {movie:req.body.inputmovie,releaseyear:parseInt(req.body.inputyear)};
    dbo.collection('movies').find(query).toArray(function(err,movie){
      if(err) throw err ;
      res.render('result',{movie:movie});
      db.close();
    });
  });
});

router.get('/favourites',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    dbo.collection('favourites').find().toArray(function(err,result){
      if(err) throw err;
      res.render('favlist',{result:result});
      db.close();
    });
  });
});

router.get('/addtofav/:movie/:releaseyear/:rating/:review/:actor/:actress',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    var document = {movie:req.params.movie.slice(1),releaseyear:parseInt(req.params.releaseyear.slice(1)),rating:parseFloat(req.params.rating.slice(1))};
    dbo.collection('favourites').find(document).toArray(function(err,result){
      if(err) throw err;
      var msg ;
      if(result.length > 0) {
        msg = 'Already Added';
        res.render('done',{msg:msg});
      }else{
        var doc = {movie:req.params.movie.slice(1),releaseyear:parseInt(req.params.releaseyear.slice(1)),rating:parseFloat(req.params.rating.slice(1)),review:req.params.review.slice(1),actor:req.params.actor.slice(1),actress:req.params.actress.slice(1)};
        dbo.collection('favourites').insertOne(doc,function(error,result){
        if(error) throw error ;
        res.render('done',{msg:msg});
        });
      }
      db.close();
    });
  });
});

router.get('/delete/:movie/:releaseyear/:rating',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("mydb");
    var query = {movie:req.params.movie.slice(1),releaseyear:parseInt(req.params.releaseyear.slice(1)),rating:parseFloat(req.params.rating.slice(1))};
    dbo.collection('favourites').remove(query,function(err,result){
      if(err) throw err ;
      res.redirect('/favourites');
      db.close();
    });
  });
});

router.get('/top',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    dbo.collection('movies').find().sort({'rating':-1}).toArray(function(err,result){
      if(err) throw err;
      res.render('top',{result:result});
      db.close();
    });
  });
});

router.get('/byactor',function(req,res){
  res.render('actor');
});

router.get('/byactress',function(req,res){
  res.render('actress');
});

router.get('/actor/:aname',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    dbo.collection('movies').find({actor:req.params.aname.slice(1)}).toArray(function(error,result){
      if(error) throw error ;
      res.render('amlist',{result:result,aname:req.params.aname.slice(1),actor:1});
      db.close();
    });
  });
});

router.get('/actress/:aname',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    dbo.collection('movies').find({actress:req.params.aname.slice(1)}).toArray(function(error,result){
      if(error) throw error ;
      res.render('amlist',{result:result,aname:req.params.aname.slice(1),actor:0});
      db.close();
    });
  });
});

router.get('/sort/:type/:aname/:actor?',function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err) throw err ;
    var dbo = db.db("mydb");
    var type = req.params.type.slice(1),aname = req.params.aname.slice(1) ;
    var query = {actor:req.params.aname.slice(1)};
    var actor = 1 ;
    if(!req.params.actor) {
      query = {actress:req.params.aname.slice(1)} ;
      actor = 0 ;
    }
    var sort_style ;
    if(type == 'rating') sort_style = {'rating':-1};
    else sort_style = {'releaseyear':-1};
    dbo.collection('movies').find(query).sort(sort_style).toArray(function(error,result){
      if(error) throw error ;
      res.render('amlist',{result:result,aname:aname,actor:actor});
      db.close();
    });
  });
});

module.exports = router;
