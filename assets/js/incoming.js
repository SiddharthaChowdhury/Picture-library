

function Incoming(conf){
	this.dropArea = conf.dropArea;
	this.uploadURL = conf.uploadURL;
	this.fileTypes = conf.fileTypes; // array
	this.uploadProgress = conf.uploadProgress;
	// this.init();
}


Incoming.prototype.start = function(){
	alert();
}

var x = new Incoming({
	dropArea : "conf.dropArea",
	uploadURL : "conf.uploadURL",
	fileTypes : "conf.fileTypes",
	uploadProgress : "conf.uploadProgres",
});
x.start();