'use strict';

(function(){
  $('.dropdown a').on('mouseenter focus', function(){
    $(this).closest('.dropdown').addClass('active');
  }).on('mouseleave blur', function(){
    $(this).closest('.dropdown').removeClass('active');
  });

  $(window).on("resize", function() {
    kendo.resize($(".dashItem"));
  });

  var getData = new kendo.data.DataSource({
    transport: {
      read: {
        url: 'scripts/certData',
        contentType: 'application/json',
        dataType: 'json'
      }
    },
    requestEnd: function(objData){
      var chartColors = ['#a6cee3','#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928', '#000000', '#2550A7'],
      dash1Options = {
        series: [{
          field: "value",
          categoryField: "metric",
          type: "pie",
          labels: {
            visible: true,
            template: "#var percent= percentage;# # percent= kendo.toString(percent, \"p0\"); # #= percent#",
          }
        }],
        legend: {
          visible: true
        },
        tooltip:{
          visible: true,
          template: "#= category#: #= value#"
        }
      },
      dash2Options = {
        series: [{
          field: "value",
          categoryField: "group",
          stack: true
        }],
        legend: {
          visible: true
        },
        tooltip:{
          visible: true,
          template: "#= dataItem.metric#: #= value#"
        }
      },
      dash3Options = {
        series: [{
          type: "horizontalWaterfall",
          field: "count",
          categoryField: "orgtype",
          summaryField: "summary",
          color: function(point){
            return chartColors[point.index];
          }
        }],
        legend: {
          visible: false
        },
        categoryAxis:{
        },
        tooltip:{
          visible: true,
          template: "<b>#= dataItem.orgtype#</b><br/>#= value# Comments"
        }
      },
      dash4Options ={
        series: [{
          field: "number_in_outline",
          categoryField: "outline_number",
          stack: true
        }],
        legend: {
          visible: true
        },
        categoryAxis:{
          labels:{
            visible: false
          }
        },
        tooltip:{
          visible: true,
          template: "<div style='text-align: left;'><b>Description:</b> #= dataItem.outline_description#<br/><b>Comments:</b> #= value#</span>",
          align: "left"
        }
      };
      
      buildChart('dash1', objData.response, 'docketData', dash1Options, chartColors, 'Comments in Docket vs Comments in CommentCounts');
      buildChart('dash2', objData.response, 'commentData', dash2Options, chartColors, 'Total Comment Excerpts vs Total Responses', 'metric');
      buildChart('dash3', objData.response, 'orgTypeData', dash3Options, chartColors, 'Comments by Organization Type');
      buildChart('dash4', objData.response, 'headerData', dash4Options, chartColors, 'Top Five Outline Headings (Comment Excerpts)', 'outline_number');
    }
  });

  getData.read();


  function buildChart(id, data, dataSchema, chartOptions, chartColors, title, groupField){
    var baseOptions = {
      theme: "material",
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
      seriesColors: chartColors
    },
    kendoOptions = $.extend(true, baseOptions, chartOptions);
    if(typeof groupField !== 'undefined'){
      kendoOptions.dataSource.group = { field: groupField};
    }
    $('#' + id).kendoChart(kendoOptions);
  }

})();

