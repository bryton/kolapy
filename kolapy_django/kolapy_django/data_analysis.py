import datetime as dt
from pandas.io.data import DataReader as dr
import StringIO
from django.http import HttpResponse


def data_to_csv(ticker):
    stockData = dr(ticker, 'yahoo', dt.datetime(1980,01,01))
    s = []
    for day in stockData.itertuples():
        csvDay = day[0].strftime('%Y-%m-%d') + ',' + str(day[6]) + "\\n"
        s.append(csvDay)
    return ''.join(s)

# return csv-formatted string of Adjusted Closing prices
def csv(ticker):
    df = dr(ticker, 'yahoo', dt.datetime(1980,01,01))
    adj = df['Adj Close']
    output = StringIO.StringIO()
    adj.to_csv(output,sep=',')
    val=output.getvalue()
    output.close()
    return val

    
    
    


    
        
    
        