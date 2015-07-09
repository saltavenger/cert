'use strict';

$('.dropdown a').on('mouseenter focus', function(){
	$(this).closest('.dropdown').addClass('active');
}).on('mouseleave blur', function(){
	$(this).closest('.dropdown').removeClass('active');
});

$("#docketCount").kendoChart({
	title: {
		text: "How many dockets?"
	},
	legend: {
		visible: false
	},
	seriesDefaults: {
		type: "bar"
	},
	tooltip: {
		visible: true
	},
	dataSource: {
		transport: {
			read: {
				url: "https://cert-abtassociates.com/agworkerprotection_devel/json/json2.cfm",
				dataType: "html",
				data: $("#main").text(),
				success: function(data){
					return data;
				}
			}
		}
	}
});