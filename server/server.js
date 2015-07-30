Meteor.methods({
	//cartItem.qty
	//cartItem.product
	//cartItem.session
	//cartItem.Name
    //cartItem.Category
    //cartItem.Price
    //cartItem.orgname
    //cartItem.cartId
    //cartItem.addToCartToggle 	: Value from Settings.json Meteor.settings.public[orgname]. addToCartToggle
    //cartItem.singlePricedItem : boolean (true | false)
    //cartItem.itemSize
    //cartItem.spiceLevel
    //cartItem.messageToKitchenByItem
    //cartItem.isMultiPriceItem
    


	addToCart:function(cartItem)
	{
		qty = Number (cartItem.qty);
		if(qty > 0)
		{
			var now = Meteor.call('getLocalTime', cartItem.orgname);
			console.log(cartItem.session + ' addToCart:now = ' + now);
			cartItem.dateAdded = now;

			switch (cartItem.addToCartToggle)
        	{
            	case  websheets.public.generic.INCREMENT :

            		if(cartItem.singlePricedItem)
            		{
            			var itemFromCart = CartItems.findOne({product:cartItem.product, session:cartItem.session});
            			if(itemFromCart)
            			{
            				cartItem.qty += itemFromCart.qty;

            			}

            			cartItem.totalPrice = cartItem.Price * cartItem.qty;	
            			

						console.log(cartItem.session + ': addToCart: totalPrice (Increment - Single pricied Item) = ' +cartItem.totalPrice);


						CartItems.update({product:cartItem.product, session:cartItem.session}, cartItem, {upsert:true});

						console.log(cartItem.session + ': addToCart: Added (Increment - Single pricied Item) the product = ' +cartItem.product  + ' for session id = ' + cartItem.session + 'for orgname = ' + cartItem.orgname + ' qty = ' + cartItem.qty); 

            		}
            		else
            		{

            			cartItem.totalPrice = cartItem.Price * cartItem.qty;

						console.log(cartItem.session + ': addToCart: totalPrice (Increment - Multi pricied Item) = ' +cartItem.totalPrice);

		
						CartItems.insert(cartItem);

						console.log(cartItem.session+ ': addToCart: Added (Increment - Multi pricied Item) the product = ' + cartItem.product  + ' for session id = ' + cartItem.session + 'for orgname = ' + cartItem.orgname +' qty = ' + cartItem.qty); 

            		}
                	break;

            	default:

					cartItem.totalPrice = cartItem.Price * cartItem.qty;

					console.log(cartItem.session+ ': addToCart:totalPrice = ' + cartItem.totalPrice);

					console.log(cartItem.session + ': cartId = '+ cartItem.cartId);

					CartItems.update({_id:cartItem.cartId, product:cartItem.product, session:cartItem.session}, cartItem ,{upsert:true});

					console.log(cartItem.session + ': addToCart: Added the product = ' + cartItem.product  + ' for session id = ' + cartItem.session + 'for orgname = ' + cartItem.orgname + ' and cartId = '+ cartItem.cartId +' qty = ' + cartItem.qty);        

        	}


			
		}
		else if (qty=== 0) 
		{
				console.log(cartItem.session + ': addToCart: Quantity is Zero');

				CartItems.remove ({_id:cartItem.cartId,product:cartItem.product, session:cartItem.session, orgname:cartItem.orgname}, function(error, result){

					if (error)
					{
						console.log(cartItem.session+ ': addToCart: Trouble removing the product = ' + cartItem.product  + ' for session id = ' + cartItem.session);
					}

				});

		}
		else
		{
				console.log('addToCart: Invalid Quantity');

		}
	},
	
	removeCartItem:function(product,sessionId, orgname, cartId)
	{
		console.log('Removing from Cart: Sessionid = ' + sessionId + ' :: product = ' +product + ': CartId = ' + cartId);
		if(cartId)
		{
			CartItems.remove({_id:cartId, session:sessionId, product:product, orgname:orgname});
		}
		else
		{
			CartItems.remove({session:sessionId, product:product, orgname:orgname});
		}
	},

	removeAllCartItem:function(sessionId)
	{
		CartItems.remove({session:sessionId});
	},

	getOrder:function(sessionId, orgname)
	{

		console.log("sessionId = " + sessionId);
		var order = Orders.findOne({UniqueId:sessionId, orgname:orgname});
		console.log("order = " + order);

		return order;
	},

	getNextSequenceValue: function ()
	{
		
		try{

			var currentId = Counters.findOne({},{sort:{orderNumber:-1}}) || 1;

			for(var key in currentId)
			{
			    console.log("getNextSequenceValue: currentId: " + key + " = " + currentId[key]);
			}

        	var nextOrderumber= Number (currentId.orderNumber) + 1;
        	Counters.insert({orderNumber:nextOrderumber});
        	console.log("getNextSequenceValue: nextOrderumber: " + nextOrderumber);

        	var sequence = Counters.findOne({orderNumber:nextOrderumber});
        	for(var key in sequence)
        	{
        		console.log("getNextSequenceValue: sequence: " + key + " = " +sequence[key]);
        	}

        	return sequence;

        }catch(error)
        {
        			console.log(error);
        }
   	
	},

	updateOrderStatus: function(sessionId, orgname, UniqueId, OrderNumber, toStatusCode)
	{
		console.log(sessionId + ': OrderNumber  = ' + OrderNumber);
		console.log(sessionId + ': toStatusCode = ' + toStatusCode);
		if(! OrderNumber || ! toStatusCode)
		{
			console.log(sessionId + ': OrderNumber or toStatusCode is not avail, fetching from database for given UniqueId = ' + UniqueId  );
			var orderFromDb = Orders.findOne({orgname:orgname, UniqueId: UniqueId});
			for(var keyOrderFromDb in orderFromDb)
			{
				console.log(sessionId + ': orderFromDb: ' + keyOrderFromDb + ' = ' + orderFromDb[keyOrderFromDb]);
			}
			OrderNumber 	= orderFromDb.OrderNumber;
			toStatusCode 	= orderFromDb. StatusCode + 1;


		}

		console.log(sessionId + ': update order status: orgname = ' + orgname + ' orderNumber = ' + OrderNumber + ' : UniqueId = ' + UniqueId + ': toStatusCode = ' + toStatusCode);
		Orders.update ({orgname:orgname, UniqueId: UniqueId, OrderNumber:OrderNumber },{$set: {StatusCode: toStatusCode, Status:statusDescription(toStatusCode)}} );

	},


	orderItems: function(sessionId, contactInfo, sequence, orgname, cardToken, callback)
	{

			console.log(sessionId + ' :In OrderItems');
			console.log(sessionId + ' :orgname = ' + orgname);


			for(var key in sequence)
        	{
        		console.log(sessionId + " :sequence: " +key + " = " +sequence[key]);
        	}

			var order 				= {};
			order.orgname     		= orgname;
			order.sessionId 		= sessionId;
			order.Status 			= websheets.public.orderState.ONE;
			order.StatusCode		= websheets.public.orderStateCode.ONE;
			order.OrderNumber 		= sequence.orderNumber;
			order.UniqueId 			= sequence._id;
			order.TimeOrderReceived = Meteor.call('getLocalTime', orgname );
			order.CustomerName 		= contactInfo.contactName;
			order.CustomerPhone 	= contactInfo.phoneNumber;
			order.CustomerEmail 	= contactInfo.email;
			order.MessageToKitchen 	= contactInfo.messageToKitchen;
			order.osmLink			= rootUrl(order.orgname) +'/osm/'+ order.UniqueId;;

			var itemString='';
			var items=[];

			var itemsInCart= CartItems.find({session:sessionId, orgname:orgname});

			console.log(sessionId + ' :Number of items in cart for session ' + sessionId
				+ ', contact  ' + order.CustomerPhone + ' ' +order.CustomerEmail +' = ' + itemsInCart.count());

			var totalItemCount = 0;
			var subTotal = 0;

			itemsInCart.forEach (function (cartitems)
			{
				totalItemCount += Number(cartitems.qty);

				for(key in cartitems)
				{
					console.log(sessionId + " :cartitems: " + key + "  =  " + cartitems[key]);
				}


				subTotal +=  (Number(cartitems.Price) * cartitems.qty);
				itemString = itemString + cartitems.qty + " - " + cartitems.Name;
				if(cartitems.itemSize)
				{
					itemString += ' [Size - ' + cartitems.itemSize + ']';
				}
				if(cartitems.spiceLevel)
				{
					itemString += '[SpiceLevel - ' + cartitems.spiceLevel + ']';
				}
				if(cartitems.messageToKitchenByItem)
				{
					itemString += ' [Message - ' + cartitems.messageToKitchenByItem + ']';
				}

				itemString += '\n';

   				items.push(
   				{ 
        				"name" 						: cartitems.Name,
        				"qty"  						: cartitems.qty,
						"itemSize"					: cartitems.itemSize,  			
        				"spiceLevel" 				: cartitems.spiceLevel,
						"messageToKitchenByItem" 	: cartitems.messageToKitchenByItem
				});

				cartitems.UniqueId = order.UniqueId;

				try{

					OrderedItems.update({product:cartitems.product, _id:cartitems._id, orgname:orgname},cartitems,{upsert:true});
				}catch (exception)
				{
					console.log(sessionId + ' :exception on OrderedItems Update = ' + exception);
					throw exception;

				}


   			});

			console.log(sessionId + " :Done with Calculating " );



			order.itemsObject 		= items;
			order.Items 			= itemString.substring(0, itemString.length-1); // Substring to get rid of the last new character
			order.TotalItem 		= totalItemCount;	
			order.SubTotal 			= Number (subTotal.toFixed(2));


			var tax 				= Meteor.call('getSetting', 'tax', orgname);
			var sale_discount 		= Meteor.call('getSetting', 'sale_discount', orgname);

            var taxValue 			= Number(tax);
            var sale_discountValue 	= Number(sale_discount);
            order.taxValue      	= taxValue;
            order.saleDiscountValue = sale_discountValue;            
            console.log(sessionId + ' :tax ( Tax from sheet )			= ' + taxValue );
            console.log(sessionId + ' :discount ( Discount from sheet )	= ' + sale_discountValue );



            if(sale_discountValue > 0 && taxValue > 0)
            {
                order.discount               = order.SubTotal * sale_discountValue;
                order.subtotalAfterDiscount  = order.SubTotal - order.discount;
                order.tax                    = order.subtotalAfterDiscount  * taxValue;
                order.Total                  = Number((order.subtotalAfterDiscount + order.tax).toFixed(2));
            }
            else
            if (sale_discountValue > 0 && taxValue <= 0)

            {
                order.discount               = order.SubTotal * sale_discountValue;
                order.subtotalAfterDiscount  = order.SubTotal - order.discount;
                order.Total                  = Number((order.subtotalAfterDiscount).toFixed(2));

            }
            else
            if (sale_discountValue <=  0 && taxValue > 0)
            {
                 order.tax 		= order.SubTotal* taxValue;
                 order.Total 	= Number((order.SubTotal + order.tax).toFixed(2));


            } 
            else
            {
               	order.Total = Number((order.SubTotal).toFixed(2));

            }


			if(cardToken)
			{
				order.Payment='Online';
				order.cardToken = cardToken;
            }
            else
            {

            	order.Payment='At Pickup';

            }	

            console.log(sessionId + " : Here is the completed Order Object: " + JSON.stringify(order, null, 4));

            try{

			   	Orders.insert(order);
			   	console.log(sessionId + " :Order insert complete" );

			   	OrdersMeta.insert(order, function(error, doc){
			   		if(error)
			   		{
			   			console.log(sessionId + " : Error inserting OrdersMet : "  + error);

			   		}
			   		else
			   		{
			   			console.log(sessionId + " : Done with inserting OrdersMeta")
			   		}

			   	});
			   	console.log(sessionId + " :OrdersMeta insert complete" );

			}catch(e)
			{
				console.log(sessionId + " :trouble insert the order ["+ order.OrderNumber + "] to mongodb " + order);
				throw new Meteor.Error(e);

			}
			try{

			 	CartItems.remove({session:sessionId, orgname:orgname});
			 	console.log(sessionId + " :CartItems remove complete" );


			}catch(e)
			{
				config.log(sessionId + " : trouble removing the items from CartItems collection; orderNumber ["+ order.OrderNumber + "]" );
				
			}

		return order;

	
	}
});


Orders.after.update (function (userId, doc, fieldNames, modifier, options) 
{
  // this.previous  --- Will contain the doc previous to update, if previous doc is needed update the fetchPrevious: true

   console.log('Orders.after.update:userId     = ' + userId);
   console.log('Orders.after.update:doc        = ' + JSON.stringify(doc, null, 4));
   console.log('Orders.after.update:fieldNames = ' + JSON.stringify(fieldNames, null, 4));
   console.log('Orders.after.update:modifier   = ' + JSON.stringify(modifier, null, 4));
   console.log('Orders.after.update:options    = ' + JSON.stringify(options, null, 4));
   console.log('fieldNames[0]                  = ' + fieldNames[0]);

   if(fieldNames[0] !== "sheetRowId")
   {

	   doc.Operation = 'Update';
	    var orderUpdateStatus	= 	{
	  						   		'websheets'	:{},

	  							};


	   	try{
		  		var count = 0;
		  		orderUpdateStatus.websheets.status 	= websheets.public.status.SUCCESS;
		  		var response;
		  		do
		  		{
		  			count +=1;
		  			response = Meteor.call('postWebsheets', doc);
		  			console.log(doc.sessionId + ": update attempted count = " + count );
		  		}while (count < websheets.private.generic.WEBSHEETS_MAX_RETRY && response.statusCode !== 200)

		  		if(response.statusCode !== 200)
		  		{
		  			console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
		  			orderUpdateStatus.websheets.status 	= websheets.public.status.FAILED;
		  		}
		  		else
		  		{
		  			orderUpdateStatus.websheets.response  = response ;
		  			Orders.update({UniqueId:doc.UniqueId},     {$set: {sheetRowId : response.data.sheetRowId}});
					OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {sheetRowId : response.data.sheetRowId}});
					Meteor.call('sendReadyNotification', 'Orders.after.update', doc);
		  		}
		 }catch(e)
		 {
		  		console.log(doc.sessionId + ": Caught error on updating the order ststus to websheets fatal error.", e);
		  		console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
		  		orderUpdateStatus.websheets.status 		= websheets.public.status.FATAL;
		  		orderUpdateStatus.websheets.error 		= e.toString();
		  	    orderUpdateStatus.websheets.errorStack	= e.stack;


		 }
		 console.log(doc.sessionId + ': Order Update Status' +  JSON.stringify(orderUpdateStatus, null, 4))
		 console.log(doc.sessionId + ': Done updating the order status to websheets');
	}
	else
	{
		console.log(doc.sessionId + ': Ignoring update of sheetRowId not posting to websheet')
	}



}, {fetchPrevious: false});

OrdersMeta.after.insert(function (userId, doc) {

  	console.log(doc.sessionId + ": In the OrdersMeta Insert Hook");

  	var processStatus	= 	{
  								'payment'	:{},
  						   		'websheets'	:{},
  						   		'email'		:{},
  						   		'sms'		:{}

  							};

  	var payment 		= 	{};
  	var emailCustomer 	=	{};
  	var emailClient 	=	{};
  	var emailWebmaster 	= 	{};
  	var smsCustomer		= 	{};
  	var smsClient		= 	{};
  	var smsWebmaster	= 	{};					

  	//Start CC Auth and Charge
 	if(doc.cardToken)
 	{	
 		processStatus.payment.status = websheets.public.status.ENABLED;

 		if( isPaymentStripe(doc.orgname))
 		{   
 			payment.vendor  = 'Stripe';
	 		payment.status 	= websheets.public.status.SUCCESS;
	 		var result;
	 		try{
	 			console.log(doc.sessionId + ": Start charging the card");
				var result = Meteor.call('stripeAuthAndCharge', doc);

			}catch(e)
			{
				console.log(doc.sessionId + ": Card Authorization and charge process exprienced fatal error");
				console.log(doc.sessionId + ": Error: " + e);
				PaymentInfo.insert({_id:doc.UniqueId, error:e});
				result.error 		= e;
				result.errorStack 	= e.stack;
			}

			if( result.error)
			{
				doc.Payment='Charge Failed';
				var orderStatusAlertMessage = Meteor.call('getSetting', 'order_status_alert_message', doc.orgname);
				Orders.update({UniqueId:doc.UniqueId}, {$set: {Payment: doc.Payment, orderStatusAlert:orderStatusAlertMessage}});
				OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {Payment: doc.Payment, orderStatusAlert:orderStatusAlertMessage}});
				console.log(doc.sessionId + ": Jay:Todo:Send appropriate notifciation to customer and owner");

				payment.status 				= websheets.public.status.FAILED;
				payment.error 				= result.error;
				payment.errorStack			= result.errorStack;
				var response 				= Meteor.call('sendCCAuthFailedNotification', doc);
				payment.declineNotification = new Object();;
				
				for(var key in response)
				{
					 payment.declineNotification[key] = response[key];
				}

			}
		}
		else
		{
			console.log(doc.sessionId + ": Client is configured for online payment, but no Payment processor enabled - Fatal");
			processStatus.payment.status 	= websheets.public.status.FATAL;
			processStatus.payment.error 	= 'Client is configured for online payment, but no Payment processor enabled - Fatal';
		}

		processStatus.payment.payment = payment;

 	}
 	else
 	{
 		console.log(doc.sessionId + ': Either payment is not enabled or customer opt not to pay online')
 		processStatus.payment.status 		=	websheets.public.status.ENABLED;
 		processStatus.payment.message   	=	'Either payment is not enabled or customer opt not to pay online';
 	}
 	console.log(doc.sessionId + ": Done payment process" );
 	//End CC Auth and Charge


    //Start Sending the Websheets
	try{
	  		var count = 0;
	  		processStatus.websheets.status 	= websheets.public.status.SUCCESS;
	  		var response;
	  		do
	  		{
	  			count +=1;
	  			response = Meteor.call('postWebsheets', doc);
	  			console.log(doc.sessionId + ": insert (new order) attempted count = " + count );
	  		}while (count < websheets.private.generic.WEBSHEETS_MAX_RETRY && response.statusCode !== 200)

	  		if(response.statusCode !== 200)
	  		{
	  			console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
	  			processStatus.websheets.status 	= websheets.public.status.FAILED;
	  		}
	  		else
	  		{
	  			processStatus.websheets.response  = response ;
	  			Orders.update({UniqueId:doc.UniqueId},     {$set: {sheetRowId : response.data.sheetRowId}});
				OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {sheetRowId : response.data.sheetRowId}});
	  		}
	 }catch(e)
	 {
	  		console.log(doc.sessionId + ": Caught error on posting to websheets fatal error.", e);
	  		console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
	  		processStatus.websheets.status 		= websheets.public.status.FATAL;
	  		processStatus.websheets.error 		= e.toString();
	  		processStatus.websheets.errorStack 	= e.stack;

	 }
	 console.log(doc.sessionId + ': Done posting to websheets');
	 //End Sending the Websheets

	 //Start Sending Email
 	if(isEmailEnabled(doc.orgname))
 	{
 		processStatus.email.status = websheets.public.status.ENABLED;

 		if(isEmailMailgun(doc.orgname))
 		{
		 		//Customer Email
			 	if(doc.CustomerEmail && isEmailCustomer(doc.orgname))
			 	{

			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, websheets.private.generic.CUSTOMER);
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
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailCustomer.status 		= websheets.public.status.FATAL;
						emailCustomer.error 		= e.toString();
						emailCustomer.errorStack 	= e.stack;

						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': customer opt not receive email or customer emailing is not enabled.')
			 		emailCustomer.status 	=	websheets.public.status.NOT_ENABLED;

			 	}

			 	processStatus.email.emailCustomer = emailCustomer;

			 	//Client Email
			 	if(isClientEmailOrderReceived(doc.orgname))
			 	{

			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, websheets.private.generic.CLIENT);
					 	for(var key in response)
					 	{
					 		emailClient [key] = response[key];
					 	}
					 	if(response.result.error)
            			{
            				emailClient.status 	= websheets.public.status.FAILED;
                            emailClient.error 	= response.result.error.statusCode;
            			}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailClient.status 		= websheets.public.status.FATAL;
						emailClient.error 		= e.toString();						
						emailClient.errorStack 	= e.stack;


						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': Not configured to send email to the client')
					emailClient.status 	=	websheets.public.status.NOT_ENABLED;	 	
				}

			 	processStatus.email.emailClient = emailClient;

			 	//Webmaster Email
			 	if(isEmailWebmaster(doc.orgname))
			 	{
			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, websheets.private.generic.WEBMASTER);
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
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailWebmaster.status 		= websheets.public.status.FATAL;
						emailWebmaster.error 		= e.toString();
						emailWebmaster.errorStack 	= e.stack;

						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': Not configured to send email to the Webmaster')
			 		emailWebmaster.status 	=	websheets.public.status.NOT_ENABLED;	
			 	}	
			 	processStatus.email.emailWebmaster = emailWebmaster;
	 	}
	 	else
	 	{
	 		console.log(doc.sessionId + ": Client is configured for sending email, but no vendor api enabled - Fatal");
			processStatus.email.status 	= websheets.public.status.FATAL;
			processStatus.email.error 	= 'Client is configured for sending email, but no vendor api enabled - Fatal'

	 	}
	}
	else
	{
	 	console.log(doc.sessionId + ': Email is not enabled for this client')
 		processStatus.email.status 	=	websheets.public.status.NOT_ENABLED;

	}

 	console.log(doc.sessionId + ": Done sending initial order email");
	//Ens Sending the Email

	//Start Sending the SMS
	if(isSmsEnabled(doc.orgname))
	{
		if (isSmsTwilio(doc.orgname))
		{
				if(doc.CustomerPhone && isSmsCustomer(doc.orgname))
				{
					try{
					 	var response = Meteor.call('smsOrderReceived', doc, doc.CustomerPhone);
					 	for(var key in response.result)
					 	{
					 		console.log(key + ' = ' + response.result[key]);
					 		smsCustomer[key] = response.result[key];
					 	}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending sms to customer: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						smsCustomer.status 		= websheets.public.status.FATAL;
						smsCustomer.error 		= e.toString();
						smsCustomer.errorStack 	= e.stack

						
					}

				}
				else
				{
					console.log(doc.sessionId + ': customer opt not receive sms')
			 		smsCustomer.status 	=	websheets.public.status.NOT_ENABLED;	

				}
				processStatus.sms.smsCustomer = smsCustomer;


				if(isSmsClient(doc.orgname))
				{
					console.log(doc.sessionId + ": Start client sms");
					//var clientPhoneNumberText 	= Meteor.call('getSetting', 'phone_number_texting', doc.orgname);
					var clientPhoneNumberText  = getSetting ('phone_number_texting', doc.orgname);
					console.log(doc.sessionId + " :clientPhoneNumberText  = " + clientPhoneNumberText );
					console.log(doc.sessionId + " : typeof clientPhoneNumberText  = " + typeof clientPhoneNumberText );

					if(typeof clientPhoneNumberText !== 'string')
					{
						clientPhoneNumberText = String(clientPhoneNumberText);

					}

					var clientPhoneNumberArray	= clientPhoneNumberText.split(',');
					console.log(doc.sessionId + " : clientPhoneNumberArray.lenght = " + clientPhoneNumberArray.length);
					var smsResult=[]
					for (var i =0; i < clientPhoneNumberArray.length; i++)
					{
						var clientSMSResult={};
							try{
								clientPhoneNumberArray[i] = clientPhoneNumberArray[i].trim();
								clientSMSResult.clientPhoneNumberText = clientPhoneNumberArray[i];
							 	var response = Meteor.call('smsOrderReceived', doc, clientPhoneNumberArray[i], websheets.private.generic.CLIENT);
							 	for(var key in response.result)
							 	{
							 		console.log(key + ' = ' + response.result[key]);
							 		clientSMSResult[key] = response.result[key];
							 	}

							}catch (e)
							{
								console.log(doc.sessionId + " :trouble sending sms to Client: " + e);
								console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
								clientSMSResult.status 		= websheets.public.status.FATAL;
								clientSMSResult.error 		= e.toString();
								clientSMSResult.errorStack 	= e.stack;

								
							}	
						smsResult.push(clientSMSResult)	;
					}						
					smsClient.smsResult = smsResult;
				}
				else
				{
					console.log(doc.sessionId + ': Not configured to send sms to the client')
					smsClient.status 	=	websheets.public.status.NOT_ENABLED;	 	
					
				}
				console.log(doc.sessionId + ": Done Client sms");
				processStatus.sms.smsClient = smsClient;

				if(isSmsWebmaster(doc.orgname))
				{
					console.log(doc.sessionId + ": Start webmaster sms");

					try{
					 	var response = Meteor.call('smsOrderReceived', doc, webmasterPhoneNumberText(doc.orgname), websheets.private.generic.WEBMASTER);
					 	for(var key in response.result)
					 	{
					 		console.log(key + ' = ' + response.result[key]);
					 		smsWebmaster[key] = response.result[key];
					 	}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending sms to Webmaster: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						smsWebmaster.status 		= websheets.public.status.FATAL;
						smsWebmaster.error 			= e.toString();
						smsWebmaster.errorStack 	= e.stack;

						
					}					

				}
				else
				{
					console.log(doc.sessionId + ': Not configured to send email to the Webmaster')
					smsWebmaster.status 	=	websheets.public.status.NOT_ENABLED;	 	
					
				}
				console.log(doc.sessionId + ": Done Webmaster sms");
				processStatus.sms.smsWebmaster = smsWebmaster;
		}
		else
		{

			console.log(doc.sessionId + ": Client is configured for sending sms, but no vendor api enabled - Fatal");
			processStatus.sms.status 	= websheets.public.status.FATAL;
			processStatus.sms.error 	= 'Client is configured for sending sms, but no vendor api enabled - Fatal'

		}

	}
	else
	{
		console.log(doc.sessionId + ': SMS is not enabled for this client')
 		processStatus.sms.status 	=	websheets.public.status.NOT_ENABLED;
	}

 	console.log(doc.sessionId + ": Done sending inital order sms");	
	//End Sending the SMS


 	//Jay:TODO: Examine the processStatus object and handle it appropriately,

 	console.log(doc.sessionId + ': Process Status' +  JSON.stringify(processStatus, null, 4))
 	OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {processStatus: processStatus}});




});


    Menu.after.update(function (userId, doc, fieldNames, modifier, options) 
    {
    	   var hookSessionId = Meteor.uuid();
    	   console.log(hookSessionId + ': Menu.after.update:userId     = ' + userId);
		   console.log(hookSessionId + ': Menu.after.update:doc        = ' + JSON.stringify(doc, null, 4));
		   console.log(hookSessionId + ': Menu.after.update:fieldNames = ' + JSON.stringify(fieldNames, null, 4));
		   console.log(hookSessionId + ': Menu.after.update:modifier   = ' + JSON.stringify(modifier, null, 4));
		   console.log(hookSessionId + ': Menu.after.update:options    = ' + JSON.stringify(options, null, 4));
		   var categories = Settings.find({'Key':'category_menu'},{fields: {'Value' : 1}}).fetch();
		   var totalMenuItemCount=0
		   for (categoriesKey in categories)
		   {

		   		console.log(hookSessionId + ': Menu.after.update : Category Name 		= ' + categories[categoriesKey].Value);
		   		var menuByCategoriesCount = Menu.find({'Category': categories[categoriesKey].Value}).count();
		   		console.log(hookSessionId + ': Menu.after.update : Menu Count by Category ' +  categories[categoriesKey].Value +' = ' + menuByCategoriesCount);
		   		Settings.update({'Key':'category_menu', 'Value': categories[categoriesKey].Value, orgname:doc.orgname}, {$set:{'menuItemCount': menuByCategoriesCount}});
		   		totalMenuItemCount += menuByCategoriesCount;
		   }

		   var totalMenuItemCountObject={};
		   totalMenuItemCountObject.UniqueId 	= Meteor.uuid();
		   totalMenuItemCountObject.Key 		= 'totalMenuItemCount';
		   totalMenuItemCountObject.Value 		= totalMenuItemCount;
		   totalMenuItemCountObject.orgname		= doc.orgname;
		   console.log(hookSessionId + ': Menu.after.update: totalMenuItemCountObject       = ' + JSON.stringify(totalMenuItemCountObject, null, 4));
		   Settings.update({'Key':'totalMenuItemCount', orgname:doc.orgname}, totalMenuItemCountObject, {upsert:true});

		   preProcessDmMetaData(hookSessionId , doc);



    }, {fetchPrevious: false});



    Settings.after.update(function (userId, doc, fieldNames, modifier, options) 
    {
    	var hookSessionId = Meteor.uuid();

    	if(fieldNames[0] !== 'menuItemCount' &&  doc.Key !== 'totalMenuItemCount')
    	{

    	   console.log(hookSessionId + ': Settings.after.update:userId     = ' + userId);
		   console.log(hookSessionId + ': Settings.after.update:doc        = ' + JSON.stringify(doc, null, 4));
		   console.log(hookSessionId + ': Settings.after.update:fieldNames = ' + JSON.stringify(fieldNames, null, 4));
		   console.log(hookSessionId + ': Settings.after.update:modifier   = ' + JSON.stringify(modifier, null, 4));
		   console.log(hookSessionId + ': Settings.after.update:options    = ' + JSON.stringify(options, null, 4));

		   		console.log('Settings.after.update : Category Name 		= ' + doc.Value);
		   		var menuByCategoriesCount = Menu.find({'Category': doc.Value}).count();
		   		console.log('Settings.after.update : Menu Count by Category ' +  doc.Value +' = ' + menuByCategoriesCount);
		   		Settings.update({'Key':'category_menu', 'Value': doc.Value,  orgname:doc.orgname}, {$set:{'menuItemCount': menuByCategoriesCount}});
		   		preProcessDmMetaData(hookSessionId , doc);
		  }
		  else
		  {
		  	console.log(hookSessionId + ': Settings.after.update: Not action in the hook');
		  }

    }, {fetchPrevious: false});




    preProcessDmMetaData = function(hookSessionId , doc)
    {
    	var totalMenuCount 	= Settings.findOne({'Key':'totalMenuItemCount', orgname:doc.orgname});
    	var dm_count_page 	= Settings.findOne({'Key':'dm_count_page', 		orgname:doc.orgname});
    	var dm_count_column = Settings.findOne({'Key':'dm_count_column', 	orgname:doc.orgname});
    	console.log(hookSessionId + ': preProcessDmMetaData: totalMenuCount 	= ' + totalMenuCount.Value);

    	var result 			= Settings.find({$and : [{Key: "category_menu"}, {orgname:doc.orgname}, {menuItemCount : {"$exists" : true, "$ne" : 0}}]},{sort:{sheetRowId: 1}}).fetch();
    	console.log(hookSessionId + ': preProcessDmMetaData: Total Valid Categories count (result.length)	= ' + result.length);


    	var capacityLevel = websheets.public.generic.DM_MAX_COUNT_PAGE_ONE;



    	if( dm_count_page)
    	{
    		dm_count_page 	= dm_count_page.Value;
			console.log(hookSessionId + ': preProcessDmMetaData: dm_count_page	= ' + dm_count_page);

    	}
    	else
    	{
    		dm_count_page = websheets.public.generic.DM_COUNT_PAGE_VALUE; //default three column
    		console.log(hookSessionId + ': preProcessDmMetaData: using default value for dm_count_page = ' + dm_count_page);

    	}


    	if( dm_count_column)
    	{
    		dm_count_column 	= dm_count_column.Value;
			console.log(hookSessionId + ': preProcessDmMetaData: dm_count_column	= ' + dm_count_column);

    	}
    	else
    	{
    		dm_count_column = websheets.public.generic.DM_COUNT_COLUMN_VALUE; //default three column
    		console.log(hookSessionId + ': preProcessDmMetaData: using default value for dm_count_column = ' + dm_count_column);

    	}
    	


    	var totalIncludingSpaceForCatagory 	= Number(totalMenuCount.Value) + result.length * Number (dm_count_column); 
    	for(var i =0; i < result.length;  i++)
    	{

    		var lastLineCount 		= result[i].menuItemCount % websheets.public.generic.DM_COUNT_COLUMN_VALUE;
    		console.log(hookSessionId + ': preProcessDmMetaData: lastLineCount = ' + lastLineCount);
    		var adjustPerLineCount = 0;
    		if(lastLineCount > 0)
    		{
    			adjustPerLineCount 			= dm_count_column - lastLineCount;
    			console.log(hookSessionId + ': preProcessDmMetaData: adjustPerLineCount = ' + adjustPerLineCount);
    			totalIncludingSpaceForCatagory += adjustPerLineCount;
    		}

    	}
    	console.log(hookSessionId + ': preProcessDmMetaData: totalIncludingSpaceForCatagory 	= ' + totalIncludingSpaceForCatagory);

    	var pageCapacity 					= Math.round( Number(totalIncludingSpaceForCatagory)/Number(dm_count_page));
     	console.log(hookSessionId + ': preProcessDmMetaData: pageCapacity = ' +  pageCapacity);

     	if(pageCapacity <=  websheets.public.generic.DM_MAX_COUNT_PAGE_ONE)
     	{
     		console.log(hookSessionId + ': Working with first level  (default) page capacity');
     	}
     	else
     	if(pageCapacity > websheets.public.generic.DM_MAX_COUNT_PAGE_ONE &&  pageCapacity <= websheets.public.generic.DM_MAX_COUNT_PAGE_TWO)
     	{
     		console.log(hookSessionId + ': Working with second level page capacity');
     		console.log(hookSessionId + ': Jay - Need to have logic to adjust the CSS to accomodate the page capacity');
     		capacityLevel 	= websheets.public.generic.DM_MAX_COUNT_PAGE_TWO;
     	}
     	else 
     	if(pageCapacity > websheets.public.generic.DM_MAX_COUNT_PAGE_TWO &&  pageCapacity <= websheets.public.generic.DM_MAX_COUNT_PAGE_THREE)
     	{
     		console.log(hookSessionId + ': Working with Third level page capacity');
     		console.log(hookSessionId + ': Jay - Need to have logic to adjust the CSS to accomodate the page capacity');
     		capacityLevel 	= websheets.public.generic.DM_MAX_COUNT_PAGE_THREE;
     	}
     	else
     	{
     		console.log(hookSessionId + ': No logic to handle this pageCapacity = ' + pageCapacity);

     	}


    	var count 			= 0;

    	var dmCategoryArray = [];
    	var pageCount 		= 1;
    	var insertDmCategoryArrayFlag = false;
    	for(var i =0; i < result.length;  i++)
    	{

    		count += websheets.public.generic.DM_COUNT_COLUMN_VALUE;
    		console.log(hookSessionId + ': preProcessDmMetaData: count (Before adding menuItemCount) = ' + count);
    		count += result[i].menuItemCount;

    		console.log(hookSessionId + ': preProcessDmMetaData: count (After adding menuItemCount)  = ' + count);

    		var lastLineCount 		= result[i].menuItemCount % websheets.public.generic.DM_COUNT_COLUMN_VALUE;
    		console.log(hookSessionId + ': preProcessDmMetaData: lastLineCount = ' + lastLineCount);
    		var adjustPerLineCount = 0;
    		if(lastLineCount > 0)
    		{
    			adjustPerLineCount 			= dm_count_column - lastLineCount;
    			console.log(hookSessionId 	+ ': preProcessDmMetaData: adjustPerLineCount = ' + adjustPerLineCount);
    	    }
    		count += adjustPerLineCount;

    		console.log(hookSessionId + ': preProcessDmMetaData: count (After adding menuItemCount)  = ' + count);

    		if(count < pageCapacity)
    		{
    			 dmCategoryArray.push({'name': result[i].Value, 'actualCount':result[i].menuItemCount });
    			 insertDmCategoryArrayFlag = true;
    		}

    		else 
    		if(count >pageCapacity)
    		{
    			var difference 		= count - pageCapacity ;
    			console.log(hookSessionId + ': difference = ' + difference);
    			var allowedCount 	= result[i].menuItemCount - difference;
    			console.log(hookSessionId + ': allowedCount = ' + allowedCount);


    		var inPageLastLineCount 		= allowedCount % websheets.public.generic.DM_COUNT_COLUMN_VALUE;
    		console.log(hookSessionId + ': preProcessDmMetaData: inPageLastLineCount  = ' + inPageLastLineCount );
    		var inPageAdjustPerLineCount  = 0;
    		if(inPageLastLineCount > 0)
    		{
    			inPageAdjustPerLineCount 			= dm_count_column - inPageLastLineCount;
    			console.log(hookSessionId + ': preProcessDmMetaData: inPageAdjustPerLineCount  = ' + inPageAdjustPerLineCount );
    			allowedCount += inPageAdjustPerLineCount ;
    		}



    			if(allowedCount > 0)
    			{
    				insertDmCategoryArrayFlag = false;
	    			dmCategoryArray.push({'name': result[i].Value , 'partial': websheets.private.generic.FIRST, 'allowedCount': allowedCount, 'actualCount':result[i].menuItemCount});
	    			DmMetatData.update ({pageNumber:pageCount}, {pageNumber:pageCount, capacityLevel:capacityLevel, category:dmCategoryArray}, {upsert: true});
					console.log(hookSessionId + ': preProcessDmMetaData : DmMetaDataOject (Greater than pageCapacity) = ' + JSON.stringify(dmCategoryArray , null, 4))

	    			dmCategoryArray 	=[];
	    			var carryOverCount  = result[i].menuItemCount - allowedCount;
	    			console.log(hookSessionId + ': carryOverCount = ' + carryOverCount );
	    			
	    			dmCategoryArray.push({'name': result[i].Value, 'partial': websheets.private.generic.SECOND, 'allowedCount': carryOverCount, 'startFrom': allowedCount, 'actualCount':result[i].menuItemCount });

	    			pageCount 			+= 1;
	    			count 				= carryOverCount;
	    		}
	    		else
	    		{
	    		    //dmCategoryArray.push({'name': result[i].Value , 'partialFirst': true, 'allowedCount': allowedCount, 'actualCount':result[i].menuItemCount});
	    			DmMetatData.update ({pageNumber:pageCount}, {pageNumber:pageCount, capacityLevel:capacityLevel, category:dmCategoryArray}, {upsert: true});
					console.log(hookSessionId + ': preProcessDmMetaData : DmMetaDataOject (Greater than pageCapacity) = ' + JSON.stringify(dmCategoryArray , null, 4))

	    			dmCategoryArray 	=[];
	    			var carryOverCount  = result[i].menuItemCount;
	    			console.log(hookSessionId + ': carryOverCount = ' + carryOverCount );
	    			dmCategoryArray.push({'name': result[i].Value, 'actualCount':result[i].menuItemCount });

	    			pageCount 			+= 1;
	    			count 				= carryOverCount;


	    		}


    		}
    		else
    		{
    			insertDmCategoryArrayFlag = false;
    			dmCategoryArray.push({'name': result[i].Value, 'actualCount':result[i].menuItemCount });
     			DmMetatData.update ({pageNumber:pageCount}, {pageNumber:pageCount, capacityLevel:capacityLevel, category:dmCategoryArray}, {upsert: true});
				console.log(hookSessionId + ': preProcessDmMetaData : DmMetaDataOject (Greater that pageCapacity) = ' + JSON.stringify(dmCategoryArray , null, 4))   			
    			dmCategoryArray 	=[];
    			pageCount 			+= 1;
    			count 				= 0;
    		}


    	}

    	if(insertDmCategoryArrayFlag )
    	{
	    	DmMetatData.update ({pageNumber:pageCount}, {pageNumber:pageCount, capacityLevel:capacityLevel, category:dmCategoryArray}, {upsert: true});
	    	console.log(hookSessionId + ': preProcessDmMetaData : DmMetaDataOject (Outside for loop) = ' + JSON.stringify(dmCategoryArray , null, 4))   			


    	}
    }
