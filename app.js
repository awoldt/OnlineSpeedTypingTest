const express = require('express');
const app = express();
const port = 8080;

//medium words
const generatedWords = require('random-word');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(port, () => {
    console.log('== server is running on port ' + port + ' ==');
});

app.get('/', (req, res) => {
    var words = [];
    //generates 100 words
    for(i=0; i<100; ++i) {
        words.push(generatedWords());
    }
   
    res.render('index', {
        title: 'Free Online Speed Typing Test',
        txt: words
    });
});