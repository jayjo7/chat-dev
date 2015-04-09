Template.catering.helpers({

		catering: function()
	{

		return Content.findOne({$and : [{Key: "Catering"}, {Value : {"$exists" : true, "$ne" : ""}}]});



	},

	cateringArray: function(catering)
	{

		var value = catering ['Value']
		console.log(' catering value = ' + value);

		var cateringArray = value.split('\n\n' );


		//for(key in cateringArray)
		//{
		//	console.log(key + " = " + acateringArray[key]);
		//}

		return cateringArray;


	}

});