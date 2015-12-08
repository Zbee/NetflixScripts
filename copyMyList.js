/* global jQuery */
/* global netflix */
/* global $ */

//Open page: https://netflix.com/browse/my-list - Netflix will normalize the URL
//Select your profile
//Now open netflix in a new tab
//Sign out of your old netflix account
//Sign into your new netflix account
//Switch back to the netflix tab with your old account's list pulled up
//Press ctrl+shift+i
//Paste the jQuery code in the console, press enter
//Paste the rest of the code, press enter
//Enjoy your new netflix account with all of your saved titles

//Include jQuery (run this snippet by itself, or run all of the code twice)
var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-1.11.0.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

//Create list of items in your list
var list = [];
$(".smallTitleCard").each(function() {
  list.push("/title/" + $(this).attr("data-reactid").split("title_")[1].split("_")[0]);
});

//Reverse list so that the list is added in the correct order
list = list.reverse();

//Open up each page
var done = [];
list.forEach(function(e) {
  if (done.indexOf(e) == -1) {
    $.get(e, function(page) {
      //Load the HTML
      var $html = $('<div/>').html(page).contents();
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
