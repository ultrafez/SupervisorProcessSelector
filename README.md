# SupervisorProcessSelector

A web-based UI written in Node, allowing you to control a number of processes configured as Supervisor jobs.

This app allows you to select which Supervisor process, out of a list of defined processes, you want to run - stopping all others in the list beforehand. This allows a radio-button-like way of selecting which mutually-exclusive process you'd like to run.

## Installation

This has been tested on Node 0.10.

```
cp config.json.example config.json
# Edit config.json with your job config
npm install
npm start
```

## Configuration

`config.json` will define a number of configuration keys. These are explained below:

Example:

```
{
    "processes": [
        "cubedemo",
        "cubeinteractive"
    ],
    "processGroup": "cube",
    "port": 48004,
    "supervisorHost": "http://user:pass@localhost:9001"
}
```

* `processes` - this is an array of Supervisor process names that you wish to be able to control
* `processGroup` - name of a Supervisor group that all of the listed processes belong to
* `port` - port for the web interface to listen on
* `supervisorHost` - username/password+host+port that the Supervisor API is listening on
