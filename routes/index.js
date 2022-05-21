const home = require('./home');
const inventory = require('./inventory');
const shipments = require('./shipments');

const constructorMethod = (app) => {
  //middleware function that is called in app.js 
    app.use('/', home);
    app.use('/inventory', inventory);
    app.use('/shipments', shipments);
    app.use('*', (req, res) => {
      res.status(404).render('errors/404');
    });
  };
  
  module.exports = constructorMethod;