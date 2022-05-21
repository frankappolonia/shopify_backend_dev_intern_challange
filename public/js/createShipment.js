let shipmentForm = $('#new-shipment-form');
let cart = $('#cart');

let addbt = $('#addItemBt')
shipmentForm.submit((event =>{
    event.preventDefault();
    let _id = $('#_id').val();
    let quantity = $('#quantity').val();
    let price = $('#price').val();
    //validatons

    let item = $(
        `<tr>`+
        `<td>${_id}</td>`+
        `<td>${quantity}</td>`+
        `<td>${price}</td>`+
    `</tr>`
    )
    $("#tbody").append(item)
}));

let submitCart = $('#submitCartBt');

editItemHandler(submitCart)

function editItemHandler(btn) {
    /**This function handles the click event of the edit item form thats created above.
     * It sends an ajax request to the server to update the item in the db. Upon successful PUT,
     * it creates new html content with the updated item, removes the update item form,
     *  and appends the updated item to the <section> html
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
          //3. validate input here
        
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


$("button").click(function () {
    var id = $(this).attr("id");
    let children = $("#row" + id).children();
    if (children.length > 1) {
      let itemData = {
        _id: children[1].innerText,
        name: children[2].innerText,
        price: children[3].innerText,
        quantity: children[4].innerText,
      };
      newHtml = $(
          `<label></label>`+
          `<input></input>`
      )
    


    }

});
      //validatons
      
    