express-dyngodb
==============

Simple express middleware for dyngodb

## Installation

```sh
$ npm install express-dyngodb
```

## API


*app.js*
```js
var express    = require('express'),
    gson       = require('express-dyngodb');

var app = express();

app.use(dyngodb());

app.get('/some/:id',function (req, res, next)
{
    req.db.test.findOne({ _id: req.params.id },
               .result(function (result)
               {
                  res.send(result);
               })
               .error(next);
})
```

## Local

To use [DynamoDB Local](http://aws.typepad.com/aws/2013/09/dynamodb-local-for-desktop-development.html)
```sh
$ node app.js --local
```
