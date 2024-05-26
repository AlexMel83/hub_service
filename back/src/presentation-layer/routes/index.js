const authRouteInit = require("./auth.routes");
const coworkingsRoutesInit = require("./coworkings.routes");
const advantagesRoutesInit = require("./advantages.routes");
const spacesRoutesInit = require("./spaces.routes");
const bookingsRoutesInit = require("./bookings.routes");
const favoritesRoutesInit = require("./favorites.routes");
const paymentsRoutesInit = require("./payments.routes");
const intersectionRoutesInit = require("./intersection.routes");
const reviewsRoutesInit = require("./reviews.routes");

const routeInit = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  authRouteInit(app);
  coworkingsRoutesInit(app);
  advantagesRoutesInit(app);
  spacesRoutesInit(app);
  bookingsRoutesInit(app);
  favoritesRoutesInit(app);
  paymentsRoutesInit(app);
  intersectionRoutesInit(app);
  reviewsRoutesInit(app);
};

module.exports = {
  routeInit,
};
