var blockRedraw = false;
var g_price = new Array();

g_price[0] = 
	new Dygraph(document.getElementById("graph_price0"), "{{ price_csv }}", 
	{
		height : 200,
		labels : [ "Date", "Price" ],
		fillGraph : true,
		highlightCallback : function(e, x, pts, row) {
			var sel = g_price[0].getSelection();
			g_pnl[0].setSelection(sel);
		},
	
		unhighlightCallback : function(e, x, pts, row) {
			g_price[0].clearSelection();
			g_pnl[0].clearSelection();
		},
	
		drawCallback : function(me, initial) {
			if (blockRedraw || initial)
				return;
			blockRedraw = true;
			var range = me.xAxisRange();
	
			g_pnl[0].updateOptions({
				dateWindow : range,
			});
	
			blockRedraw = false;
		},
		colors : [ "purple" ]
	});


var g_pnl = new Array();
g_pnl[0] = 
	new Dygraph(document.getElementById("graph_pnl0"), "{{ pnl_csv }}", {
		height : 200,
		labels : [ "Date", "PnL" ],
		fillGraph : true,
		stepPlot : true,
		highlightCallback : function(e, x, pts, row) {
			var sel = g_pnl[0].getSelection();
			g_price[0].setSelection(sel);
		},
	
		unhighlightCallback : function(e, x, pts, row) {
			g_pnl[0].clearSelection();
			g_price[0].clearSelection();
		},
	
		drawCallback : function(me, initial) {
			if (blockRedraw || initial)
				return;
			blockRedraw = true;
			var range = me.xAxisRange();
	
			g_price[0].updateOptions({
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


var zeropad = Dygraph.zeropad;
$(document).on("mouseup dblclick", ".view1_graph_block", function() {
	var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[0].substring(1, 2), 10);

	var ticker = $(".c" + tabIndex + ".id_ticker").val();
	var range = g_price[tabIndex].xAxisRange();
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
	
	$(".c" + tabIndex + ".date1").val(start);
	$(".c" + tabIndex + ".date2").val(end);
	
	$.ajax({
		url : "/display1/",
		type : "POST",
		data : {
			ticker : ticker,
			start : start,
			end : end,
			csrfmiddlewaretoken : '{{ csrf_token }}'
		},
		success : function(received_data) {
			$('.c' + tabIndex + ' [name="mean"]').html(
					received_data.stats.mean.toPrecision(5));
			$('.c' + tabIndex + ' [name="stdev"]').html(
					received_data.stats.stdev.toPrecision(5));
			$('.c' + tabIndex + ' [name="beta"]').html(
					received_data.stats.beta.toPrecision(5));

		},
		error : function(xhr, errmsg, err) {
			
		}
	});
});


// configure typeahead
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

	
// stock form submission
$(document).on("blur", ".id_ticker, .date1, .date2", function() {
	var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[0].substring(1, 2), 10);
	$(".c" + tabIndex + ".errors").html("");
	var ticker = $(".c" + tabIndex + ".id_ticker").val();
	var input_startdate = $(".c" + tabIndex + ".date1").val();
	var input_enddate = $(".c" + tabIndex + ".date2").val();
	var start;
	var end;

	// form validation
	if (!ticker) {
		$(".c" + tabIndex + ".errors").append(
		"Please enter a ticker. <br>");
		return false;
	}
	
	if (!input_startdate) {
		start = Date.parse("01/01/1980 00:00:00");
	}
	
	else {
		start = Date.parse(input_startdate + " 00:00:00");
	}

	if (!input_enddate) {
		end = new Date();
	}

	else {
		end = Date.parse(input_enddate + " 24:00:00");
	}

	if (Date.parse(input_startdate) > Date.parse(input_enddate)) {
		$(".c" + tabIndex + ".errors").append("The start date cannot be later than the end date. <br>");
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
			g_price[tabIndex].updateOptions({
				labels : [ "Date", "Price" ],
				file : received_data.csv.price_csv,
				dateWindow : [ start, end ]
			});
			$('.c' + tabIndex + ' [name="mean"]').html(
					received_data.stats.mean.toPrecision(5));
			$('.c' + tabIndex + ' [name="stdev"]').html(
					received_data.stats.stdev.toPrecision(5));
			$('.c' + tabIndex + ' [name="beta"]').html(
					received_data.stats.beta.toPrecision(5));
			$(".c" + tabIndex + " h3")
			.html(received_data.name);
		},
		error : function(xhr, errmsg, err) {
			alert(xhr.status + ": errmsg = " + errmsg + ": "
					+ xhr.responseText);
		}
	});

	return false;
}); // end stock form submission

var editor = new Array();

editor[0] = 
	CodeMirror.fromTextArea(document.getElementById("code0"), {
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

// Algorithm button function (Run)
$(document).on("click", ".algorithm_button", function() {
	var tabIndex = parseInt($(this).attr("class").replace(/\s+/, " ").split(" ")[0].substring(1, 2), 10);
	var ticker = $(".c" + tabIndex + ".id_ticker").val();
	var start = $(".c" + tabIndex + ".date1").val();
	var end = $(".c" + tabIndex + ".date2").val();
	var code = editor[tabIndex].getValue();
	$.ajax({
		url : "/algorithm/",
		type : "POST",
		data : {
			ticker : ticker,
			start : start,
			end : end,
			code : code,
			csrfmiddlewaretoken : '{{ csrf_token }}'
		},
		success : function(received_data) {
			g_pnl[tabIndex].updateOptions({
				file : received_data.csv.cum_pnl_csv
			});
		},
		error : function(xhr, errmsg, err) {
			alert(xhr.status + ": errmsg = " + errmsg + ": "
					+ xhr.responseText);
		}
	});
	return false;
}); // end algorithm button click (Run)


