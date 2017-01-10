
var fs = require('fs');

module.exports = {
	
	renderLibraryView: function(req, res){
		res.render('index');
	},

	uploadImage: function(req, res){

		var allowedTypes = ['image/jpeg', 'image/png'];
		var allowedDir = '../../public/'; 

		// Using skipper
		req.file("file").upload({
	        saveAs:function(file, cb) {

		        if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
		        	res.status(400)
		           	return res.json({msg:'Error! attachment must be either .jpg or .png file! (attachment not saved)'});
		        }
		        
		        if(file.byteCount > 5242880){ // 5Megabits
		        	res.status(400)
		        	return res.json({msg: 'Image upload limit is maximum 5MB'});
		        }

		        else
		            cb(null,allowedDir+"/"+file.filename);
		        
	        }
	    },function whenDone(err,files){
	       	if (err) return res.serverError(err);
       		if( files.length > 0 ){
       			res.status(200);
       			return res.json({msg:"File saved", data: files});
       		}
       		else{
       			res.status(404);
       			return res.json({msg:"File was not uploaded", data: files});
       		}
	    }); 
	},
}