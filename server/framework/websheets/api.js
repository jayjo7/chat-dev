	var Api = new Restivus(
	{
    	useDefaultAuth: false,
   	 	prettyJson: true
  	});


	Api.addRoute('sheetSync', {authRequired: false }, {

		get: 
		{
			action: function()
			{
				return {result:{ statusCode:'200', status:websheets.public.status.SUCCESS, data:'sheetSync' }}
			
			}
		},

		put:
		{



			action: function()
			{
				var collectiveResult = [];
				var sessionid = Meteor.uuid();

				var bodyJason = this.bodyParams;
				console.log(sessionid + ": sheetSync: Number of objects received in boday parms = " + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					console.log(sessionid + ': sheetSync: Received.bodyParams = ' + JSON.stringify(bodyJason, null, 4));

					for(var key in bodyJason)
					{
						console.log(sessionid + ': sheetSync: ' + key + ' = ' + bodyJason[key]);

						console.log(sessionid + ': sheetSync: Working with the worksheet = ' + key);

						var data= bodyJason[key];
						console.log(sessionid + ': sheetSync: Number of records received = ' + data.length);
						var result 			={};
						result.worksheet 	= key;
						result.status 		= websheets.public.status.SUCCESS;	
						
						for (i=0; i<data.length; i++)
						{


							for (var keyData in data[i])
							{
								console.log( sessionid + ': sheetSync: data [ ' + i  +' ] [' + keyData + ' ] = ' + data[i][keyData]);
							}

							try{

								if( isSupportedTab(key))
								{

									result = upsertSupportedTab(key, data[i], websheets.private.generic.UNIQUE_ID_NAME, websheets.private.generic.ORG_KEY_NAME, sessionid)

								}
								else
								{
							   		CollectionDriver.prototype.upsert(key, data[i], UNIQUE_ID_NAME, ORG_KEY_NAME , Meteor.bindEnvironment(function(err, doc){

							   			if (err) 
	          							{ 
										   		result.status 		=  websheets.public.status.FAILED;
												result.error		=  err;
	          							}  
	          							else
	          							{
	          									result.action 		= 'upsert';
												result.receiveddata =  data[i];
												if( ORDERS === key.toUpperCase())
												{
													Meteor.call('sendReadyNotification', sessionid, doc);
												}
	          							}	
							   		}));
							   	}
						   	}catch(e)
						   	{
						   		result.status 		=  websheets.public.status.FAILED;
								result.error		=  e;
						   	}
						}	
						collectiveResult.push(result);
					}	

					return  { result: { statusCode 	: 200,
										status 		: websheets.public.status.SUCCESS,
										data 		: collectiveResult,
										message 	: sessionid + ': sheetSync: Processed Sucessfully, investigate the result for individual result'
										}
							}									

				}
				else
				{
					return { result: { 	statusCode 	:  401,
										status 		:  websheets.public.status.FAILED,
										message 	:  sessionid + ': sheetSync: The request body is empty'
									 }
							}

				}

			}
		}

	});

	Api.addRoute('sheetSyncFull', {authRequired: false }, {

		get: 
		{
			action: function()
			{
				return {result:{ statusCode:'200', status:websheets.public.status.SUCCESS, data:'sheetSyncFull' }}
			}
		},

		put:
		{



			action: function()
			{
				var collectiveResult = [];
				var sessionid = Meteor.uuid();


				var dataFromDb 

				var bodyJason = this.bodyParams;
				console.log(sessionid + ': sheetSyncFull: Number of objects received in boday parms = ' + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					for(var key in bodyJason)
					{
						var result 		 	={};
						result.worksheet 	= key;
						result.status 		= websheets.public.status.SUCCESS;	
						var data= bodyJason[key];
						console.log(sessionid + ': data[0].orgname = ' + data[0][websheets.private.generic.ORG_KEY_NAME]);


						if(isSupportedTab(key))
						{

							var resultProcessSupportedTab = processSupportedTab (key, data, websheets.private.generic.UNIQUE_ID_NAME, websheets.private.generic.ORG_KEY_NAME, sessionid);
							for (keyResultProcessSupportedTab in resultProcessSupportedTab)
							{
								result[keyResultProcessSupportedTab] = resultProcessSupportedTab[keyResultProcessSupportedTab];
							}

						}
						else
						{
							CollectionDriver.prototype.findAll (key, { orgname : data[0][websheets.private.generic.ORG_KEY_NAME]}, Meteor.bindEnvironment(function(err,docFromDb)
							{
								console.log(sessionid + ': sheetSyncFull: Working with the worksheet = ' + key);

								if(err)
								{
									console.log(sessionid + ': sheetSyncFull: Trouble reteriving the data from mongodb :key = '+ key + ' : orgname = ' + data[0][websheets.private.generic.ORG_KEY_NAME]); 
									result.status 		= websheets.public.status.FAILED;	
									result.message      = sessionid + ': sheetSyncFull: Trouble reteriving the data from mongodb :key = ' + key + ' : orgname = ' + data[0][websheets.private.generic.ORG_KEY_NAME]
									result.error		= err;
								}
								else
								{
									dataFromDb = docFromDb;
									console.log(sessionid + ': sheetSyncFull: Size of array received from db : '+ dataFromDb.length);

							    	console.log(sessionid + ': sheetSyncFull: Number of records received = ' + data.length);

							    	for(var i=0; i<data.length; i++)
							    	{
							    		console.log ( sessionid + ': sheetSyncFull: data[' + i + '].UniqueId = ' + data[i].UniqueId);

							    		for(var keyFromDB in dataFromDb)
							    		{
							    			//console.log("sheetSyncFull: Data From DB Key = " + keyFromDB);
							    			//console.log("sheetSyncFull: UniqueId = " + dataFromDb[keyFromDB].UniqueId);
							  		    	//console.log("sheetSyncFull: _id= " + dataFromDb[keyFromDB]._id);
					  		

							    			if(data[i][websheets.private.generic.UNIQUE_ID_NAME] === dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME])
							    			{
							    				dataFromDb.splice(keyFromDB, 1);
							    				break;
							    			}
							    		}
							    	}
							    }

							    console.log(sessionid + ': sheetSyncFull: Size of array received from db after check : '+ dataFromDb.length);

							    //var fullSyncResult=[];

								for(var keyFromDB in dataFromDb)
							    {
							    	console.log (sessionid + ': sheetSyncFull: Deleting _id = ' + 	 dataFromDb[keyFromDB]._id);
							    	console.log (sessionid + ': sheetSyncFull: uniqueid     = ' + 	 dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME]);

							    	CollectionDriver.prototype.delete(key, dataFromDb[keyFromDB]._id, Meteor.bindEnvironment(function(err, doc)
							    	{
							    		console.log (sessionid + ': sheetSyncFull: doc on delete = ' + JSON.stringify(doc, null, 4))

							    		if(err)
							    		{
							    			console.log (sessionid + ': sheetSyncFull: Trouble deleting the record with UniqueId : ' + dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME]);
							    			console.log (sessionid + ': error = ' + err);
											result.status 		= websheets.public.status.FAILED;	
											result.message      = sessionid + ': sheetSyncFull: Trouble deleting the record with UniqueId : ' + dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME];
											result.data         = dataFromDb[keyFromDB];
											result.error		= err;
										}
							    		else
							    		{

							    			console.log (sessionid + ': sheetSyncFull: Sucessfully deleted the record with UniqueId : ' + dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME]);
							    			
							    		}
							    	}));


							    }	


								for (i=0; i<data.length; i++)
								{

							   			CollectionDriver.prototype.upsert(key, data[i], websheets.private.generic.UNIQUE_ID_NAME, websheets.public.generic.ORG_KEY_NAME , Meteor.bindEnvironment(function(err,doc) 
							   			{
							   				console.log (sessionid + ': sheetSyncFull: doc on upsert = ' + JSON.stringify(doc, null, 4))

					          				if (err) 
					          				{ 
							    				console.log (sessionid + ': sheetSyncFull: Trouble upserting the record with UniqueId : ' + data[i][websheets.private.generic.UNIQUE_ID_NAME]);
												result.status 		= websheets.public.status.FAILED;	
												result.message      = sessionid + ': sheetSyncFull: Trouble upserting the record with UniqueId : ' + data[i][websheets.private.generic.UNIQUE_ID_NAME];
												result.data         = data[i][websheets.private.generic.UNIQUE_ID_NAME]
												result.error		= err;				          					

					          				}  
	          							    else
	          							    {
	          									result.action 		= 'upsert';
												result.receiveddata =  data[i];
												if( websheets.public.generic.ORDERS === key.toUpperCase())
												{
													Meteor.call('sendReadyNotification', sessionid, doc);
												}
	          							    }
					     			}));
								}


						



							}));
						}
					collectiveResult.push(result);
					}

					return  { result: { statusCode 	: 200,
										status 		: websheets.public.status.SUCCESS,
										data 		: collectiveResult,
										message 	: sessionid + ': sheetSyncFull: Processed Sucessfully, investigate the result for individual result'
										}
							}	


				}
				else
				{

					return { result: { 	statusCode 	:  401,
										status 		:  websheets.public.status.FAILED,
										message 	: sessionid + ': sheetSyncFull: The request body is empty'
									 }
							}

				}					

				
			}

		}

});





    function isSupportedTab(tabName)
    {

    	if (SupportedTabs.findOne({'tabName': tabName}))
    	{
    		return true;
    	}
    	else 
    	{
    		return false;
    	}


    }


    function upsertSupportedTab(collectionName, data , UniqueId_key, orgname, sessionid)
    {

		console.log(sessionid + ": upsertSupportedTab: processing supported tab = " + collectionName);
		console.log(sessionid + ": upsertSupportedTab: UniqueId_key  			= " + UniqueId_key);
		console.log(sessionid + ": upsertSupportedTab: Data      				= " + JSON.stringify(data, null, 4));


    	var result 			={};

    	try{

	    	switch (collectionName.toUpperCase())
	    	{
	    		case websheets.private.generic.MENU:
	    		
	    			data.Name = s(data.Name).trim().titleize().value();
	    			Menu.update({ UniqueId : data[UniqueId_key], orgname : data[orgname]}, data,{upsert:true});

	    			break;

	    		case websheets.private.generic.ORDERS:

	    			Orders.update({ UniqueId : data[UniqueId_key], orgname : data[orgname]}, data,{upsert:true});
	    			Meteor.call('sendReadyNotification', sessionid, data);

	    			break;

	    		case websheets.private.generic.CONTENT:
	    			Content.update({ UniqueId : data[UniqueId_key], orgname : data[orgname]}, data,{upsert:true});
	    			break;

	    	    case websheets.private.generic.SETTINGS:
	    	    	Settings.update({ UniqueId : data[UniqueId_key], orgname : data[orgname]}, data,{upsert:true});
	    			break;	

	    		default:
	    		 	throw new Meteor.Error("Trying to process unsupported tab" );

	    	}
	        result.action 		=   'upsertSupportedTab';
			result.receiveddata = 	data;
			result.tabName 		= 	collectionName;
			result.UniqueId_key = 	UniqueId_key;

    	}catch (err)
    	{
    			result.status 		=  websheets.public.status.FAILED;
				result.error		=  err;
				result.errorStack   =  err.stack
		  		console.log(sessionid + ": upsertSupportedTab: Caught error on upserting data from sheet", err);
		  		console.log(sessionid + ": upsertSupportedTab: collectionName ( Tab Name ) = " + collectionName);
		  		console.log(sessionid + ": upsertSupportedTab: UniqueId_key  	= " + UniqueId_key);
		  		console.log(sessionid + ": upsertSupportedTab: Data      		= " + JSON.stringify(data, null, 4));
		  		console.log(sessionid + ": upsertSupportedTab: Jay Todo: Send Email Notification to Webmaster and Owner");
		

    	}
		 console.log(sessionid + ": upsertSupportedTab: returing result from upsertSupportedTab = " + JSON.stringify(result, null, 4));

    	return result;



    }





    function removeSupportedTab(collectionName, data , UniqueId_key, orgname, sessionid)
    {

		console.log(sessionid + ": removeSupportedTab: processing supported tab = " + collectionName);
		console.log(sessionid + ": removeSupportedTab: UniqueId_key  			= " + UniqueId_key);
		console.log(sessionid + ": removeSupportedTab: Data      				= " + JSON.stringify(data, null, 4));


    	var result 			={};
    	var resultOnDelete='';

    	try{

	    	switch (collectionName.toUpperCase())
	    	{
	    		case websheets.private.generic.MENU:
	    			resultOnDelete = Menu.remove({ _id:data._id, UniqueId : data[UniqueId_key], orgname : data[orgname]});

	    			break;

	    		case websheets.private.generic.ORDERS:

	    			resultOnDelete =  Orders.remove({ _id:data._id, UniqueId : data[UniqueId_key], orgname : data[orgname]});

	    			break;

	    		case websheets.private.generic.CONTENT:
	    			resultOnDelete = Content.remove({ _id:data._id, UniqueId : data[UniqueId_key], orgname : data[orgname]});
	    			break;

	    	    case websheets.private.generic.SETTINGS:
	    	    	resultOnDelete = Settings.remove({ _id:data._id, UniqueId : data[UniqueId_key], orgname : data[orgname]});
	    			break;	

	    		default:
	    		 	throw new Meteor.Error("Trying to process unsupported tab" );

	    	}
	        result.action 			=   'removeSupportedTab';
			result.receiveddata 	= 	data;
			result.tabName 			= 	collectionName;
			result.UniqueId_key 	= 	UniqueId_key;
			result.resultOnDelete 	=   resultOnDelete;

    	}catch (err)
    	{
    			result.status 		=  websheets.public.status.FAILED;
				result.error		=  err;
				result.errorStack   =  err.stack
		  		console.log(sessionid + ": removeSupportedTab: Caught error on upserting data from sheet", err);
		  		console.log(sessionid + ": removeSupportedTab: collectionName ( Tab Name ) = " + collectionName);
		  		console.log(sessionid + ": removeSupportedTab: UniqueId_key  	= " + UniqueId_key);
		  		console.log(sessionid + ": removeSupportedTab: Data      		= " + JSON.stringify(data, null, 4));
		  		console.log(sessionid + ": removeSupportedTab: Jay Todo: Send Email Notification to Webmaster and Owner");
		

    	}
		 console.log(sessionid + ": removeSupportedTab: returing result from removeSupportedTab = " + JSON.stringify(result, null, 4));

    	return result;



    }


    function findSupportedTab(collectionName, data , UniqueId_key, orgname, sessionid)
    {

		console.log(sessionid + ": findSupportedTab: processing supported tab = " + collectionName);
		console.log(sessionid + ": findSupportedTab: UniqueId_key  = " + UniqueId_key);
		console.log(sessionid + ": findSupportedTab: Data      = " + JSON.stringify(data, null, 4));


    	var result 			={};
    	var dataFromDb;		

    	try{

	    	switch (collectionName.toUpperCase())
	    	{
	    		case websheets.private.generic.MENU:
	    			dataFromDb = Menu.find({orgname : data[orgname]});

	    			break;

	    		case websheets.private.generic.ORDERS:

	    			dataFromDb =  Orders.find({orgname : data[orgname]});

	    			break;

	    		case websheets.private.generic.CONTENT:
	    			dataFromDb = Content.find({orgname : data[orgname]});
	    			break;

	    	    case websheets.private.generic.SETTINGS:
	    	    	dataFromDb = Settings.find({orgname : data[orgname]});
	    			break;	

	    		default:
	    		 	throw new Meteor.Error("Trying to process unsupported tab" );

	    	}
	        result.action 		=   'findSupportedTab';
			result.receiveddata = 	data;
			result.tabName 		= 	collectionName;
			result.UniqueId_key	= 	UniqueId_key;
			result.dataFromDb   =   dataFromDb.fetch();

    	}catch (err)
    	{
    			result.status 		=  websheets.public.status.FAILED;
				result.error		=  err;
				result.errorStack   =  err.stack
		  		console.log(sessionid + ": findSupportedTab: Caught error on upserting data from sheet", err);
		  		console.log(sessionid + ": findSupportedTab: collectionName ( Tab Name ) = " + collectionName);
		  		console.log(sessionid + ": findSupportedTab: UniqueId_key  	= " + UniqueId_key);
		  		console.log(sessionid + ": findSupportedTab: Data       	= " + JSON.stringify(data, null, 4));
		  		console.log(sessionid + ": findSupportedTab: Jay Todo: Send Email Notification to Webmaster and Owner");
		

    	}
    	 console.log(sessionid + ": findSupportedTab: " + collectionName + "count () = " + dataFromDb.count());

		 //console.log(sessionid + ": findSupportedTab: returing result from findSupportedTab = " + JSON.stringify(result, null, 4));

    	return result;



    }


    function processSupportedTab( collectionName, data, UniqueId_key, orgname, sessionid)
    {
    	result = {};
    	var supportedTabCursor = findSupportedTab(collectionName, data[0] , UniqueId_key, orgname, sessionid);
    	console.log(sessionid + ": processSupportedTab: " + collectionName + "count () = " + supportedTabCursor.dataFromDb.length);
    	for(var i=0; i<data.length; i++)
		{
			console.log ( sessionid + ': processSupportedTab: data[' + i + '].UniqueId = ' + data[i].UniqueId);

			for(var keyFromDB in supportedTabCursor.dataFromDb)
			{
				//console.log("processSupportedTab: Data From DB Key = " + keyFromDB);
				//console.log("processSupportedTab: UniqueId = " + dataFromDb[keyFromDB].UniqueId);
				//console.log("processSupportedTab: _id= " + dataFromDb[keyFromDB]._id);
				  		

				if(data[i][websheets.private.generic.UNIQUE_ID_NAME] === supportedTabCursor.dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME] )
				{
					supportedTabCursor.dataFromDb.splice(keyFromDB, 1);
					break;
				}
			}


		}

		console.log(sessionid + ': processSupportedTab: Size of array received from db after check : '+ supportedTabCursor.dataFromDb.length);
		result.recordsToBeDeleted= supportedTabCursor.dataFromDb.length;

		var deletedRecords =[];

		for(var keyFromDB in supportedTabCursor.dataFromDb)
		{
			console.log (sessionid + ': processSupportedTab: Deleting _id = ' + 	 supportedTabCursor.dataFromDb[keyFromDB]._id);
			console.log (sessionid + ': processSupportedTab: uniqueid     = ' + 	 supportedTabCursor.dataFromDb[keyFromDB][websheets.private.generic.UNIQUE_ID_NAME]);


			var resultOnRemove = removeSupportedTab(collectionName, supportedTabCursor.dataFromDb[keyFromDB], websheets.private.generic.UNIQUE_ID_NAME, websheets.private.generic.ORG_KEY_NAME, sessionid)
			deletedRecords.push(resultOnRemove);


		}	

		 result.deletedRecords = deletedRecords;

		 //done deleting the records

		 //upsert records from the sheet

		 var upsertedRecords =[];

		for (i=0; i<data.length; i++)
		{

			var resultOnUpsert = upsertSupportedTab(collectionName, data[i], websheets.private.generic.UNIQUE_ID_NAME, websheets.private.generic.ORG_KEY_NAME, sessionid)
			upsertedRecords.push(resultOnUpsert);


		}
		result.upsertedRecords = upsertedRecords;
		 console.log(sessionid + ": findSupportedTab: returing result from findSupportedTab = " + JSON.stringify(result, null, 4));

		 return result;
    }


