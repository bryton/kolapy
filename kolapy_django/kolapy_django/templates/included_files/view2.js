	var div1 = "graph_price10";
	var div2 = "graph_price20";
	
	if ("{{ flip }}" == "True")
	{
		var t = div1;
		div1 = div2;
		div2 = t;
	}

	g_stock1 = new Array(); /*
	g_stock1[0] = new Dygraph(document.getElementById("graph_price10"),
	"{{ price_csv1 }}",
	{});
	{
		labels: ["Date", "Price"],
		fillGraph: true
	}); // end of g1 initialization
	
	g_stock2 = new Dygraph(document.getElementById(div2),
	"{{ price_csv2 }}",
	{
		labels: ["Date", "PnL"],
		fillGraph: true,
	}); // end of g2 initialization
	
	if ("{{ flip }}" == "True")
	{
		var t = g_stock1[0];
		g_stock1[0] = g_stock2[0];
		g_stock2[0] = t;
	}
	
	g_spread = new Array();
	g_spread[0] = new Dygraph(document.getElementById("graph_spread0"));
	
	g_stock1[0].updateOptions({
		colors: ["purple"],
		highlightCallback: function(e, x, pts, row) {
			g_stock2[0].setSelection(row + g_stock2[0].numRows() - g_stock1[0].numRows());
		},
		unhighlightCallback: function(e, x, pts, row) {					
			g_stock1[0].clearSelection();
			g_stock2[0].clearSelection();
		}, 
		drawCallback: function(me, initial) {
            if (blockRedraw || initial) return;
            blockRedraw = true;
            var range = me.xAxisRange();
            
            g_stock2[0].updateOptions({
                dateWindow: range,
            });
            
            blockRedraw = false;
		}
	});
	
	g_stock2[0].updateOptions({
		colors: ["blue"],
		highlightCallback: function(e, x, pts, row) {
			g_stock1[0].setSelection(row - g_stock2[0].numRows() + g_stock1[0].numRows());
		},
		unhighlightCallback: function(e, x, pts, row) {					
			g_stock1[0].clearSelection();
			g_stock2[0].clearSelection();
		},
		drawCallback: function(me, initial) {
	        if (blockRedraw || initial) return;
            blockRedraw = true;
            var range = me.xAxisRange();
            g_stock1[0].updateOptions({
            	dateWindow: range,
            });
	                
            blockRedraw = false;
		},				
		showRangeSelector: true,
		rangeSelectorPlotStrokeColor: "white",
		rangeSelectorPlotFillColor: "white",
	});
	
	$("#options_button_view2").click(function(){

		var ticker1 = $(".c0.id_ticker1").val();
		var ticker2 = $(".c0.id_ticker2").val();
		var start_string = $(".c0.view2_date1").val();
		var end_string = $(".c0.view2_date2").val();
		var start = Date.parse(start_string + " 00:00:00"); 
		var end = Date.parse(end_string + " 24:00:00");
		
		
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
				
				g_stock1[0].updateOptions({
					labels : ["Date", "Price"],
					file : file1,
					dateWindow : [start, end]
				});
				g_stock2[0].updateOptions({
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
	
	$(".cointegrate_button").click(function(){
		var ticker1 = $(".c0.id_ticker1").val();
		var ticker2 = $(".c0.id_ticker2").val();
		var start_string = $(".c0.view2_date1").val();
		var end_string = $(".c0.view2_date2").val();
		
		
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
				g_spread[0].updateOptions({
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
	});*/
