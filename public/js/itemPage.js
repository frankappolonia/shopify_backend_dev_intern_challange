let url = window.location.href
let itemId = url.substring(url.lastIndexOf('/')+1) //https://stackoverflow.com/questions/3730359/get-id-from-url-with-jquery

let editButton = $('<button id="editBt" type="submit">Update Item</button>');
let deleteButton = $('<button id="deleteBt" type="submit">Delete Item</button>');
editButtonClick(editButton);
deleteButtonClick(deleteButton);

$('#product-container').append(editButton)
$('#product-container').append(deleteButton)



function editButtonClick(btn){
    /**This function handles the click event for when a user clicks edit post. What happens is
     * that the original item content is emptied, and a form is created to update the item.
     * The form is by default populated with the items current content, so you can "edit" the post
     */
    btn.on('click', function (event) {
        event.preventDefault();
        let ogName = $('#name').text();
        let ogQuantity = $('#quantity').text();
        let ogPrice = $('#price').text();

        let editHtml = $(
            '<form method="post" id="update-item-form">'+
                '<label for="name">Update name: </label>' +
                `<input type="text" value="${ogName}" class="form-control" id="name" name="name" >`+
                '<label for="quantity">Update Quantity</label>'+
                `<input type="number" value="${ogQuantity}" class="form-control" id="quantity" name="quantity">`+
                '<label for="price">Update Price</label>'+
                `<input type="number" value="${ogPrice}" class="form-control" id="price" name="price">`+
            '</form>')
        
        $('#product-container').empty()
        $('#product-container').append(editHtml)
        let submitEdit = $('<button type="submit" class="btn btn-warning">Submit Edit</button>')
        editItemHandler(submitEdit)
        $('#product-container').append(submitEdit)
    })
}

function editItemHandler(btn) {
    /**This function handles the click event of the edit item form thats created above.
     * It sends an ajax request to the server to update the post in the db. Upon successful PATCH,
     * it creates new html content with the updated item, removes the update item form,
     *  and appends the updated item to the <section> html
     */
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault();
      let name = $('#name').val();
      let quantity = $('#quantity').val();
      let price = $('#price').val();

      try{
          //validate input here
        $.ajax({
            method: "PUT",
            url: `/${itemId}`,
            contentType: 'application/json',
            data: JSON.stringify({
            name: name,
            quantity: quantity,
            price: price
            }),
            success: (response)=>{
                let editedPostHtml = $(
                `<dl> `+
                    `<dt>Name: </dt>`+
                    `<dd id="name">${response.name}</dd>`+
                    `<dt>Quantity: </dt>`+
                    `<dd id="quantity">${response.quantity}</dd>`+
                    `<dt>Price Per Item: </dt>`+
                    `<dd id="price">${response.price}</dd>`+
                `</dl>`);

                $('#error').empty()
                $('#product-container').empty()
                $('#product-container').append(editedPostHtml)

                let editButton2 = $('<button id="editBt" type="submit">Update Item</button>')
                let deleteButton2 = $('<button id="deleteBt" type="submit">Delete Item</button>')

                editButtonClick(editButton2)
                deleteButtonClick(deleteButton2)

                $('#product-container').append(editButton2)
                $('#product-container').append(deleteButton2)
            
            },
            error: (response)=>{
            console.log(response)
            $('#product-container').empty();
            $('#error').empty();
            $('#error').append("Error: " + response.responseText);
                }
            });

    }catch(e){
        console.log('unsuccsessful edit')
        $('#error').empty()
        $('#error').append("Error: " + e)

    }
    })
}

function deleteButtonClick(btn) {
    /**This function sends a delete request to the server, deleting the main post. */
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault()
      $.ajax({
        method: "DELETE",
        url: `/${itemId}`,
        success: (response)=>{
            $('#product-container').empty()
            $('#error').empty()
            $('#product-container').append(`<p>${response}</p>`)
        },
        error: (response)=>{
         console.log('unsuccsessful deletion')
         $('#error').empty()
          $('#error').append("Error: " + response.responseText)

            }
        })
    })
}