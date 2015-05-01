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

Template.registerHelper('getSettingsMulti', function(key)
{
	console.log('getSettingsMulti:key = ' + key)
	var result = Settings.find({$and : [{Key: key}, {Value : {"$exists" : true, "$ne" : ""}}]});
		console.log('getSettingsMulti:Value = ' + result.Value)

	return result
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

Template.registerHelper('showCart', function()
{

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


});

Template.registerHelper('isMenuAvailable', function(categoryMenu)
{
        console.log('isMenuAvailable:categoryMenu = ' + categoryMenu)
		var menuCount = Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]}).count();
		if(menuCount > 0)
			return true;
		else
			return false;

});

Template.registerHelper('menuMulti', function(categoryMenu)
{

		return Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]});

});

Template.registerHelper('menuMulti', function(categoryMenu)
{

		return Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]});

});

Template.registerHelper('currency', function(num)
{

        return '$' + Number(num).toFixed(2);

});

Template.registerHelper('isToSell', function(fontStyle)
{

         if('italic' === fontStyle)
            return false;
        else
            return true;

});

Template.registerHelper('isItemAvailable', function(fontLine)
{
		if('line-through' === fontLine)
			return  false;
		else
			return true;

});

Template.registerHelper('isSpecial', function(fontWeight)
{
        if('bold' === fontWeight)
            return true;
        else
            return false;

});

Template.registerHelper('soldOut', function(fontLine)
{
    	if('line-through' === fontLine)
    		return 'soldout';
    	else
    		return '';

});

Template.registerHelper('haveDiscount', function()
{
        var sale_discount   = Settings.findOne({$and : [{Key: "sale_discount"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        console.log("sale_discount.Value : " + sale_discount.Value);

        var sale_discountValue = Number(sale_discount.Value);

        if(sale_discountValue> 0)
        {
        	return true;
        }
        else
        {
        	return false;
        }


});




