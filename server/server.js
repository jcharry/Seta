var express = require('express');
var app = express();
//var cookieParser = require('cookie-parser');
var path = require('path');

var apiController = require('./controllers/apiController');

// Webpack-dev-server requires proxying to a different server - super annyoing,
// so during dev run server on port 3000 along with webpack-dev-server (which goes to
// 8080)

// Heroku passes a port # as an environment var
const PORT = process.env.PORT || 3000;
// Heroku doesn't like __dirname, so we set the current
// working directory to an ENV variable to reference
// a static directory containing data files
process.env.PWD = process.cwd();
console.log(process.env.PWD);
console.log(apiController);

app.use(express.static('dist'));
//app.use(express.static(process.env.PWD + '/static'));

app.get('/map', function (request, response) {
    console.log(process.env.PWD);

    response.sendFile(path.resolve(process.env.PWD, 'dist', 'index.html'));
});

apiController(app);

app.listen(PORT, function(err) {
    console.log('listening on port ' + PORT);
});
