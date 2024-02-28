## har-mock-server
Mock your FrontEnd project by using files HAR.<br/>
It creates a server after reading har file, searches for the best response that fits request's criteria.
By default the server searches for only 'application/json' responses that have the same **queryString** params and/or **body** also the same http **method**: if not found something it returns http 404.

Server will try to match request api path.
if there are more results, try to check the full matching request's path.
<br >From v1.1.0 it supports also request's **body** match criteria.
<br >From v1.2.0  it supports **delayed** response (as register in file HAR)

## Next Feature
- flag for using delayed responses option
- ....



## Install
- install server in dev-dependencies
```shell
  npm install har-mock-server --save-dev
```

- in the scripts' section of package.json add a command like:
```javascript
  "scripts": {
      "har-mock-server": "har-mock-server -f ./node_modules/har-mock-server/test/test.har"
	},
```
> [!NOTE]
> "./node_modules/har-mock-server/test/test.har" is a test file shipped with the package

## Usage
launch the server with the defined command:<br/>
  ```
  npm run har-mock-server
  ```

for inline help to see supported params:
  ```
  npm run har-mock-server -- --help
  ```
(note this is npm's way to pass params to a npm script)

# Testing server

in browser address' bar write for example:

http://localhost:8000/posts<br />
http://localhost:8000/todos<br />
http://localhost:8000/todos?userId=2<br />
http://localhost:8000/albums<br />
