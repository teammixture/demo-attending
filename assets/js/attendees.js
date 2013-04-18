// This is a very rough example and this script could be heavily improved, it's been kept pretty simple on purpose.
(function () {

  var listRef = new Firebase('https://attendees.firebaseIO.com/people');
  var alert = "<div data-alert class=\"alert-box\">{0}</div>";
  var processing = false;

  // Click event for the signup
  $("button").on("click", function() { 

    if (processing)
      return false;

    processing = true;
    $("button").text("Processing, please wait...");

    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var twitter = $("#twitter").val();
    var exists = false;
    var valid = true;

    if (firstName.length === 0)
      valid = false;
    if (lastName.length === 0)
      valid = false;
    if (twitter.length === 0)
      valid = false;

    if (!valid) {
      displayAlert("Please complete all fields","alert");
      processing = false;
      $("button").text("Confirm");
      return false;
    }

    listRef.on('value', function(snapshot) {

      for(item in snapshot.val()) {
        if (snapshot.val()[item].twitter === twitter)
          exists = true;
      }

    });

    if (!exists) {
      listRef.push({firstName: firstName, lastName: lastName, twitter: twitter});
      displayAlert("Success, your on the list","success");
    } else {
      displayAlert("Sorry a user with that Twitter name already exists!","alert");
      processing = false;
      $("button").text("Confirm");
    }

    processing = false;
    $("button").text("Confirm");

    return false;

  });

  function displayAlert(msg, class) {
    $(".alert-box").remove();
    $("#frm").prepend(alert.replace("{0}", msg));
    $(".alert-box").addClass(class);
  }
  
  // Set the count on load
  listRef.on('value', function(snapshot) {
    var count = 0;
    snapshot.forEach(function() {
      count++;
    });
    $("#count").text(count);
  });
  
  // Update the count and alert the user
  listRef.on('child_changed', function(snapshot) {
    var count = 0;
    snapshot.forEach(function() {
      count++;
    });
    $("#count").text(count);
  });

})();
