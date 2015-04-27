Template.cart.helpers({	currency: function(num)    	{        	return '$' + Number(num).toFixed(2);    	},    sessionId:function()    {    	console.log("sessionId: " +  Session.get('appUUID'))    	return Session.get('appUUID');    	//return Meteor.call('getUUID');    	//console.log("sessionId: " +  Meteor.call('getSessionId'));    	//return Meteor.connection._lastSessionId;    }	,    shopCart: function()    {        var tax = Settings.findOne({$and : [{Key: "tax"}, {Value : {"$exists" : true, "$ne" : ""}}]});    	   sessid = Session.get('appUUID');                        console.log("shopCart:sessid =  " +sessid);           // return  CartItems.find({session:sessid})		    //console.log("In Cart Temlate");		    var shopCart = [];		   // var sessid = Meteor.default_connection._lastSessionId;		    var cartItems = CartItems.find({session: sessid});		    shopCart.itemCount = cartItems.count();		    var total = 0;		    cartItems.forEach(function(cartItem){		        var item = _.extend(cartItem,{});		        cartItem.price = (Number(cartItem.Charge) * cartItem.qty);		        total += cartItem.price;		        shopCart.push(cartItem);		    });		    shopCart.subtotal = total;            console.log("tax.Value : " + tax.Value);            var taxValue = Number(tax.Value);            if(taxValue >= 0)            {                 shopCart.tax = shopCart.subtotal * taxValue;                 shopCart.taxMessage= "Including Tax";                 shopCart.total = shopCart.subtotal + shopCart.tax;            }             else            {                shopCart.total = shopCart.subtotal                 shopCart.taxMessage= "Tax is not included";            }		    for(key in shopCart)		    {		    	console.log(key + " = " + shopCart[key]) ;		    }		    return shopCart;                     }});Template.cart.events({    'click #checkout-modal-close-trigger' : function(evt, tmpl)    {        console.log('In "checkout-trigger" click event');        $("#checkout-modal-modal").fadeToggle('fast');    },    'click #checkout-modal-trigger' : function(evt, tmpl)    {        console.log('In "checkout-trigger" click event');        $("#checkout-modal-modal").fadeToggle('fast');    },    'click #inputRadioPickUp': function(evt, tmpl)    {        console.log('In click inputRadioPickUp');     $("#creditcarddetails").hide('slow');    },     'click #inputRadioNow': function(evt, tmpl)    {        console.log('In click inputRadioNow');      $("#creditcarddetails").show('slow');      },    'click .removecart': function(evt,tmpl)    {        var currentTarget = evt.currentTarget        console.log("currentTarget" + currentTarget);        console.log("tmpl" + tmpl);        console.log("this.product " + this.product);        var sessid = Session.get('appUUID');        console.log("sessid = " + sessid );        console.log('currentTarget.title = ' + currentTarget.title);       // if(confirm('Are you sure to remove the ' + this.Name + ' from cart ?'))       // {            Meteor.call('removeCartItem', this.product, sessid);       // }    },        'click #product_in_cart , focusout  #product_in_cart': function (event, template) {        event.preventDefault();        console.log('In the click Event handler');        console.log("currentTarget = " + event.currentTarget);        console.log("event.keyCode = " + event.keyCode);        //for(key in event)        //{        //    console.log(key + " = " + event[key]);        //}            var selectedValue = Number (event.currentTarget.value);            console.log(' New Selected Value = '+ selectedValue);           product = this.product;            console.log("product = " + product );            sessid = Session.get('appUUID');            console.log("sessid = " + sessid );            if(selectedValue ===0)            {                if(confirm('Are you sure to remove the item ?'))                {                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);                }                else                {                    event.currentTarget.value = this.qty;                }            }            else            {                if(Number.isInteger(selectedValue))                {                    Meteor.call('addToCart', selectedValue ,product, sessid,  this.Name, this.Category, this.Charge);                }                else                {                    alert( 'Please enter a valid number.');                    event.currentTarget.value = this.qty;                }            }  },    'keyup #inputPhoneNumber': function (event, template) {        console.log("In event.type (intputPhoneNumber)= keyup");        var countryCode = Settings.findOne({$and : [{Key: "country_code"}, {Value : {"$exists" : true, "$ne" : ""}}]})                            phone = $('#inputPhoneNumber').val();        console.log("phone = " + phone);        console.log("CountryCode = " + countryCode['Value']);       //var formatedPhone = Phone.formatLocal(countryCode['Value'], phone);       // console.log("formatedPhone = " + formatedPhone);       //var formatE164Value = Phone.formatE164('AU', phone);      // console.log("formatE164Value = " + formatE164Value);               // var validPhoneNumber = Phone.isValidNumber(phone, 'US')               // console.log("validPhoneNumber = " + validPhoneNumber);        event.currentTarget.value= Phone.formatLocal(countryCode['Value'], phone);               //$('#intputPhoneNumber').html(Phone.formatLocal('AU', phone));    },      'keyup #product_in_cart': function (event, template) {        //event.preventDefault();        var isIgnore = false;        console.log("In event.type= keyup");        console.log("currentTarget = " + event.currentTarget);        console.log("event.keyCode = " + event.keyCode);        console.log("event.which = " + event.which);        console.log("event.key = " + event.key);        console.log("event.currentTarget.value = " + event.currentTarget.value);        var currentTargetValue = event.currentTarget.value;        console.log("currentTargetValue = " + currentTargetValue);        console.log("currentTargetValue.length= " + currentTargetValue.length);        //for(key in event)        //{        //   console.log(key + " = " + event[key]);        //}            console.log("isIgnore - before = "+ isIgnore);        if(event.keyCode ==='8' || event.keyCode == 8)        {            if(currentTargetValue.length >0)            {                console.log("currentTargetValue after removing last char= " + currentTargetValue);            }            else            {                isIgnore = true;            }        }        console.log("isIgnore - after = "+ isIgnore);        if( ! isIgnore)        {                        var selectedValue = Number (currentTargetValue);            console.log(' New Selected Value = '+ selectedValue);           product = this.product;            console.log("product = " + product );            sessid = Session.get('appUUID');            console.log("sessid = " + sessid );            if(selectedValue ===0)            {                if(confirm('Are you sure to remove the item ?'))                {                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);                }                else                {                    event.preventDefault();                    console.log("this.qty = " + this.qty );                    event.currentTarget.value = this.qty;                }            }            else            {                if(Number.isInteger(selectedValue))                {                    Meteor.call('addToCart', selectedValue ,product, sessid,  this.Name, this.Category, this.Charge);                }                else                {                    alert( 'Please enter a valid number.');                    event.currentTarget.value = this.qty;                }            }        }  },  'click #idPlaceOrder': function(event){    $('#idPlaceOrder').addClass('placeOrder');  },    'click #idCloseModal': function(event){    $('#idPlaceOrder').removeClass('placeOrder');  },	'click .placeOrder': function(event){        event.preventDefault();        $contactInfoError = $('#contactInfoError');        $contactInfoError.text('');                       console.log("Order form submitted");        console.log(event.type);        var isPayNow = $('#inputRadioNow').prop( "checked" );        console.log('isPayNow = ' + isPayNow );        //for(key in event.target)        //{        //    console.log(key + ' = ' + event.target[key]);        //}        $contactName        = $('#inputContactName')        $inputEmail         = $('#inputEmail')        $intputPhoneNumber  = $('#inputPhoneNumber')        //Remove the error class        $contactName.removeClass("error-highlight");        $inputEmail.removeClass("error-highlight");        $intputPhoneNumber.removeClass("error-highlight");        var contactInfo = {};        contactInfo.phoneNumber         = $intputPhoneNumber.val();        contactInfo.email               = $inputEmail.val();        contactInfo.messageToKitchen    = $('#inputMessageToKitchen').val();        contactInfo.contactName         = $contactName.val();        console.log(contactInfo.phoneNumber);        console.log(contactInfo.email);        console.log(contactInfo.messageToKitchen);        console.log(contactInfo.contactName);        var validationResult = true;        //var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i        if(contactInfo.contactName === null || contactInfo.contactName === undefined || contactInfo.contactName.trim()=='')        {            console.log("contactInfo.contactName is not valid" );            //event.target.setCustomValidity("Please enter your name.");                        $contactName .attr('style', 'border-color: red;')            $contactName .attr('title', 'Please enter a name.')            $contactName. addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');                   validationResult = false;        }        if(contactInfo.email === null || contactInfo.email === undefined || contactInfo.email.trim()=='')        {            console.log("contactInfo.email is not valid" );           // event.target.setCustomValidity("Please enter your valid email.");                        $inputEmail .attr('style', 'border-color: red;')            $inputEmail. addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');              validationResult = false;                    }        else        if(!contactInfo.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))        {            console.log("Entered contactInfo.email is not valid" );           // event.target.setCustomValidity("Please enter your valid email.");            $inputEmail .attr('style', 'border-color: red;')            $inputEmail. addClass("error-highlight");            $contactInfoError.text('Please enter a valid email.');              validationResult = false;        }        if(contactInfo.phoneNumber === null || contactInfo.phoneNumber === undefined || contactInfo.phoneNumber.trim()=='')        {            console.log("contactInfo.phoneNumberis not valid" );            //event.target.setCustomValidity("Please enter your valid phone number.");            $intputPhoneNumber .attr('style', 'border-color: red;')            $intputPhoneNumber .addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');              validationResult = false;                    }         var paymentInfo;try{        console.log("Before:isPayNowCheck: validationResult = " + validationResult);        if(isPayNow)        {                   paymentInfo = {};            $inputCardNumber        = $('#inputCardNumber')            $inputCardExpiryMonth   = $('#inputCardExpiryMonth')            $inputCardExpiryYear    = $('#inputCardExpiryYear')            $inputCVC               = $('#inputCVC')            $inputCardNumber.removeClass("error-highlight");            $inputCardExpiryMonth.removeClass("error-highlight");            $inputCardExpiryYear.removeClass("error-highlight");            $inputCVC.removeClass("error-highlight");            paymentInfo.cardNumber      = $inputCardNumber .val();            paymentInfo.cardExpiryMonth = $inputCardExpiryMonth.val();            paymentInfo.cardExpiryYear  = $inputCardExpiryYear.val();            paymentInfo.cardCVC         = $inputCVC .val();            console.log("paymentInfo.cardNumber      = " + paymentInfo.cardNumber);            console.log("paymentInfo.cardExpiryMonth = " + paymentInfo.cardExpiryMonth);            console.log("paymentInfo.cardExpiryYear  = " + paymentInfo.cardExpiryYear);            console.log("paymentInfo.cardCVC         = " + paymentInfo.cardCVC);            var ccValidateReg  = "^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$";            if(paymentInfo.cardNumber  === null || paymentInfo.cardNumber  === undefined || paymentInfo.cardNumber.trim()=='')            {                console.log("paymentInfo.cardNumber is not valid" );                                $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  validationResult = false;                            }            else            if( ! paymentInfo.cardNumber .match(ccValidateReg))            {                          console.log("Entered but paymentInfo.cardNumber is not valid" );                $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please enter a valid Credit Card number');                            validationResult = false;            }            else if( ! Stripe.card.validateCardNumber(paymentInfo.cardNumber))            {                 console.log("Entered but paymentInfo.cardNumber (Stripe Logic)is not valid" );                $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please enter a valid Credit Card number');                            validationResult = false;            }            if(paymentInfo.cardExpiryMonth  === null || paymentInfo.cardExpiryMonth  === undefined || paymentInfo.cardExpiryMonth.trim()=='')            {                console.log("paymentInfo.cardExpiryMonth is not valid" );                $inputCardExpiryMonth.attr('style', 'border-color: red;')                $inputCardExpiryMonth .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  validationResult = false;                            }            if(paymentInfo.cardExpiryYear === null || paymentInfo.cardExpiryYear === undefined || paymentInfo.cardExpiryYear.trim()=='')            {                console.log("paymentInfo.cardExpiryYear is not valid" );                $inputCardExpiryYear .attr('style', 'border-color: red;')                $inputCardExpiryYear .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  validationResult = false;                            }            if(validationResult)            {               if( ! Stripe.card.validateExpiry(paymentInfo.cardExpiryMonth, paymentInfo.cardExpiryYear))               {                    console.log("The expiry date is before today's date  (Stripe Logic). Please select a valid expiry date");                    validationResult = false;                     $inputCardExpiryMonth.attr('style', 'border-color: red;')                    $inputCardExpiryMonth .addClass("error-highlight");                    $inputCardExpiryYear .attr('style', 'border-color: red;')                    $inputCardExpiryYear .addClass("error-highlight");                    $contactInfoError.text('Please enter a future date.');               }                var today = new Date();                var someday = new Date();                someday.setFullYear(paymentInfo.cardExpiryYear, paymentInfo.cardExpiryMonth, 1);                if (someday < today)                 {                    console.log("The expiry date is before today's date. Please select a valid expiry date");                    validationResult = false;                     $inputCardExpiryMonth.attr('style', 'border-color: red;')                    $inputCardExpiryMonth .addClass("error-highlight");                    $inputCardExpiryYear .attr('style', 'border-color: red;')                    $inputCardExpiryYear .addClass("error-highlight");                    $contactInfoError.text('Please enter a future date.');                }            }            var cvcValidateReg = "^[0-9]{3,4}$";           if(paymentInfo.cardCVC === null || paymentInfo.cardCVC === undefined || paymentInfo.cardCVC.trim()=='')            {                console.log("paymentInfo.cardCVC is not valid" );                $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  validationResult = false;                            }            else            if( ! paymentInfo.cardCVC .match(cvcValidateReg))            {                          console.log("Entered but paymentInfo.cardCVC is not valid" );                $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please enter a valid cvc number');                            validationResult = false;            }             else            if( ! Stripe.card.validateCVC (paymentInfo.cardCVC))            {                          console.log("Entered but paymentInfo.cardCVC (Stripe Logic)is not valid" );                $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please enter a valid cvc number');                            validationResult = false;            }              Stripe.card.validateCVC        if(validationResult )        {                            Stripe.setPublishableKey('pk_test_1J0fGPuQStfrSiv6P1L5p8lz');                        Stripe.card.createToken({                                    number: paymentInfo.cardNumber,                                    cvc: paymentInfo.cardCVC,                                    exp_month: paymentInfo.cardExpiryMonth,                                    exp_year:paymentInfo.cardExpiryYear                                 },                                 function(status, response) {                                        if (response.error) {                                            // Show the errors on the form                                            console.log('response.error = ' + response.error);                                            for(var key in response.error)                                            {                                                console.log( key +' = ' + response.error[key]);                                            }                                            $contactInfoError.text(response.error.message);                                            return false;                                        } else {                                                    // token contains id, last4, and card type                                                    var token = response.id;                                                    console.log('token = ' + token);                                                                var sessid = Session.get('appUUID');                                                    console.log("Confirming orders... " + sessid);                                                    var contact                                                    console.log("contact = " + contactInfo);                                                    Meteor.call('getNextSequenceValue',function(error, result)                                                    {                                                        if(error)                                                        {                                                            console.log("Trouble getting the next sequence number");                                                        }                                                        else                                                        {                                                            var sequence = result;                                                            for(var key in sequence)                                                                {                                                                console.log("cart.js : " +key + " = " +sequence[key]);                                                                }                                                                Meteor.call('orderItems',sessid, contactInfo, sequence, response, function(error, result)                                                                {                                                                    if(error)                                                                    {                                                                        if(result)                                                                        {                                                                            console.log("Could not insert the order for the session  = " + sessid + "Order = " + JSON.stringify(result, null, 4));                                                                        }                                                                        else                                                                        {                                                                            console.log("Could not insert the order for the session  = " + sessid );                                                                        }                                                                    }                                                                    else                                                                    {                                                                        console.log("sessid = " + sessid);                                                                        console.log("sequence._id= " + sequence._id);                                                                        Router.go('confirmation',  {UniqueId: sequence._id});                                                                    }                                                                });                                                        }                                                     });                                        }                        });        }                    }        else        if(validationResult )        {            var sessid = Session.get('appUUID');            console.log("Confirming orders... " + sessid);            var contact            console.log("contact = " + contactInfo);            Meteor.call('getNextSequenceValue',function(error, result)            {                if(error)                {                    console.log("Trouble getting the next sequence number");                }                else                {                    var sequence = result;                           for(var key in sequence)                        {                        console.log("cart.js : " +key + " = " +sequence[key]);                        }                        Meteor.call('orderItems',sessid, contactInfo, sequence, function(error, result)                        {                            if(error)                            {                                if(result)                                {                                    console.log("Could not insert the order for the session  = " + sessid + "Order = " + JSON.stringify(result, null, 4));                                }                                else                                {                                    console.log("Could not insert the order for the session  = " + sessid );                                }                            }                            else                            {                                console.log("sessid = " + sessid);                                console.log("sequence._id= " + sequence._id);                                Router.go('confirmation',  {UniqueId: sequence._id});                            }                        });                }             });        }     }catch (e)     {        console.log(e instanceof SyntaxError);          console.log(e.message);                         console.log(e.name);                            console.log(e.fileName);                        console.log(e.lineNumber);                      console.log(e.columnNumber);                    console.log(e.stack);       }          },	'click .removeShadow':function (evt,tmpl)    {    	//evt.preventDefault();    	var $L = 1200,		$menu_navigation = $('#main-nav'),		$cart_trigger = $('#cd-cart-trigger'),		$hamburger_icon = $('#cd-hamburger-menu'),		$lateral_cart = $('#cd-cart'),		$shadow_layer = $('#cd-shadow-layer');		$body = $('body');		$shadow_layer.removeClass('is-visible');		// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden		if( $lateral_cart.hasClass('speed-in') ) {			$lateral_cart.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){				$('body').removeClass('overflow-hidden');			});			$menu_navigation.removeClass('speed-in');		} else {			$menu_navigation.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){				$('body').removeClass('overflow-hidden');			});			$lateral_cart.removeClass('speed-in');		}    }}); /*   Template.body.events({        "click .cartProduct ": function(evt, data) {        //var dataJson= JSON.stringify(data);        //var htmlName = dataJson.Name;              //console.log(' body Input data = '+ dataJson);            //console.log(' body Input data htmlName = '+ htmlName);            var selectedValue = Number (this.value);            console.log(' New Selected Value = '+ selectedValue);            var product_name = this.name;            console.log(' New Selected Name = '+ product_name);            product_id= this.id;            console.log("product_id = " + product_id );            product = product_name.substring(product_name.indexOf("_")+1);            console.log("this.product = " + this.product );            console.log("product = " + product );            sessid = Session.get('appUUID');            console.log("sessid = " + sessid );            if(selectedValue ===0)            {                if(confirm('Are you sure to remove the item !'))                {                    Meteor.call('addToCart', selectedValue ,product, sessid, this.Name, this.Category, this.Charge);                }                esle                {                    this.value = selectedValue;                }            }            else            {                   var productObject=  Menu.findOne({UniqueId:product});                   console.log('productObject = ' + productObject);                    Meteor.call('addToCart', selectedValue ,product, sessid, productObject.Name, productObject.Category, productObject.Charge);            }        // var target =  evt.target.title='Added';  //console.log(' body Input Event = '+ target.hasclass (''));//    // e -> jquery event    // data -> Blaze data context of the DOM element triggering the event handler  }});*/