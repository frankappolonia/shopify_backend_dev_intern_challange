const home = require('./home');

const constructorMethod = (app) => {
  //middleware function that is called in app.js 
    app.use('/', home);
    app.use('*', (req, res) => {
      res.status(404).render('errors/404');
    });
  };
  
  module.exports = constructorMethod;