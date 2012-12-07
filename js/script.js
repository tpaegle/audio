// handling document ready and phonegap deviceready
window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);

// Phonegap is loaded and can be used
function onDeviceReady(){ 
	var play_btn = $('#play');
	var pause_btn = $('#pause');
	var stop_btn = $('#stop');
	var rewind_btn = $('#rewind');
	var record_btn = $('#record');
	
	play_btn.click(function(){
		playAudio("audio/sample.mp3");
		
		$(this).button('disable');
		pause_btn.button('enable');
	});
	
	pause_btn.click(function(){
		pauseAudio();
		
		$(this).button('disable');
		play_btn.button('enable');
	});
	
	stop_btn.click(function(){
		stopAudio();
		// reset slider
		$('#slider').val(0);
		$('#slider').slider('refresh');
		
	    pause_btn.button('disable');
		play_btn.button('enable');
	});
	
	rewind_btn.click(function(){
		stopAudio();
		playAudio("audio/sample.mp3");
		
	    play_btn.button('enable');
		pause_btn.button('disable');
	});
	
	record_btn.click(function(){
		stopAudio();
		$(this).button('disable');
		play_btn.button('enable');
		pause_btn.button('disable');
		
		var recsec = 10;
		recordAudio('record.mp3');
		var rectxt = setInterval(function(){
			var recording = $('#recording');
			if(recsec == 0) {
				clearInterval(rectxt);
				recording.text('Play recording');
				record_btn.button('enable');
				playAudio('record.mp3');
			} else {
				recording.text('Stop recording in ' + recsec + ' seconds' );
				--recsec;
			}
		},1000);
	});
}

/* Audio player */
var audio = null;
var audioTimer = null;
var pausePos = 0;

/* play audio file */
function playAudio(file){alert('test');
	audio = new Media(file, function(){ // success callback
    	console.log("playAudio():Audio Success");
    }, function(error){ // error callback
    	alert('code: '    + error.code    + '\n' + 
          	  'message: ' + error.message + '\n');
    });
    
    // get audio duration
    var duration = audio.getDuration();
    
    // set slider data
    if( duration > 0 ){
	    $('#slider').attr( 'max', Math.round(duration) );
	    $('#slider').slider('refresh');
    }
    
    // play audio
    audio.play();
    
    audio.seekTo(pausePos*1000);

    // update audio position every second
    if (audioTimer == null) {
        audioTimer = setInterval(function() {
            // get audio position
            audio.getCurrentPosition(
                function(position) { // get position success
                    if (position > -1) {
                        setAudioPosition(position);
                    }
                }, function(e) { // get position error
                    console.log("Error getting pos=" + e);
                    //setAudioPosition(duration);
                }
            );
        }, 1000);
    }
}

/* pause audio */
function pauseAudio() {
    if (audio) {
        audio.pause();
    }
}

/* stop audio */
function stopAudio() {
    if (audio) {
        audio.stop();
        audio.release();
    }
    clearInterval(audioTimer);
    audioTimer = null;
    pausePos = 0;
}

/* set audio position */
function setAudioPosition(position) {
	pausePos = position;
	position = Math.round(position);
    $('#slider').val(position);
    $('#slider').slider('refresh');
}

/* record audio file */
function recordAudio(file){
	audioRec = new Media(file, function(){ // success callback
    	console.log("recordAudio():Audio Success");
    }, function(error){ // error callback
    	alert('recording error : ' + error.message);
    });
    
    // start recording
    audioRec.startRecord();
    
    // stop recording after 10 seconds
    setTimeout(function(){
    	audioRec.stopRecord();
    	audioRec.release();
    }, 10000);
}
