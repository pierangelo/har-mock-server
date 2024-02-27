## har-mock-server
mock your FrontEnd project by using HAR.
It creates a server after reading har file, searching for the best response that fits request's criteria.
By default the server search for only 'application/json' responses that has the same queryString params: if not found anything it returns http 404.

Server will try to match request api path.
if there are more results, try to check the full matching request's path.

## Next Feature
- Apply response's delay before send to client


## Usage
- install server in dev-dependencies
```shell
  npm install har-mock-server --save-dev
```

- in the scripts' section to package.json add a command like:
```javascript
  "scripts": {
      "har-mock-server": "har-mock-server -f ./node_modules/har-mock-server/test/test.har"
	},
```

  note: "./node_modules/har-mock-server/test/test.har" is test file shipped with the package

- launch the server with the defined command:
  npm run har-mock-server


# Testing server

in browser address' bar write:

http://localhost:8000/posts
http://localhost:8000/todos
http://localhost:8000/todos?userId=2
http://localhost:8000/albums
