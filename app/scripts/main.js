'use strict';

(function(){
  $('.dropdown a').on('mouseenter focus', function(){
    $(this).closest('.dropdown').addClass('active');
  }).on('mouseleave blur', function(){
    $(this).closest('.dropdown').removeClass('active');
  });
  
  var chartColors = ["#a6cee3","#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#000000", "#2550A7"],
  dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "scripts/certData",
        contentType: "application/json",
        dataType: "json"
      }
    },
    requestEnd: function(objData){
      console.log(objData);
      buildColumnChart("dash1", objData.response, "docketData", "Comments in Docket vs Comments in CommentCounts", "value", "metric", chartColors);
      buildColumnChart("dash2", objData.response, "commentData", "Total Comment Excerpts vs Total Responses", "value", "metric", chartColors);
      buildColumnChart("dash3", objData.response, "responseData", "Draft Responses vs Final Responses", "value", "metric", chartColors);
      $("#dash4").kendoChart({
        dataSource: {
          data: objData.response,
          schema:{
            data: "orgNumData"
          }
        },
        title: {
          text: "Total Number of Organizations Submitting Comments"
        },
        series: [{
          field: "value",
          color: function(point){
            var seriesColor = chartColors;
            return seriesColor[point.index];
          }
        }],
        tooltip: {
          visible: true
        }
      });
    }
  });

  dataSource.read();


  function buildColumnChart(id, data, dataSchema, title, seriesField, catField, colors){
         

    $("#" + id).kendoChart({
      dataSource: {
        data: data,
        schema: {
          data: dataSchema
        }
      },
      title: {
        text: title
      },
      series: [{
        field: seriesField,
        color: function(point){
          var seriesColor = colors;
          return seriesColor[point.index];
        }
      }],
      categoryAxis:{
        field: catField
      },
      tooltip: {
        visible: true
      }
    });
  }

})();


/* 

$("#dash5").kendoChart({
  autoBind: false,
  dataSource: dash5Data,
  series: [{
  	field: "count",
  	color: function(point){
  		var seriesColor = chartColors;
  		return seriesColor[point.index];
  	}
  }],
  categoryAxis:{
  	field: "orgType"
  },
  tooltip: {
  	visible: true
  }
});
*/