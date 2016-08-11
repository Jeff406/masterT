
var fs = require('fs'),
	xamel = require('xamel'),
	http = require('http');
	
var assert = require('assert');
var request = require('request');
var xml1 = fs.readFileSync('manifest.xml');
var xml = xml1.toString().replace("\ufeff", "");
var path = "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@amazonqc2-vnm.stg2-cms.sys.am/site_2946/20160229/";
//var manifest = fs.createWriteStream("manifest.xml");
/*
 * var request = http.get(link, function(response) {
		  response.pipe(manifest);
		});
 */
//console.log(xml);

var fileNames = [];
function readFileName() {
    function expandContent(fileName) {
    var file = fs.readFileSync(fileName);
    var XML = file.toString().replace("\ufeff", "");
         xamel.parse(XML, { buildPath : '' }, function(err, xml) {
        if (err !== null) {
        throw err;
        }
	   var item = xml.$('rss/channel').eq(0);
	   if (item) {  
	   var links = item.get('item');
	   links.forEach(function(item) {
	    var name = item.eq(0).text();
	    //console.log(name);
		fileNames.push(name);
	    if (name && name.indexOf('article') == -1) {
	        expandContent(name);
	    }
	       }); 
	       }
       });
	}
 expandContent('manifest.xml');
}
readFileName();
describe("XMLs", function() {
	fileNames.forEach(function(filename) {
		it(filename, function(done) {
			http.get(path + filename, function (response) {
			assert.equal(response.statusCode, 200);
			//console.log(response.statusCode);
			done();
				});
			});
		});
	
});