/**
 * @author Most code by Dan Mosedale.  Some pieces borrowed from popcorn.js and
 * rainbow example code.
 */
 
var instrPopcorn;
var singerPopcorn;

var snapshotOnlyMode = false;

function RecordingSession() {
  // avoid console whining if Rainbow isn't installed
  if ("service" in window.navigator) {
    this.mediaSvc = window.navigator.service.media;
  }
  
  if ("apps" in window.navigator) {
    this.apps = window.navigator.apps;
  }
  this.ctx = document.getElementById("singerCanvas").getContext("2d");
}
RecordingSession.prototype = {

  recording: null, // a file, after the recording has completed 
	running: false,
	startTime: -1,
  state: "uninitialized",
    
	startSession: function start() {

    // just in case a session was left running
    // YYY ask anant if this risks a crash
    try {
	   this.mediaSvc.endSession();
	  } catch (ex) {}
	  
    var self = this;

    function snapPhotoAndFinish() {
      var imageData = self.mediaSvc.fetchImage();
      self.stop();

      sendImageURL(imageData);
    }

    function onStateChange(state, args) {
      //console.log("state change called: state = " + state + ", args = " + args);
      this.state = state;

      switch (state) {
        case 'session-began':

          // the camera is warmed up, so we can allow the user to play
          
          if (snapshotOnlyMode) {
            $("#snapPhoto").button().click(snapPhotoAndFinish).show();
            $("#play").button().show().click(
              function() { instrPopcorn.volume(1).play();})            
          } else {
            $("#snapPhoto").hide(); // configure & show later during playback
            $("#record").button().show().click(onRecordClick);
          }
          break;
          
        case 'record-began':

          // save the time off so we can start playback at the same place
          self.startTime = instrPopcorn.currentTime();

          $("#recording").attr("checked", "checked");
          $("#recording").button("refresh");

          // start playing the instrumental
          instrPopcorn.volume(1).play();
          break;
          
        case 'record-ended':
          self.mediaSvc.endSession();
          break;
          
        case 'record-finished':
          // save this off so callers can use this
          self.recording = args.files.item(0);
          break;
          
        case 'error':
          // XXX maybe propagate this to the user
          break;
      }
    }
    
    this.session = this.mediaSvc.beginSession({width:320, height:240}, this.ctx, onStateChange);
  },

  startRecording: function rs_startRecording() {
    this.mediaSvc.beginRecording();
    this.running = true;
  },
  
	stop: function stop() {
    // this call is async; once the file is ready, the state change observer will be notified 

    switch (this.state) {
      case "record-began":
        this.mediaSvc.endRecording();
        break;
        
      case "record-ended":
        this.mediaSvc.endSession();
        break;
    }
    
    try {
      instrPopcorn.pause();
    } catch (ex) {}
    
    this.running = false;    
	} 
}

function fadeInIntroText() {
  $(".introText").animate({color: "white"}, 1000);		
}

function onInstrPlay() {
  // if the intro text is still around, fade it out
  $(".introText").animate({color: "black"}, 1000);
  $("#play").button("option", {label: "pause"});
  // XXX add pause symbol
}

function onInstrPause() {
  instrPopcorn.pause();

  // YYY is this right?
  $("#recording").removeAttr("checked");
  $("#recording").button("refresh");
}

function onRecordClick() {
  if (!recordingSession.running) {

    try {
      recordingSession.startRecording();
    } catch (ex) {
      console.log("exception starting recording session: " + ex);
    }

    $("#record").button("option", {label: "all done" });
    $("#record").addClass('done');
  
  } else {
    recordingSession.stop();

    // ditch the buttons until they're actually usable
    $("#record").hide();
    // YYY $("#snapPhoto").hide();
    // YYY $("#play").hide();
    
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

  $("#snapPhoto").button().show().click(pauseAndSnapPhotoFromPlayback);
  
  // and once the recording finishes, we stop playing the instrumental  
  singerPopcorn.listen("ended", function() {
    instrPopcorn.pause();
    $("#onAir").removeAttr("checked");
    $("#onAir").button("refresh");
  });

  instrPopcorn.play();
  singerPopcorn.play();

}

function pauseAndSnapPhotoFromPlayback() {
  console.log("called snapPhotoFromPlayback");

  singerPopcorn.pause();
  instrPopcorn.pause();

  var scratchCanvas = $("#scratchCanvas").get(0);
  var singerVideo = $("#singerVideo").get(0);
  var scratchContext = scratchCanvas.getContext("2d"); 
  scratchContext.drawImage(singerVideo, 0, 0, 320, 200);

  sendImageURL(scratchCanvas.toDataURL()); 
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

function setupOWAInstaller() {
  // XXX Remember to add script to add navigator.apps if it
  // doesn't already exist once we're registered appropriately.
  if (!("apps" in navigator)) {
    $("#install").hide();
    return;
  }
   
  navigator.apps.amInstalled(function(data) {
    console.log("data is", data);
    if (data) {
      $("#install").hide();
    }
  });
  
  $("#install").click(function() {

    navigator.apps.install({
      // XXX need to automate this so it will work from other installs too
      url: "http://localhost/s/theband/theband.webapp",
      onsuccess: function() {
        // XXX would be nice to provide visual feedback by giving hide a duration
        // but that's failing for reasons we don't want to debug now
        $("#install").hide();
      },
      onerror: function(wtf) {
        console.log("Installation failed:", wtf);
      }
    })
    return false;
  })
}

function sendImageURL(imageDataURL) {
  navigator.apps.invokeService("image.send",
    {
      data: imageDataURL.slice("data:image/png;base64,".length),
      // XXX hardcoded
      title: "Singing 'Oh When the Saints'",
      description: "with Jono and friends",
      contentType: "image/png"
    },
    function onSuccess(args) {
      console.log("success args: " + args);
        setTimeout(
          function () {
            // YYY hardcoded
            window.open("http://www.flickr.com/dmose/", "flickrWindow");
          }, 4000);
    },
    function onError() {
      console.log("error after invoking service");
    });
}

function setupSnapshotOnlyMode() {
  $("#indicatorLights").hide();
}

$(document).ready(function() {

  $("#indicatorLights").buttonset();

  setupOWAInstaller();
  
  if (snapshotOnlyMode) {
    setupSnapshotOnlyMode();
  }
  
  // hide buttons until they're ready to use
  $("#record").hide();
  $("#play").hide();
  $("#snapPhoto").hide();

  parseDataSourcesFromURL();

  setTimeout(fadeInIntroText, 2000);
  
  recordingSession = new RecordingSession();    
  recordingSession.startSession();
  
  instrPopcorn = Popcorn('#instrVideo');
  instrPopcorn.load();
  instrPopcorn.listen("play", onInstrPlay);
  instrPopcorn.listen("pause", onInstrPause);

  $("#playRecording").button().click(onPlayRecordingClick);
  
});

$(window).unload(function () {
  recordingSession.stop();
});
