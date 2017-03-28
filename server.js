// ./mongod and mongo to run
//https://camper-api-project-codefay.c9users.io/google
// 56 gmail; 775 google
var express = require('express');
var app = express();
var path = require('path');
var Post = require('../urlshort/post.js');

var mongoose = require('mongoose');
var num;

mongoose.connect('mongodb://localhost/test');
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
                res.send(post.longURL);
                //res.redirect(post.longURL);
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
            res.send({ "original_URL":input, "short_url":"https://camper-api-project-codefay.c9users.io/" + num});
        });
        
        /*
        Post.find(function (err, posts) {
            if (err) return console.error(err);
            console.log(posts);
        });
        */
    }
    // https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

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
