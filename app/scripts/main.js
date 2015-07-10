'use strict';

$('.dropdown a').on('mouseenter focus', function(){
	$(this).closest('.dropdown').addClass('active');
}).on('mouseleave blur', function(){
	$(this).closest('.dropdown').removeClass('active');
});

var docketData = new kendo.data.DataSource({
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

$("#docketCount").kendoChart({
  autoBind: false,
  dataSource: docketData,
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
docketData.read()