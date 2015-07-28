Meteor.methods({

	sendReadyNotification: function(sessionid, doc){

		console.log(sessionid +':sendReadyNotification: doc.UniqueId= ' + doc.UniqueId);


			if(doc.StatusCode == websheets.public.orderStateCode.THREE)
			{
				try
				{
					var ordersMeta = OrdersMeta.findOne({UniqueId:doc.UniqueId, orgname:doc.orgname});
					console.log(sessionid +':sendReadyNotification: ordersMeta.UniqueId = ' + ordersMeta.UniqueId);

					if( ! ordersMeta.readyNotificationStatus || 
						  (
						  	ordersMeta.readyNotificationStatus.email.emailCustomer.status !== websheets.public.status.SUCCESS &&
						  	ordersMeta.readyNotificationStatus.sms.smsCustomer.status     !== websheets.public.status.SUCCESS
						  )
					  )
					{

						var readyNotificationStatus 	= 	{
				  						   						'email'		:{},
				  						   						'sms'		:{}
				  											};

				  		var emailCustomer 	=	{};
				  		var emailWebmaster 	= 	{};
				  		var smsCustomer		= 	{};
				  		var smsWebmaster	= 	{};	

						 //Start Sending Email
					 	if(isEmailEnabled(doc.orgname))
					 	{
					 		readyNotificationStatus.email.status = websheets.public.status.ENABLED;

					 		if(isEmailMailgun(doc.orgname))
					 		{
							 		//Customer Email
								 	if(doc.CustomerEmail && isEmailCustomer(doc.orgname))
								 	{

								 		try{
										 	var response = Meteor.call('emailOrderReady',sessionid, doc, websheets.private.generic.CUSTOMER);
										    console.log(JSON.stringify(response, null, 4));

										 	for(var key in response)
										 	{
										 		emailCustomer [key] = response[key];
										 	}

										 	if(response.result.error)
					            			{
					            				emailCustomer.status 	= websheets.public.status.FAILED;
					                            emailCustomer.error 	= response.result.error.statusCode;
					            			}


										}catch (e)
										{
											console.log(sessionid+ ":sendReadyNotification: trouble sending email: " + e);
											console.log(sessionid+ ":sendReadyNotification: Jay Todo: Send Email Notification to Webmaster and Owner");
											emailCustomer.status 		= websheets.public.status.FATAL;
											emailCustomer.error 		= e.toString();
											emailCustomer.errorStack	= e.stack;	
											
										}

								 	}
								 	else
								 	{
								 		console.log(sessionid+ ':sendReadyNotification: customer opt not receive email')
								 		emailCustomer.status 	=	websheets.public.status.ENABLED;

								 	}

								 	readyNotificationStatus.email.emailCustomer = emailCustomer;

								 	//Webmaster Email
								 	if(isEmailWebmaster(doc.orgname))
								 	{
								 		try{
										 	var response = Meteor.call('emailOrderReady', sessionid, doc, websheets.private.generic.WEBMASTER);
										 	for(var key in response)
										 	{
										 		emailWebmaster [key] = response[key];
										 	}
										 	if(response.result.error)
					            			{
					            				emailWebmaster.status 	= websheets.public.status.FAILED;
					                            emailWebmaster.error 	= response.result.error.statusCode;
					            			}

										}catch (e)
										{
											console.log(sessionid+ ":sendReadyNotification: trouble sending email: " + e);
											console.log(sessionid+ ":sendReadyNotification: Jay Todo: Send Email Notification to Webmaster and Owner");
											emailWebmaster.status 		= websheets.public.status.FATAL;
											emailWebmaster.error 		= e.toString();
										    emailWebmaster.errorStack	= e.stack;	

										}

								 	}
								 	else
								 	{
								 		console.log(sessionid+ ':sendReadyNotification:  Not configured to send email to the Webmaster')
								 		emailWebmaster.status 	=	websheets.public.status.ENABLED;	
								 	}	
								 	readyNotificationStatus.email.emailWebmaster = emailWebmaster;
						 	}
						 	else
						 	{
						 		console.log(sessionid+ ": Client is configured for sending email, but no vendor api enabled - Fatal");
								readyNotificationStatus.email.status 	= websheets.public.status.FATAL;
								readyNotificationStatus.email.error 	= 'Client is configured for sending email, but no vendor api enabled - Fatal'

						 	}
						}
						else
						{
						 	console.log(sessionid+ ':sendReadyNotification:  Email is not enabled for this client')
					 		readyNotificationStatus.email.status 	=	websheets.public.status.ENABLED;

						}

					 	console.log(sessionid+ ":sendReadyNotification:  Done sending order ready email");
						//Ens Sending the Email
						//Start Sending the SMS
						if(isSmsEnabled(doc.orgname))
						{
							if (isSmsTwilio(doc.orgname))
							{
									if(doc.CustomerPhone && isSmsCustomer(doc.orgname))
									{
										try{
										 	var response = Meteor.call('smsOrderReady', sessionid, doc, doc.CustomerPhone);
										 	for(var key in response.result)
										 	{
										 		console.log(key + ' = ' + response.result[key]);
										 		smsCustomer[key] = response.result[key];
										 	}

										}catch (e)
										{
											console.log(sessionid+ ':sendReadyNotification: trouble sending sms to customer: ' + e);
											console.log(sessionid+ ':sendReadyNotification: Jay Todo: Send Email Notification to Webmaster and Owner');
											smsCustomer.status 		= websheets.public.status.FATAL;
											smsCustomer.error 		= e.toString();
											smsCustomer.errorStack 	= e.stack;
										}

									}
									else
									{
										console.log(sessionid+ ':sendReadyNotification: customer opt not receive sms')
								 		smsCustomer.status 	=	websheets.public.status.ENABLED;	

									} 
									readyNotificationStatus.sms.smsCustomer = smsCustomer;

									if(isSmsWebmaster(doc.orgname))
									{

										try{
										 	var response = Meteor.call('smsOrderReady', sessionid,  doc, webmasterPhoneNumberText(doc.orgname), websheets.private.generic.WEBMASTER);
										 	for(var key in response.result)
										 	{
										 		console.log(key + ' = ' + response.result[key]);
										 		smsWebmaster[key] = response.result[key];
										 	}

										}catch (e)
										{
											console.log(sessionid+ ':sendReadyNotification: trouble sending sms to Webmaster: ' + e);
											console.log(sessionid+ ':sendReadyNotification: Jay Todo: Send Email Notification to Webmaster and Owner');
											smsWebmaster.status 	= websheets.public.status.FATAL;
											smsWebmaster.error 		= e.toString();
											smsWebmaster.errorStack	= e.stack;
											
										}					

									}
									else
									{
										console.log(sessionid+ ':sendReadyNotification: Not configured to send email to the Webmaster')
										smsWebmaster.status 	=	websheets.public.status.ENABLED;	 	
										
									}
									readyNotificationStatus.sms.smsWebmaster = smsWebmaster;
							}
							else
							{

								console.log(sessionid+ ':sendReadyNotification: Client is configured for sending sms, but no vendor api enabled - Fatal');
								readyNotificationStatus.sms.status 	= websheets.public.status.FATAL;
								readyNotificationStatus.sms.error 	= 'Client is configured for sending sms, but no vendor api enabled - Fatal'

							}

						}
						else
						{
							console.log(sessionid+ ':sendReadyNotification: SMS is not enabled for this client')
					 		readyNotificationStatus.sms.status 	=	websheets.public.status.ENABLED;
						}

					 	console.log(sessionid+ ": Done sending order ready sms");	
						//End Sending the SMS


					 	//Jay:TODO: Examine the readyNotificationStatus object and handle it appropriately,

					 	console.log(sessionid+ ': Ready Notification Status' +  JSON.stringify(readyNotificationStatus, null, 4))
					 	OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {readyNotificationStatus: readyNotificationStatus}});

					}
					else
					{
						console.log(sessionid + ': Ready notifciation is already sent ( Order Number = ' + doc.OrderNumber +' )')
					}

				}catch(e)
				{
					console.log(sessionid + ': Trouble sending order ready notification ' + e);
					console.log(sessionid + ': Jay TODO - Review and handle the error');

				}


			}
			else
			{
				console.log(sessionid + ': StatusCode is not ready, ignoring ( Order Number = ' + doc.OrderNumber +', StatusCode = ' + doc.StatusCode +' )' );

			}


	}




});
