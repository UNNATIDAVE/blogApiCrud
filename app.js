var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');


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

var dbPath = 'mongodb://localhost/mydatabase';

//command to connect with db
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function(){
	console.log("database connection open success");
});

//include the model file

var newBlog =require('./blogModel.js');
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

app.post('/blog/create', function(req, res) {

    //to save info to schema
    var newBlog = new blogModel({

        title: req.body.title,
        subtitle: req.body.subtitle,
        blogBody: req.body.blogBody
    });
    var today = Date.now();
    newBlog.created = today;

    //to save author info
    newBlog.authorInfo = {
        authorName: req.body.name,
        authorEmail: req.body.email
    };

    //to split by , of all the tags
    newBlog.tags = (req.body.tags != undefined && req.body.tags != null) ? req.body.tags.split(',') : '';

    // save blog
    newBlog.save(function(err, result) {

        if (err) {
            //to check if error is due to unique title 
            if (err.errors.hasOwnProperty('title')) {
                if (err.errors.title.kind = "unique")
                    console.log(err);
            }
            res.send("Enter unique title ");
        } else
            res.send(newBlog);
    }); //end save blog

}); //end post request to create blog



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
//route for commenting on a blog.
app.post('/blog/comment/:id', function(req, res, next) {

    blogModel.findOne({
        '_id': req.params.id
    }, function(err, result) {

        if (err) {
            console.log(err);
            res.send("Check Your ID");
        } else {

            //if result is not null 
            if (result) {
                var ddate = new Date();
                timendate = ddate.toString();

                result.comments.push({
                    Name: req.body.commentorName,
                    comment: req.body.commentBody,
                    commentTime: timendate
                });

                //save comment
                result.save(function(err) {
                    if (err) {
                        console.log("Save comment erorr");
                        res.send(err);
                    } else
                        res.send(result);
                });
            } else {
                res.send("check Your ID");
                console.log("Id not avaialble in database");
            }
        }

    })
});

//function for any other path for get request i.e Error handler
app.get('*', function(request, response, next) {

    response.status = 404;
    next("Error Occured");
});

//function for any other path for put request i.e Error handler
app.put('*', function(request, response, next) {

    response.status = 404;
    next("Error Occured");
});

//function for any other path for post request i.e Error handler
app.post('*', function(request, response, next) {

    response.status = 404;
    next("Error Occured");
});

//Error handling Middleware 
//application level middleware
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