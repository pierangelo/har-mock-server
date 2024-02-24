#!/usr/bin/env node
const express = require("express");
const fs = require('fs');
const argsNew = require('yargs').argv;

const app = express();

const har = require("./index");
const [, , ...args] = process.argv;
const argsAccepted = ['p'];

function printHelp() {
    console.log(`har-mock-server [-flag] path-to.har
    flag:
      -p :port number to use. example '-p 8000'

      `);
}
function loadArgs(argsNew) {
    // return args.reduce((acc, value, index) => {
    //     if (value === '--help' || value === '-h') {
    //         acc.help = true;
    //     } else if (value === '-p' || value === '--port') {
    //         acc.port = parseInt(args[index + 1], 10);
    //     } else if (fs.existsSync(value)) {
    //         acc.har = value;
    //     }
    //     return acc;
    // }, { port: 3000 });
    process.argv.map(opt => {
        if (opt == '-p') {

        }
    });
    let options = {};
    console.log("args:", argsNew);
    console.log("args:", argsNew.p);
    var argArray = JSON.parse(JSON.stringify(argsNew));

    argArray.forEach(el => {
        if (argsAccepted[el]) {
            options.el = argArray.el;
        } else {
            return printHelp();
        }
    });

}


//entry point
const options = loadArgs(argsNew);

if (options.help) {
    return printHelp();
}
if (!options.har) {
    return console.error("ERROR: only .har file are accepted.");
}

// server
app.use(har.getMiddleware(options.har));
app.use((req, res) => {
    res.status(404).send();
});
app.listen(options.port);
console("server linstening on port:", options.port);
