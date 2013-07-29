var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'></span></li>"
tabCounter = 0;
tabListLength = 0;

var tabs = $("#tabs").tabs();

tabs.find(".ui-tabs-nav").sortable({
	axis : "x",
	stop : function() {
		tabs.tabs("refresh");
	}
});


$("#add_tab").click(function() {
	tabCounter++;
	tabListLength++;
	var id = "tab" + tabCounter;
	var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, "New Tab"));
	tabs.find(".ui-tabs-nav").append(li);

	
	$.ajax({
		url : "/addtab/",
		type : "POST",
		data : {
			tabCounter : tabCounter,
			csrfmiddlewaretoken : '{{ csrf_token }}'
		},
		success : function(received_data) {
			tabs.append("<div id='" + id + "'>" + received_data.html + "</div>");
			tabs.tabs("refresh");
			$( "#tabs" ).tabs("option", "active", tabListLength);
			
		},
		error : function(xhr, errmsg, err) {
			alert(xhr.status + ": errmsg = " + errmsg + ": " + xhr.responseText);
		}

	});
	dialog.dialog("open");
	
});


var dialog = $("#dialog").dialog({
	autoOpen : false,
	modal : true,
	buttons : {
		Add : function() {
			makeInteractive();
			$(this).dialog("close");
		},

	},
	close : function() {
		form[0].reset();
	}
});

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

$(document).on("mousemove", ".view1_graph_block", function() 
{
	window.tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[0].substring(1, 2), 10);
});


function makeInteractive()
{	
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



