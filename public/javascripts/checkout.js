Stripe.setPublishableKey('pk_test_uVErMcAq0BJO1fTGNg6vpgyx00t1ShhXz5');

var $form = $('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('d-none');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response){
    if(response.error){
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('d-none');
        $form.find('button').prop('disabled', false);
    }
    else{
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        $form.get(0).submit();
    }
}