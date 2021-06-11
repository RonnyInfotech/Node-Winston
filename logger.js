const winston = require('winston');
var path = require('path');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'info',
            filename: 'log/filelog-info.log',
            json: true,
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json())

        }),
        new winston.transports.File({
            level: 'error',
            filename: 'log/filelog-error.log',
            json: true,
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.json())
        })
    ]
});

module.exports.error = function() {
    logger.error.apply(logger, formatLogArguments(arguments))
}

module.exports.info = function() {
    logger.info.apply(logger, formatLogArguments(arguments))
}

function formatLogArguments(args) {
    args = Array.prototype.slice.call(args)

    var stackInfo = getStackInfo(1)

    if (stackInfo) {
        // get file path relative to project root
        var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'

        if (typeof(args[0]) === 'string') {
            args[0] = calleeStr + ' ' + args[0]
        } else {
            args.unshift(calleeStr)
        }
    }

    return args
}

function getStackInfo(stackIndex) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    var stacklist = (new Error()).stack.split('\n').slice(3)

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

    var s = stacklist[stackIndex] || stacklist[0]
    var sp = stackReg.exec(s) || stackReg2.exec(s)

    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative('./', sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
        }
    }
}