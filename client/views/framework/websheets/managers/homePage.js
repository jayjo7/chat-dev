var notificationkey = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY) + '_' + websheets.public.generic.NOTIFICATION_MESSAGE_KEY;


Template.homePage.helpers({

    getPriceString:function(menu)
    {
        if(menu.Price)
        {
            return '$' + Number(menu.Price).toFixed(2);
        }
        else
        {
            return 'Add to Cart';
        }
    },

    isMultiPriceItem:function(menu)
    {
        if(menu.Price)
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    priceString:function(menu)
    {
        if(menu.Price)
        {
            return '$' + Number(menu.Price).toFixed(2);
        }
        else
        {
            var price='';
            if(menu.PriceSmall)
            {
                price +='S-$' + Number(menu.PriceSmall).toFixed(2) + ' ';
            }
            if(menu.PriceMedium)
            {
                price += 'M-$' + Number(menu.PriceMedium).toFixed(2) + ' ';
            }
            if(menu.PriceLarge)
            {
                price += 'L-$' + Number(menu.PriceLarge).toFixed(2) + ' ';
            }
            if(menu.PriceXL)
            {
                price += 'XL-$' + Number(menu.PriceXL).toFixed(2);
            }
            return price;
        }



    },

    notification_message_session:function()
    {

        return Session.get(notificationkey);

    },

    haveNotification: function(notification_general,isNotTakingOnlineOrder, isStoreClosed)
    {


        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);


        if(isNotTakingOnlineOrder)
        {        
                var settings = Settings.findOne({$and : [{Key: "notification_no_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                Session.set(notificationkey, settingsArray);

                return true;
        }

        if(isStoreClosed)
        {

                var settings        = Settings.findOne({$and : [{Key: "notification_store_closed"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]})
                var settingsValue   = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();

                var settingsArray = [];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                Session.set(notificationkey, settingsArray);
                return true;
        }

        if(typeof notification_general != 'undefined' && notification_general.length> 0)

        {
            Session.set(notificationkey, notification_general)
            return  true;

        }
        else
        {
            Session.set(notificationkey, null)

            return false;
        }

    },



    notification: function()
    {
        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);


        var settings = Settings.findOne({$and : [{Key: "notification_general"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue       = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();
                var settingsArray       =[];


                if(settingsValue.trim().length> 0)
                {

                    settingsArray = settingsValue.split('\n\n' );

                }

                return settingsArray;
            

    },

    isNotTakingOnlineOrder: function()
    {
        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

        var store_online_orders= Settings.findOne({$and : [{Key: "store_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

        if('NO' === store_online_orders.Value.trim().toUpperCase())
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

        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

        var store_open_time= Settings.findOne({$and : [{Key: "store_open_time"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var store_close_time= Settings.findOne({$and : [{Key: "store_close_time"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

            var momentDate=moment().utcOffset(Number(gmtOffset(orgname)));
            var currentday =momentDate.day();
            var currentTime =momentDate.hour();
            console.log('currentTime = ' + currentTime);


            if (currentday === 0  || (currentday === 6)) //Sunday
            {
                var store_open_saturday     = Settings.findOne({$and : [{Key: "store_open_saturday"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                var store_open_sunday       = Settings.findOne({$and : [{Key: "store_open_sunday"},   {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

                if( 'NO'=== store_open_sunday.Value.trim().toUpperCase() || 'NO'=== store_open_saturday.Value.trim().toUpperCase() )
                {
                    return true;
                }
                else
                {
                    var store_open_time_weekend = Settings.findOne({$and : [{Key: "store_open_time_weekend"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                    var store_close_time_weekend= Settings.findOne({$and : [{Key: "store_close_time_weekend"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]});
                    console.log('store_close_time_weekend = ' + store_close_time_weekend.Value);
                    if(currentTime >= store_open_time_weekend.Value  &&  currentTime < store_close_time_weekend.Value)
                    {

                        return  false;
                    }
                    else
                    {

                        return true;
                    }


                }

            }

            if(currentTime >= store_open_time.Value  &&  currentTime < store_close_time.Value)
            {

                return  false;
            }
            else
            {

                return true;
            }

    },



  isTakingOnlineOrder:function(isNotTakingOnlineOrder, isStoreClosed)
  {

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



    isItemInCart: function(product)
    {

        var sessid = Session.get('appUUID');
        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

        var cartItems = CartItems.findOne({session: sessid, product:product, orgname:orgname});

            if(cartItems)
                    return true;
            else
            return false;
    },

    soldOutCss:function(fontLine, fontStyle)
    {
        if('line-through' === fontLine || 'italic' === fontStyle)
            return 'soldout disabled';
        else
            return '';
    }

});


Template.homePage.events({
    'click .addcart': function(evt,tmpl)
    {

        var orgname         = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
        var currentTarget   = evt.currentTarget
        var product         = this.UniqueId ;
        var sessid          = Session.get('appUUID');
        var cartItem={};
        cartItem.orgname    = orgname;
        cartItem.product    = product;
        cartItem.session    = sessid;
        cartItem.qty        = 1;
        cartItem.Name       = this.Name; 
        cartItem.Category   = this.Category;
        cartItem.Price      = this.Price;

        switch (addToCartToggle(orgname))
        {
            case  websheets.public.generic.INCREMENT :

                cartItem.addToCartToggle    =  websheets.public.generic.INCREMENT;
                cartItem.singlePricedItem   = true;
                break;
                
            default:
                evt.currentTarget.className = "btn btn btn-sm pull-right  btn-ordered removecart"; 
                evt.currentTarget.title     ='Remove from Cart'          
        }

         Meteor.call('addToCart',  cartItem);



    },

    'click .removecart': function(evt,tmpl)
    {
        var orgname         = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
        var currentTarget   = evt.currentTarget
        var product         = this.UniqueId ;
        var sessid          = Session.get('appUUID');
        Meteor.call('removeCartItem', product, sessid, orgname);
        switch (addToCartToggle(orgname))
        {
            case websheets.public.generic.INCREMENT :
                break;
            default:
                evt.currentTarget.className = "btn btn-success btn-sm pull-right addcart"; 
                evt.currentTarget.title='Add to Cart'         

        }

    },

    'click #addDatatoModal': function(evt,tmpl)
    {
        //evt.preventDefault();
        Session.setPersistent(websheets.public.generic.MENU_OBJECT_SESSION_KEY, this);

    }


});
