Template.footer.helpers({

	address:function(){

		return Settings.findOne({$and : [{Key: "address"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	},

		phoneNumber:function(){
		
		return Settings.findOne({$and : [{Key: "phone_number"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	}
	,
			faxNumber:function(){
		
		return Settings.findOne({$and : [{Key: "fax_number"}, {Value : {"$exists" : true, "$ne" : ""}}]});

	},

	hasFaxNumber: function(faxNumber)
	{
		if(faxNumber==undefined || faxNumber == null )
		{
			return false;
		}
		else
		{
			faxNumber = faxNumber.trim();
			if(faxNumber.length > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}

});