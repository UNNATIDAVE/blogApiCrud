function ageCalculater(dateOfBirth){
	
	var today = new Date();
	var birthdate = new Date(dateOfBirth);
	var age = today.getFullYear()- birthdate.getFullYear();
	var month = today.getMonth() - birthdate.getMonth();
	if(month<0 || (month===0 && today.getDate() - birthdate.getDate())){
		age--;
	}
	
	return age;
}

exports.ageFilter = function(req, res, next){

	var age= ageCalculater(req.query.dob);
	console.log(age);
	
	if(age >= 18){
		console.log("Age is ok.");
		next();
	}
	else{
		res.send("Your age is under 18. You are not allowed to access this link.");
	}
};
