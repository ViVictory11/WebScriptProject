$(document).ready(function () {
    loaddata();
    $("#newAppo").hide();
    //visibility of the new appoinment form
    $("#showNew").click(function() {
        $("#newAppo").slideToggle();
    });
    //form for adding new appoinment times where 
    //appending every new "smaller" form to main form occurs
    $("#addTimeOption").click(function() {
        var timeOptionInput = $("<div class='timeOption'></div>");
        timeOptionInput.append("<label>Date:</label><br>");
        timeOptionInput.append("<input type='date' name='date[]' style='margin-bottom: 5px;' required><br>");
        timeOptionInput.append("<label>Time:</label><br>");
        timeOptionInput.append("<input type='time' name='time[]' style='margin-bottom: 5px;' required><br>");
        $("#timeOptions").append(timeOptionInput);
    });

    $("#formNewAppo").submit(function(event) {
        event.preventDefault(); //preventing html to handle submission, letting js to do it
        var formData = $(this).serializeArray(); //preparing array to handlaing objects of jQuery
        //putting the inputs from the form into the array-object
        formData.push({ name: "title", value: $("input[name='title']").val() });
        formData.push({ name: "description", value: $("input[name='description']").val() });
        formData.push({ name: "duration", value: $("input[name='duration']").val() });
        formData.push({ name: "place", value: $("input[name='place']").val() });
        formData.push({ name: "creator", value: $("input[name='creator']").val() });

        submitFormData(formData);
    });
});

function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty(); //precution for no overriding of printing appoinments

            response.forEach((appointment) => {
                // Initialize earliest and latest dates for each appointment
                var earliestDate = new Date(0);
                var latestDate = new Date(0);
                var currentDate = new Date();

                //conditions for checking the dates of times
                appointment.times.forEach((time) => {
                    var appointmentDate = new Date(time.date);
                    if (appointmentDate < earliestDate) {
                        earliestDate = appointmentDate;
                    }
                    if (appointmentDate > latestDate) {
                        latestDate = appointmentDate;
                    }
                });

                // Determine appointment status based on appointment times
                var isAllPast = latestDate < currentDate;
                var isAllFuture = earliestDate > currentDate;
                var isMixed = !isAllPast && !isAllFuture;

                // Display appointments based on status
                var outerEntry = $("<div class='entry'></div>");

                if (isAllPast || (isMixed && latestDate <= currentDate)) {
                    outerEntry.css("background-color", "#D3D3D3"); // Grey for all past
                } else {
                    outerEntry.css("background-color", "#89CFF0"); // Babyblue for mixed or all future
                }
                outerEntry.css({
                    "font-size": "1.5em",
                    "margin": "10px",
                    "padding": "10px"
                });

                //putting in OuterEntry just the title (what is visible before a click)
                var titleDiv = $("<div class='title'>" + appointment.title + "</div>");
                outerEntry.append(titleDiv);

                //all infomration extracted about the appoinment from database in new div
                var innerEntry = $("<div class='inner'></div>");
                innerEntry.append("<p>Place: " + appointment.place + "</p>");
                innerEntry.append("<p>Duration: " + appointment.duration + "</p>");
                innerEntry.append("<p>Description: " + appointment.description + "</p>");
                innerEntry.append("<p>Creator: " + appointment.creator + "</p>");
                innerEntry.append("<p>All Votes: </p>");

                //handleing stragedy for votes (if there are any times, any votes, how many votes)
                var allVotesList = $("<ul></ul>");
                if (appointment.times.length === 0) {
                    allVotesList.append("<li><p>No time options available yet!</p></li>");
                } else {
                    appointment.times.forEach((time) => {
                        var timeVotesList = $("<ul></ul>");
                        var timeListItem = $("<li>Date: " + time.date + "</li>");
                        time.users.forEach((user) => {
                                var listItem = $("<li></li>");
                                if (user.name === null) { //checking if any user has given any input yet
                                    listItem.append("No votes yet made!");
                                } else {
                                    listItem.append("User: " + user.name + ", Checked: " + (user.checked ? "Yes" : "No"));
                                    listItem.append(", Comment: " + user.comment);
                                }
                                timeVotesList.append(listItem);
                            });
                        timeListItem.append(timeVotesList);
                        allVotesList.append(timeListItem);
                    });
                }
                innerEntry.append(allVotesList);

                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                //creating entry for the form for vote-submission
                var formEntry = $("<div class='formEntry'></div>");
                var formTimesList = $("<ul class='formTimesList'></ul>");

                var addedTimeSlots = [];

                appointment.times.forEach((time) => {
                    //making sure there is no data override
                    if (!addedTimeSlots.includes(time.date)) {
                        addedTimeSlots.push(time.date);
                        var form = $("<form id='submitForm' method='POST' action='../db/submitHandler.php'></form>");
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", Checked: ");
                        var checkbox = $("<input type='checkbox' name='checked'>");
                        listItem.append(checkbox);
                        form.append(listItem);
                        var hiddenInput = $("<input type='hidden' name='appoTimeId' value='" + time.id + "'>");
                        form.append(hiddenInput);
                        formTimesList.append(form);
                    }
                });
                formEntry.append(formTimesList);

                //only one commet pro form
                var commentInput = $("<input type='text' name='comment' placeholder='Your Comment'>");
                formEntry.append(commentInput);

                var nameInput = $("<input type='text' name='userName' placeholder='Your Name'>");
                formEntry.append(nameInput);

                var submitButton = $("<button type='submit'>Submit</button>");
                formEntry.append(submitButton);

                formEntry.hide();
                formEntry.css("font-size", "1rem");

                //putting everything into the outerEntry
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                //appending the whole block into the html
                $("#app-container").append(outerEntry);

                //formEntry.hide();

                //managing that when an appoinment-times are all in the past,
                //only details can be seen and nothing else.
                if (!isAllPast) {
                    titleDiv.click(function() {
                        innerEntry.slideToggle();
                        formEntry.slideToggle();
                    });

                    submitButton.click(function(event) {
                        event.preventDefault();
                        submitForm(formEntry);
                    });
                } else {
                    titleDiv.click(function() {
                        innerEntry.slideToggle();
                    });
                }
            });

            $("#app-container").show();
        },
        error: function(error) {
            console.error(error);
        }
    });
}


function submitForm(formContainer) {
    //collecting all the data into an array to send 
    var formDataArray = [];
    var name = formContainer.find('input[name=userName]').val();
    var comment = formContainer.find('input[name=comment]').val();

    formContainer.find('.formTimesList form').each(function() {
        var appoTimeId = $(this).find('input[name=appoTimeId]').val();
        var checkedValue = $(this).find('input[name=checked]').prop('checked') ? 1 : 0;

        var formData = {
            name: name,
            checked: checkedValue,
            comment: comment,
            appoTimeId: appoTimeId
        };
        formDataArray.push(formData);
    });

    $.ajax({
        url: "../db/submitHandler.php",
        type: 'POST',
        data: { formDataArray: formDataArray },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('#message').html('<span style="color: green">Form submitted successfully</span>');
                location.reload();
            } else {
                $('#message').html('<span style="color: red">Form not submitted. Some error occurred.</span>');
            }
        },
        error: function(error) {
            console.error(error);
            $('#message').html('<span style="color: red">Error submitting form. Please try again later.</span>');
        }
    });
}


function submitFormData(formData) {
    //the submitted data is checked outside of submitFormData
    $.ajax({
        url: "../db/submitHandlerCreate.php",
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('#message').html('<span style="color: green">Form submitted successfully</span>');
                location.reload();
            } else {
                $('#message').html('<span style="color: red">Form not submitted. Some error occurred.</span>');
            }
        },
        error: function(error) {
            console.error(error);
            $('#message').html('<span style="color: red">Error submitting form. Please try again later.</span>');
        }
    });
}
