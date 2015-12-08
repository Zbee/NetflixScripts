/* global jQuery */
/* global netflix */
/* global $ */

//Designed to run in the javascript console

//Does not currently support using two accounts
//Will probably have to be an extension or tampermonkey snippet

//Open page: https://netflix.com/browse/my-list - Netflix will normalize the URL

//Include jQuery
var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-1.11.0.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

//Function to run after jQuery is loaded
var run = function () {
  //Create list of items in your list
  var list = [];
  $(".smallTitleCard").each(function() {
    list.push("/title/" + $(this).attr("data-reactid").split("title_")[1].split("_")[0]);
  });
  
  //Open up each page
  var done = [];
  list.forEach(function(e) {
    if (done.indexOf(e) == -1) {
      $.get(e, function(page) {
        //Load the HTML
        var $html = $('<div/>').html(page).contents()
        //Get the title
        //var title = $html.find("h1").text() != "" ? $html.find("h1").text() : $html.find("h1 img").attr("alt");
        //Check if the title is on your list
        var added = $html.find(".icon-button-mylist-added").length == 1 ? true : false;
        //Add the item to your list if it's not there
        if (added == false) {
          //URL to post request to
          var url = netflix.contextData.player.data.config.ui.initParams.apiUrl + "/playlistop";
          //Data for add to my list request
          var request = {
            operation: "add",
            authURL: parseInt(netflix.reactContext.contextData.userInfo.data.authURL),
            trackId: parseInt($html.find(".playLink").attr("href").split("trackId=")[1].split("&")[0]),
            videoId: parseInt(e.split("e/")[1])
          };
          var json = JSON.stringify(request);
          //Actually submit the request
          $.ajax({
            url: url,
            type: "POST",
            data: json,
            dataType: "json",
            contentType: "application/json",
            complete: function(res) {
              console.log(res);
            }
          });
        }
        done.push(e);
      }, "html");
    }
  });
};

//Waiting for jQuery
var waitForJQ = function() {
  if (typeof jQuery != "undefined") {
    run()
  } else {
    console.log("jQuery not yet loaded");
    window.setTimeout(waitForJQ, 1000);
  }
}; 
waitForJQ();
