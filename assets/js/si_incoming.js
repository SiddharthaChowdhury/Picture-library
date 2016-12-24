window.onload = function(){
  	var drop_zone = document.querySelector('#drop-overlay');
    var overlay = document.querySelectorAll('.overlay');
    var image_data = [];
    function hideOverlay(){
   		for(var i = 0; i< overlay.length; i++){
      		overlay[i].setAttribute('style','display:none;')
      }
    }
    function showOverlay(){
   		for(var i = 0; i< overlay.length; i++){
      		overlay[i].setAttribute('style','display:block;')
      }
    }
    document.querySelector('#target').addEventListener('dragenter',function(e){
    		// e.preventDefault();
       	showOverlay();
    });
  
    drop_zone.addEventListener('dragover',function(e){
    		e.preventDefault();
    });
  
    drop_zone.addEventListener('drop',function(e){
    		e.preventDefault();
        var files = e.dataTransfer.files; //It returns a FileList object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var file = files[i],
                filename = file.name;
            if(file.type.match('image')){		                
              var _fileReader = new FileReader();
              _fileReader.onload = (function(file) {
                return function(evt) {
                  si_cookHTML(evt, file)
                };
              })(files[i]);
              _fileReader.readAsDataURL(files[i]);
          }
        }
        hideOverlay()
    });
  
    drop_zone.addEventListener('dragleave',function(e){
    		e.preventDefault();
        hideOverlay()
    });
  
    //------------------------------ Dropped handling function
    function si_cookHTML(evt, file) {
  		// console.log(file)
  		var initial = {
  			"name": file.name,
  	        "size": file.size,
  	        "type": file.type,
  	        "data": evt.target.result
      	};
      	image_data.push(initial);
  		var img = new Image();
  		// var x = ''
  		img.onload = function(){
  			var x = img.height.toString() +' x '+img.width.toString()

  			var _size = file.size;
  	        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
  	        i=0;while(_size>900){_size/=1024;i++;}
  	        var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
  	        
  			img.setAttribute('class', 'si_thumbnailImg');
  			img.setAttribute('ondragstart', 'return false;');
  			var aTag = document.createElement('div');
  			aTag.setAttribute('class', 'si_thumbnailWrapper');
  			aTag.appendChild(img);

  			var overLay = document.createElement('div');
  			overLay.setAttribute('class', 'si_thumbnailOverlay');

  			var lay = '<div class="si_ThumbnailOverlayContent"><small>'+x+' &nbsp;&nbsp;'+exactSize+'</small></div>';
                  
              overLay.innerHTML = lay;
  			aTag.appendChild(overLay);
  	
  			document.querySelector('#result').appendChild(aTag)	
  		}
  		img.src = evt.target.result;
  	}
}
