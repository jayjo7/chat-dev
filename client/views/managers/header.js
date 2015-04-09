Template.header.events({

    'click .openCart': function(evt,tmpl)
    {
    	//evt.preventDefault();
    	var $L = 1200,
		$menu_navigation = $('#main-nav'),
		$cart_trigger = $('#cd-cart-trigger'),
		$hamburger_icon = $('#cd-hamburger-menu'),
		$lateral_cart = $('#cd-cart'),
		$shadow_layer = $('#cd-shadow-layer');
		$body = $('body');


        $menu_navigation.removeClass('speed-in');

        if( $lateral_cart.hasClass('speed-in') ) {
		// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		$lateral_cart.removeClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.removeClass('overflow-hidden');
		});
		$shadow_layer.removeClass('is-visible removeShadow');

	} else {
		$lateral_cart.addClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.addClass('overflow-hidden');
		});
		$shadow_layer.addClass('is-visible removeShadow');
	}

    },

    'click .hamburgerMenu':function (evt,tmpl)
    {
    	console.log('In hamburgerMenu click event');
    	evt.preventDefault();
    	var $L = 1200,
		$menu_navigation = $('#main-nav'),
		$cart_trigger = $('#cd-cart-trigger'),
		$hamburger_icon = $('#cd-hamburger-menu'),
		$lateral_cart = $('#cd-cart'),
		$shadow_layer = $('#cd-shadow-layer');
		$body = $('body');

		$lateral_cart.removeClass('speed-in');

		if( $menu_navigation.hasClass('speed-in') ) {
		// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		$menu_navigation.removeClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.removeClass('overflow-hidden');
		});
		 $shadow_layer.removeClass('is-visible removeShadow');

	} else {
		$menu_navigation.addClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.addClass('overflow-hidden');
		});
		 $shadow_layer.addClass('is-visible removeShadow');
	}


	},

		'click .removeShadowMenu':function (evt,tmpl)
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
    },

		'click .mainmenutoggle':function (evt,tmpl)
    {
    	//evt.preventDefault();


        console.log('In mainmenutoggle click event');

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


       evt.currentTarget.className ='current mainmenutoggle';



    	var $L = 1200,
    	$main_menutoggle	= $('#main-menutoggle'),
   		$aboutus_menutoggle	= $('#aboutus-menutoggle'),
    	$catering_menutoggle = $('#catering-menutoggle'),
    	$findus_menutoggle	= $('#findus-menutoggle');

    	var currentTargetId = evt.currentTarget.id;


    	if(currentTargetId === $main_menutoggle.attr('id'))
    	{
    		$aboutus_menutoggle.removeClass('current mainmenutoggle');
    		$catering_menutoggle.removeClass('current mainmenutoggle');
    		$findus_menutoggle.removeClass('current mainmenutoggle');

    		$aboutus_menutoggle.addClass('mainmenutoggle');
    		$catering_menutoggle.addClass('mainmenutoggle');
    		$findus_menutoggle.addClass('mainmenutoggle');

    	}
    	else if (currentTargetId === $aboutus_menutoggle.attr('id')) 
    	{

    		$main_menutoggle.removeClass('current mainmenutoggle');
    		$catering_menutoggle.removeClass('current mainmenutoggle');
    		$findus_menutoggle.removeClass('current mainmenutoggle');

    		$main_menutoggle.addClass('mainmenutoggle');
    		$catering_menutoggle.addClass('mainmenutoggle');
    		$findus_menutoggle.addClass('mainmenutoggle');

    	}
    	else if(currentTargetId === $catering_menutoggle.attr('id') )
    	{
    		$main_menutoggle.removeClass('current mainmenutoggle');
    		$aboutus_menutoggle.removeClass('current mainmenutoggle');
    		$findus_menutoggle.removeClass('current mainmenutoggle');

    		$main_menutoggle.addClass('mainmenutoggle');
    		$aboutus_menutoggle.addClass('mainmenutoggle');
    		$findus_menutoggle.addClass('mainmenutoggle');

    	}
    	else if(currentTargetId === $findus_menutoggle.attr('id'))
    	{
    		$main_menutoggle.removeClass('current mainmenutoggle');
    		$aboutus_menutoggle.removeClass('current mainmenutoggle');
    		$catering_menutoggle.removeClass('current mainmenutoggle');
    		$main_menutoggle.addClass('mainmenutoggle');
    		$aboutus_menutoggle.addClass('mainmenutoggle');
    		$catering_menutoggle.addClass('mainmenutoggle');

    	}

    	



    }


});

Template.header.helpers({

	homeUrl: function()
	{
		var host =  window.location.host;
		if('localhost'===host)
			return 'http://host';
		else
			return 'https://host';
	},

    isItemInCart: function(){
        var sessid = Session.get('appUUID');


        var cartItems = CartItems.find({session: sessid});
        var cartItemsCount = cartItems.count()
        console.log("header.js: cartItems.count = " + cartItemsCount);

        console.log("header.js: cartItems = " + cartItems)
            if(cartItemsCount > 0)
            {
            	   var $L = 1200,
        		   $main_menutoggle    = $('#dosahousecart');
        		   $main_menutoggle.removeClass('wiggle-me');

                 return true;

             }
            else
            {
            	return false;
        	}
    }


	});

