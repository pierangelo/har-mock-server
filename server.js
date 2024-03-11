#!/usr/bin/env node
const express = require("express");
const fs = require('fs');
const app = express();
const server = require("./index");
const chalk = require('chalk');
const bodyParser = require('body-parser');
var packageJson = require('./package.json');

const [, , ...args] = process.argv;


console.log(chalk.yellow(packageJson.name) + " v" + chalk.yellow(packageJson.version));

/**
 * Print help description on screen
 */
function printMenuHelp() {
    console.log(`har-mock-server [options] -f <path_to_file>.har
    options:
      -p  or --port:                    Port number to use. i.e: '-p 8000'
      -f  or --file <path_to_file>.har: File's name (included directory. i.e: ./assets/file.har)
      -b  or --basePath:                part of the url's path to be excluded during check
      `);

}


//entry point
if (args.length == 0) {
    console.log(chalk.red("ERROR: no args were passed to application."));
    return printMenuHelp();
}


const commands = args.reduce((opt, value, index) => {
    try {
        if (value === '--help' || value === '-h') {
            opt.help = true;
        } else
            if (value === '-p' || value === '--port') {
                opt.port = parseInt(args[index + 1], 10);
            } else
                if (value === '-f' || value === '--file') {
                    if (fs.existsSync(args[index + 1])) {
                        opt.harFile = args[index + 1];
                    } else {
                        opt.error = "ERROR: file doesn't exist: " + args[index + 1];
                    }
                } else if (value === '-b' || value === '--basePath') {
                    console.log(chalk.yellow("INFO") + ": param basePath is set to '" + args[index + 1] + "'");

                    opt.basePath = args[index + 1];
                }

    } catch (error) {
        console.error("error:", error);
    }
    return opt;
}, { port: 8000 });

if (commands.help) {
    return printMenuHelp();
}
if (!commands.harFile) {
    return console.error(commands.error);
}
if (commands.basePath == null) {
    commands.basePath = "";
    console.log(chalk.yellow("WARN") + ": param basePath is missing:  default is set to '" + commands.basePath + "'");

}

// server
app.use(bodyParser.json());

app.use((req, res, next) => {
    server.getResponse(commands.harFile, req, res, next, commands.basePath);
});
app.listen(commands.port);
console.log("server listening on http://localhost:" + chalk.yellow(commands.port));
