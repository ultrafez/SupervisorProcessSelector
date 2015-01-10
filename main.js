var config = require(__dirname + '/config.json');

var supervisord = require('supervisord');
var bodyParser = require('body-parser');
var express = require('express');

// SUPERVISOR SETUP

var supervisor = supervisord.connect(config.supervisorHost);

// EXPRESS SETUP

var app = express();
var server = require('http').Server(app);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || config.port);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES

app.get('/', function (req, res) {
    res.render('index', {processes: config.processes});
});

// API ROUTES

var apiRouter = express.Router();

apiRouter.post('/start', function (req, res) {
    var process = req.body.process;

    if (!process) {
        return res.send({'status': 'error', 'message': 'No process specified'});
    }

    if (config.processes.indexOf(process) == -1) {
        return res.send({'status': 'error', 'message': 'Invalid process specified'});
    }

    supervisor.stopProcessGroup(config.processGroup, function(err, result) {
        if (err) {
            return res.send({'status': 'error', 'message': 'Supervisor failed to stop processes: ' + err});
        }

        supervisor.startProcess(config.processGroup + ':' + process, function(err, result) {
            if (err) {
                return res.send({'status': 'error', 'message': 'Supervisor failed to start process: ' + err});
            }

            res.send({'status': 'ok', 'message': result});
        });
    });
});

apiRouter.post('/stop', function (req, res) {
    supervisor.stopProcessGroup(config.processGroup, function(err, result) {
        if (err) {
            return res.send({'status': 'error', 'message': 'Supervisor failed to stop processes: ' + err});
        }

        res.send({'status': 'ok', 'message': result});
    });
});

app.use('/api', apiRouter);

// START LISTEN

server.listen(app.get('port'), function() {
    console.log('Web server listening on port %d', server.address().port);
});
