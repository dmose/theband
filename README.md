## The Band

An experiment in playing collaborate online music, with the first step being karaoke, video style.

#### Prerequisites

* If you don't already have it, get <a href="https://www.mozilla.com/en-US/firefox/RC/" target="_blank">Firefox 4.0 RC1 or later</a>
* Install the <a href="https://addons.mozilla.org/en-US/firefox/addon/mozilla-labs-rainbow/" target="_blank">Mozilla Labs Rainbow add-on, v.0.3.1 or later</a>.
* If you're on Mac (Snow Leopard in particular), after you've installed Rainbow and restarted, quit Firefox again.  Then, open Terminal.app, and type:

   `arch -i386 /Applications/Firefox.app/Contents/MacOS/firefox-bin`

* If you have problems along the way, review the [Rainbow README](http://github.com/mozilla/rainbow/blob/master/README), as there can be gotchas, including:

#### Demo Sites

* Open a new tab, and into the navigation (URL) bar, type

     `about:config`
     
* If necessary, click on the "I'll be careful, I promise" button
* In the upper left corner of the page, in the filter text box, type "rainbow"
* Double-click on the "extensions.rainbow.allowedDomains"
* At the beginning of the text field, right after the [ symbol, add 

    `"http://redpuma.net",
    
* Click the OK button
* The 'value' column of extensions.rainbow.allowedDomains should now read

    `"["http://redpuma.net","http://localhost","http://mozilla.github.com"]`
  
* Close the about:config tab

* Check out <a href="http://redpuma.net/software/theband/" target="_blank">the demo site</a>

#### Release notes
* The astute performer who "gets the band back together", will notice that the recordings of the instrumentalist and singer are currently out of sync; this is to due to a [known issue in Rainbow](https://github.com/mozilla/rainbow/issues#issue/5)
* If you're pulling a webm video file, be sure that your web server's mime.types file has the appropriate entry.

