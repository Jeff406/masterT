if(typeof require !== 'undefined') XLSX = require('xlsx');

var assert = require('chai').assert,
	http = require('http');
var workbook = XLSX.readFile('amz.xlsx');
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
		var cmsURL_key = 'P' + i;
		var siteID_key = 'Q' + i;
		var cms_cell = worksheet[cmsURL_key];
		var siteID_cell = worksheet[siteID_key];
		if (cms_cell == null || siteID_cell == null)  {
			continue;
		}
		var cms_val = cms_cell.v;
		var siteID_val = siteID_cell.v;
		var testObj = genURL(cms_val, siteID_val, i);
		testObjects.push(testObj);
	}
}
storeTestObj();
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
	for (var i = 0; i < testObjects.length; i++) {
		var obj = testObjects[i];
		describe("Row :" + obj["Row"], function(){
			it(obj["Manifest"], function(done){
				http.get(obj["Manifest"], function (response) {
					assert.equal(response.statusCode, 200);
						done();
				});
			});
			it(obj["ReplicaMap"], function(done){
				http.get(obj["ReplicaMap"], function (response) {
					assert.equal(response.statusCode, 200);
						done();
				});
			});
		});
	}
});




