const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(morgan(process.env.NODE_ENV == "development" ? "dev" : "combined"));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/../../public'));

server.listen(app.get('port'), () => {
  console.log(`Comments server listening on port ${app.get('port')}!`)
});

io.on('connection', function (socket) {
  socket.on('update-component-rating', function (data) {
    socket.broadcast.emit('update-component-rating', data);
  });
});

module.exports = app;
