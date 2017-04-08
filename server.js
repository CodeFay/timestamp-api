// ./mongod and mongo to run
//https://forum.freecodecamp.com/t/guide-for-using-mongodb-and-deploying-to-heroku/19347

var express = require('express');
var app = express();
var path = require('path');

var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    _id:  { type: Number },
    longURL: { type: String }
});

var Post = mongoose.model('Post', PostSchema);
var num;

//var url = 'mongodb://localhost/test';

console.log('mongolab_uri ' + process.env.MONGOLAB_URI);
var url = process.env.MONGOLAB_URI;
mongoose.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/*', function(req, res){
    var input = req.params[0];
    if (input.length < 5 && input < 1000)  { // this will be short URL action
        
        Post.findOne({ '_id': input }, function (err, post) {
            if (err) return console.error(err);
            
            if (post == null) { // if there is no match
                res.send('Short URL not in database');
            } else {
                console.log(post.longURL);
                //res.send(post.longURL);
                res.redirect(post.longURL);
            }
        });
        
    } else if (!isUrl(input)){
        res.send('Input URL not valid! Please re-enter');
    } else {
        
        num = Math.floor(Math.random() * 1000) + 1;
        new Post({
            _id: num,
            longURL: input
            }).save(function (err) {
            if (err) return console.error(err);
            res.send({ "original_URL":input, "short_url":"https://cfurl.herokuapp.com/" + num});
        });
        
        /*
        Post.find(function (err, posts) {
            if (err) return console.error(err);
            console.log(posts);
        });
        */
    }
});

// http://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
   return regexp.test(s);
}

//app.listen(8080);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

