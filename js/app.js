const express = require('express');
const books = require('../routes/books');
const patrons = require('../routes/patrons');
const app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser');
var path = require('path'); 
const routes = require('../routes/index');

app.use(express.static('public'));

app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use("/", routes)
app.use('/books', books);
app.use('/patrons', patrons);

app.get('/', (req, res)=>{
    res.render('index');
})



app.get('/all-loans', (req, res)=>{
    res.render('loans/all_loans');
})



app.listen(3030);
module.exports = app;
