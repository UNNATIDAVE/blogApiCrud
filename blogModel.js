// Including Mangoose
var mongoose = require('mongoose');

//Defining schema
var Schema = mongoose.Schema;

var blogSchema = new Schema({

	title 		:{type: String, default:'', required:true},
	subTitle 	: {type: String, default:''},
	blogBody 	: {type: String, default:''}, 
	tags		: [],
	created		: {type:Date},
	authorInfo	: {},
	comments	: {type: String, default:''}
});

mongoose.model('Blog',blogSchema);