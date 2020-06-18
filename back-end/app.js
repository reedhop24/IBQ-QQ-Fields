const express = require('express');
const port = 800;
const cors = require("cors");
let app = express();

app.use(cors());

app.get('/get', (req, res) => {
    res.json({
        "Models": {
         "Driver": [
          {
           "Description": "Personal Auto Driver",
           "Rules": "NODELETE;DOENDPOINT 'https:\/\/test.ibqagents.com\/ACME:webrate\/Auto\/3475\/Driver.json' IF Marital = 'Married';",
           "Fields": {
            "LastName": {
             "Description": "Last name",
             "Type": "VARCHAR(20);",
             "Rules": "REQUIRED;VALID IF $REGEXP('^[ a-zA-Z]*-?[ a-zA-Z]*$',LastName) = 1 ELSE INVALID 'Must only contain letters, spaces and one hyphen';"
            },
            "FirstName": {
             "Description": "First name",
             "Type": "VARCHAR(18);",
             "Rules": "REQUIRED;VALID IF $REGEXP('^[ a-zA-Z]*-?[ a-zA-Z]*$',FirstName) = 1 ELSE INVALID 'Must only contain letters, spaces and one hyphen';"
            },
            "BirthDate": {
             "Description": "Birthdate",
             "Type": "DATE;",
             "Rules": "VALID IF $AGE(BirthDate) >= 16 AND $AGE(BirthDate) <= 105 ELSE INVALID 'Driver age must be 16 - 105 years old';REQUIRED;"
            },
            "Sex": {
             "Description": "Gender",
             "Type": "ENUM('','Male','Female');",
             "Rules": "REQUIRED;"
            },
            "Marital": {
             "Description": "Marital status",
             "Type": "ENUM('','Married','Single','Widowed','Divorced','Separated');",
             "Rules": "REQUIRED;"
            },
            "Relation": {
             "Description": "Relation to applicant",
             "Type": "ENUM('','Spouse','Child','Sibling','Parent','Employee','Other','Roommate','SigOther','Relative');",
             "Rules": "REQUIRED;"
            },
            "Occupation": {
             "Description": "Employment",
             "Type": "ENUM('','Employed','Homemaker','Student','Military','Disabled','Retired','Unemployed');",
             "Rules": "REQUIRED;"
            },
            "Incident5Years": {
             "Description": "Have you had any Accidents\/ Tickets\/ Claims in the past 5 years?",
             "Type": "ENUM('','No','Yes');",
             "Rules": "REQUIRED;"
            },
            "SR22": {
             "Description": "Need a SR22?",
             "Type": "ENUM('','No','Yes');",
             "Rules": "REQUIRED;"
            },
            "Rated": {
             "Description": "Rated driver",
             "Type": "ENUM('Yes','No');",
             "Rules": "SETFIELD 'Yes';"
            }
           },
          }
         ]
        }
       });
});

app.listen(port, () => {
    console.log("server listening on port " + port);
});