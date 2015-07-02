'use strict';

$('.dropdown a').on('mouseenter focus', function(){
	$(this).closest('.dropdown').addClass('active');
}).on('mouseleave blur', function(){
	$(this).closest('.dropdown').removeClass('active');
});