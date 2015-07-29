'use strict';

(function(){

  $.fn.setup_navigation = function(settings) {
    settings = jQuery.extend({
      menuHoverClass: 'active',
    }, settings);
    
    // Set tabIndex to -1 so that links can't receive focus until menu is open
    $(this).find('> li > a').next('ul').find('a').attr('tabIndex',-1);
    $(this).find('> li > ul > li > a').next('ul').find('a').attr('tabIndex',-1);
    
    $(this).find('> li > a').hover(function(){
      $(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
    });
    $(this).find('> li > ul > li >a').hover(function(){
      $(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
    });
    $(this).find('> li > a').focus(function(){
      $(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
      $(this).next('ul')
        .addClass(settings.menuHoverClass)
        .find('a').attr('tabIndex',0);
    });
    $(this).find('> li > ul > li > a').focus(function(){
      $(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
      $(this).next('ul')
        .addClass(settings.menuHoverClass)
        .find('a').attr('tabIndex',0);
    });

      // Hide menu if click or focus occurs outside of navigation
    $(this).find('a').last().keydown(function(e){ 
      if(e.keyCode == 9) {
        // If the user tabs out of the navigation hide all menus
        $('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
      }
    });
    $(document).click(function(){ $('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1); });
    
    $(this).click(function(e){
      e.stopPropagation();
    });
  }

  $('#mainMenu, #secondaryMenu').setup_navigation();

  

  
  $(window).on('resize', function() {
    kendo.resize($('.dashItem'));
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
      var chartColors = ['#882e72','#B178A6', '#D6C1DE', '#196580', '#5289c7', '#7bafde', '#4eb265', '#90c987', '#cae0ab', '#f7ee55', '#f6c141', '#f1932d', '#e8601c', '#dc050c', '#777777'],
      chart1Colors = [chartColors[4], chartColors[5]],
      chart2Colors = [chartColors[13], chartColors[8], chartColors[6]],
      dash1Options = {
        series: [{
          field: 'value',
          categoryField: 'metric',
          type: 'pie',
          labels: {
            visible: true,
            template: '#var percent= percentage;# # percent= kendo.toString(percent, \"p0\"); # #= percent#',
          }
        }],
        legend: {
          visible: true
        },
        tooltip:{
          visible: true,
          template: '#= category#: #= value#'
        }
      },
      dash2Options = {
        series: [{
          field: 'value',
          categoryField: 'group',
          stack: true
        }],
        legend: {
          visible: true
        },
        tooltip:{
          visible: true,
          template: '#= dataItem.metric#: #= value#'
        }
      },
      dash3Options = {
        chartArea: {
          margin: {
            right: 50
          }
        },
        series: [{
          type: 'horizontalWaterfall',
          field: 'count',
          categoryField: 'orgtype',
          summaryField: 'summary',
          color: function(point){
            return chartColors[point.index];
          },
          labels: {
            visible: true,
            template: "#= category#",
            position: "insideBase",
            color: "#888888"
          }
        }],
        categoryAxis: {
          labels:{
            visible: false
          }
        },
        legend: {
          visible: false
        },
        tooltip:{
          visible: true,
          template: '<b>#= dataItem.orgtype#</b><br/>#= value# organizations'
        }
      },
      dash4Options ={
        series: [{
          field: 'number_in_outline',
          categoryField: 'outline_number',
          stack: true
        }],
        legend: {
          visible: true,
          position: 'right',
          orientation: 'vertical',
          labels:{
            template: '#var label= text;# # label= label.split(" ");# #if(label.length > 3){ label = label.map(function(el, i){ if((i+1)%3 === 0){ return el + "\\n"; } else{ return el } });}# # label = label.join(" ");# #=label#',
            padding: {
              bottom: 10
            }
          }
        },
        categoryAxis:{
          labels:{
            visible: false          }
        },
        tooltip:{
          visible: true,
          template: '<div style=\'text-align: left;\'><b>Description:</b> #= dataItem.outline_description#<br/><b>Comments:</b> #= value#</span>',
          align: 'left'
        }
      };
      
      buildChart('dash1', objData.response, 'docketData', dash1Options, chart1Colors, 'Comments in Docket vs Comments in CommentCounts');
      buildChart('dash2', objData.response, 'commentData', dash2Options, chart2Colors, 'Total Comment Excerpts vs Total Responses', 'metric');
      buildChart('dash3', objData.response, 'orgTypeData', dash3Options, chartColors, 'Comments by Organization Type');
      buildChart('dash4', objData.response, 'headerData', dash4Options, chartColors, 'Top Five Outline Headings (Comment Excerpts)', 'outline_number');
      

      var certData = objData.response[0].stateData,
          mapData = joinData(statesData, certData),
          comments = [];

      mapData.features.forEach(function(e){
        comments.push(e.properties.count);
      });

      /*var max = d3.max(comments),
          min = d3.min(comments);*/

      //uses d3 quantile scale to create color map
      var quantile = d3.scale.quantile().domain(comments).range(d3.range(4)),
          map = L.map('map', {zoomControl: false}).setView([37.8, -96], 4),
          zoomHome = L.Control.zoomHome();

      zoomHome.addTo(map);

      L.tileLayer('https://{s}.tiles.mapbox.com/v4/aareskog.n05p31e9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWFyZXNrb2ciLCJhIjoiUE9xRko2VSJ9.JrYWM5Ru2ocTP5zafKmdKw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
      }).addTo(map);

      // control that shows state info on hover
      var info = L.control();

      info.onAdd = function(){
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };

      info.update = function (props) {
        this._div.innerHTML = '<h4>Comments by State</h4>' +  (props ?
          '<b>' + props.name + '</b><br />' + props.count + ' comments'
          : 'Hover over a state');
      };

      info.addTo(map);


      // get color depending on # of comments per state
      function getColor(d) {
        return d === 0  ? '#FEE5D9' :
               d === 1  ? '#FCAE91' :
               d === 2  ? '#FB6A4A' :
                          '#F7300F' ;
      }
      

      function style(feature) {
        var range = quantile(feature.properties.count);
        return {
          weight: 1,
          opacity: 1,
          color: '#ffffff',
          fillOpacity: 0.7,
          fillColor: getColor(range)
        };
      }

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 4,
          color: '#DA291C',
          fillOpacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }

        info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
      }

      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      var geojson = L.geoJson(mapData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);

      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
          grades = quantile.range(),
          labels = [];

        for (var i = 0; i < grades.length; i++) {
          var inverted = quantile.invertExtent(grades[i]);
          labels.push(
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            inverted[0] + (inverted[1] ? '&ndash;' + inverted[1] : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(map);
    }
  });

  getData.read();

  function joinData(obj1, obj2){
    var newData = obj1;
    for(var i=0; i < obj1.features.length; i++){
      var stateName = obj1.features[i].properties.name,
        dataFeatures = newData.features[i].properties,
        properties = {'stateName': stateName, 'dataFeatures': dataFeatures};
      obj2.forEach(checkState, properties);
      if(typeof dataFeatures.count === 'undefined'){
        dataFeatures.count = 0;
      }
    }
    return newData;
  }

  function checkState(el){
    // jshint validthis: true
    if(this.stateName === el.state){
      this.dataFeatures.count = el.count;
    }
  }

  function buildChart(id, data, dataSchema, chartOptions, chartColors, title, groupField){
    var baseOptions = {
      theme: 'material',
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

