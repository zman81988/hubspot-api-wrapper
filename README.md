# HubSpot-API
Innitial commit
Promised based node package to assist with making API calls to the HubSpot 
servers.  Version 0.1 on release will support contacts companies and deals 
endpoints


Author: Peter Manca(Hubspotter)

The fist thing you need to do to be able to call any of the functions listed 
below is to initialize your credentials.  This package can handle oauth2 or 
your hapikey.  If you are using your hapikey you must receive this from your 
portal.  If you are going to use OAuth2 then you must go through the normal 
OAuth flow to generate your token.  You then only need your token to 
authenticate correctly in the package. 

Here is an example of how to call that function. 

	hubspot.init(options)

This function will return a true of false depending on whether or not it was set correctly. You can do this by assigning the return value to a variable. 

	var result = hubspot.init(options)

You can create the options object like so(Both the token and the Hapikey 
must be a string)->

	var token = xxxxx
	var options = {type:"oauth",value: token}

or 

	var hapikey = xxxxx
	var options = {type"hapikey",value: hapikey}

This package is a promise based package. All of the functions will return a 
promise to you.  

There are 3 objects beyone the init object you can work with. 
1. contact
2. company
3. deal

An example of calling one of the functions below would then look like this 
below while printing the results to the terminal/console. 

	var hubspot = require('hubspot-api-wrapper')

	var token = xxxxx
	var options = {type:"oauth",value: token}
	hubspot.init(options)

	hubspot.contact.getAll().then(result => {
		console.log(result)
	})

	var deal2Create =  {
            "portalId": portalID,
            "properties": [
                {
                    "value": "Tim's Newer Deal",
                    "name": "dealname"
                },
                {
                    "value": "appointmentscheduled",
                    "name": "dealstage"
                },
                {
                    "value": "default",
                    "name": "pipeline"
                },
                {
                    "value": "60000",
                    "name": "amount"
                },
                {
                    "value": "newbusiness",
                    "name": "dealtype"
                }
            ]
        }
	
	hubspot.deal.create(deal2Create).then(result => {
		console.log(result)
	})

	var companyID = xxxx
	hubspot.company.getByID(companyID).then(result => {
		console.log(result)
	})


Please use developers.hubspot.com as a resource for how to properly format 
some of the parameters as in how to create a deal above. 




Functions availible
Notes:
Below are the function definitions
1.() means no parameters
2. style is es7 which means functionName: (list of parameters)
3. Variables are going to be mostly strings unless they are IDs then which 
they are a number or if there are multiple strings as in get by batch they 
will be in an array.  Some of the endpoints that involve the properties that 
are not optional will require objects.  You can see examples of the 
structure at developers.hubspot.com
Init -->
---------------------


var options = {type: "oauth",value: token}
var options = {type: "hapikey",value: hapikey}

init = obj =>

Contacts -->
----------------------
- getAll: [properties] =>
- getRecent: [properties] =>
- getByEmail: email =>
- getByID: id =>
- create: properties =>
- createOrUpdate: (email,properties) =>
- update: (vid,properties) =>
- updateByEmail: (email,properties) => 
- updateByEmail: (email,properties) =>
- delete: vid => 
- search: query => 
- getBatchByID: (vids,properties) =>
- getBatchByEmail: (emails,properties,portalID) =>
- getByUTK: utk =>
- getBatchByUTK: (utks,properties) => 
- merge: (vidPrimary,vidSecondary) =>
- createOrUpdateByBatch: body =>

Companies -->
----------------------

- create: properties => 
- update: (companyID,properties) => 
- delete: (id,portalID) => 
- getAll: [properties] =>
- getRecentlyModified: () =>
- getRecentlyCreated: () =>
- getByDomain: domain =>
- getByID: id =>
- getContactsByCompanyID: (companyID,portalID) =>
- getContactIDsByCompanyID: (companyID,portalID) =>
- addContactToCompany: (companyID,vid) =>
- removeContactFromCompany: (companyID,vid) =>

Deals -->
----------------------
- create: body =>
- update: (dealID,properties) =>
- getAll: [properties] =>
- getRecentlyModified: () =>
- getRecentlyCreated: () =>
- delete: (dealID,portalID) =>
- getByID: id =>
- associate: (dealID,objType,objIDs) =>
- removeAssociateObject: (dealID,objType,objIDs) =>
- getAssociatedDeals: (objType, id) =>





You can run the tests.js file to run the Mocha test script with some minor 
adjustments to the files in the test folder. 