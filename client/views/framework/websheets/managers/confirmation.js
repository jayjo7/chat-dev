Template.confirmation.events({
    'click #moveOrderStatus': function(event,tmpl)
    {

      event.preventDefault();
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
      console.log('confirmation:moveOrderStatus: In moveOrderStatus event');
      var sessionId = Session.get('appUUID');
      var toStatusCode = this.Order.StatusCode + 1;

      //Meteor.call('updateOrderStatus', sessionId, orgname,  this.UniqueId)
      Meteor.call('updateOrderStatus', sessionId, this.Order.orgname,this.Order.UniqueId, this.Order.OrderNumber, toStatusCode)

    }
});

Template.confirmation.helpers({

    enableDeliveredButton: function(order, omEnabled )
  {

    if( websheets.public.orderState.THREE === order.Status && omEnabled)
    {
      return true;
    }
    else
    {
      return false;
    }

  },
  enableReadyButton: function(order, omEnabled )
  {

    if( websheets.public.orderState.TWO === order.Status && omEnabled)
    {
      return true;
    }
    else
    {
      return false;
    }

  },

  haveETA: function(uniqueId)
  {
      console.log('isReady:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
      

  },

	isReady: function(order)
  {
      if(websheets.public.orderState.THREE === order.Status)
        	return true;
      else
        	return false;
  },

  isDelivered: function(order)
  {
      if(websheets.public.orderState.FOUR === order.Status)
        	return true;
      else
        	return false;
  },

  isInProcess: function(order)
  {
      if( websheets.public.orderState.TWO === order.Status)
        	return true;
      else
        	return false;

  },

  isInKitchen: function(order)
  {
      if(    websheets.public.orderState.TWO      === order.Status 
          || websheets.public.orderState.FOUR     === order.Status 
          || websheets.public.orderState.THREE    === order.Status)
        	return true;
      else
        	return false;
  },
  isSaleComplete: function(order)
  { 

      if(     websheets.public.orderState.FOUR  === order.Status 
          ||  websheets.public.orderState.THREE === order.Status)
        	return true;
      else
        	return false;
  },




  message: function(order)
	{
		  console.log('message:uniqueId = ' + uniqueId);

      var messageKey='message_confirmation';
      if(websheets.public.orderState.THREE === order.Status)

          messageKey = 'message_ready';
      else
		  if(websheets.public.orderState.FOUR === order.Status)

        messageKey = 'message_delivered';


		  var confirmation = Settings.findOne({$and : [{Key: messageKey}, {UniqueId:uniqueId}, {Value : {"$exists" : true, "$ne" : ""}}]});

		  var value = confirmation['Value'];
		  console.log(' confirmation value = ' + value);

		  var confirmationArray = value.split('\n\n' );

		  for(key in confirmationArray)
		  {
		      console.log(key + " = " + confirmationArray[key]);
		  }

		  return confirmationArray;

	},


  orderedCart: function(uniqueId)
  {
    var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

    return OrderedItems.find({UniqueId:uniqueId, orgname:orgname});
  },

  haveTax:function(uniqueId)
  {
      console.log('haveTax:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return validData(orderMeta.tax);

  },

  getDiscount:function(uniqueId)
  {
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.discount).toFixed(2);
  },

  getSubTotal:function(uniqueId)
	{
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
		  return '$'+Number(orderMeta.SubTotal).toFixed(2);
	},
    
  getTax:function(uniqueId)
  {
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.tax).toFixed(2);
	},

  getTotal:function(uniqueId)
	{
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.Total).toFixed(2);
	},

  currency: function(num)
  {
      return '$' + Number(num).toFixed(2);
  },

  haveMessageToKitchen: function(order)
  {
      return validData(order.MessageToKitchen);

  },

  messageToKitchen: function(order)
  {
      return order.MessageToKitchen;
  },

  haveDiscount:function(uniqueId)
  {
      console.log('haveDiscount:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return validData(orderMeta.discount);

  },

  showSubTotal:function(uniqueId)
  {
      console.log('showSubTotal:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      if(orderMeta.tax || orderMeta.discount)
        return true;
      else
        return  false;
  },

  getPaymentOption:function(uniqueId)
  {
      console.log('getPaymentOption:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return orderMeta.Payment;

  },

  isOrderStatusAlert:function(uniqueId)
  {
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);  
      console.log('isOrderStatusAlert:uniqueId = ' + uniqueId);
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      if(orderMeta.orderStatusAlert)
      {
        return true;
      }
      else
      {
        return false;
      }
  },

  getOrderStatusAlert:function(uniqueId)
  {
      console.log('getOrderStatusAlert:uniqueId = ' + uniqueId);
      var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY); 
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return orderMeta.orderStatusAlert;
  }


});
