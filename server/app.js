const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path');

app.use(compression());
app.use(express.static(path.join(__dirname, './client/build')));



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
console.log('server started on port:',PORT);
app.listen(PORT);