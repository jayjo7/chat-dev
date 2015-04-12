Template.registerHelper('getSettings', function(key)
{
	console.log('getSettings:key = ' + key)
	var result = Settings.findOne({$and : [{Key: key}, {Value : {"$exists" : true, "$ne" : ""}}]});
		console.log('getSettings:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getSettingsArray', function(key)
{
	console.log('getSettingsArray:key = ' + key)

		var Settings = Content.findOne({$and : [{Key: key}, {Value : {"$exists" : true, "$ne" : ""}}]})



				console.log('getSettingsArray = ' + Settings);


				var settingsValue = Settings['Value'];
				console.log('getSettingsArray:settingsValue= ' + settingsValue);

				var settingsArray = settingsValue.split('\n\n' );

				return settingsArray;
});


Template.registerHelper('getContent', function(key)
{
	console.log('getContent:key = ' + key)
	var result = Content.findOne({$and : [{Key: key}, {Value : {"$exists" : true, "$ne" : ""}}]});
		console.log('getContent:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getContentArray', function(key)
{
	console.log('getContentArray:key = ' + key)

		var content = Content.findOne({$and : [{Key: key}, {Value : {"$exists" : true, "$ne" : ""}}]})



				console.log('getContentArray = ' + content);


				var contentValue = content['Value'];
				console.log('getContentArray:ContentValue= ' + contentValue);

				var contentArray = contentValue.split('\n\n' );

				return contentArray;
});

Template.registerHelper('showCart', function(){

	    	var  sessid = Session.get('appUUID');
             
            console.log("shopCart:sessid =  " +sessid);

			var cartItems = CartItems.find({session: sessid});
		    cartItems.itemCount = cartItems.count();
		    console.log("showCart:cartItems.itemCount =  " +cartItems.itemCount);
		    if(cartItems.itemCount > 0)
		    {
		    	return true;
		    }
		    else
		    {
		    	return false;
		    }


})
