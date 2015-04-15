Template.payment.events({


'submit form': function(event, template){

	console.log("Payment form submitted");
		event.preventDefault();

	    // This identifies your website in the createToken call below
        Stripe.setPublishableKey('pk_test_1J0fGPuQStfrSiv6P1L5p8lz');

        var cardNumber = $('.card-number').val();
        var cardCvv = $('.card-cvc').val();
        var cardExpiryMonth = $('.card-expiry-month').val();
        var cardExpiryYear = $('.card-expiry-year').val();


        console.log("card-number = " + cardNumber);
        console.log("card-cvc = " + cardCvv);
        console.log("card-expiry-month = " + cardExpiryMonth);
        console.log("card-expiry-year = " + cardExpiryYear);



        Stripe.card.createToken({
  									number: cardNumber,
  									cvc: cardCvv,
  									exp_month: cardExpiryMonth,
  									exp_year:cardExpiryYear
								}, 
								function(status, response) {

      									//alert('status = ' + status);
      									var $form = $('#payment-form');

      									if (response.error) {
        									// Show the errors on the form
        									console.log('response.error = ' + response.error);
        									for(var key in response.error)
        									{
        										console.log( key +' = ' + response.error[key]);
        									}
        									$('#payment-errors').text(response.error.message);
        									//$form.find('.payment-errors').text(response.error.message);
        									$form.find('button').prop('disabled', false);
        									return false;
      									} else {
        											// token contains id, last4, and card type
        											var token = response.id;
        											console.log('token = ' + token);
        											// Insert the token into the form so it gets submitted to the server
        											$form.append($('<input type="hidden" name="stripeToken" />').val(token));
        											$('#payment-errors').text('Token = ' + token);

        											// and re-submit
        											//$form.get(0).submit();
      									}
    					});

           //$form.find('button').prop('disabled', true);


}


});
