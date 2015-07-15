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
      buildColumnChart('dash1', objData.response, false, 'docketData', 'Comments in Docket vs Comments in CommentCounts', 'value', 'metric', 'cat');
      buildColumnChart('dash2', objData.response, false, 'commentData', 'Total Comment Excerpts vs Total Responses', 'value', 'metric', 'cat');
      buildColumnChart('dash3', objData.response, false, 'responseData', 'Draft Responses vs Final Responses', 'value', 'metric', 'cat');
      buildColumnChart('dash4', objData.response, false, 'orgNumData', 'Total Number of Organizations Submitting Comments', 'value', 'cat');
      buildColumnChart('dash5', objData.response, true, 'orgTypeData', 'Comments by Organization Type', 'count', 'orgtype', 'group');
      buildColumnChart('dash6', objData.response, false, 'headerData', 'Top Five Outline Headings (Comment Excerpts)', 'number_in_outline', 'outline_number', 'cat');
    }
  });

  getData.read();


  function buildColumnChart(id, data, legendViz, dataSchema, title, seriesField, groupOrcatField, groupOrCat){
    var chartColors = ['#a6cee3','#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928', '#000000', '#2550A7'],
    kendoOptions = {
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
      seriesColors: chartColors,
      series: [{
        field: seriesField
      }],
      legend: {
        visible: legendViz,
        position: 'right'
      },    
      tooltip: {
        visible: true
      }
    };
    if(typeof groupOrcatField !== 'undefined'){
      if(groupOrCat === 'group'){
        kendoOptions.dataSource.group = { field: groupOrcatField};
        kendoOptions.series[0].name = '#: group.value #';
        kendoOptions.categoryAxis = { labels: { visible: false} };
      }
      else{
        kendoOptions.categoryAxis = { field: groupOrcatField };
        kendoOptions.categoryAxis.labels = { template: '# var label= value;# #label = label.substring(0,25);# #= label #' };
        kendoOptions.series[0].color = function(point){
          var seriesColor = chartColors;
          return seriesColor[point.index];
        };
      }
    }
    $('#' + id).kendoChart(kendoOptions);
  }

})();