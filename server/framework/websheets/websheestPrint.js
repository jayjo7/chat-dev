Meteor.methods({


	postWebsheetsPrint:function(doc)
	{
		var response ={};
    var printerUrl = websheetsprintApiUrl(doc.orgname);
    console.log(doc.sessionId + ": postWebsheetsPrint:printerUrl: " + printerUrl);
    var paramsObject = buildParamsObject(doc)
    console.log(doc.sessionId + ": postWebsheetsPrint:paramsObject: " + JSON.stringify(paramsObject, null, 4));

		 try{
  				
  			response = HTTP.get(printerUrl,
  			  	{
  					params: paramsObject,
  					followAllRedirects: true
  				});


  			console.log(doc.sessionId + ": postWebsheetsPrint:Done invoking HTTP.Post to websheets");

  			if(response.statusCode != 200)
  			{
  				console.log('postWebsheetsPrint-Failed', 'Order posting to websheets failed with http status code [' + response.statusCode  + ']', e);
  			}
       // else
       //{
       //     console.log(doc.sessionId +": postWebsheetsPrint:response.content:: " +JSON.stringify(response.content, null, 4));
       //
       // }

							
		}catch (e)
		{
			console.log(doc.sessionId + ': postWebsheetsPrint-Failed', 'Could not post the order to Websheets Printer', e);
      response.paramsObject         = paramsObject;
      response.printerUrl           = printerUrl;
			response.websheetsPrintError  = e;
      response.websheetsPrint       = false;
		}
    console.log(doc.sessionId +": postWebsheetsPrint:response:: " +JSON.stringify(response, null, 4));

		return response;

	}

});

var buildParamsObject = function(doc)
{
  var params =
  {
      op  :   websheetsprintOperation(doc.orgname),
      unm :   websheetsprintUserName(doc.orgname),
      dno :   websheetsprintDeviceName(doc.orgname),
      key :   websheetsprintApiKey(doc.orgname),
      mode :  websheetsprintMode(doc.orgname),
      msgno :   doc.OrderNumber,
      content :   buildContentString(doc)
  }
  console.log("buildParamsObject : params: " +JSON.stringify(params, null, 4));


  return params;
}


//8 :  12 - Characters
//7 :  16 - Characters 
//6 :  24 - Characters
//5 :  32 - Characters
//4 :  42 - Characters

var fontEightCharCount  = 12;
var fontSevenCharCount  = 16;
var fontSixCharCount    = 24;
var fontFiveCharCount   = 32;
var fontFourCharCount   = 42;

var buildContentString =function(doc)
{

    var content="";


  //Start Org Name Sizing
  var orgnameLength = doc.orgname.length;

  var diffWithFontSevenSize = fontSevenCharCount - orgnameLength;

  if(diffWithFontSevenSize == 0)
  {
      content =  "|7" + doc.orgname.toUpperCase();
  }
  else if(diffWithFontSevenSize > 0)
  {
    content =  "|7";
    var preSpace = diffWithFontSevenSize/2;
    for( var i = 0; i<preSpace; i++)
    {
      content = content + " ";
    }
     content = content+doc.orgname.toUpperCase();
  }
  else
  {
      content =  "|6" + doc.orgname.toUpperCase();
  }






  var content = content + "|5********************************" 
  var content = content + "|7" + "   Order# " +  doc.OrderNumber;
  var content = content + "|5********************************" 
  for (key in doc.itemsObject)
  {
      console.log( "Key   : " + key);

      var item = doc.itemsObject[key];
      var content = content + "|5" + item.qty  + "  -  " + item.name; 

      //console.log( "item.name :  " + item.name);
      //console.log( "item.qty  :  " + item.qty);
      //console.log( "item.itemSize  : " + item.itemSize);
      //console.log( "item.spiceLevel  : " + item.spiceLevel);
      //console.log( "item.messageToKitchenByItem  : " + item.messageToKitchenByItem);
      //console.log( "tem.price  : " + item.price);

  }


  //var content = content + "|"+  doc.Items ;
  //var content = content + "|"; //Adding a empty line
  //var content = content + "|5*********************************" 

  var content  = content+ "|5********** Thank you! **********";

  console.log("buildContentString : content: " + content);

  return content

}