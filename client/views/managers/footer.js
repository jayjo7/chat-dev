Template.footer.helpers({

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