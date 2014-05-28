var AWS = require('aws-sdk'),
    argv= require('optimist').argv,
    _= require('underscore'),
    fs= require('fs'),
    dyngodb= require('dyngodb2');

const CONFIG= process.cwd()+'/dyngo.config.js';

module.exports= function (opts)
{
    opts= opts||{};

    var gerr, gdb, ooops= function (err) { gerr= err; };
 
    if (argv.local)
    {
       if (opts.dynamo)
         _.extend(opts.dynamo,{ endpoint: new AWS.Endpoint('http://localhost:8000') });
       else
         _.extend(opts,{ dynamo: { endpoint: new AWS.Endpoint('http://localhost:8000') } });
    }

    dyngodb(opts,function (err,db)
    {
        if (err)
          ooops(err);
        else
        {
            gdb= db;

            if (fs.existsSync(CONFIG))
              require(CONFIG)(db,ooops);
        }
    });

    return function waitForGdb(req, res, next)
    {
        if (gerr)
          next(gerr);
        else
        if (gdb)
        {
           req.db= gdb;
           next();
        }
        else
           setTimeout(function ()
           {
              waitForGdb(req,res,next);
           },100);
    };
};
