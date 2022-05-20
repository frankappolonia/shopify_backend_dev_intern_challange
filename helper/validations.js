const { ObjectId } = require('mongodb');

function checkId(id) {
  if(arguments.length !== 1) throw "Invalid number of arguments for id check!"
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  };


function checkQuantity(quantity){
    if (arguments.length !== 1) throw "invalid number of arguments for quantity validation";
    if (isNaN(parseInt(quantity))) throw "Quantity must be a number!";
    if (quantity%1 !== 0) throw "Quantity must be a whole number!";
    quantity = parseInt(quantity);
    if (typeof(quantity) !== 'number') throw "Quantity must be a number!";
    if (quantity < 0) throw "Quantity cannot be less than 0!";

};

function checkPrice(price){
  if (arguments.length !== 1) throw "invalid number of arguments for Price validation!";
  if (isNaN(parseInt(price))) throw "Price must be a number!";
  price = parseFloat(price);
  if (typeof(price) !== 'number') throw "Price must be a number!";
  if (price < 1) throw "Price must be at least 1 dollar!";
};

function checkName(name){
  if (arguments.length !== 1) throw "Invalid number of arguments for name validation!";
  if (typeof(name) !== 'string') throw "Name must be a string!";
  name = name.trim();
  if(name.length < 1) throw "Name must be at least 1 character long (whitespace doesnt count)!";
}

function validateItem(name, quantity, price){
  if (arguments.length !== 3) throw "Invalid number of arguments for validation!";
  checkName(name);
  checkQuantity(quantity);
  checkPrice(price);
};


  module.exports = {
      checkId,
      checkQuantity,
      checkPrice,
      checkName,
      validateItem

  };