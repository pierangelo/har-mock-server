# har-mock-server
mock your FrontEnd project by using HAR file from Chrome.
It creates a server after reading har file, searching for the best response that fits request's criteria.
By default the server search for only 'application/json' responses that has the same queryString params: if not found anything it returns http 404.

# usage
node server.js -p 8000 -f test.har
where:
-f <path-to-file>.har
-p server's listening port (default port is 8000)
