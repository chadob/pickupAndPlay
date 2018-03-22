const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
// const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
})

const port = process.env.port || 8080;
app.set('port', port);
app.listen(process.env.PORT || 3000, function(){
  console.log('running on port' + port);
});
// server.listen(port, () => console.log('running on port' + port));
