var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const moment = require('moment');
let passport = require('passport');
let auth = require('./utils/auth');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const { generateMessage } = require('./utils/message');

auth(passport);
app.set('view engine', 'ejs');

//app.use(express.static(path.join(__dirname, './public')));

app.use(cookieSession({
  name: 'session',
  keys: ['123']
}));

app.use(passport.initialize());
app.use(cookieParser());

app.get('/', function(req, res){
    if (req.session.token) {
      res.cookie('token', req.session.token);
      
  } else {
      res.cookie('token', '')
      
  }
  res.render('index.ejs');
});

app.get('/login', (req, res)=>{
  res.render('login.ejs');
});

app.get('/chat',isLoggedIn, (req, res)=>{  
  console.log(req.session.user);  
    res.render('chat',{user: req.session.user});  
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect:'/', failureFlash: true}),
    (req, res) => {
        console.log(req.user.token);
        req.session.token = req.user.token;        
        req.session.user = req.user.profile.displayName;
        
        res.redirect('/chat');
    }
);

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

io.on('connection', function(socket){
 
  socket.broadcast.emit('newConnection',generateMessage('admin','msg'));

    socket.on('disconnect', ()=>{
        io.emit('disconnected', generateMessage('admin',''))
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg + ' at:' + new Date());
        io.emit('sentchat',{msg: moment().format('hh:mm a: ') + msg});
      });
});

function isLoggedIn(req, res, next) {
  console.log(req.isAuthenticated());
  // if user is authenticated in the session, carry on
  if (req.session.token)
  {
    return next();
  }  
  // if they aren't redirect them to the home page
  res.redirect('/');
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});