$(function() 
{
	var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'></span></li>"
	var tabs = $( "#tabs" ).tabs();
	var tabCounter = 2;
	
	$("#add_tab").click(function()
	{
		id = "view" + tabCounter;
		var label = "Tab " + tabCounter;
		var li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace(/#\{label\}/g, label));
		tabs.find( ".ui-tabs-nav" ).append( li );
		tabs.append( "<div id='" + id + "'><p>hello</p></div>" );
		tabs.tabs( "refresh" );
		tabCounter++;
	});
	
	 tabs.delegate( "span.ui-icon-close", "click", function() 
	 {
		 var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
		 $( "#" + panelId ).remove();
	 	tabs.tabs( "refresh" );
	 });
	
});
