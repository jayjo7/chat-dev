Template.aboutUs.helpers({

		aboutUs: function()
	{

		var aboutUs = Content.findOne({$and : [{Key: "AboutUs"}, {Value : {"$exists" : true, "$ne" : ""}}]})



				console.log('aboutUs = ' + aboutUs);


				var aboutUsValue = aboutUs['Value'];
				console.log(' About value = ' + aboutUsValue);

				var aboutUsArray = aboutUsValue.split('\n\n' );

				//for(key in aboutUsArray)
				//{
				//	console.log(key + " = " + aboutUsArray[key]);
				//}

				return aboutUsArray;
			





	}


});