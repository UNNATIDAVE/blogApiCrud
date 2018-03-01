var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// calling mongoose module
var mongoose = require('mongoose');


app.use(bodyParser.json({
	limit: '10mb',
	extended: true
}));

app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}));

//configuration of database

var dbPath = 'mongodb://localhost/myappdb';

//command to connect with db
db = mongoose.connect(dbpath);

mongoose.connection.once('open', function(){
	console.log("database connection open success");
});

//include the model file

var newBlog =require('blogModel.js');
var blogModel = mongoose.model('Blog');
//end include

//here are the routes
app.get('/', function(req, res){
		res.send("This is a blog application")
});

/////////// code for the route/////

//start  route to GET all Blogs

app.get('/blogs', function(req, res){

	blogModel.find(function(err, result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});		//end user model find
});

// end route to GET all blogs
// route to get a particuler blog
app.get('/blogd/:id', function(req, res){

	blogModel.findOne({'_id': req.params.id},function(err,result){

		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result)
		}
	});
});
// end route to get a particular blog

// start route to create a Blog

app.post('/blog/create', function(req,res){
	var newBlog = new blogModel({

		title	: req.body.title,
		subTitle	: req.body.subTitle,
		blogBody	: req.body.blogBody
	});

	//lets set the date of creation
	var today = Date.now();
	newBlog.created = today;

	//lets set the tags into array
	var allTags = (req.body.allTags!=undefined && req.body.alltags != null)	? req.body.alltags.split(',') : '';
		newBlog.tags = allTags;
		//let set the author information
		var authorInfo = {fullName: req.body.authorFullName, email: newBlog.authorInfo = authorInfo};

			//now lets save the file
			newBlog.save(function(error,result){
				if(error){
					console.log(error);
					res.send(error);
				}
				else{
					res.send(newBlog);
				}
			});
		
});


//start route to edit a blog using _id

app.put('/blogs/:id/edit', function(req,res){
	var update = req.body;

	blogModel.findOneAndUpdate({'_id': req.params.id}, update, function(req, res){
		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});

app.post('/blog/:id/delete', function(req,res){
	blogModel.remove({'_id':req.params.id},function(err,result){
		if(err){
			res.send(err)
		}
		else{
			res.send(result)
		}
	});
});
app.use(function(err, req, res, next) {

    console.log("Error handler used");
    //console.error(err.stack);

    if (res.status == 404) {
        res.send("Check your Path , Please refer Documentation for API Info");
    } else {
        res.send(err);
    }
});



app.listen(3000, function() {
    console.log('Blog app listening on port 3000!');
});