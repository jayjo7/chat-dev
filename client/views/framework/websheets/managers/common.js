Template.registerHelper('getSelectedItemSize', function(cartItem)
    {
        var htmlString ='';

        switch (cartItem.itemSize)
        {
            case websheets.public.size.SMALL:

                htmlString = '<span class="badge progress-bar-success">' +  websheets.public.size.SMALL + '</span>';

                break;

            case websheets.public.size.MEDIUM:

                  htmlString ='<span class="badge progress-bar-info">' + websheets.public.size.MEDIUM + '</span>';
                break;

            case  websheets.public.size.LARGE:

               htmlString = '<span class="badge progress-bar-warning">' + websheets.public.size.LARGE +'</span>';
               break;

            case websheets.public.size.EXTRALARGE:

                htmlString = '<span class="badge progress-bar-danger">'+ websheets.public.size.EXTRALARGE + '</span>';
        }
        return htmlString;

    });

Template.registerHelper('getSelectedSpiceLevel', function(cartItem)
    {
        var htmlString ='';

        switch (cartItem.spiceLevel)
        {
            case websheets.public.spicy.MILD:

                htmlString = '<span class="label label-success">' +  websheets.public.spicy.MILD + '</span>';

                break;

            case websheets.public.spicy.NORMAL:

                  htmlString ='<span class="label label-warning">' + websheets.public.spicy.NORMAL + '</span>';
                break;

            case websheets.public.spicy.SPICY:

                htmlString = '<span class="label label-danger">'+ websheets.public.spicy.SPICY+ '</span>';
        }
        return htmlString;

    });

Template.registerHelper('hasValue', function(key)
{
	var menu = Session.get(websheets.public.generic.MENU_OBJECT_SESSION_KEY);
	console.log('hasValue: menu      = '  + menu);
	console.log('hasValue: given key =' + key);
	var value = menu[key];
	console.log('hasValue: value = ' + value);
	//value = value.trim();
	console.log('hasValue: value = ' + value);

	if(value)
	{
		return true;
	}
	else
	{
		return false;
	}

});

Template.registerHelper('menu',function(categoryMenu)
{
    var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
    console.log('menu: ' + orgname);

	return Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]},{sort:{sheetRowId: 1}});

});

Template.registerHelper('prune', function(string, length, useWordBoundary)
{
	string = string.trim();
	return string.trunc(length, useWordBoundary);

});

Template.registerHelper('newOrderCount', function()
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
	//var orders = Orders.find({orgname:orgname, StatusCode: 1});
	//orders.observeChanges({

	//	added: function (id, user){

	//	},

	//	addedBefore: function(id, fields, before)
	//	{

	//	},

	//	changed: function(id, fields)
	//	{

	//	},
	//	movedBefore: function(id, before)
	//	{

	//	},
	//	removed: function(id)
	//	{

	//	}

	//});

	return  Orders.find({orgname:orgname, StatusCode: 1}).count();

});

Template.registerHelper('getOrders', function(StatusCode)
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	console.log('getOrders:StatusCode = ' +StatusCode);
	return  Orders.find({orgname:orgname,StatusCode: StatusCode});

});


Template.registerHelper('getSettings', function(key)
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	//console.log('getSettings:key = ' + key)
	var result = Settings.findOne({$and : [{Key: key}, {orgname:orgname},{Value : {"$exists" : true, "$ne" : ""}}]});
		//console.log('getSettings:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getSettingsArray', function(key)
{
	//console.log('getSettingsArray:key = ' + key)
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	var Settings = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})



				//console.log('getSettingsArray = ' + Settings);


				var settingsValue = Settings['Value'];
				//console.log('getSettingsArray:settingsValue= ' + settingsValue);

				var settingsArray = settingsValue.split('\n\n' );

				return settingsArray;
});

Template.registerHelper('getSettingsMulti', function(key)
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	console.log('getSettingsMulti:key = ' + key)
	var result = Settings.find({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]},{sort:{sheetRowId: 1}});
	console.log('getSettingsMulti:Value = ' + result.Value)

	return result
});


Template.registerHelper('getContent', function(key)
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	//console.log('getContent:key = ' + key)
	var result = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
		//console.log('getContent:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getContentArray', function(key)
{
		var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	//console.log('getContentArray:key = ' + key)

		var content = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})



				//console.log('getContentArray = ' + content);


				var contentValue = content['Value'];
				//console.log('getContentArray:ContentValue= ' + contentValue);

				var contentArray = contentValue.split('\n\n' );

				return contentArray;
});

Template.registerHelper('showCart', function()
{

	    	var  sessid = Session.get('appUUID');
            var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

            //console.log("shopCart:sessid =  " +sessid);

			var cartItems = CartItems.find({session: sessid, orgname:orgname});
		    cartItems.itemCount = cartItems.count();
		    //console.log("showCart:cartItems.itemCount =  " +cartItems.itemCount);
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
	    var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

        //console.log('isMenuAvailable:categoryMenu = ' + categoryMenu)
		var menuCount = Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]}).count();
		if(menuCount > 0)
			return true;
		else
			return false;

});

Template.registerHelper('menuMulti', function(categoryMenu)
{
	    var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);


		return Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]});

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

Template.registerHelper('isPaymentEnabled', function(){

	    var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	    console.log('Meteor.settings.public[orgname].onlinePayment = ' + Meteor.settings.public[orgname].onlinePayment);

	    if('enabled' === Meteor.settings.public[orgname].onlinePayment)
	    {
	    	return true;
	    }
	    else
	    {
	    	false;
	    }


});

Template.registerHelper('imageFormatter', function(){

	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	return Meteor.settings.public[orgname].imageFormatter;

});


validData = function(input)
{
	console.log("validData:input = " + input);

	if(input)
	{
		return true;
	}
	else
	{
		return false;
	}

}

isPaymentStripe	 = function(orgname) 
{
    if('STRIPE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

isPaymentSquare	 = function(orgname) 
{
    if('SQUARE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

isPaymentBrainTree	 = function(orgname) 
{
    if('BRAINTREE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

gmtOffset  	= function(orgname)
{
    return  Meteor.settings.public[orgname]. gmtOffset;
}

countryCode =  function(orgname)
{
	return  Meteor.settings.public[orgname]. countryCode;
}

currencyFormat = function(num)
{
	return '$' + Number(num).toFixed(2);
}


addToCartToggle=function(orgname)
{
	return Meteor.settings.public[orgname]. addToCartToggle;
}

isSpecial = function(fontWeight)
{
	 if('bold' === fontWeight)
            return true;
     else
            return false;

}

isItemAvailable = function(fontLine)
{
		if('line-through' === fontLine)
			return  false;
		else
			return true;
	
}

prune =  function(string, length, useWordBoundary)
{
	string = string.trim();
	return string.trunc(length, useWordBoundary);

}

String.prototype.trunc = function( n, useWordBoundary)
{
         var toLong = this.length >n , s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '&hellip;' : s_;
};


getDmCountColumn = function()
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	var key = websheets.public.generic.DM_COUNT_COLUMN;
	var result = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
	return result.Value


}

getDmCountPage = function()
{
	var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

	var key = websheets.public.generic.DM_COUNT_PAGE
	var result = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
	return result.Value


}

