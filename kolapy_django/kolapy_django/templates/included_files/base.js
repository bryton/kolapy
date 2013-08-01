/************************************************************************
 * base.js contains general JavaScript commands that apply to 
 * all views (one stock, two stock, etc.). It contains
 * the JavaScript for dynamically adding tabs and for constructing new
 * Dygraph and CodeMirror objects
 ************************************************************************/

// template for adding new tab to tab list (see element with id="tabs" in base.html)
var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'></span></li>"

tabCounter = 0;    // total number of times a tab has been added
tabListLength = 0; // current number of tabs

// initialize the tabs and make them sortable
var tabs = $("#tabs").tabs();
tabs.find(".ui-tabs-nav").sortable({
	axis : "x",
	stop : function() {
		tabs.tabs("refresh");
	}
});

$('#tab0 *').addClass("c0");


// create new tab and corresponding HTML content when new tab is clicked. 
// Then programmatically select new tab and open dialog box
$("#add_tab").click(function() {
	tabCounter++;
	tabListLength++;
	
	// create new tab with empty contents
	var id = "tab" + tabCounter;
	var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, "New Tab"));
	tabs.find(".ui-tabs-nav").append(li);

	// add HTML for current tab
	$.ajax({
		url : "/addtab/",
		type : "POST",
		data : {
			tabCounter : tabCounter,
			csrfmiddlewaretoken : '{{ csrf_token }}'
		},
		success : function(received_data) {
			tabs.append("<div id='" + id + "'>" + received_data.html + "</div>"); //add HTML
			tabs.tabs("refresh");												  // refresh tabs
			$( "#tabs" ).tabs("option", "active", tabListLength);				  // select this new tab
			$("#" + id + " *").addClass("c" + tabCounter);
			
		},
		error : function(xhr, errmsg, err) {
			alert(xhr.status + ": errmsg = " + errmsg + ": " + xhr.responseText);
		}

	});
	
	// open dialog box where user configures the tab (specifies the tab's title, selects view, etc.)
	dialog.dialog("open");
	
});

// construct dialog box
var dialog = $("#dialog").dialog({
	autoOpen : false,
	modal : true,
	buttons : {
		// when "Add" button is clicked, make the HTML on the tab page interactive
		Add : function() {
			makeInteractive();
			$(this).dialog("close");
		},

	},
	close : function() {
		form[0].reset();
	}
});

// configurations for submitting dialog box
var form = dialog.find("form").submit(function(event) {
	makeInteractive();
	dialog.dialog("close");
	event.preventDefault();
});


// make tabs closable
tabs.delegate("span.ui-icon-close", "click", function() {
	var panelId = $(this).closest("li").remove().attr("aria-controls");
	$("#" + panelId).remove();
	tabs.tabs("refresh");
	tabListLength--;
});

// set global tabIndex variable equal to currently activated tab
$(document).on("mousemove", ".view1_graph_block", function() 
{
	window.tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[1].substring(1, 2), 10);
});


// Add Dygraphs and code block for this tab
function makeInteractive()
{	
	// add newest price graph to g_price array
	g_price[tabCounter] = 
		new Dygraph(document.getElementById('graph_price' + tabCounter), '{{ price_csv }}', 
		{ 
			height : 200,
			labels : [ 'Date', 'Price' ], 
			fillGraph : true, 
			highlightCallback : function(e, x, pts, row) {
				var sel = g_price[tabIndex].getSelection();
				g_pnl[tabIndex].setSelection(sel);
				
			},
		
			unhighlightCallback : function(e, x, pts, row) {
				g_price[tabIndex].clearSelection();
				g_pnl[tabIndex].clearSelection();
			},
		
			drawCallback : function(me, initial) {
				if (blockRedraw || initial)
					return;
				blockRedraw = true;
				var range = me.xAxisRange();
		
				g_pnl[tabIndex].updateOptions({
					dateWindow : range,
				});
				
		
				blockRedraw = false;
			},
			colors : [ 'purple' ]
		});
	
	// add newest PnL graph to g_pnl array
	g_pnl[tabCounter] = 
		new Dygraph(document.getElementById("graph_pnl" + tabCounter), "{{ pnl_csv }}", {
			height : 200,
			labels : [ "Date", "PnL" ],
			fillGraph : true,
			stepPlot : true,
			highlightCallback : function(e, x, pts, row) {
				var sel = g_pnl[tabIndex].getSelection();
				g_price[tabIndex].setSelection(sel);
				
			},
		
			unhighlightCallback : function(e, x, pts, row) {
				g_pnl[tabIndex].clearSelection();
				g_price[tabIndex].clearSelection();
			},
		
			drawCallback : function(me, initial) {
				if (blockRedraw || initial)
					return;
				blockRedraw = true;
				var range = me.xAxisRange();
		
				g_price[tabIndex].updateOptions({
					dateWindow : range,
				});
		
				blockRedraw = false;
			},
		
			colors : [ "blue" ],
			showRangeSelector : true,
			rangeSelectorPlotStrokeColor : "white",
			rangeSelectorPlotFillColor : "white",
			interactionModel : Dygraph.Interaction.defaultModel
		
		});


	// add newest CodeMirror object to editor array
	editor[tabCounter] = 
		CodeMirror.fromTextArea(document.getElementById("code" + tabCounter), {
			mode : {
				name : "python",
				version : 2,
				singleLineStringErrors : false
			},
			lineNumbers : true,
			indentUnit : 4,
			tabMode : "shift",
			matchBrackets : true
		});
	
	$("#tabs ul:first li:eq(" + tabListLength + ") a").text($("#tab_title").val());
}


//configure typeahead for all ticker fields. 
$(document).on("focus", ".id_ticker", function() {
	$(".id_ticker").autocomplete({
		source: function(request, response)
		{
			$.ajax({
				 url: "/typeahead/",
				 type : "GET",
				 dataType: "json",
				 data : 
				 {
					 term : request.term
				 },
				 success: function(data) 
				 {
					 response($.map( data, function(v, i) 
					 {
						 return {
							 label: v.Symbol,
							 value: v.Symbol
						 };
					 }));
				 },
				 error : function(xhr, errmsg, err) 
				 {
						alert(xhr.status + ": errmsg = " + errmsg + ": "
								+ xhr.responseText);
				 }
			});
		},
		
	});
});

