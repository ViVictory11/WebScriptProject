$(document).ready(function () {
    loaddata();
    $("#btn-Search").click(function (e) {
        loaddataTime($("#AppoTimeInput").val());
    });

    // Event-Handler für das Hauptcontainer hinzufügen
    $("#app-container").on("submit", ".formEntry form", function(event) {
        // Verhindere das Standardverhalten des Formulars (Seitenneuladen)
        event.preventDefault();

        // Daten aus dem Formular sammeln
        var formData = $(this).serialize();

        // Modal anzeigen, um den Benutzernamen einzugeben
        showNameModal();

        // Event-Listener für den Namen-Modal-Submit-Button hinzufügen
        $("#submitNameBtn").off("click").on("click", function() {
            // Get user name from input
            var userName = $("#userNameInput").val();

            // Formular mit Benutzernamen und Daten senden
            $.ajax({
                type: "POST",
                url: "../db/submitHandler.php", // Passe den Pfad entsprechend an
                data: formData + "&userName=" + userName,
                success: function(response) {
                    // Handle die Antwort hier, z.B. zeige eine Bestätigungsmeldung an
                    console.log("Data submitted successfully!");
                },
                error: function(xhr, status, error) {
                    // Handle Fehler hier
                    console.error("Error:", error);
                }
            });

            // Modal schließen
            closeNameModal();
        });
    });
});

// Funktion zum Anzeigen des Namens-Modals
function showNameModal() {
    var modal = $("#nameModal");
    modal.css("display", "block");
}

// Funktion zum Schließen des Namens-Modals
function closeNameModal() {
    var modal = $("#nameModal");
    modal.css("display", "none");
}
function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty(); // Clear the container to ensure no old data is displayed
    
            response.forEach((person) => {
                // Create an outer div container for each person
                var outerEntry = $("<div class='entry'></div>");
                // Set background color and styles for the outer container
                outerEntry.css({
                    "background-color": "#FFC0CB",
                    "font-size": "1.5em", // 1.5 times font size
                    "margin": "10px", // Margin
                    "padding": "10px" // Padding
                });

                // Display the title of the entry
                var titleDiv = $("<div class='title'>" + person.title + "</div>");
                outerEntry.append(titleDiv);
                
                // Create an inner div container for details
                var innerEntry = $("<div class='inner'></div>");
                // Add data from the Person object to the inner div
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>All Votes: </p>");
                
                // List all votes and associated user information
                var allVotesList = $("<ul></ul>");
                person.times.forEach((time) => {
                    // Iterate over each time entry and its associated users
                    time.users.forEach((user) => {
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", User: " + user.name + ", Checked: ");
                        listItem.append(", Comment: " + user.comment);
                        allVotesList.append(listItem);
                    });
                });
                // Append the votes list to the inner div
                innerEntry.append(allVotesList);
                
                // Hide the inner container initially
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                // Create a form container for selecting times
                var formEntry = $("<div class='formEntry'></div>");
                //var form = $("<form ")
                var formTimesList = $("<ul class='formTimesList'></ul>");
               // form.append(formTimesList);

                // Keep track of unique time slots
                var addedTimeSlots = [];

                // Iterate over times to create list items with checkboxes
                person.times.forEach((time) => {
                    // Check if the time slot has already been added
                    if (!addedTimeSlots.includes(time.date)) {
                        // Add the time slot to the list and mark it as added
                        addedTimeSlots.push(time.date);
                        var form = $("<form id='submitForm' method='POST' action='../db/submitHandler.php'>></form>"); // Erstelle ein Formular für jede Zeitoption
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", Checked: ");
                        var checkbox = $("<input type='checkbox' name='checked'>"); // Checkbox erstellen
                        listItem.append(checkbox);
                        form.append(listItem);
                        var commentInput = $("<input type='text' name='comment' placeholder='Your Comment'>"); // Füge ein Textfeld für den Kommentar hinzu
                        form.append(commentInput);
                        var hiddenInput = $("<input type='hidden' name='appoTimeId' value='" + time.id + "'>"); // Füge ein verstecktes Feld für die Zeitoption-ID hinzu
                        form.append(hiddenInput);
                        formTimesList.append(form);
                    }
                });

                // Append the list of times to the form container
                formEntry.append(formTimesList);
                // Create a submit button for the form
                var submitButton = $("<button type='submit'>Submit</button>"); // Nur einen Submit-Button am Ende des Formulars
                formEntry.append(submitButton);

                // Hide the form entry initially
                formEntry.hide();
                formEntry.css("font-size", "1rem");
                
                // Append the inner and form containers to the outer container
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                // Append the outer container to the main container
                $("#app-container").append(outerEntry);

                // Hide the form container initially
                formEntry.hide();

                // Click event for the title
                titleDiv.click(function() {
                    // Toggle the display of the inner and form containers when the title is clicked
                    innerEntry.slideToggle();
                    formEntry.slideToggle();
                });
            });
    
            // Show the container
            $("#app-container").show();
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error(error);
        }
    });
}

//Starting point for JQuery init
/*$(document).ready(function () {
    loaddata();
    $("#btn-Search").click(function (e) {
        loaddataTime($("#AppoTimeInput").val());
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
            $("#app-container").empty(); // Clear the container to ensure no old data is displayed
    
            response.forEach((person) => {
                // Create an outer div container for each person
                var outerEntry = $("<div class='entry'></div>");
                // Set background color and styles for the outer container
                outerEntry.css({
                    "background-color": "#FFC0CB",
                    "font-size": "1.5em", // 1.5 times font size
                    "margin": "10px", // Margin
                    "padding": "10px" // Padding
                });

                // Display the title of the entry
                var titleDiv = $("<div class='title'>" + person.title + "</div>");
                outerEntry.append(titleDiv);
                
                // Create an inner div container for details
                var innerEntry = $("<div class='inner'></div>");
                // Add data from the Person object to the inner div
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>All Votes: </p>");
                
                // List all votes and associated user information
                var allVotesList = $("<ul></ul>");
                person.times.forEach((time) => {
                    // Iterate over each time entry and its associated users
                    time.users.forEach((user) => {
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", User: " + user.name + ", Checked: " + user.checked + ", Comment: " + user.comment);
                        allVotesList.append(listItem);
                    });
                });
                // Append the votes list to the inner div
                innerEntry.append(allVotesList);
                
                // Hide the inner container initially
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                // Create a form container for selecting times
                var formEntry = $("<div class='formEntry'></div>");
                var formTimesList = $("<ul></ul>");

                // Keep track of unique time slots
                var addedTimeSlots = [];

                // Iterate over times to create list items with checkboxes
                person.times.forEach((time) => {
                    // Check if the time slot has already been added
                    if (!addedTimeSlots.includes(time.date)) {
                        // Add the time slot to the list and mark it as added
                        addedTimeSlots.push(time.date);
                        var listItem = $("<li></li>");
                        var checkbox = $("<input type='checkbox'>");
                        listItem.append("Date: " + time.date + ", Checked: ");
                        listItem.append(checkbox);
                        formTimesList.append(listItem);
                        var comment = $(" <input type'text'>");
                        listItem.append(comment);
                    }
                });

                // Append the list of times to the form container
                formEntry.append(formTimesList);
                // Create a submit button for the form
                var submitButton = $("<button>Submit</button>");
                formEntry.append(submitButton);

                // Hide the form entry initially
                formEntry.hide();
                formEntry.css("font-size", "1rem");
                
                // Append the inner and form containers to the outer container
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                // Append the outer container to the main container
                $("#app-container").append(outerEntry);

                // Hide the form container initially
                formEntry.hide();

                // Click event for the title
                titleDiv.click(function() {
                    // Toggle the display of the inner and form containers when the title is clicked
                    innerEntry.slideToggle();
                    formEntry.slideToggle();
                });
            });
    
            // Show the container
            $("#app-container").show();
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error(error);
        }
    });
}



/*function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty(); // Clear the container to ensure no old data is displayed
    
            response.forEach((person) => {
                // Create an outer div container for each person
                var outerEntry = $("<div class='entry'></div>");
                // Set background color and styles for the outer container
                outerEntry.css({
                    "background-color": "#FFC0CB",
                    "font-size": "1.5em", // 1.5 times font size
                    "margin": "10px", // Margin
                    "padding": "10px" // Padding
                });

                // Display the title of the entry
                var titleDiv = $("<div class='title'>" + person.title + "</div>");
                outerEntry.append(titleDiv);
                
                // Create an inner div container for details
                var innerEntry = $("<div class='inner'></div>");
                // Add data from the Person object to the inner div
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>All Votes: </p>");
                
                // List all votes and associated user information
                var allVotesList = $("<ul></ul>");
                person.times.forEach((time) => {
                    // Iterate over each time entry and its associated users
                    time.users.forEach((user) => {
                        var listItem = $("<li></li>");
                        listItem.append("Date: " + time.date + ", User: " + user.name + ", Checked: " + user.checked + ", Comment: " + user.comment);
                        allVotesList.append(listItem);
                    });
                });
                // Append the votes list to the inner div
                innerEntry.append(allVotesList);
                
                // Hide the inner container initially
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                // Create a form container for selecting times
                var formEntry = $("<div class='formEntry'></div>");
                var formTimesList = $("<ul></ul>");
                // Iterate over times to create list items with checkboxes
                person.times.forEach((time) => {
                    var listItem = $("<li></li>");
                    var checkbox = $("<input type='checkbox'>");
                    listItem.append("Date: " + time.date + ", Checked: ");
                    listItem.append(checkbox);
                    formTimesList.append(listItem);
                });
                // Append the list of times to the form container
                formEntry.append(formTimesList);
                // Create a submit button for the form
                var submitButton = $("<button>Submit</button>");
                formEntry.append(submitButton);

                // Hide the form entry initially
                formEntry.hide();
                formEntry.css("font-size", "1rem");
                
                // Append the inner and form containers to the outer container
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                // Append the outer container to the main container
                $("#app-container").append(outerEntry);

                // Hide the form container initially
                formEntry.hide();

                // Click event for the title
                titleDiv.click(function() {
                    // Toggle the display of the inner and form containers when the title is clicked
                    innerEntry.slideToggle();
                    formEntry.slideToggle();
                });
            });
    
            // Show the container
            $("#app-container").show();
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error(error);
        }
    });
}*/

/*function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty(); // Leeren des Containers, um sicherzustellen, dass keine alten Daten angezeigt werden
    
            response.forEach((person) => {
                // Erstellen eines äußeren Div-Containers für jede Person
                var outerEntry = $("<div class='entry'></div>");
                // Hintergrundfarbe des äußeren Containers setzen
                outerEntry.css({
                    "background-color": "#FFC0CB",
                    "font-size": "1.5em", // 1.5-fache Schriftgröße
                    "margin": "10px", // Margin
                    "padding": "10px" // Padding
                });

                // Titel des Eintrags anzeigen
                var titleDiv = $("<div class='title'>" + person.title + "</div>");
                outerEntry.append(titleDiv);
                
                // Erstellen eines inneren Div-Containers für den Namen und andere Inhalte
                var innerEntry = $("<div class='inner'></div>");
                // Daten aus dem Person-Objekt dem inneren Div hinzufügen
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>Times: </p>");
                
                // Verstecke den inneren Container
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                // Erstellen eines Form-Containers für die Zeiten
                var formEntry = $("<div class='formEntry'></div>");
                // Erstellen einer Liste für die Zeiten
                var formTimesList = $("<ul></ul>");
                // Iteriere über die Zeiten und füge sie der Liste hinzu
                person.times.forEach((time) => {
                    // Erstellen eines Listeneintrags mit Checkbox für jede Zeit
                    var listItem = $("<li></li>");
                    var checkbox = $("<input type='checkbox'>");
                    listItem.append("Date: " + time.date + ", Checked: ");
                    listItem.append(checkbox);
                    formTimesList.append(listItem);
                });
                // Füge die Zeitenliste dem Form-Container hinzu
                formEntry.append(formTimesList);
                // Erstellen eines Submit-Buttons für das Formular
                var submitButton = $("<button>Submit</button>");
                formEntry.append(submitButton);

                formEntry.hide();
                formEntry.css("font-size", "1rem");
                
                // Den inneren Container und das Form-Container dem äußeren Container hinzufügen
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                // Den äußeren Container dem Hauptcontainer hinzufügen
                $("#app-container").append(outerEntry);

                // Verstecke das Form-Container zunächst
                formEntry.hide();

                // Klickereignis für den Titel
                titleDiv.click(function() {
                    // Bei Klick auf den Titel, zeige den inneren Container und das Form-Container an oder verstecke ihn, je nach aktuellem Status
                    innerEntry.slideToggle();
                    formEntry.slideToggle(); // SlideToggle für das formEntry hinzufügen
                });
            });
    
            // Container anzeigen
            $("#app-container").show();
        },
        error: function(xhr, status, error) {
            // Fehler behandeln
            console.error(error);
        }
    });
}*/


/*function loaddata() {
    $.ajax({
        type: "GET",
        url: "../serviceHandler.php",
        cache: false,
        data: { method: "queryDataFromDatabase" },
        dataType: "json",
        success: function(response) {
            $("#app-container").empty(); // Leeren des Containers, um sicherzustellen, dass keine alten Daten angezeigt werden
    
            response.forEach((person) => {
                // Erstellen eines äußeren Div-Containers für jede Person
                var outerEntry = $("<div class='entry'></div>");
                // Hintergrundfarbe des äußeren Containers setzen
                outerEntry.css({
                    "background-color": "#FFC0CB",
                    "font-size": "1.5em", // 1.5-fache Schriftgröße
                    "margin": "10px", // Margin
                    "padding": "10px" // Padding
                });
                
                // Erstellen eines inneren Div-Containers für den Namen und andere Inhalte
                var innerEntry = $("<div class='inner'></div>");
                // Daten aus dem Person-Objekt dem inneren Div hinzufügen
                innerEntry.append("<p>Place: " + person.place + "</p>");
                innerEntry.append("<p>Duration: " + person.duration + "</p>");
                innerEntry.append("<p>Description: " + person.description + "</p>");
                innerEntry.append("<p>Creator: " + person.creator + "</p>");
                innerEntry.append("<p>Times: </p>");
                // Erstellen einer Liste für die Zeiten
                var timesList = $("<ul></ul>");
                // Iteriere über die Zeiten und füge sie der Liste hinzu
                person.times.forEach((time) => {
                    timesList.append("<li>Date: " + time.date + ", Checked: " + time.checked + "</li>");
                });
                // Füge die Zeitenliste dem inneren Div hinzu
                innerEntry.append(timesList);
                
                // Verstecke den inneren Container
                innerEntry.hide();
                innerEntry.css("font-size", "1rem");

                // Erstellen eines Form-Containers für die Zeiten
                var formEntry = $("<div class='formEntry'></div>");
                // Erstellen einer Liste für die Zeiten
                var formTimesList = $("<ul></ul>");
                // Iteriere über die Zeiten und füge sie der Liste hinzu
                person.times.forEach((time) => {
                    // Erstellen eines Listeneintrags mit Checkbox für jede Zeit
                    var listItem = $("<li></li>");
                    var checkbox = $("<input type='checkbox'>");
                    checkbox.prop("checked", time.checked === 1); // Setze den Zustand des Kontrollkästchens basierend auf dem Wert von time.checked
                    listItem.append("Date: " + time.date + ", Checked: ");
                    listItem.append(checkbox);
                    formTimesList.append(listItem);
                });
                // Füge die Zeitenliste dem Form-Container hinzu
                formEntry.append(formTimesList);
                // Erstellen eines Submit-Buttons für das Formular
                var submitButton = $("<button>Submit</button>");
                formEntry.append(submitButton);
                
                // Den inneren Container und das Form-Container dem äußeren Container hinzufügen
                outerEntry.append(innerEntry);
                outerEntry.append(formEntry);
                
                // Den äußeren Container dem Hauptcontainer hinzufügen
                $("#app-container").append(outerEntry.append(person.title).click(function() {
                    // Bei Klick auf den äußeren Container, zeige den inneren Container und das Form-Container an oder verstecke ihn, je nach aktuellem Status
                    innerEntry.slideToggle();
                    formEntry.slideToggle(); // SlideToggle für das formEntry hinzufügen
                }));
            });
    
            // Container anzeigen
            $("#app-container").show();
        },
        error: function(xhr, status, error) {
            // Fehler behandeln
            console.error(error);
        }
    });
}*/
