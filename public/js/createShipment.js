let shipmentForm = $('#new-shipment-form');
let cart = $('#cart');
let addbt = $('#addItemBt');

shipmentForm.submit((event =>{
  //This event handler adds new items to the shipment cart.
  /**The cart is an html table, and when the user submits the cart an event handler function (below)
   * will take the items from the table, and submit an ajax request to the server
   * */
    event.preventDefault();
    let _id = $('#_id').val();
    let quantity = $('#quantity').val();
    let price = $('#price').val();

    //client side validations go here

    let item = $( //new item that gets added to the cart table
        `<tr>`+
        `<td>${_id}</td>`+
        `<td>${quantity}</td>`+
        `<td>${price}</td>`+
    `</tr>`
    );

    $("#tbody").append(item);
}));

let submitCart = $('#submitCartBt');

submitCartHandler(submitCart)

function submitCartHandler(btn) {
    /**This function handles the submit cart event of the create shipment form.
     * It sends an ajax request to the server to create a shipment. Upon successful creation,
     * it will redirect the user to the shipments specific page.
     */
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault();

      //2. get values from the table
      let order = []
      $('#cart > tbody  > tr').each(function(index, tr) {
          let children = $(tr).children();
          if (children.length > 1) {
            let itemData = {
              _id: children[0].innerText,
              quantity: children[1].innerText,
              price: children[2].innerText,

            };
            order.push(itemData)
        }
      });
      
      try{
          //3. client side validations go here
        
        //4. send AJAX request to server
        $.ajax({
            method: "POST",
            url: `/shipments`,
            contentType: 'application/json',
            data: JSON.stringify({
            order: order
            }),

            //4.if successful:
            success: (response)=>{
                //4a. redirect to order page
                console.log(response)
                window.location.replace(`/shipments/orders/${response}`);
                
            },
             //5.if unsuccessful:
            error: (response)=>{
            console.log(response)
            //5a. append error to error div
            $('#tbody').empty();
            $('#error').empty();
            $('#error').append("Error: " + response.responseText);
                }
            });

    }catch(e){
        console.log('unsuccsessful edit');
        $('#error').empty();
        $('#error').append("Error: " + e);
        };
        
    });
};
      
    