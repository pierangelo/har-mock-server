## har-mock-server
Mock your FrontEnd project by using files HAR.<br/>
It creates a server after reading har file, searches for the best response that fits request's criteria.
By default the server searches for only 'application/json' responses that have the same **queryString** params and/or **body** also the same http **method**: if not found something it returns http 404.

Server will try to match request api path.
if there are more results, try to check the full matching request's path.


## Next Feature
- flag for using delayed responses option
- ....


## Changelog
- From v1.4.0 you can set a **custom basePath** (-b param) as a non important url's part and should not be considered during matching.<br>
i.e:  you generate a request as http://localhost/<_controller_>/<_function_> and request in HAR file are memoized in http://site.com/<_context_>/<_controller_>/<_function_>.
<br>you have 2 ways to get the match:
<br>- generate request as http://localhost/<_context_><_controller_>/<_function_>
<br>- or telling the server not considering <_context_> as a part during the match.
<br>so passing the param "-b /<_context_>/" the server will not consider it
<br/>


- From v1.5.0  added  option **excludeBody criteria** for not using it in searching  aresponse in har file
<br/>

- From v1.3.0  fix in **queryString criteria** with request url with extended path: i.e:  <http://baseUrl/path1/path2/api>
<br/>

- From v1.2.0  it supports **delayed** response (as register in file HAR)
<br/>

- From v1.1.0 it supports also request's **body** match criteria.


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
