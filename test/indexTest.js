var Beerticon = require('../index.js');
var should = require('chai').should();

var fs = require('fs');
var async = require('async');
var gm = require('gm');

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
    this.timeout(60000);
    it('generate sample icons', function(done) {
	var arr =range(0,100);
	arr.push('daishi');
	arr.push('nakajima');
	arr.push('beer-kun');
	arr.push('id7642765876875634526');
	arr.push('id78tyv7r65345636rugvj');
	arr.push('id67ri ibiuyiiuhiuhiuh');
	arr.push('yamada-kun');
	arr.push('yamata-kun');
	
	async.each(arr, function(i, cb) {
	    (new Beerticon()).generate('i='+i, 'tmp/' + i + '.png' , cb);
	}, function(err) {
	    if (err) throw err;
	    var cs = [];
	    for (var i=0; i<arr.length; i++) {
		for (var j=i; j < arr.length; j++) {
		    if (i != j) {
			cs.push({i:arr[i], j:arr[j]});
		    }
		}
	    }
	    async.eachLimit(cs, 12, function(c, cb) {
		gm.compare('tmp/' + c.i + '.png', 'tmp/' + c.j + '.png',
			   {metric: 'mse'},
			   function (err, isEqual, equality, raw, path1, path2) {
			       equality.should.above(0.01, 'comparing ' + c.i + ',' + c.j);
			       cb();
			   });
	    }, done);
	});
    });
});
