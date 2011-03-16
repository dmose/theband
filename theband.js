/**
 * @author Most code by Dan Mosedale.  Some pieces borrowed from popcorn.js and
 * rainbow example code.
 */
 
"strict";

var instrPopcorn;
var singerPopcorn;
var recorder;
var recordButton;
 
function RecordingSession() {
}
RecordingSession.prototype = {

  recording: null, // a file, after the recording has completed 
	running: false,
	startTime: 0,
    	
	start: function start() {

  	// stop any existing recording
  	recorder.stop();

    // start playing the instrumental
    instrPopcorn.volume(1).play();

    $("#recording").attr("checked", "checked");
    $("#recording").button("refresh");

   	// start recording
   	recorder.start();

    this.running = true;

    // save the time off so we can start playback at the same place
    this.startTime = instrPopcorn.currentTime();
	}, 
	
	stop: function stop() {
    this.recording = recorder.stop();
		instrPopcorn.pause();

    this.running = false;
	}, 
	
	toggle: function toggle() {
		if (this.running) {
			this.stop();
		} else {
			this.start();
		}
	}
}

function Recorder() {
    // avoid console whining if Rainbow isn't installed
    if ("service" in window.navigator) {
	  this.mediaSvc = window.navigator.service.media;
	}
	this.ctx = document.getElementById("singerCanvas").getContext("2d");
}
Recorder.prototype = {
	
	isRecording: false,

	start: function start() {
		this.stream = this.mediaSvc.recordToFile({width:320, height:240}, this.ctx);
		this.isRecording = true;
	},
	
  // returns a DOM File object
  stop: function stop() {
	  var recordedFile;
		if ("stream" in this) {
      try {
		    recordedFile = this.stream.stop().files.item(0);
		  } catch (ex) {} // no whining if there's nothing to stop
		}
		this.isRecording = false;
    if (recordedFile) return recordedFile;
    return;
	},

	toggle: function toggle() {
		if (this.isRecording) {
			this.stop();
		} else {
			this.start();
		}
	}
} 

function fadeInIntroText() {
  $(".introText").animate({color: "white"}, 1000);		
}

function onInstrPlay() {

  // if the intro text is still around, fade it out
  $(".introText").animate({color: "black"}, 1000);

  // start recording a throwaway track just so that the camera provides
  // feedback for the singer to practice...
  recorder.start();
}

function onInstrPause() {

  $("#recording").removeAttr("checked");
  $("#recording").button("refresh");
  
  recorder.stop();
}

function onRecordClick() {
  if (!recordingSession.running) {

    recordingSession.start();

    $("#record").button("option", {label: "all done" });

  } else {
    recordingSession.stop();

    // ditch the button
    $("#record").hide();

    // turn off the subtitles; we don't want them now or during subsequent playback
    document.querySelector("body:last-child").lastChild.style.display = "none";

    // fade the whole container
    $("#container").fadeTo(3000, 0.33);
    $("#endPrompter").show(1000);
  }
}

function onPlayRecordingClick() {

  // we're broadcasting!
  $("#onAir").attr("checked", "checked");
  $("#onAir").button("refresh");

  $("#endPrompter").hide()

  // fade back in
  $("#container").fadeTo("fast", 1.0);
  
  
  // replace the recording <canvas> with the Porcorny <video> of the recording
  var singerDataUrl = window.URL.createObjectURL(recordingSession.recording);
  $("#singerSource").attr("src", singerDataUrl);
  $("#singerCanvas").hide();  
  $("#singerVideo").show();
  singerPopcorn = Popcorn("#singerVideo")
  singerPopcorn.load(); 
    
  // be sure that we start playing the instrumental at the time that the
  // recording started
  instrPopcorn.currentTime(recordingSession.startTime);
  
  // and once the recording finishes, we stop playing the instrumental  
  singerPopcorn.listen("ended", function() {
    instrPopcorn.pause();
    $("#onAir").removeAttr("checked");
    $("#onAir").button("refresh");
  });

  instrPopcorn.play();
  singerPopcorn.play(); 
}

// XXX should sanitize
function parseDataSourcesFromURL() {
  
  // some defaults  
  var lyricsURL = "data/when-the-saints.sbv";
  var videoURL = "data/when-the-saints.webm";

  if (location.search.length) {  
    var params = location.search.slice(1).split("&");
    for (var i = 0 ; i < params.length; ++i) {

      var param = params[i].split("=");

      switch (param[0]) {
        case "videoURL": 
          videoURL = decodeURIComponent(param[1]);
          break;

        case "lyricsURL":
          var lyricsURL = decodeURIComponent(param[1]);
          break;
      } 
    }
  }

  $("#instrVideo").attr("data-timeline-sources", lyricsURL);        
  $("#instrVideoSource").attr("src", videoURL);
}

$(document).ready(function() {
  
  $("#record").button().click(onRecordClick);

  parseDataSourcesFromURL();

  setTimeout(fadeInIntroText, 2000);
  
  $("#indicatorLights").buttonset();
  
  recorder = new Recorder();
  
  instrPopcorn = Popcorn('#instrVideo');
  instrPopcorn.load();
  instrPopcorn.listen("play", onInstrPlay);
  instrPopcorn.listen("pause", onInstrPause);

  recordingSession = new RecordingSession();  
  
  $("#playRecording").button().click(onPlayRecordingClick);
  
});

$(window).unload(function () {
	// recordButton.stop();
	recorder.stop();
});

