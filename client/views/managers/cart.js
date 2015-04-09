Template.cart.helpers({

	currency: function(num)
    	{
        	return '$' + Number(num).toFixed(2);
    	},

    sessionId:function()
    {
    	console.log("sessionId: " +  Session.get('appUUID'))
    	return Session.get('appUUID');
    	//return Meteor.call('getUUID');

    	//console.log("sessionId: " +  Meteor.call('getSessionId'));
    	//return Meteor.connection._lastSessionId;
    }	,

    shopCart: function()
    {

        var tax = Settings.findOne({$and : [{Key: "tax"}, {Value : {"$exists" : true, "$ne" : ""}}]});

    	   sessid = Session.get('appUUID');
             
           console.log("shopCart:sessid =  " +sessid);
           // return  CartItems.find({session:sessid})

		    //console.log("In Cart Temlate");

		    var shopCart = [];
		   // var sessid = Meteor.default_connection._lastSessionId;
		    var cartItems = CartItems.find({session: sessid});
		    shopCart.itemCount = cartItems.count();
		    var total = 0;

		    cartItems.forEach(function(cartItem){
		        var item = _.extend(cartItem,{});

		        cartItem.price = (Number(cartItem.Charge) * cartItem.qty);
		        total += cartItem.price;
		        shopCart.push(cartItem);
		    });
		    shopCart.subtotal = total;
            console.log("tax.Value : " + tax.Value);

            var taxValue = Number(tax.Value);

            if(taxValue >= 0)
            {
                 shopCart.tax = shopCart.subtotal * taxValue;

                 shopCart.taxMessage= "Including Tax";
                 shopCart.total = shopCart.subtotal + shopCart.tax;

            } 
            else
            {
                shopCart.total = shopCart.subtotal 

                shopCart.taxMessage= "Tax is not included";
            }



		    for(key in shopCart)
		    {
		    	console.log(key + " = " + shopCart[key]) ;
		    }


		    return shopCart;

          
       

    }


});



Template.cart.events({

        'click #product_in_cart , focusout  #product_in_cart': function (event, template) {
        event.preventDefault();
        console.log('In the click Event handler');

        console.log("currentTarget = " + event.currentTarget);
        console.log("event.keyCode = " + event.keyCode);
        //for(key in event)
        //{
        //    console.log(key + " = " + event[key]);
        //}

            var selectedValue = Number (event.currentTarget.value);
            console.log(' New Selected Value = '+ selectedValue);

           product = this.product;
            console.log("product = " + product );

            sessid = Session.get('appUUID');
            console.log("sessid = " + sessid );


            if(selectedValue ===0)
            {
                if(confirm('Are you sure to remove the item !'))
                {
                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);

                }
                else
                {
                    event.currentTarget.value = this.qty;
                }
            }
            else
            {
                if(isInteger(selectedValue))
                {

                    Meteor.call('addToCart', selectedValue ,product, sessid,  this.Name, this.Category, this.Charge);

                }
                else
                {
                    alert( 'Please enter a valid number.');
                    event.currentTarget.value = this.qty;
                }
            }
  },

    'keyup #intputPhoneNumber': function (event, template) {
        console.log("In event.type (intputPhoneNumber)= keyup");

        var countryCode = Settings.findOne({$and : [{Key: "country_code"}, {Value : {"$exists" : true, "$ne" : ""}}]})

                    
        phone = $('#intputPhoneNumber').val();

        console.log("phone = " + phone);

        console.log("CountryCode = " + countryCode['Value']);



       //var formatedPhone = Phone.formatLocal(countryCode['Value'], phone);
       // console.log("formatedPhone = " + formatedPhone);
       //var formatE164Value = Phone.formatE164('AU', phone);
      // console.log("formatE164Value = " + formatE164Value);

               // var validPhoneNumber = Phone.isValidNumber(phone, 'US')
               // console.log("validPhoneNumber = " + validPhoneNumber);
        event.currentTarget.value= Phone.formatLocal(countryCode['Value'], phone);
        
       //$('#intputPhoneNumber').html(Phone.formatLocal('AU', phone));


    },

  
    'keyup #product_in_cart': function (event, template) {
        //event.preventDefault();
        var isIgnore = false;
        console.log("In event.type= keyup");
        console.log("currentTarget = " + event.currentTarget);
        console.log("event.keyCode = " + event.keyCode);
        console.log("event.which = " + event.which);
        console.log("event.key = " + event.key);
        console.log("event.currentTarget.value = " + event.currentTarget.value);

        var currentTargetValue = event.currentTarget.value;
        console.log("currentTargetValue = " + currentTargetValue);
        console.log("currentTargetValue.length= " + currentTargetValue.length);


        //for(key in event)
        //{
        //   console.log(key + " = " + event[key]);
        //}  
  

        console.log("isIgnore - before = "+ isIgnore);

        if(event.keyCode ==='8' || event.keyCode == 8)
        {
            if(currentTargetValue.length >0)
            {

                console.log("currentTargetValue after removing last char= " + currentTargetValue);

            }
            else
            {
                isIgnore = true;
            }
        }

        console.log("isIgnore - after = "+ isIgnore);

        if( ! isIgnore)
        {

            


            var selectedValue = Number (currentTargetValue);


            console.log(' New Selected Value = '+ selectedValue);



           product = this.product;
            console.log("product = " + product );

            sessid = Session.get('appUUID');
            console.log("sessid = " + sessid );


            if(selectedValue ===0)
            {
                if(confirm('Are you sure to remove the item !'))
                {
                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);

                }
                else
                {
                    event.preventDefault();
                    console.log("this.qty = " + this.qty );
                    event.currentTarget.value = this.qty;
                }
            }
            else
            {
                if(isInteger(selectedValue))
                {

                    Meteor.call('addToCart', selectedValue ,product, sessid,  this.Name, this.Category, this.Charge);

                }
                else
                {
                    alert( 'Please enter a valid number.');
                    event.currentTarget.value = this.qty;
                }
            }
        }
  },


	'submit form': function(event){

        event.preventDefault();
        
        console.log("Order form submitted");
        console.log(event.type);


        //for(key in event.target)
        //{
        //    console.log(key + ' = ' + event.target[key]);
        //}

        var contactInfo = {};

        contactInfo.phoneNumber = event.target.phoneNumber.value;
        contactInfo.email=event.target.inputEmail.value;
        contactInfo.messageToKitchen = event.target.messageToKitchen.value;
        contactInfo.contactName = event.target.contactName.value;
        console.log(contactInfo.phoneNumber);
        console.log(contactInfo.email);
        console.log(contactInfo.messageToKitchen);
        console.log(contactInfo.contactName);

        var validationResult = true;
        var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i


        if(contactInfo.contactName === null || contactInfo.contactName === undefined || contactInfo.contactName.trim()=='')
        {
            console.log("contactInfo.contactName is not valid" );
            //event.target.setCustomValidity("Please enter your name.");
            $contactName = $('#contactName')
            $contactName .attr('style', 'border-color: red;')
            $contactName .attr('title', 'Please enter a name.')

            $contactInfoError = $('#contactInfoError');
            $contactInfoError.text('Please fill the above highlighted fileds');       


            validationResult = false;

        }
        if(contactInfo.email === null || contactInfo.email === undefined || contactInfo.email.trim()=='')
        {
            console.log("contactInfo.email is not valid" );
           // event.target.setCustomValidity("Please enter your valid email.");
            $inputEmail = $('#inputEmail')
            $inputEmail .attr('style', 'border-color: red;')
            $contactInfoError = $('#contactInfoError');
            $contactInfoError.text('Please fill the above highlighted fileds');  
            validationResult = false;
            
        }
        else
        if(!contactInfo.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        {
            console.log("Entered contactInfo.email is not valid" );
           // event.target.setCustomValidity("Please enter your valid email.");
            $inputEmail = $('#inputEmail')
            $inputEmail .attr('style', 'border-color: red;')
            $contactInfoError = $('#contactInfoError');
            $contactInfoError.text('Please enter a valid email.');  
            validationResult = false;


        }

        if(contactInfo.phoneNumber === null || contactInfo.phoneNumber === undefined || contactInfo.phoneNumber.trim()=='')
        {
            console.log("contactInfo.phoneNumberis not valid" );
            //event.target.setCustomValidity("Please enter your valid phone number.");
            $intputPhoneNumber = $('#intputPhoneNumber')
            $intputPhoneNumber .attr('style', 'border-color: red;')
            $contactInfoError = $('#contactInfoError');
            $contactInfoError.text('Please fill the above highlighted fileds');  

            validationResult = false;
            
        }
      //  else
      //  if(!contactInfo.phoneNumber.match(/^[0-9]{1,10}$/))
      //  {
      //
      //      console.log("Entered but contactInfo.phoneNumberis not valid" );
      //      //event.target.setCustomValidity("Please enter your valid phone number.");
      //      $intputPhoneNumber = $('#intputPhoneNumber')
      //      $intputPhoneNumber .attr('style', 'border-color: red;')
      //      $contactInfoError = $('#contactInfoError');
      //      $contactInfoError.text('Please enter a valid phone number');  
      //
      //      validationResult = false;

      //  }
        console.log("validationResult = " + validationResult);
        if(validationResult )
        {

            {

                var $L = 1200,
                $menu_navigation = $('#main-nav'),
                $cart_trigger = $('#cd-cart-trigger'),
                $hamburger_icon = $('#cd-hamburger-menu'),
                $lateral_cart = $('#cd-cart'),
                $shadow_layer = $('#cd-shadow-layer');
                $body = $('body');

                $('body').removeClass('overflow-hidden');
                $shadow_layer.removeClass('is-visible');
                // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
                if( $lateral_cart.hasClass('speed-in') ) {
                    $lateral_cart.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                        $('body').removeClass('overflow-hidden');
                    });
                    $menu_navigation.removeClass('speed-in');
                } else {
                    $menu_navigation.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                        $('body').removeClass('overflow-hidden');
                    });
                    $lateral_cart.removeClass('speed-in');
                }

        

            }


            var sessid = Session.get('appUUID');
            console.log("Confirming orders... " + sessid);

            var contact

            console.log("contact = " + contactInfo);

            Meteor.call('getNextSequenceValue',function(error, result)
            {

                if(error)
                {
                    console.log("Trouble getting the next sequence number");
                }
                else
                {
                    var sequence = result;
       
                    for(var key in sequence)
                        {
                        console.log("cart.js : " +key + " = " +sequence[key]);
                        }

                        Meteor.call('orderItems',sessid, contactInfo, sequence, function(error, result)
                        {

                            if(error)
                            {
                                if(result)
                                {
                                    console.log("Could not insert the order for the session  = " + sessid + "Order = " + JSON.stringify(result, null, 4));
                                }
                                else
                                {
                                    console.log("Could not insert the order for the session  = " + sessid );
                                }

                            }
                            else
                            {
                                console.log("sessid = " + sessid);
                                console.log("sequence._id= " + sequence._id);


                                Router.go('confirmation',  {UniqueId: sequence._id});

                            }

                        });
                } 
            });
        }
    },


	'click .removeShadow':function (evt,tmpl)
    {
    	//evt.preventDefault();
    	var $L = 1200,
		$menu_navigation = $('#main-nav'),
		$cart_trigger = $('#cd-cart-trigger'),
		$hamburger_icon = $('#cd-hamburger-menu'),
		$lateral_cart = $('#cd-cart'),
		$shadow_layer = $('#cd-shadow-layer');
		$body = $('body');


		$shadow_layer.removeClass('is-visible');
		// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $lateral_cart.hasClass('speed-in') ) {
			$lateral_cart.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$menu_navigation.removeClass('speed-in');
		} else {
			$menu_navigation.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$lateral_cart.removeClass('speed-in');
		}
    }



});

 /*   Template.body.events({
        "click .cartProduct ": function(evt, data) {

        //var dataJson= JSON.stringify(data);

        //var htmlName = dataJson.Name;
     
         //console.log(' body Input data = '+ dataJson);
            //console.log(' body Input data htmlName = '+ htmlName);

            var selectedValue = Number (this.value);
            console.log(' New Selected Value = '+ selectedValue);

            var product_name = this.name;
            console.log(' New Selected Name = '+ product_name);

            product_id= this.id;
            console.log("product_id = " + product_id );

            product = product_name.substring(product_name.indexOf("_")+1);
            console.log("this.product = " + this.product );

            console.log("product = " + product );

            sessid = Session.get('appUUID');
            console.log("sessid = " + sessid );


            if(selectedValue ===0)
            {
                if(confirm('Are you sure to remove the item !'))
                {
                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);

                }
                esle
                {
                    this.value = selectedValue;
                }
            }
            else
            {

                   var productObject=  Menu.findOne({UniqueId:product});

                   console.log('productObject = ' + productObject);

                    Meteor.call('addToCart', selectedValue ,product, sessid, productObject.Name, productObject.Category, productObject.Charge);

            }








        // var target =  evt.target.title='Added';
  //console.log(' body Input Event = '+ target.hasclass (''));
//
    // e -> jquery event
    // data -> Blaze data context of the DOM element triggering the event handler
  }
});*/