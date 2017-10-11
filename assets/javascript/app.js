/*  
    Lunch Date app javascript
*/

$(document).ready(function() {

/* 
    Mapbox Places API -------------------
*/
  var access_token = 'pk.eyJ1IjoibWFodGFiMTIiLCJhIjoiY2o4ZXppdDRrMTh0dTMzbXNjY3NoMnN0OCJ9.6jXHANiUibQbeXNIljgFUQ';
  var userAddress = '';
  var userLatitude = '';
  var userLongitude = '';
  var locationQueryURLBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  function runLocationQuery(locationQueryURL) {
          // console.log(locationQueryURLBase);

    $.ajax({
      url: locationQueryURL,
      method: 'GET'
    }).done(function(locationData) {     

      userLongitude = locationData.features[0].center[0];
      userLatitude = locationData.features[0].center[1];
      console.log(userLongitude);
      console.log(userLatitude);
      console.log("------------");

    });

  };

  // Runs location conversion from street address to lat/long
  $('#location-btn').on('click', function(event) {
    event.preventDefault();

    $('#display-latlong').empty();

    userAddress = $('#location').val().trim();
         console.log(userAddress);

    userAddress = encodeURIComponent(userAddress);

    var locationQueryURL = locationQueryURLBase + '/' + '&place_name=' + userAddress + '.json?access_token=' + access_token;

    runLocationQuery(locationQueryURL);

    $("#cuisine-choice").show();
  });

/* 
    Zomato API -------------------
*/
  var apiKey = '9d1904342e147305e39dc198de1e915c';

  var searchCuisine = '';
  var searchRadius = '400';
  var numResults = '5';
  var resultCounter = 0;

  var restaurantQueryURLBase = "https://developers.zomato.com/api/v2.1/search?apikey=" + apiKey;

  function runRestaurantQuery(numResults, restaurantQueryURL) {

    $.ajax({
      url: restaurantQueryURL,
      method: 'GET'
    }).done(function(zomatoData) {

      console.log('restaurantQueryURL: ' + restaurantQueryURL);

      // Loop through and provide the correct number of results
      for (var i = 0; i < numResults; i++) {

        resultCounter++;

        // Create variables for data sought, and log results
        var restaurantName = zomatoData.restaurants[i].restaurant.name;
        var restaurantAddress = zomatoData.restaurants[i].restaurant.location.address;
        var restaurantAggRating = zomatoData.restaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantMenu = zomatoData.restaurants[i].restaurant.menu_url;
        var restaurantThumb = zomatoData.restaurants[i].restaurant.thumb;

        // Write results to page 
        var resultSection = $('<div>');
        resultSection.addClass('restaurant');
        resultSection.attr('id', 'result-' + resultCounter);
        $('#results-section').append(resultSection);

        // Confirm that the specific JSON for the result isn't missing any details
        if (restaurantThumb !== 'null') {
          $('#result-' + resultCounter)
            .append('<div class="restaurant-thumb"><img src="'+ restaurantThumb + '"></div>');
        }
        if (restaurantName !== 'null') {
          $('#result-' + resultCounter)
            .append(
              '<h3 class="articleHeadline"><span class="label label-primary">' +
              resultCounter + '</span><strong> ' +
              restaurantName + '</strong></h3>'
            );
        }
        if (restaurantAddress !== 'null') {
          $('#result-' + resultCounter)
            .append('<h5> '+ restaurantAddress + '</h5>');
        }

        // Then display the remaining fields
        $('#result-' + resultCounter)
          .append('<h5>Rating: ' + restaurantAggRating + ' | <a href="' + restaurantMenu + '" target="_blank">Menu</a></h5>');

      }

    });

  }

  // Runs Zomato search
  $("#search-cuisine").on("change", function(event) {
    event.preventDefault();

    resultCounter = 0;

    // Empties the previous results
    $('#results-section').empty();

    searchCuisine = $('#search-cuisine').val();
    
      console.log(userLongitude);
      console.log(userLatitude);

    var restaurantQueryURL = restaurantQueryURLBase + '&lat=' + userLatitude + '&lon=' + userLongitude + '&cuisines=' + searchCuisine + '&radius=' + searchRadius + '&count=' + numResults;

    runRestaurantQuery(numResults, restaurantQueryURL);

    $("#restaurant-lists").show();
    $("#direction-row").show();
  });

/* 
    Mapbox Directions API -------------------
*/
  // var userAddress = '';
  // var userLat = '';
  // var userLon = '';
  var restAddress = '';
  var restLat = '';
  var restLon = '';
  var steps = true;
  var stepCount = 1;

  var directionsQueryURLBase = 'https://api.mapbox.com/directions/v5/mapbox/walking/';

  function runDirectionsQuery(directionsQueryURL) {

    $.ajax({
      url: directionsQueryURL,
      method: 'GET'
    }).done(function(directionData) {  
        // console.log(directionData);

      stepsLength = directionData.routes[0].legs[0].steps.length;
        //console.log('stepsLength: ' + stepsLength);

      for (i = 0; i < stepsLength; i++) {

        userDirection = directionData.routes[0].legs[0].steps[i].maneuver.instruction;
        
        $('#display-direction').append('<p><span class="label label-primary">' +
          stepCount + '</span> ' + userDirection + '</p>');

        stepCount++;

      }

      $('#display-direction').append('<p><strong>Enjoy your lunch date!</strong></p>');
        
      $('#display-directions').show();

    });
  };

  $('#directions-btn').on('click', function(event) {
    event.preventDefault();

    $('#display-direction').empty();

    userLat = $('#user-lat').val().trim();
      console.log(userLat);
    userLon = $('#user-lon').val().trim();
      console.log(userLon);

    restLat = $('#rest-lat').val().trim();
      console.log(restLat);
    restLon = $('#rest-lon').val().trim();
      console.log(restLon);

    //userAddress = encodeURIComponent(userAddress);
    
    // https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78;-77.03,38.91?steps=true&alternatives=true&access_token=your-access-token
    directionsQueryURL = directionsQueryURLBase + userLon + ',' + userLat + 
      ';' + restLon + ',' + restLat + 
      '?access_token=' + access_token + '&steps=' + steps;

      // console.log(queryURL);

    // $('#display-directions').append('Click to see directions JSON: <a href="' + queryURL + '" target="_blank">https://api.mapbox.com/directions/v5/mapbox/walking/...</a>');

    runDirectionsQuery(directionsQueryURL);
  });

/* 
    Chat -------------------
*/

  // Chat header behavior
  var closedHeight = 48;
  var openHeight = 170;
  $('#chat-heading').on('click', function(event) {
    footerHeight = $(this).closest('.footer').outerHeight();
    if (footerHeight !== openHeight) {
      $('.footer').css('height', openHeight);
      $('.container').css('margin-bottom', openHeight);
      $(this).attr('title', 'Click to close chat');
      $(this).toggleClass('collapsed');
    } else {
      $('.footer').css('height', closedHeight);
      $('.container').css('margin-bottom', closedHeight);
      $(this).attr('title', 'Click to open chat');
      $(this).toggleClass('collapsed');
    }
  });
  // Initialize Firebase for Chat
  var config = {
    apiKey: "AIzaSyACuYdpSh6e2wKU0XFX2Cc60C88e_oVKck",
    authDomain: "lunch-date-14315.firebaseapp.com",
    databaseURL: "https://lunch-date-14315.firebaseio.com",
    projectId: "lunch-date-14315",
    storageBucket: "",
    messagingSenderId: "759801042798"
  };
  firebase.initializeApp(config);

  var database =  firebase.database();
  var playersRef = database.ref('/players');
  var chatRef = database.ref('/chat');

  var playerId = 0;
  var playerSet = false;
  var name = '';

  // Chat listeners
  chatRef.on('child_removed', function(chatSnapshot) {
    $('#chat-area').empty();
    $('#chat-area').html('The other player has disconnected.');
    setTimeout(function() {
      $('#chat-area').empty();
    }, 3000);
  });
  chatRef.on('child_added', function(chatSnapshot) {

    if (playerSet) {
      if (chatSnapshot.val()) {

        var chatPlayer = chatSnapshot.val().playerId; 
        var chatName = chatSnapshot.val().name; 
        var chatMessage = chatSnapshot.val().message;
        var newChat = $('<p>')
          .addClass('playerid-' + chatPlayer)
          .html('<span class="chat-name">' + chatName + ':</span> ' + chatMessage);
        $('#chat-area').append(newChat);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
      }
    }

  }, function(errorObject) {
    console.log("The chat read failed: " + errorObject.code);
  });

  // User listener
  playersRef.on('value', function(playersSnapshot) {
    var playersNum = playersSnapshot.numChildren();

    if (!playerSet) {
      if (playersSnapshot.child('1').exists()) {
        playerId = 2;
      } else {
        playerId = 1;
      }
    }

  }, function(errorObject) {
    console.log("The player read failed: " + errorObject.code);
  });


  function writeChatData(playerId, name, message) {
    firebase.database().ref('chat').push({
      playerId: playerId,
      name: name,
      message: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }

  function writeUserData(playerId, name) {
    firebase.database().ref('players/' + playerId).set({
      name: name
    });
  }

  // Chat send button
  $('#send-button').on('click', function() {

    if (playerSet) {

      // Do nothing if no message entered
      if ($('#chat-entry').val() !== '') {

        message = $('#chat-entry').val().trim();

        // Clear previous message
        $('#chat-entry').val('');

        writeChatData(playerId, name, message);

        chatRef.onDisconnect().remove();

      }
    }
  });

  // User start button, for enter name
  $('#start-button').on('click', function() {

    playerSet = true;

    name = $('#enter-name').val().trim();
      console.log(name);

    // Hide start/name element & show chat elements
    $('#start-chat').hide();
    $('#chat-wrapper').show();
    $('#player-name').text(name);
    $('#player-number').text(playerId);
    $('#player-info, #player-id').show();

    // Clear previous name value in input
    $('#enter-name').val('');

    writeUserData(playerId, name);

    playerRef = playersRef.child(playerId);
    playerRef.onDisconnect().remove();
  });

});
