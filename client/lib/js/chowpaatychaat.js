

$(document).ready(function(){
    $("#checkout-trigger, #checkout-trigger2, #checkout-trigger3").click(function(){
   $("#checkout-modal").fadeToggle('fast');
    });
  $("#PayNow").click(function(){
    
    $("#creditcarddetails").show('slow');
});
$("#PayLater").click(function(){
    
    $("#creditcarddetails").hide('slow');
});
});
