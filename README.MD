Shopify Backend Intern Challenge for Fall 2022
Author: Frank Appolonia

**How to run this app:
**
1. You must first install the node modules dependencies. Type "npm install" in the Replit console to install all
packages.
2. OPTIONALLY, you can type "npm run seed" in the Replit console to seed the database with some initial data to play with (note that when you run the seed file, it will DELETE any existing data!)
3. Once installed, you can run the app by either typing "npm start" in  the Replit console, or by pressing the
"play" button in Replit. 

**4. Application features:**
    
      4a. Inventory System:
         The main inventory page displays a list of all current inventory available. Here, you can do 2 things. You can
        either add new inventory items, or click on an existing inventory item. If you click on an existing item, you
        will be able to view that inventory items specific page. On the specific page, you can either update the items
        name/quantity/price or delete it entirely from inventory.

       4b. Shipments:
        The main shipment page displays a list of the current inventory and available quantities, as well as a form to create a shipment. To create a shipment, you must fill out every field of the form. For the item id field, you MUST use the 24 character id of the item you wish to add to the shipment. An items corresponding id is located in the inventory table below the create shipment form. Once a shipment is succesfully created, you will be redirected to a shipment summary page.

        In addition, there is a page where you can view all past shipments. If you click on one, you will be taken to that shipments specific page, which contains all of its' details.

Note: The databse is hosted on a MongoDB atlas cluster. I can only invite by email, so let me know if you want accces to see the collections (you dont need access to use the application though.)
