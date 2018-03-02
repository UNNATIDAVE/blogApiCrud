// including module
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

//////////// Calling Middlewares /////////////
var middleWares = require('./myMiddleware.js');

app.get('/normal/route', function(request, response){
	var dateOfBirth = new Date(request.query.dob);
	response.send("Your age is above 18. you can access this page. your age is:");
});

app.get('/restricted/route', middleWares.ageFilter, function(request, response){
	console.log("Code in route will be executed now");
	var dateOfBirth = new Date(request.query.dob);
	response.send("This is a restricted routes accessible to people above 18 years.");
});

////////// End of Middlewares //////////

//configuration of database
var dbPath = 'mongodb://localhost/mydb';

//command to connect with db
db = mongoose.connect(dbPath);

// to make connection
mongoose.connection.once('open', function(){
	console.log("database connection open success");
});

// the model file
var Blog =require('./blogModel.js');
var blogModel = mongoose.model('Blog');

/////////Here are the routes//////////

// First route for documentation/ first page
app.get('/', function(req, res){
		res.send(" Welcome to Blog Application Page\n -------Refer this Documentation for Blogs------ \n \n Use this base URL for Blogs- http://localhost:3000 \n And Additional URLs for CRUD Operations are as below \n \n 1) Method: 'GET'  Extra in URl: '/blogs'	 : to get all blogs, \n 2) Method: 'GET'  Extra in URl: '/blogs/:Id' :  to find particular blog, \n 3) Method: 'POST'  Extra in URl: '/blogs/create' :  to create a blog , \n 4) Method: 'PUT'  Extra in URl: '/blogs/:Id/edit' :  to edit a blog, \n 5) Method: 'POST'  Extra in URl: '/blogs/:Id/delete' :  to delete a blog, \n 6) Method: 'POST'  Extra in URl: '/blogs/:Id/comment' :  to comment on blog \n 7) Method: 'GET'  Extra in URl: '/normal/route' :  For checking the age using Middlewares \n 8) Method: 'GET'  Extra in URl: '/restricted/route' :  For checking the restricted age using Middlewares \n \n    Thank You! :)");
});
// End route for firdt page

// Second route to GET all Blogs

app.get('/blogs', function(req, res){

	blogModel.find(function(err, result){
		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result);
		}
	});		//end user model find
});			
// end route to GET all blogs

// Third route to get a particuler blog
app.get('/blogs/:id', function(req, res){

	blogModel.findOne({'_id': req.params.id},function(err,result){

		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});
// end route to get a particular blog

// Fourth route to create a Blog
app.post('/blogs/create', function(req,res){
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
// end route to create a blog

//Fifth route to edit a blog using _id
app.put('/blogs/:id/edit', function(req,res){
	var update = req.body;

	blogModel.findOneAndUpdate({'_id': req.params.id}, update, function(req, result){
			if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});
// end route to edit a blog

//Sixth route to delete a blog using _id
app.post('/blogs/:id/delete', function(req,res){
	blogModel.remove({'_id':req.params.id},function(err,result){
		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});
// end route to delete a blog

//Seventh route to comment on a blog using _id
app.post('/blog/:Id/comment', function(req, res) {

    blogModel.findOne({'_id': req.params.id}, function(err, result) {

        if (err) {
            console.log("some error");
            res.send("Check Your ID");
        } else {

            //result is not null 
            if (result) {
                
                result.comments.push({
                    Name: req.body.commentorName,
                    comment: req.body.commentBody,
                });

                //save comment
                result.save(function(err) {
                    if (err) {
                        console.log("Save comment erorr");
                        res.send(err);
                    } else
                        res.send(result);
                });
            } 
            else {
                res.send("check Your ID");
            }
        }

    })
});


//function for any other path for get request i.e Error handler
app.get('*', function(request, response) {

    response.status = 404;
    console.log("Error Occured. Please, Check your Path");
});

//function for any other path for put request i.e Error handler
app.put('*', function(request, response) {

    response.status = 404;
    console.log("Error Occured. Please, Check your Path");
});

//function for any other path for post request i.e Error handler
app.post('*', function(request, response) {

    response.status = 404;
    console.log("Error Occured. Please, Check your Path");
});

//Error handling Middleware 
//application level middleware
app.use(function(err, req, res) {

    console.log("Connection Closed");
    
    if (res.status == 404) {
        res.send("Check your Path OR refer Documentation for API Path Info");
    } else {
        res.send(err);
    }
});


app.listen(3000, function() {
    console.log('Blog app listening on port 3000!');
});