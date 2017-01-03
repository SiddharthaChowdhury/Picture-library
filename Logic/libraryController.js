
var fs = require('fs');

module.exports = {
	
	renderLibraryView: function(req, res){
		res.render('index');
	},

	uploadImage: function(req, res){

		var allowedTypes = ['image/jpeg', 'image/png'];
		var allowedDir = '../../public/'; 
		req.file("file").upload({
	        saveAs:function(file, cb) {
		        var d = new Date();
		        var extension = file.filename.split('.').pop();
		          // seperate allowed and disallowed file types
		        if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
		        	res.status(400)
		           	return res.json({msg:'Error! attachment must be either .jpg or .png file! (attachment not saved)'});
		        }else if(file.size < 5242880){ // 5Megabits
		        	res.status(500)
		        	return res.json({msg: 'Image upload limit is maximum 5MB'});
		        }
		        else{
		            // save as allowed files
		            cb(null,allowedDir+"/"+file.filename);
		        }
	        }
	    },function whenDone(err,files){
	       	if (err) return res.serverError(err);
       		if( files.length > 0 ){
       			res.status(200);
       			return res.json({msg:"File saved", data: files});
       		}
	    }); 
	},
}