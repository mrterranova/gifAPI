//global variables
let count = 17;
let array = [];
let badges = 15;
console.log(" If you solved it, you're exempt from guilt. If you came here for clues... cheater, cheater, pumpkin eater! You know who you are, cheater!");

//click event for the submit button (also functionality for press 'enter' key)
$("#inputForm").on("submit", function (event) {
  $("#giphyUpload").empty();
  event.preventDefault();
  var userWord = $("#userInput").val().trim();
  $("#userInput").val("");
  $("span").html(userWord);
  userWord = userWord.toLowerCase();
  array.push(userWord);

  //no duplicates for any pre-existing button
  duplicates = false;
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length; j++) {
      if (j != i && array[i] === array[j])
        duplicates = true;
    }
  }
  if (duplicates) {
    array.pop();
  } else {

    //creating a button based on no duplicate parameters
    $("#createBtns").append("<button class='newBtn' data-secret='" + userWord + "'>" + userWord + "</button>");
    
    //if user word is secret word reward them below. First three words are hints to secret theme.
    if (userWord === "star" || userWord ==="stars") {
      $(".hiddenBadges").prepend("<img class='badgeEarned' id='hidden1' src='assets/images/star.png'>");
      $("#clue").text("I’m quite hot-tempered and don’t like to share. I have many children around me, one of them is very rare. I never go out, but at times you cannot see me, I hold so much together, but if I die you will cease to be.");
      count--;
      $("#countDown").text(count);
    }
    if (userWord === "sun") {
      $(".hiddenBadges").prepend("<img class='badgeEarned' id='hidden2' src='assets/images/sun.png'>");
      $("#clue").text("I can be full, but i will never spill over. i disappear at times, but return i always will.");
      count--;
      $("#countDown").text(count);
    }
    if (userWord === "moon") {
      $(".hiddenBadges").prepend("<img class='badgeEarned' id='hidden3' src='assets/images/moon.png'>");
      $("#clue").html("You’ve become a whiz at space. Now find <span id='countDown'>15</span> of anything space related to see what happens (key words are not plural forms)!");
      count--;
      $("#countDown").text(count);
    }
    for (var i = 0; i < hiddenWords.length; i++) {
      if (userWord === hiddenWords[i]) {
        $("#clue").html("You’ve become a space whiz. Now find <span id='countDown'>15</span> common space words (no plural forms)!");
        count--;
        $("#countDown").text(count);
        if (count <=15) {
          $(".hiddenBadges").prepend("<img class='badgeEarned' id='hidden" + i + "' src='assets/images/" + hiddenWords[i] + ".png'>");
        }

        //hidden theme is now revealed here- changes css features
        if (count <= 0) {
          badges++
          $("#clue").text("Jumping Jupiter! You've unlocked the hidden theme!");
          $("#clue").css("color", "white");
          $(".wordImg").css("font-family", "MilkyWay");
          $(".wordImg").css("color", "white");
          $(".wordImg").css("opacity", "0.5");
          $(".hiddenBackgroundImage").css("opacity", "1");
          $(".hiddenBackground").css("opacity", "1");
          $("body").css("background-image", "none");
          $("body").css("background-color", "black");
          $(".whereBtn").css("background-color", "black");
          $(".whereBtn").css("opacity","0.5");
          $(".newBtn").css("background-color", "black");
          $(".newBtn").css("color", "white");
        }
      }
    }
  }

//website and key for giphy API
  var gifURL = "https://api.giphy.com/v1/gifs/search?q=" +
    userWord + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

  //API format allow user to see images based on g or pg rating and pull 10 (if 10 exist)
  $.ajax({
    url: gifURL,
    method: "GET"
  }).then(function (response) {
    var results = response.data;
    for (var i = 0; i < results.length; i++) {
      var ratings = results[i];
      if (ratings.rating === "g" || ratings.rating === "pg") {
        var still = ratings.images.fixed_height_still.url;
        var animate = ratings.images.fixed_height.url
        var secret = $('<img>');
        secretImage = secret.attr("data-state", "still");
        secretImage = secret.attr("data-still", still);
        secretImage = secret.attr("data-animate", animate);
        secretImage = secret.attr("src", still);
        secretImage = secret.attr("id", "eachGif");
        $("#giphyUpload").prepend(secretImage);
      }
    }


  });

});

//clear button clears all gifs at bottom
$("clearBtn").on("click", function () {
  $("#giphyUpload").remove();
});

//new buttons appear can now be clicked and go through same parameters as before. However instead of user word/value information has been stored in secret-data.
$("#createBtns").on("click", ".newBtn", function () {
  $("#giphyUpload").empty();
  var userWord = $("#userInput").val().trim();
  userData = $(this).attr("data-secret");
  $("#word").html(userData);

  var gifURL = "https://api.giphy.com/v1/gifs/search?q=" +
    userData + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

  $.ajax({
    url: gifURL,
    method: "GET"
  }).then(function (response) {
    var results = response.data;
    for (var i = 0; i < results.length; i++) {
      var ratings = results[i];
      if (ratings.rating === "g" || ratings.rating === "pg") {
        var secretImage = $('<img>').attr("class", "giphy");
        var secretImage = $('<img>').attr("src", ratings.images.fixed_height_still.url);
        var secret = secretImage.attr("id", "eachGif");
        $("#giphyUpload").prepend(secretImage);
      }
    }
  });
});

//ability to click on still gif and watch it animate
$("#giphyUpload").on("click", "#eachGif", function () {
  var state = $(this).attr("data-state");
  var still = $(this).attr("data-still");
  var animate = $(this).attr("data-animate");

  if (state === "still") {
    $(this).attr("src", animate);
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", still);
    $(this).attr("data-state", "still");
  }
});

//array of selected keyterms hidden at bottom in case there are any cheaters!
var hiddenWords = ["nebula", "mercury", "venus", "earth", "mars", "jupiter","saturn", "uranus", "neptune", "pluto", "rocket", "space",  "eclipse",  "meteor", "asteroid", "planet", "astronomy", "supernova", "spaceship", "astronaut", "orion", "telescope", "universe", "satellite", "alien", "apollo", "nasa"];