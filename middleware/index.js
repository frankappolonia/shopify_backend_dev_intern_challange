const appMiddleware = require('./appLevel');

/**This file exports the app level middleware into wrapper functions that are called in app.js */

const constructorMethod = (app) => {
    appMiddleware.templateMiddleware(app)
    appMiddleware.expressSessionMiddleware(app)
};

module.exports = constructorMethod