Meteor.methods({

  getTax:function(){

  	//var tax = Settings.findOne( { Key:'tax'});;
    var tax = Settings.findOne({$and : [{Key: "tax"}, {Value : {"$exists" : true, "$ne" : ""}}]});

  	return tax;

  },
    getSaleDiscount:function(){

  	//var tax = Settings.findOne( { Key:'tax'});;
    var sale_discount = Settings.findOne({$and : [{Key: "sale_discount"}, {Value : {"$exists" : true, "$ne" : ""}}]});

  	return sale_discount;

  },

    getCurrencyCode:function(){

  	//var tax = Settings.findOne( { Key:'tax'});;
    var tax = Settings.findOne({$and : [{Key: "currency_code"}, {Value : {"$exists" : true, "$ne" : ""}}]});

  	return tax;

  },


  getUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    console.log("uuid = " + uuid);
    return uuid;
},

	addToCart:function(qty, product, session,Name, Category, Charge){
		qty = Number (qty);
		if(qty>0)
		{
			
			//var itemFromCart = CartItems.findOne( { $and:[{product:product}, {session:session}]});
			//if(itemFromCart)
			//{
				
			//console.log("itemFromCart.count() = " +itemFromCart.length)

				//for (var key in itemFromCart )
				//{
				//	console.log("itemFromCart.key = " + itemFromCart[key]);
				//}
				//qty +=Number(itemFromCart.qty);
				//console.log("qty = " + qty);

			var gmt_offset = Settings.findOne({Key: 'gmt_offset'})

			console.log(session + ' addToCart:gmt_offset = ' + gmt_offset.Value );

			var now =moment().utcOffset(Number(gmt_offset.Value)).format('MM/DD/YYYY hh:mm:ss A');

			console.log(session + ' addToCart:now = ' + now);

		
			CartItems.update({product:product, session:session},{qty:qty, product:product, session:session,Name:Name, Category:Category, Charge:Charge, dateAdded:now},{upsert:true});

			//CartItems.insert({qty:qty, product:product, session:session});
			console.log('Added the product = ' + product  + ' for session id = ' + session);
			
		}
		else if (qty=== 0) 
		{
				console.log('Quantity is Zero');

				CartItems.remove ({product:product, session:session}, function(error, result){

					if (error)
					{
						console.log('Trouble removing the product = ' + product  + ' for session id = ' + session);
					}

				});

		}
		else
		{
				console.log('addToCart: Invalid Quantity');

		}
	},
	
	removeCartItem:function(product,sessionId ){
		console.log('Removing from Cart: Sessionid = ' + sessionId + ' :: product' +product);
		CartItems.remove({session:sessionId, product:product});
	},
		removeAllCartItem:function(sessionId){
		CartItems.remove({session:sessionId});
	},

	getOrder:function(sessionId){

		console.log("sessionId = " + sessionId);
		var order = Orders.findOne({UniqueId:sessionId});
		console.log("order = " + order);

		return order;

	},

	getNextSequenceValue: function (){
		
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

	orderItems:function(sessionId, contactInfo, sequence, cardToken, callback){

			console.log(sessionId + ' :In OrderItems');

			for(var key in sequence)
        	{
        		console.log(sessionId + " :sequence: " +key + " = " +sequence[key]);
        	}

			var order = {};
			order.Status=STATE_ONE;
			order.OrderNumber=sequence.orderNumber;
			order.UniqueId=sequence._id;

			var gmt_offset = Settings.findOne({Key: 'gmt_offset'})

			console.log(sessionId + ' :gmt_offset = ' + gmt_offset.Value );

			var now =moment().utcOffset(Number(gmt_offset.Value)).format('MM/DD/YYYY hh:mm:ss A');

			console.log(sessionId + ' :now = ' + now);

			order.TimeOrderReceived = now;
			order.CustomerName=contactInfo.contactName;
			order.CustomerPhone=contactInfo.phoneNumber;
			order.CustomerEmail=contactInfo.email;
			order.MessageToKitchen = contactInfo.messageToKitchen;

			var itemString='';
			var items=[];

			//console.log("Order Object before loop" + JSON.stringify(order, null, 4));

			var itemsInCart= CartItems.find({session:sessionId});

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


				subTotal +=  (Number(cartitems.Charge) * cartitems.qty);
				itemString = itemString + cartitems.qty + " - " + cartitems.Name +'\n';
   				items.push(
   				{ 
        				"name" : cartitems.Name,
        				"qty"  : cartitems.qty
				});

				cartitems.UniqueId = order.UniqueId;

				try{

					OrderedItems.update({product:cartitems.product, _id:cartitems._id},cartitems,{upsert:true});
				}catch (exception)
				{
					console.log(sessionId + ' :exception on OrderedItems Update = ' + exception);
					throw exception;

				}


   			});

			console.log(sessionId + " : Done with Calculating " );



			order.itemsObject 	= items;
			order.Items 		= itemString.substring(0, itemString.length-1); // Substring to get rid of the last new character
			order.TotalItem 	= totalItemCount;	
			order.SubTotal 		= Number (subTotal.toFixed(2));


			var tax 			= Meteor.call('getTax');
			var sale_discount 	= Meteor.call('getSaleDiscount');

            var taxValue 		= Number(tax.Value);
            var sale_discountValue 	= Number(sale_discount.Value);
            console.log(sessionId + ' :tax = ' + taxValue );
            console.log(sessionId + ' :discount = ' + sale_discountValue );



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
                 order.tax 		= order.subtotal * taxValue;
                 order.total 	= Number((order.subtotal + order.tax).toFixed(2));


            } 
            else
            {
                shopCart.total = Number((shopCart.subtotal ).toFixed(2));

            }

			order.sessionId =sessionId;

			if(cardToken)
			{
				var currencyCode = Meteor.call('getCurrencyCode');
				console.log(sessionId + " :currencyCode = " + currencyCode.Value);

				for(var key in cardToken)
        		{
        			console.log(sessionId + " :CardToken: " +key + " = " +cardToken[key]);
        		}
        		Meteor.npmRequire('stripe');
        		//var secret = Meteor.settings.private.stripe.testSecretKey;
				var stripe = Meteor.npmRequire('stripe')("sk_test_X1Qg62lGhGHpGlZdeWrlbPAs");
                stripe.setApiVersion('2015-04-07');
                console.log(sessionId + " :To Payment system: order.Total = "    + order.Total);

                var orderTotalCents = order.Total;

                console.log(sessionId + " :To Payment system: orderTotalCents before toFixed(2)= "    + orderTotalCents);
                var orderTotalCents = Number(orderTotalCents).toFixed(2);
                console.log(sessionId + " :To Payment system: orderTotalCents before replace= "    + orderTotalCents);
                orderTotalCents     = orderTotalCents.toString().replace('.','');
        		console.log(sessionId + " :To Payment system: orderTotalCents = "     		+ orderTotalCents);
        		console.log(sessionId + " :To Payment system: currencyCode.Value = " 	+currencyCode.Value);
        	    console.log(sessionId + " :To Payment system: cardToken.id   = "        + cardToken.id);

        	    var idempotency_key = sequence._id +":"+sequence.orderNumber;
        	    console.log(sessionId + " :To Payment system: idempotency_key  = " 		+ idempotency_key);

        	    var toPaymentDescription= "OrderNumber:" + sequence.orderNumber;
        	    console.log(sessionId + " :To Payment system: toPaymentDescription  = " + toPaymentDescription);


				 stripe.charges.create({
  										amount: orderTotalCents,
  										currency: currencyCode.Value,
  										source: cardToken.id, // obtained with Stripe.js
  										description: toPaymentDescription,
  										metadata: {'OrderNumber': sequence.orderNumber}
									}, Meteor.bindEnvironment (function(err, charge) {
  										if (err && err.type === 'StripeCardError') 
  										{
    											
  											console.log(sessionId + "Error object from stripe: " + err);
  											for(var key in err)
  											{
  												console.log(sessionId + "Error object from stripe: " + key + " = " + err[key]);
  											}
  											callback(err);
  											return;
  										}
  										else
  										{

  											console.log(sessionId + "charge object from stripe: " + charge);
  											for(var key in charge)
  											{
  												console.log(sessionId + "charge object from stripe: " + key + " = " + charge[key]);
  											}
  											PaymentInfo.insert({_id:sequence._id, charge:charge});
  												 order.Payment='online';
  												 order.ChargeCode = charge.id;

									            console.log(sessionId + " :Done Building the Order Object" + JSON.stringify(order, null, 4));

												   Orders.insert(order, function(error, _id)
													{

														if(error)
														{
															config.log("touble insert the order to mongodb " + order);
															throw new Meteor.Error(error);

														}
														else
														{
															Meteor.call('removeAllCartItem',sessionId);
															try{

																var https = Meteor.npmRequire('request');
																var options ={
																	url:'https://script.google.com/macros/s/AKfycbwWp0DVVcDEtGzrAf7H4x5DHfgP70r-3asuXzRg3orsH1NFfrY/exec',
																	method: 'POST',
																	body: order,
																	json: true,
																	followAllRedirects: true

																}
															    https.post(options, function (error, response, body){
																	console.log(sessionId + " :error : " + error);
																	console.log(sessionId + " :response.statusCode : " + response.statusCode);
																	console.log(sessionId + " :body : " + body);

																});

																return order;
																//var result = HTTP.call(	'POST', 
																//						'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec',
									                           	//						{ data:order, followRedirects:true }
									                           	//					);
																//var result = HTTP.call('GET', 'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec');
																//console.log("result = " + result);
																//for (var key in result)
																//{
																//
																//	console.log("key = " +  key + " : " + result[key]);
																//}
															}catch (e)
															{
																console.log(sessionId + ": " +e);
															}
															//return order.items;
														}
													});




  										}
									})

									);







            }
            else
            {

            console.log(sessionId + " :Done Building the Order Object" + JSON.stringify(order, null, 4));

			   Orders.insert(order, function(error, _id)
				{

					if(error)
					{
						config.log("touble insert the order to mongodb " + order);
						throw new Meteor.Error(error);

					}
					else
					{
						Meteor.call('removeAllCartItem',sessionId);
						try{

							var https = Meteor.npmRequire('request');
							var options ={
								url:'https://script.google.com/macros/s/AKfycbwWp0DVVcDEtGzrAf7H4x5DHfgP70r-3asuXzRg3orsH1NFfrY/exec',
								method: 'POST',
								body: order,
								json: true,
								followAllRedirects: true

							}
						    https.post(options, function (error, response, body){
								console.log(sessionId + " :error : " + error);
								console.log(sessionId + " :response.statusCode : " + response.statusCode);
								console.log(sessionId + " :body : " + body);

							});

							return order;
							//var result = HTTP.call(	'POST', 
							//						'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec',
                           	//						{ data:order, followRedirects:true }
                           	//					);
							//var result = HTTP.call('GET', 'https://script.google.com/macros/s/AKfycbzu3126b_QhgPwuwoStDdoF8AVqf2XFfAQ-ars_YmR7SEZgeSc/exec');
							//console.log("result = " + result);
							//for (var key in result)
							//{
							//
							//	console.log("key = " +  key + " : " + result[key]);
							//}
						}catch (e)
						{
							console.log(sessionId + ": " +e);
						}
						//return order.items;
					}
				});
			}

	}
});