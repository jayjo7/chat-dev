Template.digitalMenu.helpers({

	getFormatedMenu:function(categoryMenu)
	{

    	var orgname = Session.get(ORG_NAME_SESSION_KEY);
    	console.log('menu: ' + orgname);

		var menus 		= Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]},{sort:{sheetRowId: 1}});
		var htmlString	= '';
        var isNewLine	= true;
        var count = 1;
		menus.forEach(function(menu){

			
			if (isNewLine)
			{
				htmlString += '<div class="row DMmenuitem">';
			}

			htmlString += '<div class="col-xs-3 DMitem" align="right">' + s(menu.Name).trim().titleize().value() ;
			if(isSpecial(menu.fontWeight))
			{
				htmlString += '&nbsp;<span class="label  label-success">Special</span>';

			}

			if(! isItemAvailable(menu.fontLine))
			{
				htmlString += '&nbsp;<span class="label label-danger">soldout</span>';
			}

			htmlString += '</div>';
        	htmlString += '<div class="col-xs-1 DMprice">' + currencyFormat(menu.Charge) + '</div>';

			if(count%3 === 0)
			{
				htmlString += '</div>';
				isNewLine   = true;
			}
			else
			{
				isNewLine = false;
			}

			count +=1;


		});

		console.log(htmlString);

		return htmlString;

	}

});