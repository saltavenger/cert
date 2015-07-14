'use strict';

(function(){
  $('.dropdown a').on('mouseenter focus', function(){
    $(this).closest('.dropdown').addClass('active');
  }).on('mouseleave blur', function(){
    $(this).closest('.dropdown').removeClass('active');
  });

  var chartColors = ["#a6cee3","#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#000000", "#2550A7"],
    getData = new kendo.data.DataSource({
      transport: {
        read: {
          url: "scripts/certData",
          contentType: "application/json",
          dataType: "json"
        }
      },
      requestEnd: function(objData){
        buildColumnChart("dash1", objData.response, "docketData", "Comments in Docket vs Comments in CommentCounts", "value", "metric", chartColors);
        buildColumnChart("dash2", objData.response, "commentData", "Total Comment Excerpts vs Total Responses", "value", "metric", chartColors);
        buildColumnChart("dash3", objData.response, "responseData", "Draft Responses vs Final Responses", "value", "metric", chartColors);
        buildColumnChart("dash5", objData.response, "orgTypeData", "Comments by Organization Type", "count", "orgType", chartColors);
        buildColumnChart("dash6", objData.response, "headerData", "Top Five Outline Headings (Comment Excerpts)", "number_in_outline", "outline_number", chartColors);  
        
        $("#dash4").kendoChart({
          dataSource: {
            data: objData.response,
            schema:{
              data: function(response){
                return response[0].orgNumData;
              }
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

        $("#dash7").kendoMap({
          center: [30.268107, -97.744821],
          zoom: 3,
          layers: [{
              type: "tile",
              urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
              subdomains: ["a", "b", "c"],
              attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
          }],
          markers: [{
              location: [30.268107, -97.744821],
              shape: "pinTarget",
              tooltip: {
                  content: "Austin, TX"
              }
          }]
        });
      }
  });

  getData.read();


  function buildColumnChart(id, data, dataSchema, title, seriesField, catField, colors){
    $("#" + id).kendoChart({
      dataSource: {
        data: data,
        schema: {
          data: function(response){
            return response[0][dataSchema];
          }
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