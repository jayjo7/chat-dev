Template.footerConfirmation.helpers({

	address:function(){

		return Settings.findOne({$and : [{Key: "address"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	},

		phoneNumber:function(){
		
		return Settings.findOne({$and : [{Key: "phone_number"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	}
	,
			faxNumber:function(){
		
		return Settings.findOne({$and : [{Key: "fax_number"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	}
});