//parsing json file created by pdf2json
'use strict';
const fs = require('fs');
var firstBy=function(){function n(n){return n}function t(n){return"string"==typeof n?n.toLowerCase():n}function r(r,e){if(e="number"==typeof e?{direction:e}:e||{},"function"!=typeof r){var u=r;r=function(n){return n[u]?n[u]:""}}if(1===r.length){var i=r,o=e.ignoreCase?t:n;r=function(n,t){return o(i(n))<o(i(t))?-1:o(i(n))>o(i(t))?1:0}}return-1===e.direction?function(n,t){return-r(n,t)}:r}function e(n,t){return n=r(n,t),n.thenBy=u,n}function u(n,t){var u=this;return n=r(n,t),e(function(t,r){return u(t,r)||n(t,r)})}return e}();
var d3 = require("d3");
var fields_file = 'fields3.csv';
var pdfJSONFile = 'Page11_12.json'
var page_num; //counts pages in pdf for loop
var field_num; //counts the fields in fielddef for that page loop
var fields_on_page; //holds the array of fields for a given page
var field_defs=[];

var FileContents = fs.readFileSync(fields_file,"utf8");  // holds the string that will be writen to file
//load the field definitions into an array
field_defs = d3.csvParse(FileContents);
//sort them by page, fieldname, Multi (desc)
var s = firstBy("Page").thenBy("full_field").thenBy(function (v1, v2) { return v2.Multi - v1.Multi; });
field_defs.sort(s);
//load the json file into an array
let rawdata = fs.readFileSync(pdfJSONFile);  
let p_json = JSON.parse(rawdata);
FileContents='';
for (page_num in p_json.formImage.Pages) {
    let fields_on_page = field_defs.filter(function(d) { return d.Page === page_num; });
    for (field_num in fields_on_page) {
        
        var FieldText=ReturnData(fields_on_page[field_num].X,fields_on_page[field_num].Y,p_json.formImage.Pages[page_num]);
        FileContents += (`'${fields_on_page[field_num].full_field}', '${fields_on_page[field_num].YEAR}', '${FieldText}', '${page_num}', '${fields_on_page[field_num].X}', '${fields_on_page[field_num].Y}'\n`);
    }
}
fs.writeFile("output.csv", FileContents, function(err) {
    console.log("file written");
  });
//create a function to find data based on an x,y pair

function ReturnData(X,Y,pageArray){
    var text_num = 0;
    var output= '';
    for (var i = 0; i <  pageArray.Texts.length; i++){
        var textX = round(parseFloat ( pageArray.Texts[i].x),3);
        X= parseFloat(X);
        var textY = round(parseFloat( pageArray.Texts[i].y),3);
        Y= parseFloat(Y);
        if((textX==X) && (textY==round(Y,3))){
            //I found the text
            console.log('found')
            output = decodeURIComponent(pageArray.Texts[i].R[0].T); 
            break;
        }
        
    }
    return output;

}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }


function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
  }