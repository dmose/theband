/*global module, S, test, equals, ok */
module("TheBand", {
  setup: function() {
    S.open("../src/index.html");
  }
});


test("Do Things Look OK?", function doThingsLookOk() {
  S('#instrVideo').visible(function(){
    ok(true,"instrVideo elements is visible");
    });
  
});


// XXX test that w/o rainbow installed, contains link to install

// XXX test that w/ rainbow installed, recording has started

// XXX test that pressing record
//    starts video & lyrics, lights up RECORDING lamp, changes text
//    in button to "all done"

// XXX test that pressing all done
//     stops both play and recording
//     does proper transition
//     ends with "get the band back together" button

// XXX test pressing "get the band back together" button
//     plays both videos
//     sets up "play it again sam" button
//     sets up "pause for a photo"

// XXX test plays well with openwebapps
//     "pressing pasue for a photo" does something approriate
