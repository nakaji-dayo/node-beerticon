var fs = require('fs');
var util = require('util');
var xamel = require('xamel');
var gm = require('gm');

var Beerticon = function(settings) {
    this.settings = settings ? settings : {};
    var defaultSettings = {
	sourceSvg: ['data/bottle_heart.svg', 'data/bottle_star.svg'],
	size: {width:128, height:128},
	hashForReplace: function(str, org) {
	    return Beerticon.hashString(str) * Beerticon.hashString(org);
	}
    };
    for (k in defaultSettings) {
	if (!this.settings[k]) {
	    this.settings[k] = defaultSettings[k];
	}
    }
};

Beerticon.prototype.generate = function(str, outputFile, cb) {
    var src;
    if (Array.isArray(this.settings.sourceSvg)) {
	var elem = getIdenticonElem(Beerticon.hashString(str));	
	var index = Math.abs(elem.code%this.settings.sourceSvg.length);
	src = this.settings.sourceSvg[index];
    } else {
	src = this.settings.sourceSvg;
    }
    fs.readFile(src, 'utf-8', function(err, data) {
	if (err) {
	    cb(err);
	    return;
	}
	xamel.parse(data, function(err, svg) {
	    var colorReplacedSvg = replaceAttr(svg, 'fill', function(org) {
		var elem = getIdenticonElem(this.settings.hashForReplace(str, org));
		return 'rgb(' + elem.red + ',' + elem.green + ',' + elem.blue + ')';		
	    }.bind(this));
	    var xml = xamel.serialize(colorReplacedSvg);
	    gm(new Buffer(xml), '.tmp.svg')
		.resize(this.settings.size.width, this.settings.size.height)
		.density(this.settings.size.width*4, this.settings.size.height*4)
		.write(outputFile, function(err) {
		    cb(err);
		});
	}.bind(this));
    }.bind(this));
};

var replaceAttr = function(xmlObj, attrName, replace) {
    if (xmlObj.attrs) {
	for (var key in xmlObj.attrs) {
	    if (key == attrName) {
		xmlObj.attrs[key] = replace(xmlObj.attrs[key]);
	    }
	}
    }
    if (xmlObj.children) {
	xmlObj.children = xmlObj.children.map(function(child) {
	    return replaceAttr(child, attrName, replace);
	});
    }
    return xmlObj;
};

Beerticon.hashString = function(str) {
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

module.exports = Beerticon;
