const fs = require('fs');
const url = require('url');
const chalk = require('chalk');


/**
 *  Deafualt criteria for searching the right response.
 *  @abstract option requestAcceptHeader  is experimental and not used  as criteria
 */
const DEFAULT_SEARCH_OPTIONS = {
    _resourceType: 'xhr',  // experimental
    mimeType: 'application/json'
};


/**
 * search for .har files and return har structure populated:
 * harObj={
 *      log:{
 *            creator:{...},
 *            entries:[...],
 *            pages:[....],
 *            version: "x.x.x"
 *          }
 * }
 *
 * @param {string} path
 */
function readFileHar(path) {
    let harObj = {};
    try {
        harObj = JSON.parse(fs.readFileSync(path));
        harObj.log.entries.forEach(e => {
            e.request.url = url.parse(e.request.url);
        });
    } catch (e) {
        console.error(e);
    }
    return harObj;
}

/**
 * Search responses for given request using path and http's method criteria.
 * optionally on mimetype if settend in @see DEFAULT_SEARCH_OPTIONS
 * @returns an array of matching responses
 */
function searchResponse(harObj, req) {


    const entriesArray = harObj.log.entries.filter(e => {
        const urlObj = e.request.url;

        //path criteria
        if (urlObj.pathname !== req.path) {
            return false;
        }
        //mimetyoe criteria if setted...
        if (DEFAULT_SEARCH_OPTIONS.mimeType && e.response.content.mimeType !== DEFAULT_SEARCH_OPTIONS.mimeType) {
            return false;
        }
        // http method criteria
        if (e.request.method !== req.method) {
            return false;
        }

        return true;
    });


    if (entriesArray.length > 1) {
        let tempResponseArray = entriesArray;

        //check queryStrign...
        const responseMatchQueryString = entriesArray.filter(element => {
            return element.request.url.path === req.originalUrl;
        });

        tempResponseArray = responseMatchQueryString.length == 0 ? entriesArray : responseMatchQueryString;


        //check body...
        if (tempResponseArray.length > 1 && req.body) {

            const responseMatchBody = entriesArray.filter(element => {
                const data = element.request.postData;
                if (data) {
                    return JSON.stringify(req.body) === data.text;
                }
                return false;
            });

            tempResponseArray = responseMatchBody.length == 0 ? tempResponseArray : responseMatchBody;

        }
        return tempResponseArray;
    }
    return entriesArray;
}

/**
 * Retuns an appropriate response if present
 *
 * @param {*} filePath - HAR filename (included directories)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getResponse(filePath, req, res, next) {
    let consoleMessages = [];
    consoleMessages.push("[request: " + chalk.yellow(req.method) + " " + chalk.yellow(req.path) + "]");
    //default response code if no response were found
    let responseStatus = 404;
    const harObj = readFileHar(filePath);
    const results = searchResponse(harObj, req);
    if (results.length > 0) {

        let result = results.filter(el => {
            if (el.response.content.text) return el;
        })[0];
        //if wwe have more than 1 response we select the first with data inside
        let response = result?.response;

        if (response) {
            if (response.status !== 200) {
                res.status(response.status);
            }

            res.type(response.content.mimeType);
            //apply responses delay
            setTimeout(() => {
                //set the response mimetype taken from har and send encoded content
                res.send(Buffer.from(response.content.text, response.content.encoding));
                responseStatus = response.status;
                consoleMessages.push("[http: " + chalk.yellow(responseStatus) + "]" + " [delay: " + chalk.yellow(result.time) + "]");
                console.log(...consoleMessages);
            }, result.time);

        } else {

            res.status(404).send();
        }
    } else {
        consoleMessages.push("[http: " + chalk.yellow(responseStatus) + "]");
        console.log(...consoleMessages);
        next();
    }

}

module.exports = {
    readFileHar,
    getResponse,
};
