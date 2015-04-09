Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',	
			waitOn: function(){ 
				console.log('Start the required subscribtions..');

		        Meteor.subscribe('cartItems');
		        console.log('done subscribing to cartItems...');

		        Meteor.subscribe('orders');
		       	console.log('done subscribing to orders...');

		        Meteor.subscribe('menu');	       
		        console.log('done subscribing to menu...');

		         Meteor.subscribe('content');	       
		        console.log('done subscribing to content...');

		        Meteor.subscribe('settings');	       
		        console.log('done subscribing to settings...');
		        return ; 
 			},
	});
	
//Router.route('/defaultsite', {name: 'homePage'});	

//Router.route('/', {name: 'homePage'});

Router.route('/', {name: 'homePage'});

Router.route('/confirmation/:UniqueId', 
				{layoutTemplate:'layoutOrderConfirmation',
					name: 'confirmation',
				 data: function(){ 
				 	Meteor.subscribe('ordereditems', this.params.UniqueId);
				 	return {UniqueId: this.params.UniqueId}

				}});






	
	
	


