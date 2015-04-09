Meteor.publish('menu', function(){
	return Menu.find();
	}
	);	
	
Meteor.publish('cartItems', function(){

	console.log("Count CartItems " + CartItems.find().count());

	return  CartItems.find();

	}
	);	


Meteor.publish('ordereditems', function(UniqueId){

	console.log("In Publish (OrderedItems): UniqueId " + UniqueId );
 
	return  OrderedItems.find({UniqueId: UniqueId });

	}
	);	
	
	
	Meteor.publish('orders', function(){
	console.log("Count Order = " + Orders.find().count());
	return Orders.find();
	}
	);	

   Meteor.publish('content', function(){
	console.log("Content = " + Content.find().count());
	return Content.find();
	}
	);	

    Meteor.publish('settings', function(){
	console.log("Settings = " + Settings.find().count());
	return Settings.find();
	}
	);	
	


