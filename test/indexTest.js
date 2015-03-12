var beerticon = require('../index.js');
var fs = require('fs');
var async = require('async');

describe('Beerticon', function() {
    before(function(done) {
	fs.mkdir('tmp', function (){done();});
    });
    var range = function(from ,to) {
	var result = [];
	for (i=from; i <= to; i++) {
	    result.push(i);
	}
	return result;
    };
    this.timeout(3000);
    it('generate sample icons', function(done) {
	async.each(range(0,1), function(i, cb) {
	    beerticon.generate('i='+i,'./beerticon_bottle.svg', 'tmp/' + i + '.png' , cb);
	}, function(err) {
	    if (err) throw err;
	    done();	    
	});
    });
    /*
    it('xamel', function(done) {
	var src = fs.readFile('./beerticon_bottle.svg', 'utf-8', function(err, data) {
	    console.log(data);
	    require('xamel').parse(data, function(err, xml) {
		console.log(JSON.stringify(xml));
		var out = require('xamel').serialize(xml);
		fs.writeFile('out2.svg', out, done);
	    });
	});
    });
     */
});
