// Initialize Firebase
var config = {
    apiKey: "AIzaSyBJk4urFXMmuXpvxkX0RW3H8r0vBpjq3eE",
    authDomain: "train-schedule-90e3e.firebaseapp.com",
    databaseURL: "https://train-schedule-90e3e.firebaseio.com",
    projectId: "train-schedule-90e3e",
    storageBucket: "train-schedule-90e3e.appspot.com",
    messagingSenderId: "112668291600"
    
    
};
firebase.initializeApp(config);

var database = firebase.database();



//on click listener
$("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#Destination").val().trim();
    var trainTime = moment($("#trainTime").val().trim(), "hh:mm").format("X");
    var trainFrequency = $("#frequency").val().trim();

    //hold info to be entered in firebase 
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    };
    database.ref("/trains").push(newTrain);
    //clears entered info
    $("#trainName").val("");
    $("#destination").val("");
    $("#trainTime").val("");
    $("#frequency").val("");

});

database.ref("/trains").on("child_added", function(captured) {
    // variable to retrieve data
    var retrieveTrainData = captured.val();
    //create table row row
    var newRow = $("<tr>")
    // puts info into specfic columns
    newRow.append("<td>" + retrieveTrainData.name+ "</td>");
    newRow.append("<td>" +retrieveTrainData.destination+ "</td>");  
    newRow.append("<td>" +retrieveTrainData.frequency+ "</td>"); 

    var totalTrainTime = Math.abs(moment().diff(moment(retrieveTrainData.time, "X"), "minutes"));
    var freqDivider = ((totalTrainTime)/retrieveTrainData.frequency);
    var freqDividerDecimal = freqDivider - Math.floor(freqDivider)
   var nextTrainMinutes =  Math.round(retrieveTrainData.frequency - (retrieveTrainData.frequency*freqDividerDecimal)) 


    var nextTrainTime = moment().add(nextTrainMinutes, "m").toDate();
  nextTrainTimeFormatted = moment(nextTrainTime).format("HH:mm");

  newRow.append("<td>" +nextTrainTimeFormatted+ "</td>");

  
  newRow.append("<td>" +nextTrainMinutes+ "</td>");
$(".table").append(newRow);
  // log any errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
  
});