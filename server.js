#!/usr/bin/env node
const express = require("express");
const fs = require('fs');
const app = express();
const server = require("./index");
const [, , ...args] = process.argv;




/**
 * Print help description on screen
 *
 */
function printMenuHelp() {
    console.log(`har-mock-server [options] -f <path_to_file>.har
    options:
      -p  or --port:                    Port number to use. i.e: '-p 8000'
      -f  or --file <path_to_file>.har: file name included directory. i.e: ./src/assest/file.har

      `);

}



//entry point
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
                        opt.har = args[index + 1];
                    } else {
                        opt.error = "ERROR: file doesn't exist: " + args[index + 1];
                    }
                }

    } catch (error) {
        console.error(error);
    }
    return opt;
}, { port: 8000 });

if (commands.help) {
    return printMenuHelp();
}
if (!commands.har) {
    return console.error(commands.error);
}

// server
app.use((req, res, next) => {
    server.getResponse(commands.har, req, res, next);
});
app.listen(commands.port);
console.log("server listening on port: ", commands.port);
