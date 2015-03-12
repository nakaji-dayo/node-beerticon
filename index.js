var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');
var parser = new require('xml2js').Parser({explicitArray: true});
var builder = new xml2js.Builder({explicitArray: true});
var gm = require('gm');

exports.generate = function(str, srcSvgFile, outputFile, cb) {
    fs.readFile(srcSvgFile, function(err, data) {
	if (err) {
	    cb(err);
	    return;
	}
	parser.parseString(data, function(err, svg) {
	    var colorReplacedSvg = replaceAttr(svg, 'fill', function(org) {
		var elem = getIdenticonElem(hashString(str + org));
		return 'rgb(' + elem.red + ',' + elem.green + ',' + elem.blue + ')';
	    }, 'string');
	    //TODO: stream xml builderを探す
	    var xml = builder.buildObject(colorReplacedSvg);
	    fs.writeFile('out.svg',xml);
	    gm(new Buffer(xml), '.tmp.svg')
		.resize(128, 128)
		.density(512, 512)
		.write(outputFile, function(err) {
		    cb(err);
		});
	});
    });
};

var replaceAttr = function(xmlObj, attrName, replace, valueType) {
    for (var key in xmlObj) {
	if (key == attrName && typeof xmlObj[key] == valueType) {
	    xmlObj[key] = replace(xmlObj[key]);
	}
	if (typeof xmlObj[key] == 'object') {
	    xmlObj[key] = replaceAttr(xmlObj[key], attrName, replace, valueType);
	}
    }
    return xmlObj;
};

var hashString = function(str) {
    var hash=0;
    for (var i=0; i< str.length; i++) {
	hash = ((hash << 5) - hash) + str.charCodeAt(i);
	hash |= 0;
    }
    return hash;
};

var getIdenticonElem = function(hash) {
    var code = hash;
    return {
	code: code,
	blue: ((code) & 31) << 3,
	green: ((code >> 5) & 31) << 3,
	red: ((code >> 10) & 31) << 3,
	reminder: (code >> 15)
    };
};
