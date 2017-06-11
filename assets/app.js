// Initialize Firebase
var config = {
    apiKey: "AIzaSyCWc86tmClSq7M1uu2pTH1uLEUkBUut4Ig",
    authDomain: "train-scheduler-37e70.firebaseapp.com",
    databaseURL: "https://train-scheduler-37e70.firebaseio.com",
    projectId: "train-scheduler-37e70",
    storageBucket: "train-scheduler-37e70.appspot.com",
    messagingSenderId: "226280180842"
  };

firebase.initializeApp(config);

//Create a variable to reference the database.
var database = firebase.database();

//list of variables
var name = "";
var destination = "";
var time = "";
var frequency = "";

//variables used for calculating time
var firstTimeConverted = "";
var currentTime = "";
var diffTime = ""
var tRemainder = "";
var minutesTilTrain = '';
var nextTrain = "";
var nextTrainFormatted = "";


//Capture Button Click
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

 //Grabbed values from text boxes
name = $('#train-name-input').val().trim();
destination = $('#destination-input').val().trim();
time = $('#train-time-input').val().trim();
frequency = $('#frequency-input').val().trim();

//Calculating time
firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
console.log(firstTimeConverted);
currentTime = moment();
diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log(diffTime);
tRemainder = diffTime % frequency;
minutesTilTrain = frequency - tRemainder;
console.log(minutesTilTrain);
nextTrain = moment().add(minutesTilTrain, "minutes");
nextTrainFormatted = moment(nextTrain).format("hh:mm");

//Code for handling the push 
database.ref().push({
  name: name,
  destination: destination,
  time: time,
  frequency: frequency,
  nextTrainFormatted: nextTrainFormatted,
  minutesTilTrain: minutesTilTrain
});

});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot) {

// Log everything that's coming out of snapshot
console.log(childSnapshot.val().name);
console.log(childSnapshot.val().destination);
console.log(childSnapshot.val().time);
console.log(childSnapshot.val().frequency);
console.log(childSnapshot.val().minutesTilTrain);
console.log(childSnapshot.val().nextTrainFormatted);


$('#train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.val() + "'" + ">" +
"<td class='col-xs-3'>" + childSnapshot.val().name +
"</td>" +
"<td class='col-xs-2'>" + childSnapshot.val().destination +
"</td>" +
"<td class='col-xs-2'>" + childSnapshot.val().frequency +
"</td>" +
"<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + 
"</td>" +
"<td class='col-xs-2'>" + childSnapshot.val().minutesTilTrain + 
"</td>");

// Handle the errors
}, function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

// Change the HTML to reflect
$("#name").html(snapshot.val().name);
$("#destination").html(snapshot.val().destination);
$("#time").html(snapshot.val().time);
$("#frequency").html(snapshot.val().frequency);
});





 