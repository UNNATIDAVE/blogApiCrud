// including module	
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const middleWares = require('./myMiddleware.js');

// the model file
const Blog = require('./blogModel.js');

// calling mongoose module
const mongoose = require('mongoose');



//configuration of database
let dbPath = 'mongodb://127.0.0.1:27017/mydb';

app.use(bodyParser.json({
	limit: '10mb',
	extended: true
}));

app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}));


//command to connect with db	
db = mongoose.connect(dbPath);

// to make connection
mongoose.connection.once('open', () => {
	console.log("database connection open success");
});

const blogModel = mongoose.model('Blog');

/////////Here are the routes//////////

// First route for documentation. first page
// app.get('/', (req, res)=> {
// 	return res.send(" Welcome to Blog Application Page\n -------Refer this Documentation for Blogs------ \n \n Use this base URL for Blogs- http://localhost:3000 \n And Additional URLs for CRUD Operations are as below \n \n 1) Method: 'GET'  Extra in URl: '/blogs'	 : to get all blogs, \n 2) Method: 'GET'  Extra in URl: '/blogs/:Id' :  to find particular blog, \n 3) Method: 'POST'  Extra in URl: '/blogs/create' :  to create a blog , \n 4) Method: 'PUT'  Extra in URl: '/blogs/:Id/edit' :  to edit a blog, \n 5) Method: 'POST'  Extra in URl: '/blogs/:Id/delete' :  to delete a blog, \n 6) Method: 'POST'  Extra in URl: '/blogs/:Id/comment' :  to comment on blog \n 7) Method: 'GET'  Extra in URl: '/normal/route' :  For checking the age using Middlewares \n 8) Method: 'GET'  Extra in URl: '/restricted/route' :  For checking the restricted age using Middlewares \n \n    Thank You! :)");
// });
// End route for first page

// Second route to GET all Blogs

app.get('/', (req, res) => {

	blogModel.find().then(result => {
		if (!result) {
			return res.status(400).send(err);
		}
		return res.status(200).send(result);
	});		//end user model find
});
// end route to GET all blogs

// Third route to get a particuler blog
app.get('/blogs/:id', (req, res) => {

	blogModel.findOne({ '_id': req.params.id }).then(blog => {
		if (!blog) {
			return res.status(400).send(err);
		}
		return res.status(200).send(blog);
	})
		.catch(err => {
			return res.status(500).send(err);
		});
});
// end route to get a particular blog

// Fourth route to create a Blog
app.post('/blogs/create', middleWares.ageFilter, (req, res) => {
	const newBlog = new blogModel({
		title: req.body.title,
		subTitle: req.body.subTitle,
		blogBody: req.body.blogBody
	});

	//lets set the date of creation
	let today = Date.now();
	newBlog.created = today;

	//lets set the tags into array
	let allTags = (req.body.allTags != undefined && req.body.alltags != null) ? req.body.alltags.split(',') : '';
	newBlog.tags = allTags;

	//let set the author information
	let authorInfo = { fullName: req.body.fullName, email: req.body.email };
	newBlog.authorInfo = authorInfo;

	//now lets save the file
	newBlog.save().then((savedBlog) => {
		if (!savedBlog) {
			return res.status(400).send(error);
		}
			return res.status(200).send(savedBlog);
	}).catch(err => {
		return res.status(500).send(err);
	});
});
// end route to create a blog

//Fifth route to edit a blog using _id
app.put('/blogs/:id/edit', middleWares.ageFilter, (req, res) => {
	let update = req.body;

	blogModel.findOneAndUpdate({ '_id': req.params.id }, update).then(result => {
		if (!result) {
			return res.status(400).send(err);
		}
		return res.status(200).send(result);
	}).catch(err => {
		return res.status(500).send(err);
	});
});
// end route to edit a blog

//Sixth route to delete a blog using _id
app.post('/blogs/:id/delete', middleWares.ageFilter, (req, res) => {
	blogModel.findByIdAndDelete({ '_id': req.params.id }).then(result => {
		if (!result) {
			return res.status(400).send(err);
		}
		return res.status(200).send(result);
	}).catch(err => {
		return res.status(500).send(err);
	});
});
// end route to delete a blog

//Seventh route to comment on a blog using _id
app.post('/blog/:id/comment', middleWares.ageFilter, (req, res) => {
	blogModel.findOne({ '_id': req.params.id }).then(result => {
		if (!result) {
			return res.status(400).json({ error: "Check Your ID" });
		}
		result.comments.push({
			Name: req.body.commentorName,
			comment: req.body.commentBody,
		});

		//save comment
		result.save().then(err => {
			if (err) {
				return res.status(400).send(err);
			}
			return res.status(200).send(result);
		});
	}).catch(err => {
		return res.status(500).send(err);
	});
});

app.listen(3000, () => { console.log('Blog app listening on port 3000!'); });