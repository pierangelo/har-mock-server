const fs = require('fs');
const url = require('url');




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
        } else {
            //test
            //console.log("subPath:", urlObj.pathname);
            //console.log("req.path:", req.path);
        }
        //imetyoe criteria if setted...
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

        tempResponseArray = responseMatchQueryString;

        //TODO: experimental - enable in future release
        //check body...
        // if (tempResponseArray.length > 1 && req.body) {

        //   const responseMatchBody = entriesArray.filter(element => {
        //     const data = element.request.postData;
        //     if (data) {
        //       return req.body === data.text;
        //     }
        //     return false;
        //   });

        //   tempResponseArray = responseMatchBody.length > 0 ? responseMatchBody : [];

        // }
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
    consoleMessages.push("[request: " + req.path + "]");
    //default response code if no response were found
    let responseStatus = 404;
    const harObj = readFileHar(filePath);
    const results = searchResponse(harObj, req);
    if (results.length > 0) {
        //if wwe have more than 1 response we select the first with data inside
        let response = results.filter(el => {
            if (el.response.content.text) return el;
        })[0].response;

        if (response) {
            if (response.status !== 200) {
                res.status(response.status);
            }
            //set the response mimetype taken from har and send encoded content
            res.type(response.content.mimeType).send(Buffer.from(response.content.text, response.content.encoding));

            responseStatus = response.status;
        }
        consoleMessages.push("[http: " + responseStatus + "]");
        console.log(textColorYellow, ...consoleMessages);
        res.status(404).send();
    } else {
        consoleMessages.push("[http: " + responseStatus + "]");
        console.log(textColorYellow, ...consoleMessages);
        next();
    }

}

module.exports = {
    readFileHar,
    getResponse,
};
