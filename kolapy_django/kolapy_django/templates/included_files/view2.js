	
	g_price1 = new Array();
	
	g_price2 = new Array();
	
	
	g_spread = new Array();
	
	
	$(document).on("blur", ".id_ticker1, .id_ticker2, .view2_date1, .view2_date2", function(){
		var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[1].substring(1, 2), 10);

		var ticker1 = $(".c" + tabIndex + ".id_ticker1").val();
		var ticker2 = $(".c" + tabIndex + ".id_ticker2").val();
		var start_string = $(".c" + tabIndex + ".view2_date1").val();
		var end_string = $(".c" + tabIndex + ".view2_date2").val();
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
				
				g_price1[0].updateOptions({
					labels : ["Date", "Price"],
					file : file1,
					dateWindow : [start, end]
				});
				g_price2[0].updateOptions({
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
	
	
	var zeropad = Dygraph.zeropad;
	$(document).on("mouseup dblclick", ".view2_graph_block", function() {
		var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[1].substring(1, 2), 10);

		var ticker1 = $(".c" + tabIndex + ".id_ticker1").val();
		var ticker2 = $(".c" + tabIndex + ".id_ticker2").val();
		var range = g_price1[tabIndex].xAxisRange();
		var d0 = new Date(range[0]);
		var d1 = new Date(range[1]);
		var start_month = zeropad(d0.getMonth() + 1);
		var start_day = zeropad(d0.getDate());
		var start_year = "" + d0.getFullYear();
		
		var start = start_month + "/" + start_day + "/"
		+ start_year;
		
		var end_month = zeropad(d1.getMonth() + 1);
		var end_day = zeropad(d1.getDate());
		var end_year = "" + d1.getFullYear();
		
		var end = end_month + "/" + end_day + "/" + end_year;
		
		// update start and end fields with the new values
		$(".c" + tabIndex + ".view2_date1").val(start);
		$(".c" + tabIndex + ".view2_date2").val(end);
	});
	
	
	$(".cointegrate_button").click(function(){
		alert("ii");
		var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[1].substring(1, 2), 10);
		
		var ticker1 = $(".c" + tabIndex + ".id_ticker1").val();
		var ticker2 = $(".c" + tabIndex + ".id_ticker2").val();
		var start_string = $(".c" + tabIndex + ".view2_date1").val();
		var end_string = $(".c" + tabIndex + ".view2_date2").val();
		
		
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
				g_spread[tabIndex] = new Dygraph(document.getElementById("graph_spread" + tabIndex));
				g_spread[tabIndex].updateOptions({
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
	

