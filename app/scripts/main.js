'use strict';

$('.dropdown a').on('mouseenter focus', function(){
	$(this).closest('.dropdown').addClass('active');
}).on('mouseleave blur', function(){
	$(this).closest('.dropdown').removeClass('active');
});

var dash1Data = new kendo.data.DataSource({
  transport: {
    read: {
      url: "scripts/certData",
      contentType: "application/json",
      dataType: "json"
    }
  },
    schema: {
    	data: "docketData"
    }
});

$("#dash1").kendoChart({
  autoBind: false,
  dataSource: dash1Data,
  series: [{
  	field: "value",
  	color: function(point){
  		var seriesColor = ["#e41a1c", "#377eb8"];
  		return seriesColor[point.index];
  	}
  }],
  categoryAxis:{
  	field: "metric"
  },
  tooltip: {
  	visible: true
  }
});
dash1Data.read();

var dash2Data = new kendo.data.DataSource({
  transport: {
    read: {
      url: "scripts/certData",
      contentType: "application/json",
      dataType: "json"
    }
  },
    schema: {
    	data: "commentData"
    }
});

$("#dash2").kendoChart({
  autoBind: false,
  dataSource: dash2Data,
  series: [{
  	field: "value",
  	color: function(point){
  		var seriesColor = ["#e41a1c", "#377eb8"];
  		return seriesColor[point.index];
  	}
  }],
  categoryAxis:{
  	field: "metric"
  },
  tooltip: {
  	visible: true
  }
});
dash2Data.read();

var dash3Data = new kendo.data.DataSource({
  transport: {
    read: {
      url: "scripts/certData",
      contentType: "application/json",
      dataType: "json"
    }
  },
    schema: {
    	data: "responseData"
    }
});

$("#dash3").kendoChart({
  autoBind: false,
  dataSource: dash3Data,
  series: [{
  	field: "value",
  	color: function(point){
  		var seriesColor = ["#e41a1c", "#377eb8"];
  		return seriesColor[point.index];
  	}
  }],
  categoryAxis:{
  	field: "metric"
  },
  tooltip: {
  	visible: true
  }
});
dash3Data.read();

var dash4Data = new kendo.data.DataSource({
  transport: {
    read: {
      url: "scripts/certData",
      contentType: "application/json",
      dataType: "json"
    }
  },
    schema: {
    	data: "orgNumData"
    }
});

$("#dash4").kendoChart({
  autoBind: false,
  dataSource: dash4Data,
  series: [{
  	field: "value",
  	color: function(point){
  		var seriesColor = ["#e41a1c", "#377eb8"];
  		return seriesColor[point.index];
  	}
  }],
  tooltip: {
  	visible: true
  }
});
dash4Data.read();

var dash5Data = new kendo.data.DataSource({
  transport: {
    read: {
      url: "scripts/certData",
      contentType: "application/json",
      dataType: "json"
    }
  },
    schema: {
    	data: "orgTypeData"
    }
});

$("#dash5").kendoChart({
  autoBind: false,
  dataSource: dash5Data,
  series: [{
  	field: "count",
  	color: function(point){
  		var seriesColor = ["#a6cee3","#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#000000"];
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
dash5Data.read();