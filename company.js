var axios = require('axios')
var hubCache = require('./init').hubCache

exports.company = {
	create: properties => {
		var endpoint =  `https://api.hubapi.com/companies/v2/companies`
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.post(endpoint,properties).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.post(endpoint,properties,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	update: (companyID,properties) => {
		var endpoint =  `https://api.hubapi.com/companies/v2/companies/` + companyID
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.put(endpoint,properties).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.put(endpoint,properties,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	delete: (id,portalID) => {
		var endpoint = `https://api.hubapi.com/companies/v2/companies/`+ id + `?portalId=` + portalID
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `&hapikey=` + hubCache.get("config").value
			return axios.delete(endpoint).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.delete(endpoint,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	getAll: properties => {		
		    return getCompanies(properties).then(response => {
		    	return response	
		    }).catch(err =>{
				throw err
			})
	},
	getRecentlyModified: () => {		
		    return getRecentlyModifiedCompanies().then(response => {
		    	return response	
		    }).catch(err =>{
				throw err
			})
	},
	getRecentlyCreated: () => {		
		    return getRecentlyCreatedCompanies().then(response => {
		    	return response	
		    }).catch(err =>{
				throw err
			})
	},
	getByDomain: domain => {
		var endpoint = `https://api.hubapi.com/companies/v2/companies/domain/` + domain
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.get(endpoint).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.get(endpoint,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	getByID: id => {
		var endpoint = `https://api.hubapi.com/companies/v2/companies/` + id
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.get(endpoint).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.get(endpoint,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	getContactsByCompanyID: (companyID,portalID) => {		
		    return getContactsAtCompany(companyID,portalID).then(response => {
		    	return response	
		    }).catch(err =>{
				throw err
			})
	},
	getContactIDsByCompanyID: (companyID,portalID) => {		
		    return getContactVIDsAtCompany(companyID,portalID).then(response => {
		    	return response	
		    }).catch(err =>{
				throw err
			})
	},
	addContactToCompany: (companyID,vid) => {
		var endpoint = `https://api.hubapi.com/companies/v2/companies/` + companyID + `/contacts/` + vid
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.put(endpoint,{},
				{headers: {"content-type": "application/json"}
			}).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.put(endpoint,{},
				{headers: {"Authorization": "Bearer " + token}
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	},
	removeContactFromCompany: (companyID,vid) => {
		var endpoint = `https://api.hubapi.com/companies/v2/companies/` + companyID + `/contacts/` + vid
		if(hubCache.get("config").type == "hapikey"){
			endpoint += `?hapikey=` + hubCache.get("config").value
			return axios.delete(endpoint).then(response =>{
				return response
			}).catch(err =>{
				return err
			})
		}else{
			var token = hubCache.get("config").value
			return axios.delete(endpoint,
				{headers: {"Authorization": "Bearer " + token }
			}).then(response => {
				return response
			}).catch(err => {
				return err
			})
		}
	}
}

function getCompanies(properties){
	var companies = []
	var propString = ""
	var endpoint = `https://api.hubapi.com/companies/v2/companies/paged`
	if(properties){
		for(var i = 0; i < properties.length; i++){
			propString += "&property=" + properties[i]
		}	
	}
	
	return new Promise(function(resolve,reject){
		
		toCall(0)
		//need this extra fn due to recursion
		function toCall(offset){
				//update the key
				if(hubCache.get("config").type == "hapikey"){
					var key = hubCache.get("config").value
					axios.get(endpoint + "?hapikey=" + key + '&offset=' + offset + propString)
				    .then(response =>{
				    companies = companies.concat(response.data.companies)
				    if (response.data['has-more']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				      
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}else{
					var token = hubCache.get("config").value
					axios.get(endpoint + '?offset=' + offset + propString,
						{headers: {"Authorization": "Bearer " + token }
					})
				    .then(response =>{
				    companies = companies.concat(response.data.companies)
				    if (response.data['has-more']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}//end of oauth block
				
		
		}//end of tocall function
		
	})//end of Promise
	

  }

function getRecentlyModifiedCompanies(){
	var companies = []
	var endpoint = `https://api.hubapi.com/companies/v2/companies/recent/modified`
	
	
	return new Promise(function(resolve,reject){
		
		toCall(0)
		//need this extra fn due to recursion
		function toCall(offset){
				//update the key
				if(hubCache.get("config").type == "hapikey"){
					var key = hubCache.get("config").value
					axios.get(endpoint + "?hapikey=" + key + '&offset=' + offset)
				    .then(response =>{
				    companies = companies.concat(response.data.results)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				      
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}else{
					var token = hubCache.get("config").value
					axios.get(endpoint + '?offset=' + offset,
						{headers: {"Authorization": "Bearer " + token }
					})
				    .then(response =>{
				    companies = companies.concat(response.data.companies)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}//end of oauth block
				
		
		}//end of tocall function
		
	})//end of Promise
	

  }


function getRecentlyCreatedCompanies(){
	var companies = []
	var endpoint = `https://api.hubapi.com/companies/v2/companies/recent/created`
	
	
	return new Promise(function(resolve,reject){
		
		toCall(0)
		//need this extra fn due to recursion
		function toCall(offset){
				//update the key
				if(hubCache.get("config").type == "hapikey"){
					var key = hubCache.get("config").value
					axios.get(endpoint + "?hapikey=" + key + '&offset=' + offset)
				    .then(response =>{
				    companies = companies.concat(response.data.results)
				    if (response.data['hasMore']){
				      	setTimeout(function(){
				      		toCall(response.data['offset'])      		
				      	},101)
				      
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}else{
					var token = hubCache.get("config").value
					axios.get(endpoint + '?offset=' + offset,
						{headers: {"Authorization": "Bearer " + token }
					})
				    .then(response =>{
				    companies = companies.concat(response.data.companies)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(companies)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}//end of oauth block
				
		
		}//end of tocall function
		
	})//end of Promise
	

}

function getContactsAtCompany(companyID,portalID){
	var contacts = []
	var endpoint = `https://api.hubapi.com/companies/v2/companies/`+ companyID + `/contacts?portalId=` + portalID

	
	
	return new Promise(function(resolve,reject){
		
		toCall(0)
		//need this extra fn due to recursion
		function toCall(vidOffset){
				//update the key
				if(hubCache.get("config").type == "hapikey"){
					var key = hubCache.get("config").value
					axios.get(endpoint + "&hapikey=" + key + '&vidOffset=' + vidOffset)
				    .then(response =>{
				    contacts = contacts.concat(response.data.contacts)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(contacts)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}else{
					var token = hubCache.get("config").value
					axios.get(endpoint + '&vidOffset=' + vidOffset,
						{headers: {"Authorization": "Bearer " + token }
					})
				    .then(response =>{
				    contacts = contacts.concat(response.data.companies)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(contacts)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}//end of oauth block
				
		}//end of tocall function
		
	})//end of Promise
	
}

function getContactVIDsAtCompany(companyID,portalID){
	var contacts = []
	var endpoint = `https://api.hubapi.com/companies/v2/companies/` + companyID + `/vids?portalId=` + portalID

	
	
	return new Promise(function(resolve,reject){
		
		toCall(0)
		//need this extra fn due to recursion
		function toCall(vidOffset){
				//update the key
				if(hubCache.get("config").type == "hapikey"){
					var key = hubCache.get("config").value
					axios.get(endpoint + "&hapikey=" + key + '&vidOffset=' + vidOffset)
				    .then(response =>{
				    contacts = contacts.concat(response.data.contacts)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(contacts)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}else{
					var token = hubCache.get("config").value
					axios.get(endpoint + '&vidOffset=' + vidOffset,
						{headers: {"Authorization": "Bearer " + token }
					})
				    .then(response =>{
				    contacts = contacts.concat(response.data.companies)
				    if (response.data['hasMore']){
				    	setTimeout(function(){
				    		toCall(response.data['offset'])      		
				    	},101)
				    }else{    	
				    	resolve(contacts)
				    }
				  }).catch(error => {
				  	//look through 429 error codes for daily or secondly(as in time) limit
					if(error.response.status == 404){
						var rejectObject = {
							advice: "You have a 404 error for endpoint not found.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 429){
						var rejectObject = {
							advice: "You have exceeded your call limit for the day.",
							error: error.response
						}
						reject(rejectObject)
					}else if(error.response.status == 401){
						var rejectObject = {
							advice: "You are not authorized to hit this endpoint.",
							error: error.response
						}
						reject(rejectObject)
					}else{
						var rejectObject = {
							advice: "You received a " + error.response.status + " error.",
							error: error.response
						}
						reject(rejectObject)
					}
				  })
				}//end of oauth block
				
		}//end of tocall function
		
	})//end of Promise
	
}
