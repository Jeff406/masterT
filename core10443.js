var fs = require('fs'),
	http = require('http');
var assert = require('chai').assert;

var jsonFile = fs.readFileSync('./Untitled.json');
var jsonData = JSON.parse(jsonFile);

var records = jsonData.RECORDS;

function genURLs(id, subdomain) {
	return {
	manifest: "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@"+ subdomain + ".audiencemedia.com/site_" + id + "/Latest/manifest.xml",
	articleCover: "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@"+ subdomain + ".audiencemedia.com/site_" + id + "/Latest/article_cover.xml",
	sectionCover: "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@"+ subdomain + ".audiencemedia.com/site_" + id + "/Latest/section_cover.xml",
	replica: "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@"+ subdomain + ".audiencemedia.com/site_" + id + "/Latest/replicaMap.xml"
	}
}

describe("Check dummy", function(){
	records.forEach(function(record) {
		describe(record.subdomain, function(){
			var t = genURLs(record.id, record.subdomain);
			it(t.manifest, function(done){
				http.get(t.manifest, function (response) {
				assert.equal(response.statusCode, 200);
				done();
					});
				});
			it(t.articleCover, function(done){
				http.get(t.articleCover, function (response) {
				assert.equal(response.statusCode, 200);
				done();
					});
				});
			it(t.sectionCover, function(done){
				http.get(t.sectionCover, function (response) {
				assert.equal(response.statusCode, 200);
				done();
					});
				});
			it(t.replica, function(done){
				http.get(t.replica, function (response) {
				assert.equal(response.statusCode, 200);
				done();
					});
				});
		});
	});
});
	
