$(document).ready(function()
{
	var ticker1;
	var ticker2;
	var start_string;
	var end_string;
	var start;
	var end;
	
	var blockRedraw = false;
	var div1 = "graph_price1";
	var div2 = "graph_price2";
	
	if ("{{ flip }}" == "True")
	{
		var t = div1;
		div1 = div2;
		div2 = t;
	}
	
	g_stock1 = new Dygraph(document.getElementById(div1),
	"{{ price_csv1 }}",
	{
		labels: ["Date", "Price"],
		fillGraph: true,

	}); // end of g1 initialization
	
	g_stock2 = new Dygraph(document.getElementById(div2),
	"{{ price_csv2 }}",
	{
		labels: ["Date", "PnL"],
		fillGraph: true,
	}); // end of g2 initialization
	
	if ("{{ flip }}" == "True")
	{
		var t = g_stock1;
		g_stock1 = g_stock2;
		g_stock2 = t;
	}
	
	g_spread = new Dygraph(document.getElementById("graph_spread"));
	
	g_stock1.updateOptions({
		colors: ["purple"],
		highlightCallback: function(e, x, pts, row) {
			g_stock2.setSelection(row + g_stock2.numRows() - g_stock1.numRows());
		},
		unhighlightCallback: function(e, x, pts, row) {					
			g_stock1.clearSelection();
			g_stock2.clearSelection();
		}, 
		drawCallback: function(me, initial) {
            if (blockRedraw || initial) return;
            blockRedraw = true;
            var range = me.xAxisRange();
            
            g_stock2.updateOptions({
                dateWindow: range,
            });
            
            blockRedraw = false;
		}
	});
	
	g_stock2.updateOptions({
		colors: ["blue"],
		highlightCallback: function(e, x, pts, row) {
			g_stock1.setSelection(row - g_stock2.numRows() + g_stock1.numRows());
		},
		unhighlightCallback: function(e, x, pts, row) {					
			g_stock1.clearSelection();
			g_stock2.clearSelection();
		},
		drawCallback: function(me, initial) {
	        if (blockRedraw || initial) return;
            blockRedraw = true;
            var range = me.xAxisRange();
            g_stock1.updateOptions({
            	dateWindow: range,
            });
	                
            blockRedraw = false;
		},				
		showRangeSelector: true,
		rangeSelectorPlotStrokeColor: "white",
		rangeSelectorPlotFillColor: "white",
	});
	
	$("#options_button_view2").click(function(){

		ticker1 = $("#id_ticker1").val();
		ticker2 = $("#id_ticker2").val();
		start_string = $("#date1_2").val();
		end_string = $("#date2_2").val();
		start = Date.parse(start_string + " 00:00:00"); 
		end = Date.parse(end_string + " 24:00:00");
		
		
		$.ajax({
			url : "/display2/",
			type : "POST",
			data : {
				ticker1 : ticker1,
				ticker2 : ticker2,
				start : start_string,
				end : end_string,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data) {
				var file1 = received_data.csv.price_csv1;
				var file2 = received_data.csv.price_csv2;
				if (received_data.flip == "True")
				{
					var t = file1;
					file1 = file2;
					file2 = t;
				}
				
				g_stock1.updateOptions({
					labels : ["Date", "Price"],
					file : file1,
					dateWindow : [start, end]
				});
				g_stock2.updateOptions({
					labels: ["Date", "Price"],
					file: file2,
					dateWindow: [start, end]
				});
			},
			error : function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
						+ ": " + xhr.responseText);
			}
			
		});
		
		return false;
	});
	
	$("#cointegrate_button").click(function(){
		$.ajax({
			url : "/cointegrate/",
			type : "POST", 
			data : 
			{
				ticker1 : ticker1,
				ticker2 : ticker2,
				start : start_string,
				end: end_string,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data)
			{
				g_spread.updateOptions({
					labels: ["Date", "Residual", "Upper Bound", "Lower Bound"],
					file: received_data.csv,
					colors: ["blue", "red", "red"],
					"Upper Bound" : {fillGraph : true},
					"Lower Bound" : {fillGraph : true}
				});
			},
			error : function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
						+ ": " + xhr.responseText);
			}
			
		});
		
		return false;
	});
});