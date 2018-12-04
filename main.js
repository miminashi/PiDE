var os = require('os');
var fs = require('fs');
var pty = require('node-pty');
var socketio = require('socket.io')

var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);

var t;  // ひとまず端末は高々1個

app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/setTermSize', function(req, res, next) {
  console.log(req.body);
  if (t) {
    var cols = req.body.cols;
    var rows = req.body.rows; 
    t.resize(cols, rows);
    res.json({status: 'ok'});
  }
  else {
    res.json({status: 'err'});
  }
});
app.get('/get', function (req, res, next) {
  fs.readFile("./sketch/main.sh", function (err, data) {
    if (err) {
      next(err);
    }
    else {
      //res.send(data);
      res.json({script: data.toString()});
    }
  });
});
app.post('/post', (req, res) => {
  console.log(req.body);
  fs.writeFile('./sketch/main.sh', req.body.script, function(err, result) {
    if (err) {
      next(err);
    }
    else {
      //res.send('ok');
      res.json({status: 'ok'});
    }
  });
});

var sock = socketio(server);

var shell = 'bash';

sock.on('connect', function(s) {
  console.log('connected');
  if (t) {
    t.kill();
    t = null;
  }
  t = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    //cwd: process.env.HOME,
    cwd: '/Users/miminashi/projects/pide/sketch',
    env: process.env
  });

  t.on('data', function(d) {
    s.emit('data', d);
  });

  s.on('data', function(d) {
    t.write(d);
  });

  s.on('disconnect', function() {
    console.log('disconnected');
    t.kill();
  });
});

server.listen(3001);
