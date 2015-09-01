'use strict';

(function(){

  $.fn.setupNavigation = function() {
    var hoverClass = 'active';
    
    // Set tabIndex to -1 so that links can't receive focus until menu is open
    $(this).find('> li > a').next('ul').find('a').attr('tabIndex',-1);
    $(this).find('> li > ul > li > a').next('ul').find('a').attr('tabIndex',-1);
    
    $(this).find('> li > a').hover(function(){
      $(this).closest('ul').find('.'+ hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
    });
    $(this).find('> li > ul > li > a').hover(function(){
      $(this).closest('ul').find('.'+ hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
    });
    $(this).find('> li > ul > li > ul > li > a').hover(function(){
      $(this).closest('ul').find('.'+ hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
    });
    $(this).find('> li > a').focus(function(){
      $(this).closest('ul').find('.'+ hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
      $(this).next('ul')
        .addClass(hoverClass)
        .find('a').attr('tabIndex',0);
    });
    $(this).find('> li > ul > li > a').focus(function(){
      $(this).closest('ul').find('.'+ hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
      $(this).next('ul')
        .addClass(hoverClass)
        .find('a').attr('tabIndex',0);
    });
    $(this).find('> li > ul > li > ul > li > a').focus(function(){
      $(this).closest('ul').find('.'+hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
      $(this).next('ul')
        .addClass(hoverClass)
        .find('a').attr('tabIndex',0);
    });

    // Hide menu if click or focus occurs outside of navigation
    $(this).find('a').last().keydown(function(e){
      if(e.keyCode === 9) {
        // If the user tabs out of the navigation hide all menus
        $('.'+hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1);
      }
    });
    $(document).click(function(){ $('.'+hoverClass).removeClass(hoverClass).find('a').attr('tabIndex',-1); });
    
    $(this).click(function(e){
      e.stopPropagation();
    });
  };

  $.fn.setupMobileNavigation = function(navName) {
    var ShowObj = function(top){
      this.height = 'auto';
      this.width = 'auto';
      this.margin = 'auto';
      this.padding = '10px 0px 0px 0px';
      this['line-height'] = 'inherit';
      this.opacity = '1';
      this.overflow = 'visible';
      this['pointer-events'] = 'auto';
      this['white-space'] = 'nowrap';
      this.visibility = 'visible';
      this['z-index'] = '999';
      if(top !== null){//excludes top css for back buttons, defaults to 84px unless otherwise set
        var topDefault = '84px';
        if($('.browsehappy').is(':visible')){
          topDefault = '134px'; 
        }
        this.top = typeof top === 'undefined' ? topDefault : top;
      }
    };
    
    $(navName + ' > li > a').click(function(e){
      e.preventDefault();
      if($(this).attr('aria-pressed') === 'false'){
        $(navName + ' .submenu-1').css(new ShowObj());
        $(this).attr('aria-pressed', 'true');
        $('.submenu-1 > li:first-child > a').focus();
      }
      else{
        $(navName + ' .submenu-1, ' + navName + ' .submenu-2, ' + navName + ' .submenu-3').css('visibility', 'hidden');
        $(this).attr('aria-pressed', 'false');
      }
    });

    $('ul' + navName + ' > li > ul li > a, ul' + navName + ' > li > ul li').click(function(e){
      e.stopPropagation();
      var currMenu = $(this).closest('ul'),
        currLevel = currMenu.attr('class'),
        targetLevel;
      if($(this).hasClass('dropdown') || $(this).parent().hasClass('dropdown')){
        e.preventDefault();
        targetLevel = parseInt(currLevel.charAt(currLevel.length-1))+1;
        if(this.nodeName === 'LI'){
          var indexLI = $(this).index()+1,
            targetMenu = $(this).children('.submenu-' + targetLevel),
            top;
          if($('.browsehappy').is(':visible')){
            console.log(targetLevel);
            top = targetLevel === 2 ? -23*indexLI + 8 + 'px': -23*indexLI + 5 + 'px';
          }
          else{
            top = targetLevel === 2 ? -23*indexLI + 7 + 'px': -23*indexLI + 4 + 'px';
          }
          currMenu.css('visibility', 'hidden');
          $(this).attr('aria-expanded', 'true');
          targetMenu.css(new ShowObj(top));
          targetMenu.children('li:first-child').children('a').focus();
        }
        else if(this.nodeName === 'A'){
          var indexParentLI = $(this).parent().index()+1,
            targetParentMenu = $(this).next('.submenu-' + targetLevel),
            parentTop;
          if($('.browsehappy').is(':visible')){
            console.log(targetLevel);
            parentTop = targetLevel === 2 ? -23*indexParentLI + 8 + 'px': -23*indexParentLI + 5 + 'px';
          }
          else{
            parentTop = targetLevel === 2 ? -23*indexParentLI + 7 + 'px': -23*indexParentLI + 4 + 'px';
          }
          currMenu.css('visibility', 'hidden');
          $(this).parent().attr('aria-expanded', 'true');
          targetParentMenu.css(new ShowObj(parentTop));
          targetParentMenu.children('li:first-child').children('a').focus();
        }
      }
      else if($(this).hasClass('prevLevel') || $(this).parent().hasClass('prevLevel')){
        e.preventDefault();
        targetLevel = parseInt(currLevel.charAt(currLevel.length-1))-1;
        var targetPrevMenu = $(this).closest('.submenu-' + targetLevel);
        if(this.nodeName === 'LI'){
          currMenu.css('visibility', 'hidden');
          $(this).parent().closest('li.dropdown').attr('aria-expanded', 'false');
          targetPrevMenu.css(new ShowObj(null));
          targetPrevMenu.children('li:first-child').children('a').focus();
        }
        else if(this.nodeName === 'A'){
          currMenu.css('visibility', 'hidden');
          $(this).parent().parent().closest('li.dropdown').attr('aria-expanded', 'false');
          targetPrevMenu.css(new ShowObj(null));
          targetPrevMenu.children('li:first-child').children('a').focus();
        }
      }
    });

    $(this).find('ul' + navName + ' li:last-child a').keydown(function(e){
      if(e.keyCode === 9) {
        // If the user tabs out of the navigation hide all menus
        $(navName + ' .submenu-1, ' + navName + ' .submenu-2, ' + navName + ' .submenu-3').css('visibility', 'hidden');
        $(navName + ' > li > a').attr('aria-pressed', 'false');
      }
    });

    $(document).click(function(event) { 
        if(!$(event.target).closest(navName).length) {
            if($(navName + ' ul').is(':visible')) {
              $(navName + ' ul').css('visibility', 'hidden');
              $(navName + ' > li > a').attr('aria-pressed', 'false');
            }
        }        
    });

  };

  $('#mainMenu').setupNavigation();
  $('#secondaryMenu').setupNavigation();
  $('#mobileMenu').setupMobileNavigation('#mobileMenu');
  $('.simpleKendo').each(function(index, el){
    buildGrid(el);
  });
  
  function buildGrid(table){
    var base = {
      navigatable: true
    },
    pageable = {
      pageable: {
        pageSize: 20
      }
    },
    dynamic = {
      sortable: true,
      filterable: true,
    },
    newOptions = {};
    if($(table).data('pageable') === true){
      if($(table).data('dynamic') === true){
        $.extend(newOptions, pageable, dynamic);
      }
      else{
        $.extend(newOptions, pageable);
      }
    }
    else if($(table).data('dynamic') === true){
      if($(table).data('pageable') === true){
        $.extend(newOptions, dynamic, pageable);
      }
      else{
        $.extend(newOptions, dynamic);
      }
    }
    else{
      newOptions = base;
    }

    var grid = $(table).kendoGrid(newOptions);
    grid.data('kendoGrid').hideColumn('hiddenLink');
  }

})();