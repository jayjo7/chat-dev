

Template.homePage.helpers({

    notification_message_session:function()
    {

        return Session.get('notification_message');

    },

    haveNotification: function(notification_general,isNotTakingOnlineOrder, isStoreClosed)
    {
        console.log("notification_general = " + notification_general);
        //console.log("notification_general.lenght = " + notification_general.length);
        console.log("isNotTakingOnlineOrder= " + isNotTakingOnlineOrder);
        console.log("isStoreClosed = " + isStoreClosed);

        if(isNotTakingOnlineOrder)
        {        
                var settings = Settings.findOne({$and : [{Key: "notification_no_online_orders"}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                console.log('notification_no_online_orders: message Notification = ' + settingsValue);
                console.log('notification_no_online_orders: Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                console.log('notification_no_online_orders: Notification trimmed size = ' + settingsValue.trim().length);

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                console.log('settingsArray.length = ' + settingsArray);
                Session.set('notification_message', settingsArray);

                return true;
        }

        if(isStoreClosed)
        {

                var settings = Settings.findOne({$and : [{Key: "notification_store_closed"}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                console.log(' notification_store_closed: message Notification = ' + settingsValue);
                console.log(' notification_store_closed: Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                console.log(' notification_store_closed: Notification trimmed size = ' + settingsValue.trim().length);

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                console.log('settingsArray.length = ' + settingsArray);
                Session.set('notification_message', settingsArray);
                return true;
        }

        if(typeof notification_general != 'undefined' && notification_general.length> 0)

        {
            Session.set('notification_message', notification_general)
            return  true;

        }
        else
        {
            Session.set('notification_message', null)

            return false;
        }

    },



    notification: function()
    {

        var settings = Settings.findOne({$and : [{Key: "notification_general"}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                console.log(' message Notification = ' + settingsValue);
                console.log(' message Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                console.log(' message Notification trimmed size = ' + settingsValue.trim().length);


                 var settingsArray=[];


                if(settingsValue.trim().length> 0)
                {

                    settingsArray = settingsValue.split('\n\n' );

                }

                console.log('settingsArray.length = ' + settingsArray);

   

                return settingsArray;
            

    },

    isNotTakingOnlineOrder: function()
    {
        var store_online_orders= Settings.findOne({$and : [{Key: "store_online_orders"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        console.log("store_online_orders = " + store_online_orders.Value);

        if('no' === store_online_orders.Value)
        {
            return true
        }
        else
        {
            return false;
        }

    },

    isStoreClosed: function()
    {
        var store_open_time= Settings.findOne({$and : [{Key: "store_open_time"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var store_close_time= Settings.findOne({$and : [{Key: "store_close_time"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var gmt_offset= Settings.findOne({$and : [{Key: "gmt_offset"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var store_open_saturday= Settings.findOne({$and : [{Key: "store_open_saturday"}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var store_open_sunday= Settings.findOne({$and : [{Key: "store_open_sunday"}, {Value : {"$exists" : true, "$ne" : ""}}]});

        //var store_close_time_24 = store_close_time.Value + 12;

       console.log("store_open_time = " + store_open_time.Value);
       console.log("store_close_time from sheet = " + store_close_time.Value);
       //console.log("store_close_time_24 = " + store_close_time_24);    
       console.log("gmt_offset = " + gmt_offset.Value);
       console.log("store_open_saturday = " + store_open_saturday.Value);
       console.log("store_open_sunday = " + store_open_sunday.Value);


            var momentDate=moment().utcOffset(Number(gmt_offset.Value))
            var currentday =momentDate.day();
            var currentTime =momentDate.hour();

            console.log("currentday = " + currentday);
            console.log("currentTime = " + currentTime);


            if (currentday === 0 ) //Sunday
            {
                if( 'no'=== store_open_sunday.Value )
                {
                    return false;
                }

            }

            if (currentday === 6) //Saturday
            {
                    if('no'=== store_open_saturday.Value )
                    {
                        return false;
                    }

            }


            if(currentTime >= store_open_time.Value  &&  currentTime < store_close_time.Value)
            {
                console.log("Store Open on Weekdays")

                return  false;
            }
            else
            {
                console.log("Store close on Weekdays")

                return true;
            }

    },



  isTakingOnlineOrder:function(isNotTakingOnlineOrder, isStoreClosed){
    if(isNotTakingOnlineOrder)
        return false;
    else
    {
        if(isStoreClosed)
        {
            return false
        }
        else
        {
            return true;
        }
    }



  } ,

    isDrink:function(categoryMenu)
    {
        //console.log('isDrink:categoryMenu = ' +categoryMenu);
        if('Drinks' === categoryMenu)
            return true;
        else
            return false;


    },

    isItemInCart: function(product){
        var sessid = Session.get('appUUID');


        var cartItems = CartItems.findOne({session: sessid, product:product});
            if(cartItems)
                    return true;
            else
            return false;
    },

	categoryMenu: function()
	{


		return Settings.find({$and : [{Key: "category_menu"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	},
	menu:function(categoryMenu)
	{

		return Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]});

	},

		isMenuAvailable:function(categoryMenu)
	{

		var menuCount = Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]}).count();
		if(menuCount > 0)
			return true;
		else
			return false;
	},

	isItemAvailable:function(fontLine)
	{

		if('line-through' === fontLine)
			return  false;
		else
			return true;
	},

	    soldOut:function(fontLine)
    {
    	if('line-through' === fontLine)
    		return 'soldout';
    	else
    		return '';
    },
        currency: function(num)
    {
        return '$' + Number(num).toFixed(2);
    },

    idOddNumberItems: function(categoryMenu)
    {
    			var menuCount = Menu.find({$and : [{Category: categoryMenu}, {Name : {"$exists" : true, "$ne" : ""}}]}).count();
    			console.log("menuCount = " + menuCount);
    			if(menuCount === 1)
    			{
    				return true;
    			}
    			else if(menuCount > 1)
    			{
    				console.log("menuCount %2 = " + menuCount % 2 );
    				if(menuCount %2 === 1)
    					return true;
    				else
    					return false;
    			}

    }

});

Template.homePage.events({
    'click .addcart': function(evt,tmpl)
    {



        var currentTarget = evt.currentTarget
        console.log("currentTarget" + currentTarget);
        console.log("tmpl" + tmpl);
        console.log("this.UniqueId " + this.UniqueId );
        var product = this.UniqueId ;
        var sessid = Session.get('appUUID');
        console.log("product = " + product );
        console.log("sessid = " + sessid );
        console.log('currentTarget.title = ' + currentTarget.title);
        Meteor.call('addToCart', 1 ,product, sessid, this.Name, this.Category, this.Charge);
        evt.currentTarget.className = "fa fa-check btn btn-success removecart"; 
        evt.currentTarget.title='Remove from Cart'

        var $L = 1200,
        $main_menutoggle    = $('#dosahousecart');

        $main_menutoggle.addClass('wiggle-me');
        //$main_menutoggle.attr('style', 'background-color:green;')


    },

        'click .removecart': function(evt,tmpl)
    {
        var currentTarget = evt.currentTarget
        console.log("currentTarget" + currentTarget);
        console.log("tmpl" + tmpl);
        console.log("this.UniqueId " + this.UniqueId );
        var product = this.UniqueId ;
        var sessid = Session.get('appUUID');
        console.log("product = " + product );
        console.log("sessid = " + sessid );
        console.log('currentTarget.title = ' + currentTarget.title);
        Meteor.call('removeCartItem', product, sessid);
        evt.currentTarget.className = "fa fa-shopping-cart  btn btn-default addcart"; 
        evt.currentTarget.title='Add to Cart'
    }


});
