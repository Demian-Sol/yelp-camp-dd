const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require("mongoose"),
      flash          = require("connect-flash"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      User           = require("./models/user"),
      seedDB         = require('./seeds/seed-db'),
      Comment        = require('./models/comment'),
      Campground     = require('./models/campground');
      
const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      authRoutes       = require("./routes/auth");
      
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

// seedDB();

/*let camps = [
  {name: 'Shenandoah NP', image: 'https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false'},
  {name: 'Sutton Falls', image: 'http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067.jpg'},
  {name: 'Riverside camp', image: 'https://www.reserveamerica.com/marketing/html/acm/__shared/assets/Free_and_Affordable_Campgrounds_You_Need_to_Visit8089.jpg'}
];*/

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.set('view engine', 'ejs');


app.use(require("express-session")({
  secret: "If you haven't seen the stars in the wild, you haven't seen the stars at all",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})

app.use('/cgroundslist', campgroundRoutes);
app.use('/cgroundslist/:id/comments', commentRoutes);
app.use(authRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log(' Yelp Camp server is now running. Or limping at the very least.');
});