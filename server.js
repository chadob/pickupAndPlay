var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');

app.use(express.static('./dist'));
app.use('/*', express.static(path.resolve('dist/index.html')));

router.get('*', function(req, res) {
    res.sendFile(path.resolve('dist/index.html'));
});
module.exports = router;
