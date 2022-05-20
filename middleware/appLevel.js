const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
let path = require('path')

const static = express.static(path.join(__dirname, '../', '/public'));

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },

  },
  partialsDir: ['views/partials/']
});

function templateMiddleware(app){
    app.use('/public', static);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.engine('handlebars', handlebarsInstance.engine);
    app.set('view engine', 'handlebars');

} 

function expressSessionMiddleware(app){
    app.use(
        session({
          name: 'Session Cookie',
          secret: "the most secret string ",
          resave: false,
          saveUninitialized: true,
          cookie: { maxAge: 7200000 }
        })
      );

}

module.exports = {
    templateMiddleware,
    expressSessionMiddleware,
}