$(document).ready(function() 
{
	// initialize graph 1 with all necessary options
	
	/*var current_ticker = "MSFT";
	var current_start_date = "init";
	var current_end_date = "init";*/
			
	var blockRedraw = false;
			
	g = new Dygraph(document.getElementById("graph_price"),
	"{{ price_csv }}",
	{
		height: 250,
		labels: ["Date", "Price"],
		fillGraph: true,
		highlightCallback: function(e, x, pts, row) 
		{
			var sel = g.getSelection();
			g2.setSelection(sel);
		},
					
		unhighlightCallback: function(e, x, pts, row) 
		{					
			g.clearSelection();
			g2.clearSelection();
		},
				
		drawCallback: function(me, initial) 
		{
			if (blockRedraw || initial) return;
			blockRedraw = true;
			var range = me.xAxisRange();
	                
	        g2.updateOptions({
	        	dateWindow: range,
	        });
	                
	        blockRedraw = false;
		},
		colors: ["purple"]
	}); // end of g1 initialization
			
			
	// initialize graph 2 with all necessary options
	g2 = new Dygraph(document.getElementById("graph_pnl"),
	"{{ pnl_csv }}",
	{
		height: 200,
		labels: ["Date", "PnL"],
		fillGraph: true,
		highlightCallback: function(e, x, pts, row) {
			var sel = g2.getSelection();
			g.setSelection(sel)
		},
				
		unhighlightCallback: function(e, x, pts, row) {					
			g2.clearSelection()
			g.clearSelection()
		},
				
		drawCallback: function(me, initial) {
			if (blockRedraw || initial) return;
			blockRedraw = true;
			var range = me.xAxisRange();
	                
			g.updateOptions({
				dateWindow: range,
			});
	                
			blockRedraw = false;
		},
				
		colors: ["blue"],
		showRangeSelector: true,
		rangeSelectorPlotStrokeColor: "white",
		rangeSelectorPlotFillColor: "white", 
		interactionModel: Dygraph.Interaction.defaultModel
			
	}); // end of g2 initialization
			
	var zeropad = Dygraph.zeropad;
	$("#view1 .graph_block").mouseup(function()
	{
		var ticker = $("#id_ticker").val();
		var range = g.xAxisRange();
		var d0 = new Date(range[0]);
		var d1 = new Date(range[1]);

		var start_month = zeropad(d0.getMonth() + 1);
		var start_day = zeropad(d0.getDate());
		var start_year = "" + d0.getFullYear();

		var start = start_month + "/"
		+ start_day + "/" + start_year;

		var end_month = zeropad(d1.getMonth() + 1);
		var end_day = zeropad(d1.getDate());
		var end_year = "" + d1.getFullYear();

		var end = end_month + "/"
		+ end_day + "/" + end_year;
		
		$("#date1").val(start);
		$("#date2").val(end);

		$.ajax({
			url : "/display1/",
			type : "POST",
			data : {
				ticker : ticker,
				start : start,
				end : end,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data) 
			{
				$("#stats").html(
					"mean: " + received_data.stats.mean + "<br>"
					+ "stdev: " + received_data.stats.stdev + "<br>"
					+ "beta: " + received_data.stats.beta + "<br>");
			},
			error : function(xhr, errmsg, err) 
			{
				alert(xhr.status + ": errmsg = " + errmsg + ": " + xhr.responseText);
			}
		});
	});
			
	// initialize date-pickers 
	$(".date").datepick(
	{
		showOnFocus: false,
		showTrigger: '<img src="http://jqueryui.com/resources/demos/datepicker/images/calendar.gif">',
	});
			
	// stock form submission
	$("#options_button_view1").click(function()
	{
		$("#errors").html("");
		var ticker = $("#id_ticker").val();
		var input_startdate = $("#date1").val();
		var input_enddate = $("#date2").val();
		var start;
		var end;

		// form validation
		if (!ticker)
		{
			$("#errors").append("Please enter a ticker. <br>");
			return false;
		}
						
		if (!input_startdate)
		{ start = Date.parse("01/01/1980 00:00:00"); }
						
		else
		{ start = Date.parse(input_startdate + " 00:00:00"); }
						
		if (!input_enddate)
		{ end = new Date(); }
						
		else
		{ end = Date.parse(input_enddate + " 24:00:00"); }
						
		if (Date.parse(input_startdate) > Date.parse(input_enddate))
		{
			$("#errors").append("The start date cannot be later than the end date. <br>");
			return false;
		}
		
		// upon successful validation, execute the following ajax:
						
		$.ajax({
			url : "/display1/",
			type : "POST",
			data : {
				ticker : ticker,
				start : input_startdate,
				end : input_enddate,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data) {
				g.updateOptions({
					labels : ["Date", "Price"],
					file : received_data.csv.price_csv,
					dateWindow : [start,end ]
				});
				$("#stats").html
				(
					"mean: " + received_data.stats.mean + "<br>"
					+ "stdev: " + received_data.stats.stdev + "<br>"
					+ "beta: " + received_data.stats.beta + "<br>");
			},
			error : function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
				+ ": " + xhr.responseText);
			}
		});
		
		$.ajax({
			url : "/googlefinanceapi/",
			type : "POST", 
			data : {
				ticker : ticker,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data) {
				alert(received_data);
			}, 
			error : function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
				+ ": " + xhr.responseText);
			},
		});
						
		return false;
	}); // end stock form submission
	
	
	// momentum form submission
	$("#momentum_button").click(function()
	{
		var ticker = $("#id_ticker").val();
		var start = $("#date1").val();
		var end = $("#date2").val();
		var minIncrease = $("#min_increase").val();
		var N = $("#N_consecutive_days").val();
		var D = $("#D_days_after").val();
		var shares = $("#number_of_shares").val();
		
		$.ajax({
			url : "/momentum/",
			type : "POST",
			data : {
				ticker : ticker,
				start : start,
				end : end,
				minIncrease : minIncrease,
				N : N,
				D : D,
				shares : shares,
				csrfmiddlewaretoken : '{{ csrf_token }}'
			},
			success : function(received_data)
			{
				g2.updateOptions({
					file : received_data.csv.cum_pnl_csv
				});
			},
			error : function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
				+ ": " + xhr.responseText);
			}
		});
		return false;
		
	});
	
	
			
	$(":checkbox").click(function()
	{
		if ($("#0").is(":checked") && $("#1").is(":checked"))
		{
			$("#graph_price").show();
			$("#graph_price").height(350);
			g.resize();
			g.updateOptions({showRangeSelector: false});
					
			$("#graph_pnl").show();
			$("#graph_pnl").height(200);
			g2.resize();
		}
		else if ($("#0").is(":checked") && !($("#1").is(":checked")))
		{
			$("#graph_price").show();
			$("#graph_price").height(500);
			g.resize();
			g.updateOptions({
				showRangeSelector: true, 
				rangeSelectorPlotStrokeColor: "white",
				rangeSelectorPlotFillColor: "white", 
				interactionModel: Dygraph.Interaction.defaultModel
			});
					
			$("#graph_pnl").hide();
		}
		else if (!($("#0").is(":checked")) && $("#1").is(":checked"))
		{
			$("#graph_price").hide();
					
			$("#graph_pnl").show();
			$("#graph_pnl").height(500);
			g2.resize();
					
		}
		else 
		{
			$("#graph_price").hide();
			$("#graph_pnl").hide();
		}
				
	});
			
	$("#settlement_button").click(function()
	{
		settlement_start = $("#settlement_start").val();
		settlement_end = $("#settlement_end").val();
		payment = $("#monthly_payment").val();
		number_of_payments = $("#number_of_payments").val();
						
		$.ajax({
			url: "/settlement/",
			type: "GET",
			dataType: "json",
			data: {
				start: settlement_start,
				end: settlement_end,
				amount: payment,
				N: number_of_payments
			},
			success: function(received_data) {
				$("#settlement_table").append(
					"<tr> \
					 <td>" + settlement_start + "</td> \
					 <td>" + settlement_end + "</td> \
					 <td>" + payment + "</td> \
					 <td>" + number_of_payments + "</td> \
					 <td>" + received_data.price_upper + "</td> \
					 </tr>"
				);
								
			},
			error: function(xhr, errmsg, err) {
				alert(xhr.status + ": errmsg = " + errmsg
				+ ": " + xhr.responseText);
			}
		});
						
		return false;
	}); // end settlement form submission
			
}); // end ready

