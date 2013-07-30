/******************************************************************/
		PYTHON GUIDE FOR KOLAPY PROJECT
/******************************************************************/

File Structure:

/kolapy_django
	/kolapy_django
		/extra      ***extraneous files, ignore***
		/templates
		backtester.py
		data_analysis.py
		fixed_income.py
		N_stock_analysis.py
		one_stock_analysis.py
		settings.py
		two_stock_analysis.py
		urls.py
		views_home.py
		views_html.py
		wsgi.py
	manage.py	



backtester.py

	class backtester
	-----------------------------------------------------------------------------------------------
	__init__(strategy, ticker, start, end)   Initialize backtester for given strategy 
											 executed on a ticker over a specified date range	
											 
	cps()									 Get cents per share from this backtester
	
	full_summary()							 -Return PNL and cumulative PNL in csv format for Dygraph
											 as well as cents per share from this backtester




data_analysis.py
(General static functions to be used by one stock, two stock, and N stock modules)

	------------------------------------------------------------------------------------------------
	dataframe(ticker)						 Get pandas dataframe from ticker
	
	name(ticker)							 Get full name of company from ticker
	
	typeahead(term)							 Get Python dictionary containing all ticker names that begin
											 with term string (key = ticker, value = company name)
											 
	csv(series, json)						 Get csv of time series (in order to draw Dygraph). Set 
											 json to True to get it into JSON format for an ajax call
	
	selection(series, start, end) 			 Get new series from original series and specified 
											 date range
											 
	exp_moving_average(series, alpha)		 Get exponential moving average of this series given alpha
											 (where alpha is the weight of the newest observation)
	



one_stock_analysis.py

	class osa
	------------------------------------------------------------------------------------------------
	__init__(ticker, json)					      Initialize a new osa object for given ticker
	
	summary_stats(start, end)				      Get mean and standard deviation of returns as well as beta 
											      for this ticker over the specified date range
											 
	full_summary(ticker, start, end, isInitial)   Get full summary for this osa object (the Price and PnL csv,
												  summary stats, and full name of company). Note: isInitial is 
												  set to True if this function is called when the user submits 
												  a request to home and false otherwise -- we keep track of 
												  this in order to determine whether the returned csv data for 
												  the Dygraphs should fit a JSON format.

two_stock_analyis.py

	class tsa
	------------------------------------------------------------------------------------------------
	__init__(ticker1, ticker2, json)			            Initialize a new tsa object for given pair
	
	cointegration_test(start, end)				            Return residuals csv (for Dygraph)
	
	full_summary(ticker1, ticker2, start, end, isInitial)   Get full summary for this tsa object to be returned
															to the ajax call (Price1, Price2 and residual csv. 
															Eventually this should return more information about
															the results of the Augmented Dickey Fuller Test as well
															as other two stock algorithms).


views_home.py

	-----------------------------------------------------------------------------------------------
	home(request)											display the homepage
	
	load_tab(request)										Return HTML that will populate the new tab
	
	google_finance_api(request)								return JSON object containing basic information 
															about ticker (company name, exchange, etc.)

	typeahead(request)										return JSON object containing all tickers that begin
															with term currently in the ticker field
															
	display_view1(request)									Update osa object based on user request and return 
															its full summary
															
	algorithm(request)										Run the Python strategy that the user inputted into 
															code block and return backtester results
															
	display_view2(request)									Update tsa object based on user request and return
															its full summary
															
	cointegration(request)									Test for cointegration on the specified stock pair and 
															date range and returns results
															
	settlement(request)										Returns the price of the fixed income specified by
															the user
															
															



/**********************************************************/
		TEMPLATES GUIDE
/**********************************************************/

File Structure:

/templates2
	/included_files
		/fundamental
		base.js
		view1.js
		view2.js
		view3.js
		view4.js
		kolapy_project.css
	/base.html
	view1.html
	view2.html
	view3.html
	view4.html
	templates_readme.txt
	
	
The /templates2 directory contains all HTML/CSS/JavaScript files for the Kolapy Project. base.html defines the main 
framework of the website -- it is where all other files are included and where the website skeleton 
is defined. As of now, it contains the HTML for the tabs as well as the for the initial view that the page displays
when a request is made to home. view<i>.html will be used to populate tab contents
each time the user adds a new tab. 

/included_files contains all static files (JavaScript and CSS). base.js contains general JavaScript/JQuery commands
that apply to all views and view<i>.js adds interactivity to all tabs displaying view i. All of these JavaScript files 
are essentially part of the same file (while kept separate, they are included together in base.html within the same 
$(document).ready(...) function) because they rely on some of the same global variables. /fundamental contains all 
third-party JavaScript/JQuery/CSS libraries for the Kolapy Project. 



