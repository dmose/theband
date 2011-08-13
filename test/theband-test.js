/*global module, S, test, equals, ok, console, expect*/
(function () { 
  module("Rainbow disabled", {
    setup: function() {
      S.open("../src/index.html?norainbow");
    }
  });

  // XXX check that this use of the ok(S()) idiom makes sense
  
  test("would-be singer sees expected page elements", function () {
    expect(4);

    ok(S("#instrVideo").visible().attr("preload", "auto"),
       "would-be singer sees auto-loaded video element");

    // XXX unfortunately, we have to say "should" become visible because there
    // doesn't yet appear to be a way to detect that it actually has.
    // FuncUnit and Syn want some media-specific loving, or a way to wait for
    // or access specific DOM properties (maybe there's some magic CSS
    // selector that can detect these things?)
    ok(S("#instrVideo").attr("controls", true).move({to: "#instrVideo"}),
       "when would-be singer hovers over instrumentalist video, controls should become visible as a tease");
    
    ok(S("#singerCanvas").invisible(), 
       "would-be singer does not see live video of themselves");

    ok(S("#getRainbowDiv").visible(), 
       "would-be singer sees a panel offering the chance to install rainbow");
    
    // XXX test clicking on button opens new tab (need a mock?)
    
  });
  
  module("OpenWebApps disabled", {
    setup: function() {
      S.open("../src/index.html?nowebapps");
    }
  });
  
  test("singer is not offered a link to install The Band", function () {
    expect(1);

    ok(S("#install").invisible(), "singer does not see a link");
  });
  
  module("All add-ons enabled", {
    setup: function() {
      // XXX check to see if app installed; get rid of it
      S.open("../src/index.html");
    },
    teardown: function() {
      // XXX be sure to uninstall the app here
    }
  });
  
  test("singer is offered a working link to install the band", function () {
    expect(1);
    
    ok(S("#install").visible().move({to: "#install"}).click(function () {
      console.log("link clicked, supposedly");
    }), "singer is offered working link click");
    
  });
   
  return;
  
  test("singer sees expected page elements", function () {
    expect(2);

    ok(S("#instrVideo").visible(), "#instrVideo is visible");
    // XXX hoist to function from disabled module

    // XXX ok(S("#instrVideo").attr("controls", false), 
    //         "#instrVideo controls disabled");
   
    ok(S("#singerCanvas").visible(), 
       "singer sees a box with live video of themselves");
    // XXX description wrong
         
  });

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
  
})();
