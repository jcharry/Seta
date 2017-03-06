const express = require('express');
const app = express();
const path = require('path');

// Heroku passes a port # as an environment var
const PORT = process.env.PORT || 9090;
// Heroku doesn't like __dirname, so we set the current
// working directory to an ENV variable to reference
// a static directory containing data files
process.env.PWD = process.cwd();
console.log(process.env.PWD);

app.use(express.static('dist'));
//app.use(express.static(process.env.PWD + '/static'));

app.get('/map', function (request, response) {
    console.log(process.env.PWD);

    response.sendFile(path.resolve(process.env.PWD, 'dist', 'index.html'));
});

app.listen(PORT, function(err) {
    console.log('listening on port ' + PORT);
});
