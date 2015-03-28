var fs = require('fs');
var util = require('util');
var xamel = require('xamel');
var gm = require('gm');

/**
 * constructor
 * @param {Object} setting - optional settings
 */
var Beerticon = function(settings) {
    this.settings = settings ? settings : {};
    for (k in Beerticon.defaultSettings) {
	if (!this.settings[k]) {
	    this.settings[k] = Beerticon.defaultSettings[k];
	}
    }
};

Beerticon.defaultSettings = {
    sourceSvg: [__dirname + '/data/bottle_heart.svg', __dirname + '/data/bottle_star.svg'],
    size: {width:128, height:128},
    replace: function(str, org) {
	return new Beerticon.Hash(Beerticon.hashString(str) * Beerticon.hashString(org + str));
    }
};

/**
 * Generate icon, and callback buffer
 * @param {String} str - input identity string
 * @param {Function} cb - callback function(err, buffer)
 */
Beerticon.prototype.generate = function(str, cb) {
    this.generateGM(str, function(err, gmc) {
	if (err) {
	    cb(err);
	    return;
	}
	gmc.toBuffer('PNG', function(err, buffer) {
	    cb(err, buffer);
	});
    });
};

/**
 * Generate icon to file
 * @param {String} str - input identity string
 * @param {String} outputFile - file path to output
 * @param {Function} cb - callback function(err)
 */
Beerticon.prototype.generateFile = function(str, outputFile, cb) {
    this.generateGM(str, function(err, gmc) {
	if (err) {
	    cb(err);
	    return;
	}
	gmc.write(outputFile, function(err) {
	    cb(err);
	});
    });
};

/**
 * Generate icon, and callback with gm object
 * @param {String} str - input identity string
 * @param {Function} cb - callback function(err, gm)
 */
Beerticon.prototype.generateGM = function(str, cb) {
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
		var r = this.settings.replace(str, org);
		if (r instanceof Beerticon.Hash) {
		    var elem = getIdenticonElem(r.hash);
		    return 'rgb(' + elem.red + ',' + elem.green + ',' + elem.blue + ')';		
		} else if (r instanceof Beerticon.Color) {
		    return r.color;
		} else {
		    return 'rgb(0,0,0)';
		}
	    }.bind(this));
	    var xml = xamel.serialize(colorReplacedSvg);
	    var gmc = gm(new Buffer(xml), '.tmp.svg')
		    .resize(this.settings.size.width, this.settings.size.height)
		    .density(this.settings.size.width*4, this.settings.size.height*4);
	    cb(null, gmc);
	}.bind(this));
    }.bind(this));
};

/**
 * Hash data type
 */
Beerticon.Hash = function(hash) {
    this.hash = hash;
};

/**
 * Color data type
 */
Beerticon.Color = function(color) {
    this.color = color;
};

/**
 * generate hash from string
 */
Beerticon.hashString = function(str) {
    var hash=0;
    for (var i=0; i< str.length; i++) {
	hash = ((hash << 5) - hash) + str.charCodeAt(i);
	hash |= 0;
    }
    return hash;
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
