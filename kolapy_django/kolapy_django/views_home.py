from django.http import HttpResponse
from django.shortcuts import render
import one_stock_analysis as osa
import two_stock_analysis as tsa
import backtester as bt
import fixed_income
import json
import urllib2

last_osa = None
last_tsa = None

#---------------------------------------------------------------------------------------   

def home(request):
    global last_osa
    global last_tsa
    last_osa = osa.one_stock_analysis('MSFT', False)
    last_tsa = tsa.two_stock_analysis('SCHD', 'SCHB', False)
    summary_osa = last_osa.full_summary('MSFT', '01/01/2008', '01/01/2013', True)
    summary_tsa = last_tsa.full_summary('SCHD', 'SCHB', '01/01/2008', '01/01/2013', True)
    csv_osa = summary_osa['csv']
    csv_tsa = summary_tsa['csv']
    return render(request, 'base.html', {'price_csv': csv_osa['price_csv'],
                                         'pnl_csv': csv_osa['pnl_csv'],
                                         'price_csv1' : csv_tsa['price_csv1'],
                                         'price_csv2' : csv_tsa['price_csv2'],
                                         'flip' : summary_tsa['flip']})
    
#---------------------------------------------------------------------------------------    

def google_finance_api(request):
    #prefix = "http://finance.google.com/finance/info?client=ig&q="
    prefix = "http://www.google.com/finance/info?infotype=infoquoteall&q="
    ticker = str(request.POST.get('ticker'))
    url = prefix + ticker
    u = urllib2.urlopen(url)
    content = u.read()
    response_data = json.loads(content[3:])
    return HttpResponse(response_data, content_type="application/json")
    
#---------------------------------------------------------------------------------------    
                                        
def display_view1(request):
    global last_osa
    ticker = str(request.POST.get('ticker'))
    if not last_osa.ticker == ticker:
        last_osa = osa.one_stock_analysis(ticker, True)
    response_data = last_osa.full_summary(ticker, str(request.POST.get('start')), str(request.POST.get('end')), False)
    return HttpResponse(json.dumps(response_data), content_type="application/json")

#---------------------------------------------------------------------------------------  

def algorithm(request):
    ticker = str(request.POST.get('ticker'))
    start = str(request.POST.get('start'))
    end = str(request.POST.get('end'))
    code = str(request.POST.get('code')) 
    print code
    exec code
    
    backtester = bt.backtester(strategy, ticker, start, end)
    response_data = backtester.full_summary()
    return HttpResponse(json.dumps(response_data), content_type="application/json")

#---------------------------------------------------------------------------------------   

def display_view2(request):
    global last_tsa
    ticker1 = str(request.POST.get('ticker1'))
    ticker2 = str(request.POST.get('ticker2'))
    start = str(request.POST.get('start'))
    end = str(request.POST.get('end'))
    if not last_tsa.ticker1 == ticker1 and not last_tsa.ticker2 == ticker2:
        if not last_tsa.ticker1 == ticker2 and not last_tsa.ticker2 == ticker1:
            last_tsa = tsa.two_stock_analysis(ticker1, ticker2, True)
            
    response_data = last_tsa.full_summary(ticker1, ticker2, start, end, False)
    return HttpResponse(json.dumps(response_data), content_type="application/json")

#---------------------------------------------------------------------------------------   

def cointegration(request):
    global last_tsa
    start = str(request.POST.get('start'))
    end = str(request.POST.get('end'))
    response_data = last_tsa.cointegration_test(start, end)
    return HttpResponse(json.dumps(response_data), content_type="application/json")

#---------------------------------------------------------------------------------------   

def settlement(request):
    amount = float(str(request.GET.get('amount')))
    N = int(str(request.GET.get('N')))
    start = str(request.GET.get('start'))
    end = str(request.GET.get('end'))
    response_data = fixed_income.fixed_income_price(amount, N, start, end)
    return HttpResponse(json.dumps(response_data), content_type="application/json")



