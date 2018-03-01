// including Mangoose
var mongoose = require('mongoose');

//defining schema
var Schema = mongoose.Schema;

var blogSchema = new Schema({

	//blogId		: {type: String, default: ''} , 
	title 		:{type: String, default:'', required:true},
	subTitle 	: {type: String, default:''},
	blogBody 	: [], 
	tags		: [],
	created		: {type:Date},
	authorInfo	: {},
	comments	: []
});

mongoose.model('Blog',blogSchema);