var fs = require('fs'),
	xamel = require('xamel'),
	http = require('http');
var request = require('sync-request');
	
var assert = require('chai').assert;
var downloadFileSync = require('download-file-sync');

//var xml1 = fs.readFileSync('manifest.xml');
//var xml = xml1.toString().replace("\ufeff", "");
var path = "http://amazon:7e289aaf5840aa35afc24b682fdf91a7@liveamqctest02-gb.audiencemedia.com/site_475/Latest/";
//http://liveamqctest02-gb.audiencemedia.com/site_475/20160720/manifest.xml

var fileNames = [];
var sectionFiles = [];
var articles = [];

function expandContent(fileName) {
	var container = [];
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
	container.push(name);
       }); 
       }
   });
   return container;
}

function downloadFile(fileName) {
	var content = downloadFileSync(path + fileName);
	fs.writeFileSync(fileName, content);	
}

function storeArticles(section, articles) {
	return {
		[section]: articles
	};
}

function getFiles() {
	var res = request('GET', path + "manifest.xml");
		if (res.statusCode != 200) {throw new Error("manifest.xml cannot be downloaded!")}
		else {
			downloadFile("manifest.xml");
			sectionFiles = expandContent("manifest.xml").slice(0);
		}	
	
	sectionFiles.forEach(function(section) {
		var re = request('GET', path + section);
		if (re.statusCode != 200) {throw new Error("section file cannot be downloaded!")}
		else {
			downloadFile(section);
			var a = expandContent(section).slice(0);
			articles.push(storeArticles(section,a));
		}	
	});
}
getFiles();
describe("XMLs", function() {
	articles.forEach(function(article) {
		Object.keys(article).forEach(function(section){
			describe(section, function(){
				var t = article[section].slice(0);
				t.forEach(function(articleFile){
					it(articleFile, function(done){
						http.get(path + articleFile, function (response) {
							assert.equal(response.statusCode, 200);
								done();
						});
					});
				});
			});
		});
	});
});
