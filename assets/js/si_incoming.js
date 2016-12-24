window.onload = function(){
    // User inputs
    var user_input = {
        url: 'upload-image',
        dropzone: '#target'
    }

  	var drop_zone = document.querySelector('#drop-overlay');
    var overlay = document.querySelectorAll('.overlay');
    var image_data = [];
    if( document.getElementById("si_upload_progress_cont") == null){
        var progressCont = document.createElement('div');
        progressCont.setAttribute('id', 'si_upload_progress_cont');
        progressCont.setAttribute('style', 'display:none; position:absolute; width: 200px; height: 100%; overflow-y: scroll; right: 0px; bottom: 0px;');
        document.querySelector(user_input.dropzone).appendChild(progressCont)
    }
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
    document.querySelector(user_input.dropzone).addEventListener('dragenter',function(e){
    		// e.preventDefault();
       	showOverlay();
    });
  
    drop_zone.addEventListener('dragover',function(e){
    		e.preventDefault();
    });
  
    drop_zone.addEventListener('drop',function(e){
        document.querySelector('#si_upload_progress_cont').style["display"] = "block";
    		e.preventDefault();
        var files = e.dataTransfer.files; //It returns a FileList object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                filename = file.name;
            if(file.type.match('image')){		                
                var _fileReader = new FileReader();
                _fileReader.onload = (function(file) {
                    return function(evt) {
                        // si_cookHTML(evt, file)
                        si_uploadAsync(evt, file)
                    };
                })(files[i]);
                _fileReader.readAsDataURL(files[i]);
            }
        }
        hideOverlay()
    });
  
    drop_zone.addEventListener('dragleave',function(e){
    		e.preventDefault();
        hideOverlay();
    });
  
    //------------------------------Asynchronous upload
    function si_uploadAsync(evt, file){
        var formdata = new FormData();
        formdata.append("file", file);
        var progressDOM = si_ProgressCook(file.name, file.size);
        var ajax = new XMLHttpRequest();
        ajax.upload.addEventListener("progress", (function(progressDOM){
            return function(event) {
                si_updateProgressStatus(event, progressDOM);
            };
        })(progressDOM), false);
        ajax.addEventListener("load", (function(progressDOM){
            return function(event){
                si_completeUpload(event, progressDOM);
            }
        })(progressDOM), false);
        ajax.addEventListener("error", (function(progressDOM){
            return function(event){
                si_uploadError(event, progressDOM);
            }
        })(progressDOM), false);
        ajax.addEventListener("abort", (function(progressDOM){
            return function(event){
                si_uploadAbort(event, progressDOM);
            }
        })(progressDOM), false);
        ajax.open("POST", user_input.url);
        ajax.send(formdata);
    }

    function si_updateProgressStatus(event, progressDOM){
        // _("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
        var percent = (event.loaded / event.total) * 100;
        progressDOM.percHndlr.innerHTML = Math.round(percent)+'%';
        progressDOM.progHndlr.style["width"] = Math.round(percent)+'%'; 
        // console.log("Uploaded "+event.loaded+" bytes of "+event.total+" Percent:"+Math.round(percent)+"% uploaded... please wait")
    }
    function si_completeUpload(event, progressDOM){
        progressDOM.progHndlr.style['background-color'] = '#40FF00';
        setTimeout(function(){
            progressDOM.thisUplod.parentNode.removeChild( progressDOM.thisUplod );
        },7000);
    }
    function si_uploadError(event, progressDOM){
      progressDOM.progHndlr.style['background-color'] = 'red';
        progressDOM.percHndlr.innerHTML = '<font color="red">FAILED!</font>';
        setTimeout(function(){
            progressDOM.thisUplod.parentNode.removeChild( progressDOM.thisUplod );
        },9000);
    }
    function si_uploadAbort(event, progressDOM){
        progressDOM.progHndlr.style['background-color'] = 'red';
        progressDOM.percHndlr.innerHTML = '<font color="red">ABORTED!</font>';
        setTimeout(function(){
            progressDOM.thisUplod.parentNode.removeChild( progressDOM.thisUplod );
        },9000);
    }
    function si_ProgressCook(filename, filesize){
        var ret = {};
        var _size = filesize;
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        i=0;while(_size>900){_size/=1024;i++;}
        var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];

        var perProg = document.createElement('div');
        perProg.setAttribute('class', 'si_eachUpld');
        perProg.setAttribute('style', 'padding: 10px 15px; background-color: #333; color: #f3f3f3; margin-bottom: 1px;');
            var small = document.createElement('small');
                var fnam = document.createElement('div');
                    fnam.setAttribute('style', 'overflow-x:hidden;')
                var prog = document.createElement('div');
                    prog.setAttribute('class', 'si_upload_progress');
                    prog.setAttribute('style', 'width: 0%; height: 2px; background-color: yellow; margin: 10px 0px;');
                
                var fsiz = document.createElement('div');
                var perc = document.createElement('div');

        fnam.innerHTML = filename;
        fsiz.innerHTML = exactSize;
        perc.innerHTML = '0%'; 
        ret['nameHndlr'] = fnam;
        ret['progHndlr'] = prog;
        ret['sizeHndlr'] = fsiz;
        ret['percHndlr'] = perc;
        ret['thisUplod'] = perProg

        small.appendChild(fnam);
        small.appendChild(fsiz);
        small.appendChild(prog);
        small.appendChild(perc);

        perProg.appendChild(small);
        document.querySelector('#si_upload_progress_cont').appendChild(perProg);
        return ret;
    }
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
