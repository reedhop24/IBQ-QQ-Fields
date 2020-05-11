# IBQ-QQ-Auto-Incident

##### This is a small snippet of code that I built for IBQ's QuickQuote platform. The fields within our QuickQuote are set on the back end, therefore our front end makes GET's and POST's to the back end to GET the field values and POST the user input. Our Back End is also handling which Incidents are allowed by our system or not. With that being said, I was tasked with creating a modal that would display if a disallowed Incident is selected.

##### The Driver form is the third form in our UI, on this form you will find input fields for Driver name, age, and address. You will also find an input for whether or not the driver has had any incidents in the past five years. If the user selects yes to this then we are displaying another drop down with the six types of incidents. These six incidents are statically set therefore they are just handled in the HTML. Once the user selects a type of incident then I ping the IncidentsLookup endpoint of our API and I receive all of the possible incident descriptions from the API. Incidents that are not allowed by our system are flagged with _Disallowed : "Yes". Therefore, as I am looping through the result object and setting the _Display attribute as options in the select, I am also storing whether or not an incident is disallowed in the Disallowed object. Then once an incident is selected that is in the disallowed object, I am displaying the modal to alert the user that the incident is not acceptable by our system. 

##### This project was built using JavaScript, jQuery, CSS, HTML, and jQuery Modal.