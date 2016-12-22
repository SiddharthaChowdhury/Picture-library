var express 	= require('express'),
	path        = require('path'),
    bodyParser  = require('body-parser'),
    app 		= express();

var Logic 		= require('./Logic/libraryController');

// ------------------------------------- [ Basic CONFIGURATION]
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));            // Static public directory for user uploads if any

app.use(bodyParser.json({limit: '5mb'}));                           // 5mb file upload limit
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));     // 5mb file upload limit


// --------------------------------------[ Routes]
app.get('/', function (req, res) {
	Logic.renderLibraryView(req, res);
});

app.listen(1337)
console.log("Server listening on port: 1337")