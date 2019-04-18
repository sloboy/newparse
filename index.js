'use strict';

const fs = require('fs');
var firstBy=function(){function n(n){return n}function t(n){return"string"==typeof n?n.toLowerCase():n}function r(r,e){if(e="number"==typeof e?{direction:e}:e||{},"function"!=typeof r){var u=r;r=function(n){return n[u]?n[u]:""}}if(1===r.length){var i=r,o=e.ignoreCase?t:n;r=function(n,t){return o(i(n))<o(i(t))?-1:o(i(n))>o(i(t))?1:0}}return-1===e.direction?function(n,t){return-r(n,t)}:r}function e(n,t){return n=r(n,t),n.thenBy=u,n}function u(n,t){var u=this;return n=r(n,t),e(function(t,r){return u(t,r)||n(t,r)})}return e}();
var d3 = require("d3");
var fields_file = 'fields3.csv';
var page_num; //counts pages in pdf for loop
var field_num; //counts the fields in fielddef for that page loop
var fields_on_page; //holds the array of fields for a given page
var field_defs;

var FileContents = '';  // holds the string that will be writen to file

let rawdata = fs.readFileSync('Page11_12.json');  
let p_json = JSON.parse(rawdata);

fs.readFile(fields_file, "utf8", function(error, field_defs) {
  field_defs = d3.csvParse(field_defs);
}
//console.log(JSON.stringify(field_defs));
var s = firstBy("Page").thenBy("full_field").thenBy(function (v1, v2) { return v2.Multi - v1.Multi; });
field_defs.sort(s);
//loop through each page in the document
var i =0;
for (page_num in p_json.formImage.Pages) {
  let fields_on_page = field_defs.filter(function(d) { return d.Page === page_num; });

  //console.log(page_num);
  //console.log(JSON.stringify(fields_on_page));
//loop through each field definition for that page
  for (field_num in fields_on_page) {
    //if the data is in multiple places, Muliti will have the
    //largest value
    var fieldmulti= fields_on_page[field_num].Multi;
    if (fieldmulti>0){
      //this is a multiple data field
      //loop through the each part
      var TextValue ='';
      var prevfieldname='';
      for (i = field_num; i <field_num+fieldmulti;i++){
        var fieldname= fields_on_page[field_num].full_field;
        var fieldYEAR = fields_on_page[field_num].YEAR;
        var fieldX = fields_on_page[field_num].X;
        var fieldY = fields_on_page[field_num].Y;
        
        for (text_num in p_json.formImage.Pages[page_num].Texts){
          var textX =(p_json.formImage.Pages[page_num].Texts[text_num].x);
          var textY =p_json.formImage.Pages[page_num].Texts[text_num].y;
          if((textX==fieldX) && (textY==fieldY)){
            //prepend the string  
            var currTextValue = decodeURIComponent( p_json.formImage.Pages[page_num].Texts[text_num].R[0].T);
            TextValue = currTextValue + TextValue;

          }
          FileContents += (`'${page_num}', '${textX}', '${textY}', '${TextValue}', '${fieldname}', '${fieldYEAR}'\n`);
        }    
      }
    }
    fs.writeFile("output.csv", FileContents, function(err) {
      console.log("file written");
    });
  }  
}      
        //get the parameters of the current field
      //   var fieldX = fields_on_page[field_num].X;
      //   var fieldY = fields_on_page[field_num].Y;
      //   var fieldname= fields_on_page[field_num].full_field;
      //   var fieldYEAR = fields_on_page[field_num].YEAR;
        
      //   console.log (fieldname + ' ' + fieldmulti);
      //   //loop through each [Texts] element
      //   //var texts; //holds the array of text elements on that page
      //   var text_num; //counts the number of text elements on that page
      //   for (text_num in p_json.formImage.Pages[page_num].Texts){
      //     //FileContents += (JSON.stringify(p_json.formImage.Pages[page_num].Texts[text_num].x));
      //     //if it matches x,y of field definition, add the current [Texts]
      //     //element to the file string with the field definition name
      //     var textX =(p_json.formImage.Pages[page_num].Texts[text_num].x);
      //     var textY =p_json.formImage.Pages[page_num].Texts[text_num].y;
      //     if((textX==fieldX) && (textY==fieldY)){
      //       // deal with fields that span multiple areas

      //       var TextValue =decodeURIComponent( p_json.formImage.Pages[page_num].Texts[text_num].R[0].T);
            
      //       //Convert wedges  â–¼ to down  â–² to up
      //       console.log(TextValue);
      //       //console.log (page_num + ', ', + textX + ', ' + fieldX, + textY + ', ' + fieldY + ', ' + TextValue);
      //       FileContents += (`'${page_num}', '${textX}', '${textY}', '${TextValue}', '${fieldname}', '${fieldYEAR}'\n`);
      //     }
      //   }
        
      // }
      
      // multi_fields_on_page.sort(s)
      // var PrevField = '';
      // var TextValue='';
      // for (field_num in multi_fields_on_page) {
        
      //   var CurrentField = multi_fields_on_page[field_num];
      //   if (CurrentField == PrevField){
      //     TextValue += decodeURIComponent( p_json.formImage.Pages[page_num].Texts[text_num].R[0].T);
      //   } else {
      //     TextValue = decodeURIComponent( p_json.formImage.Pages[page_num].Texts[text_num].R[0].T);
      //   }
      // PrevField = CurrentField
      // console.log(TextValue);
      // }

//    console.log(field_defs);


//   }
//   fs.writeFile("output.csv", FileContents, function(err) {
//     console.log("file written");
//   });
// });

// function join(lookupTable, mainTable, lookupKey, mainKey, select) {
//   var l = lookupTable.length,
//       m = mainTable.length,
//       lookupIndex = [],
//       output = [];
//   for (var i = 0; i < l; i++) { // loop through l items
//       var row = lookupTable[i];
//       lookupIndex[row[lookupKey]] = row; // create an index for lookup table
//   }
//   for (var j = 0; j < m; j++) { // loop through m items
//       var y = mainTable[j];
//       var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
//       output.push(select(y, x)); // select only the columns you need
//   }
//   return output;
// };