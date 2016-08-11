if(typeof require !== 'undefined') XLSX = require('xlsx');

var assert = require('chai').assert,
	http = require('http');
var workbook = XLSX.readFile('out.xlsx');
var sheet_name_list = workbook.SheetNames;
var first_sheet_name = workbook.SheetNames[0];
//http://amazon:7e289aaf5840aa35afc24b682fdf91a7@audiotechnology-au.audiencemedia.com/site_1924/Latest/manifest.xml
var testObjects = [];
var replicaFiles = [];
/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];

/* Find desired cell */

/* Get the value */

//console.log(desired_cell);
var manifests = [];
var replicaMaps = [];

function genURL(cmsurl, siteID, row) {
	var domain = cmsurl.replace(/http:\/\/|\/admin/g, "");
	var url1 = "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@" + domain + "/site_" + siteID + "/Latest/manifest.xml";
	var url2 = "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@" + domain + "/site_" + siteID + "/Latest/replicaMap.xml";
	return {Row: row,
		Manifest: url1,
		ReplicaMap: url2
	}
}
function storeTestObj() {
	for (var i = 2; i < 336; i++) {
		var v = 'V' + i;
		var w = 'W' + i;
		var f1 = worksheet[v];
		var f2 = worksheet[w];
		if (f1 == null || f2 == null)  {
			continue;
		}
		var m = f1.v;
		var r = f2.v;
		//var testObj = genURL(cms_val, siteID_val, i);
		manifests.push(m);
		replicaMaps.push(r);
	}
}
storeTestObj();
//console.log(manifests);
/*
describe("Manifest", function() {
	testOnManfest(function(url) {
		it(url, function(done){
			http.get(url, function (response) {
				assert.equal(response.statusCode, 200);
					done();
			});
		});
	});
});
*/
describe("Ping test", function() {
	describe("Manifests", function(){
		manifests.forEach(function(manifest) {
			it(manifest, function(done){
				http.get(manifest, function (response) {
					assert.equal(response.statusCode, 200);
						done();
				});
			});
		});

	});
	describe("ReplicaMaps", function(){
		replicaMaps.forEach(function(rep) {
			it(rep, function(done){
				http.get(rep, function (response) {
					assert.equal(response.statusCode, 200);
						done();
				});
			});
		});

	});
});



