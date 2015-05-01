Template.confirmation.helpers({
  haveETA: function(uniqueId)
  {

  },

	isReady: function(uniqueId)
    {
        console.log('isReady:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        if(STATE_THREE === order.Status)
        	return true;
        else
        	return false;

     },

     	isDelivered: function(uniqueId)
    {
        console.log('isDelivered:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        if('delivered' === order.Status)
        	return true;
        else
        	return false;

     },

          	isInProcess: function(uniqueId)
    {
        console.log('isInProcess:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        if( STATE_TWO === order.Status)
        	return true;
        else
        	return false;

     },

     isInKitchen: function(uniqueId)
    {
        console.log('isInKitchen:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        if( STATE_TWO === order.Status || STATE_FOUR === order.Status || STATE_THREE === order.Status)
        	return true;
        else
        	return false;

     },

     isSaleComplete: function(uniqueId)
    {
        console.log('isSaleComplete:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        if( STATE_FOUR === order.Status || STATE_THREE === order.Status)
        	return true;
        else
        	return false;

     },

    order: function(uniqueId)
    {
        console.log('uniqueId = ' + uniqueId);

        return Orders.findOne({UniqueId:uniqueId});

     },

     customerName: function(uniqueId)
    {
        console.log('uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        return order.CustomerName;

     },

     message: function(uniqueId)
	{
		console.log('message:uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        var messageKey='message_confirmation';
        if(STATE_THREE === order.Status)

        	messageKey = 'message_ready';
        	
        else
		if(STATE_FOUR === order.Status)

			messageKey = 'message_delivered';


		var confirmation = Settings.findOne({$and : [{Key: messageKey}, {Value : {"$exists" : true, "$ne" : ""}}]});

		var value = confirmation['Value'];
		console.log(' confirmation value = ' + value);

		var confirmationArray = value.split('\n\n' );

		for(key in confirmationArray)
		{
		console.log(key + " = " + confirmationArray[key]);
		}

		return confirmationArray;

	},

     orderNumber: function(uniqueId)
    {
        console.log('uniqueId = ' + uniqueId);
        var order = Orders.findOne({UniqueId:uniqueId});
        return order.OrderNumber;

     },

         orderedCart: function(uniqueId)
    {
    	  
             
           console.log("orderedCart:uniqueId =  " +uniqueId);

           var tax              = Settings.findOne({$and : [{Key: "tax"}, {Value : {"$exists" : true, "$ne" : ""}}]});
           var sale_discount    = Settings.findOne({$and : [{Key: "sale_discount"}, {Value : {"$exists" : true, "$ne" : ""}}]});


		      var orderedCart         = [];
		      var orderedItems        = OrderedItems.find({UniqueId: uniqueId});
		      orderedCart.itemCount   = orderedItems.count();
		      var total               = 0;

		      orderedItems.forEach(function(orderedItem){
		        var item = _.extend(orderedItem,{});

		        orderedItem.price = (Number(orderedItem.Charge) * orderedItem.qty);
		        total += orderedItem.price;
		        orderedCart.push(orderedItem);
		      });

		      orderedCart.subtotal = total;

          console.log("sale_discount.Value : " + sale_discount.Value);

          var sale_discountValue = Number(sale_discount.Value);
          console.log("tax.Value : " + tax.Value);

          var taxValue = Number(tax.Value);

            if(sale_discountValue > 0 && taxValue > 0)
            {
                orderedCart.discount                = orderedCart.subtotal * sale_discountValue;
                orderedCart.subtotalAfterDiscount   = orderedCart.subtotal - orderedCart.discount;
                orderedCart.tax                     = orderedCart.subtotalAfterDiscount  * taxValue;
                orderedCart.total                   = orderedCart.subtotalAfterDiscount + orderedCart.tax;
                orderedCart.message                    = "Total (" + sale_discountValue *100 +"% discount & tax)";
                Session.set('orderedTax', orderedCart['tax']);          
                Session.set('discount', orderedCart['discount']);          

            }  
            else
            if (sale_discountValue > 0 && taxValue <= 0)

            {
                orderedCart.discount               = orderedCart.subtotal * sale_discountValue;
                orderedCart.subtotalAfterDiscount  = orderedCart.subtotal - orderedCart.discount;
                orderedCart.total                  = orderedCart.subtotalAfterDiscount;
                orderedCart.message                = "Total (" + sale_discountValue *100 +"% discount)";
                Session.set('discount', orderedCart['discount']);          
                Session.set('orderedTax', null);          


            }  
            else
            if (sale_discountValue <=  0 && taxValue > 0)
            {
                 orderedCart.tax            = orderedCart.subtotal * taxValue;
                 orderedCart.total          = orderedCart.subtotal + orderedCart.tax;
                 orderedCart.message        = "Total (Including Tax)";
                 Session.set('discount', null);          
                 Session.set('orderedTax', orderedCart['tax']);          


            }  
            else
            {
                orderedCart.total = orderedCart.subtotal 
                Session.set('orderedTax', null);  
                Session.set('discount', null);          
                orderedCart.taxMessage= "Tax is not included";
            }                                         


		    //orderedCart.tax = orderedCart.subtotal * .092;

		   // orderedCart.total = orderedCart.subtotal + orderedCart.tax;

		    for(key in orderedCart)
		    {
		    	console.log(key + " = " + orderedCart[key]) ;
		    }

		    Session.set('orderedSubTotal', orderedCart['subtotal']);
		   	Session.set('orderedTotal',    orderedCart['total']);


		    return orderedCart;

          
       

    },

    haveTax:function()
    {
        if(Session.get('orderedTax'))
        {
            return true;
        }
        else
        {
            return false;
        }

    },

  getDiscount:function()

  {
    return '$'+Number(Session.get('discount')).toFixed(2);
  },

  getSubTotal:function()

	{
		return '$'+Number(Session.get('orderedSubTotal')).toFixed(2);
	},
    getTax:function()

	{
		return '$'+Number(Session.get('orderedTax')).toFixed(2);
	},
	    getTotal:function()

	{
		return '$'+Number(Session.get('orderedTotal')).toFixed(2);
	},
    	currency: function(num)
    	{
        	return '$' + Number(num).toFixed(2);
    	},

      haveMessageToKitchen: function(uniqueId)
      {
                var order = Orders.findOne({UniqueId:uniqueId});
                if(order.MessageToKitchen)
                {
                  return true;

                }
                else
                {
                  return false;
                }
      },
            messageToKitchen: function(uniqueId)
      {
                var order = Orders.findOne({UniqueId:uniqueId});
                return order.MessageToKitchen;
      }



});