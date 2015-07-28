Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
	});
	


Router.route('/',   {
						name: 'homePage',
						waitOn:  function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
									Meteor.subscribe('menu', 						websheets.public.generic.ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content', 					websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings', 					websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
							        Meteor.subscribe('cartItems', appUUID, 			websheets.public.generic.ORG_NAME);
		        					console.log(appUUID + ':done subscribing to cartItems...');	


								}
});

Router.route('/home',   {
						name: 		'home',
						template:  	'homePage',
						waitOn: function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
									Meteor.subscribe('menu', 						websheets.public.generic.ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content', 					websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings', 					websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
							        Meteor.subscribe('cartItems', appUUID , 		websheets.public.generic.ORG_NAME);
		        					console.log(appUUID + ':done subscribing to cartItems...');					        	        					

								}
});

Router.route('/om', 
					{
						layoutTemplate: 'layoutOrderManagement',
						name: 			'orderManagement',
				 		waitOn:  function()
				 						{ 
											Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
				 							Meteor.subscribe('settings', 				                     		websheets.public.generic.ORG_NAME);	  
				 							Meteor.subscribe('orderManagement', 									websheets.public.generic.ORG_NAME);
				 							Meteor.subscribe('ordereditemsManagement',  							websheets.public.generic.ORG_NAME);
										}
			});


Router.route('/dm/:pageNumber', {
						layoutTemplate:'layoutDigitalMenu', 
						name: 'digitalMenu',
						waitOn:  function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
									Meteor.subscribe('menu',  												websheets.public.generic.ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content',  											websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings',  											websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
							        Meteor.subscribe('dmMetatData',  										websheets.public.generic.ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to dmMetatData...');		
							        
					        	   // Meteor.subscribe('orderManagement', 									websheets.public.generic.ORG_NAME);
				
								},

						data: function()
						{
							return {pageNumber: this.params.pageNumber};
						}							

					});

Router.route('/os/:UniqueId', 
					{
						layoutTemplate: 'layoutOrderConfirmation',
						name: 			'os',
						template:  		'confirmation',
				 		data: function()
				 						{ 
				 							var appUUID = Session.get('appUUID');
				 							console.log("router /os = " +  											websheets.public.generic.ORG_NAME );
									        Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
				 							Meteor.subscribe('settings', 											websheets.public.generic.ORG_NAME);	  
				 							console.log(appUUID + ':done subscribing to settings...');
				 							Meteor.subscribe('ordereditems', this.params.UniqueId,  				websheets.public.generic.ORG_NAME);
				 							console.log(appUUID + ':done subscribing to ordereditems...');
				 						    Meteor.subscribe('orders', this.params.UniqueId, 						websheets.public.generic.ORG_NAME);
				 						    console.log(appUUID + ':done subscribing to orders...');
				 						    Meteor.subscribe('ordersMeta', this.params.UniqueId, 					websheets.public.generic.ORG_NAME);
				 						   	console.log(appUUID + ':done subscribing to ordersMeta...');

				 						   	var order = Orders.findOne({UniqueId:this.params.UniqueId, orgname:websheets.public.generic.ORG_NAME});
				 							return {UniqueId: this.params.UniqueId, Order:order};

										}
			});

Router.route('/osm/:UniqueId', 
					{
						layoutTemplate: 'layoutOrderConfirmation',
						name: 			'osm',
						template:  		'confirmation',
				 		data: function()
				 						{ 
				 							var appUUID = Session.get('appUUID');
				 							console.log("router /osm = " +  										websheets.public.generic.ORG_NAME );
									        Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
				 							Meteor.subscribe('settings', 											websheets.public.generic.ORG_NAME);	  
				 							console.log(appUUID + ':done subscribing to settings...');
				 							Meteor.subscribe('ordereditems', this.params.UniqueId,  				websheets.public.generic.ORG_NAME);
				 							console.log(appUUID + ':done subscribing to ordereditems...');
				 						    Meteor.subscribe('orders', this.params.UniqueId, 						websheets.public.generic.ORG_NAME);
				 						    console.log(appUUID + ':done subscribing to orders...');
				 						    Meteor.subscribe('ordersMeta', this.params.UniqueId, 					websheets.public.generic.ORG_NAME);
				 						   	console.log(appUUID + ':done subscribing to ordersMeta...');
				 						   	var order = Orders.findOne({UniqueId:this.params.UniqueId, orgname:websheets.public.generic.ORG_NAME});
				 							return {UniqueId: this.params.UniqueId, Order:order, omEnabled:true};

										}
			});

Router.route('/confirmation/:UniqueId', 
					{
						layoutTemplate: 'layoutOrderConfirmation',
						name: 			'confirmation',
						template:  		'confirmation',
				 		data:			function()
				 						{ 
											Session.setPersistent(websheets.public.generic.ORG_NAME_SESSION_KEY, 	websheets.public.generic.ORG_NAME);
				 							Meteor.subscribe('settings', websheets.public.generic.ORG_NAME);	       
				 							Meteor.subscribe('ordereditems', this.params.UniqueId , 				websheets.public.generic.ORG_NAME);
				 						    Meteor.subscribe('orders', this.params.UniqueId , 						websheets.public.generic.ORG_NAME);
				 						    Meteor.subscribe('ordersMeta', this.params.UniqueId , 					websheets.public.generic.ORG_NAME);
				 						   	var order = Orders.findOne({UniqueId:this.params.UniqueId, orgname:websheets.public.generic.ORG_NAME});
				 							return {UniqueId: this.params.UniqueId, Order:order};

										}
			});








	
	
	


