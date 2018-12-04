Terminal.applyAddon(fit);

var term = new Terminal();
var sock = io();

term.setOption('fontSize', "24");
term.open(document.getElementById('terminal'));
term.on('data', function (data) {
  sock.emit('data', data);
});
term.on('resize', function(e) {
  console.log('onresize');
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  var body = JSON.stringify({
    cols: term.cols,
    rows: term.rows
  });
  fetch('/setTermSize', {
    method: 'POST',
    headers: headers,
    body: body
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);
  }).catch(function(error) {
    console.log(error);
  });
});


sock.on('data', function(data) {
  term.write(data);
});

var editor = ace.edit("editor");
editor.setOptions({
  fontSize: "15pt"
});
editor.getSession().setMode("ace/mode/sh");

var play = function() {
  console.log('play');
  var headers = {'Accept': 'application/json',
    'Content-Type': 'application/json'};
  var script = editor.getValue();
  var body = JSON.stringify({script: script});
  fetch('/post', {
    method: 'POST',
    headers: headers,
    body: body 
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);
    //sock.emit('data', '\033\n\n');
    sock.emit('data', 'clear\n./main.sh\n');
  }).catch(function(error) {
    console.log(error);
  });
};

var stop = function() {
  console.log('stop');
  sock.emit('data', '\003');
};

var onresize = function() {
  console.log('onresize');
  if (term) {
    term.fit();
  }
};

var onload = function() {
  console.log('onload');
  term.fit();
  fetch('/get', {
    method: 'get',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json.script);
    editor.setValue(json.script, 1);
  }).catch(function(error) {
    console.log(error);
  });
};

window.onload = onload();
