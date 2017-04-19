var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var opn = require('opn');

var app = express();
var compiler = webpack(config);
var PORT = process.argv[2] ? parseInt(process.argv[2]) : 8888;


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));


// Test routes for dist bundle
// app.get('/test/css/bundle.css', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/css/bundle.css'));
// });

// app.get('/test/js/bundle.js', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/js/bundle.js'));
// });

// app.get('/test/js/commons.bundle.js', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/js/commons.bundle.js'));
// });


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + PORT);
    opn('http://localhost:' + PORT);
});
