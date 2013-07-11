$(document).ready(function() {
			
			// initialize graph 1 with all options
	
			var current_ticker = "MSFT";
			var blockRedraw = false;
			
			g = new Dygraph(document.getElementById("graphdiv"), // containing div
			"{{ price_csv }}",
			{
				labels: ["Date", "Price"],
				highlightCallback: function(e, x, pts, row) {
					var sel = g.getSelection();
					g2.setSelection(sel)
				},
					
				unhighlightCallback: function(e, x, pts, row) {					
					g.clearSelection()
					g2.clearSelection()
				},
				
				drawCallback: function(me, initial) {
	                if (blockRedraw || initial) return;
	                blockRedraw = true;
	                var range = me.xAxisRange();
	                
	                g2.updateOptions({
	                    dateWindow: range,
	                });
	                
	                blockRedraw = false;
	                
	                var zeropad = Dygraph.zeropad;
	                var d0 = new Date(range[0]);
	                var d1 = new Date(range[1]);
	                
	                var start_month = zeropad(d0.getMonth() + 1);
	                var start_day = zeropad(d0.getDate());
	                var start_year = "" + d0.getFullYear();
	                
	                var start_date = start_month + "/" + start_day + "/" + start_year;
	                
	                var end_month = zeropad(d1.getMonth() + 1);
	                var end_day = zeropad(d1.getDate());
	                var end_year = "" + d1.getFullYear();
	                
	                var end_date = end_month + "/" + end_day + "/" + end_year;
	                
	                $.ajax({
						url : "/display/",
						type : "POST",
						data : {
							ticker : current_ticker,
							start : start_date,
							end : end_date,
							csrfmiddlewaretoken : '{{ csrf_token }}'
						},
						success : function(received_data) {
							$("#stats").html
							(
								"mean: " + received_data.stats.mean + "<br>"
								+ "stdev: " + received_data.stats.stdev + "<br>"
							)
						},
						error : function(xhr, errmsg, err) {
							alert(xhr.status + ": errmsg = " + errmsg
									+ ": " + xhr.responseText);
						}
					});
	            },
				colors: ["purple"]
			});
			
			// initialize graph 2 with all options
			g2 = new Dygraph(document.getElementById("graphdiv2"),
			"{{ pnl_csv }}",
			{
				labels: ["Date", "PnL"],
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
				rangeSelectorPlotFillColor: "white"
			
			});
			
			// initialize date-pickers 
			$(".date").datepick(
					{
						showOnFocus: false,
						showTrigger: '<img src="http://jqueryui.com/resources/demos/datepicker/images/calendar.gif">',
					});
			
			// initialize check-boxes
			$("#graph_block input[type=checkbox]").click(function()
					{
						
					});
			
			var graph_redraw_ajax = function(input_ticker, input_startdate, input_enddate)
			{
				$.ajax({
					url : "/display/",
					type : "POST",
					data : {
						ticker : input_ticker,
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
						g2.updateOptions({
							labels: ["Date", "PnL"],
							file: received_data.csv.pnl_csv,
							dateWindow: [start, end]
						});
						$("#stats").html
						(
							"mean: " + received_data.stats.mean + "<br>"
							+ "stdev: " + received_data.stats.stdev + "<br>"
						)
					},
					error : function(xhr, errmsg, err) {
						alert(xhr.status + ": errmsg = " + errmsg
								+ ": " + xhr.responseText);
					}
				});
			};
			
			// stock form submission
			$("#ticker_button").click(function()
					{
						$("#errors").html("");
						var input_ticker = $("#id_ticker").val();
						var input_startdate = $("#date1").val();
						var input_enddate = $("#date2").val();
						
						// form validation
						if (!input_ticker)
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
						
						current_ticker = input_ticker;
						// upon successful validation, execute the following ajax:
						graph_redraw_ajax(input_ticker, input_startdate, input_enddate);
						
						return false;
					}); // end stock form submission
			
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

