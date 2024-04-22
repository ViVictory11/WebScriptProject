$(document).ready(function () {
    loaddata();
    $("#newAppo").hide();
    $("#showNew").click(function() {
        $("#newAppo").slideToggle();
    });

    $("#addTimeOption").click(function() {
        var timeOptionInput = $("<div class='timeOption'></div>");
        timeOptionInput.append("<label>Date:</label><br>");
        timeOptionInput.append("<input type='date' name='date[]' style='margin-bottom: 5px;' required><br>");
        timeOptionInput.append("<label>Time:</label><br>");
        timeOptionInput.append("<input type='time' name='time[]' style='margin-bottom: 5px;' required><br>");
        $("#timeOptions").append(timeOptionInput);
    });

    $("#formNewAppo").submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        
        formData.push({ name: "title", value: $("input[name='title']").val() });
        formData.push({ name: "description", value: $("input[name='description']").val() });
        formData.push({ name: "duration", value: $("input[name='duration']").val() });
        formData.push({ name: "place", value: $("input[name='place']").val() });
        formData.push({ name: "creator", value: $("input[name='creator']").val() });

        submitFormData(formData);
    });
});

function submitFormData(formData) {
    $.ajax({
        url: "../db/submitHandlerCreate.php",
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('#message').html('<span style="color: green">Form submitted successfully</span>');
            } else {
                $('#message').html('<span style="color: red">Form not submitted. Some error occurred.</span>');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            $('#message').html('<span style="color: red">Error submitting form. Please try again later.</span>');
        }
    });
}

function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty();

            // Initialize earliest and latest dates with extreme values
            var earliestDate = new Date(Number.MAX_VALUE);
            var latestDate = new Date(0);
            var currentDate = new Date();

            response.forEach((person) => {
                person.times.forEach((time) => {
                    var appointmentDate = new Date(time.date);
                    if (appointmentDate < earliestDate) {
                        earliestDate = appointmentDate;
                    }
                    if (appointmentDate > latestDate) {
                        latestDate = appointmentDate;
                    }
                });
            });

            var isAllPast = latestDate < currentDate;
            var isAllFuture = earliestDate > currentDate;
            var isMixed = !isAllPast && !isAllFuture;

            response.forEach((person) => {
                var outerEntry = $("<div class='entry'></div>");

                if (isAllPast || (isMixed && latestDate <= currentDate)) {
                    outerEntry.css("background-color", "#D3D3D3");
                } else {
                    outerEntry.css("background-color", "#89CFF0");
                }

                outerEntry.css({
                    "font-size": "1.5em",
                    "margin": "10px",
                    "padding": "10px"
                });

                var titleDiv = $("<div class='title'>" + person.title + "</div>");
                outerEntry.append(titleDiv);

                var innerEntry = $("<div class='inner'></div>");
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>All Votes: </p>");

                var allVotesList = $("<ul></ul>");
                person.times.forEach((time) => {
                    time.users.forEach((user) => {
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", User: " + user.name + ", Checked: " + (user.checked ? "Yes" : "No"));
                        listItem.append(", Comment: " + user.comment);
                        allVotesList.append(listItem);
                    });
                });
                innerEntry.append(allVotesList);
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                var formEntry = $("<div class='formEntry'></div>");
                var formTimesList = $("<ul class='formTimesList'></ul>");

                var addedTimeSlots = [];

                person.times.forEach((time) => {
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

                var commentInput = $("<input type='text' name='comment' placeholder='Your Comment'>");
                formEntry.append(commentInput);

                var nameInput = $("<input type='text' name='userName' placeholder='Your Name'>");
                formEntry.append(nameInput);

                var submitButton = $("<button type='submit'>Submit</button>");
                formEntry.append(submitButton);

                formEntry.hide();
                formEntry.css("font-size", "1rem");

                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);

                $("#app-container").append(outerEntry);

                formEntry.hide();

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
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}




function submitForm(formContainer) {
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
            } else {
                $('#message').html('<span style="color: red">Form not submitted. Some error occurred.</span>');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            $('#message').html('<span style="color: red">Error submitting form. Please try again later.</span>');
        }
    });
}
