from django.http import HttpResponse
from django.shortcuts import render
from kolapy_django.forms import StockForm
import datetime as dt



from kolapy_django import data_analysis

def home(request):
    csv = data_analysis.data_to_csv('MSFT')
    form = StockForm()
    return render(request, 'home/base.html', {'form': form, 'csv': csv})

def display(request):
    val = data_analysis.csv(str(request.POST['ticker']))
    response = HttpResponse(mimetype='text/csv')
    response['Content-Disposition'] = 'attachment; filename=somefilename.csv'
    response.write(val)
    return response
    


