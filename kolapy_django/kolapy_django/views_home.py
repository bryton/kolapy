from django.http import HttpResponse
from django.shortcuts import render
import data_analysis2
import fixed_income
import json
import os.path

last_analysis = None

def home(request):
    global last_analysis
    last_analysis = data_analysis2.data_analysis('MSFT', False)
    summary = last_analysis.full_summary('MSFT', '01/01/2008', '01/01/2013', True)
    csv = summary['csv']
    return render(request, 'base2.html', {'price_csv': csv['price_csv'],
                                          'pnl_csv': csv['pnl_csv']})

def display(request):
    global last_analysis
    ticker = str(request.POST.get('ticker'))
    if not last_analysis.ticker == ticker:
        last_analysis = data_analysis2.data_analysis(ticker, True)
    response_data = last_analysis.full_summary(ticker, str(request.POST['start']), str(request.POST['end']), False)
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def tickers(request):
    tickers_file = os.path.join(os.path.dirname(__file__), 'symbols.txt').replace('\\', '/')
    tickers = open(tickers_file).read()
    return HttpResponse(tickers, mimetype='text/csv')

def settlement(request):
    amount = float(str(request.GET.get('amount')))
    N = int(str(request.GET.get('N')))
    start = str(request.GET.get('start'))
    end = str(request.GET.get('end'))
    response_data = fixed_income.fixed_income_price(amount, N, start, end)
    return HttpResponse(json.dumps(response_data), content_type="application/json")



