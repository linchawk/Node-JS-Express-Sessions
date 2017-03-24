var express = require('express');
var session = require('express-session');
var bodyPaser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: true}));
app.use(session({secret: 'rockybalboa'}));

app.all('*', function(request, response, next) {
  if(request.url == '/login' || request.url == '/dologin') {
    console.log("1");
    return next();
  }
  if(!request.session.usrName) {
    console.log("2");
    response.redirect('/login');
  }
  else {
    console.log("3");
    return next();
  }
});

// function checkSession (request, response, next) {
//   if((request.url != '/login' || request.url != '/dologin') && !request.session.usrName) {
//     response.redirect('/login')
//   }
//   next();
// }

app.get('/login', function(request, response) {
  response.status(200);
  response.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.post('/dologin', function(request, response) {
  var usrName = request.body.usrName;
  var password = request.body.password;
  response.status(200);
  if(usrName === 'linchawk' && password === 'rockybalboa') {
    request.session.usrName = usrName
    request.session.token = usrName + 'salt';
    response.redirect('/index');
  }
  else {
    response.redirect('/login');
  }
});

app.get('/index', function(request, response) {
  response.status(200);
  response.end('Welcome ' + request.session.usrName);
});

app.get('/logout', function(request, response) {
  request.session.destroy(function(err) {

  });
  response.status(200);
  response.end('Logged out successfully');
});

app.listen(8400, function() {
  console.log('Express Session Test app running on port 8400');
});
