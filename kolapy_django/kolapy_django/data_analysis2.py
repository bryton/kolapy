import datetime as dt
import pandas as pd
from pandas.io.data import DataReader as dr
import numpy as np 

class data_analysis: 

    def __init__(self, ticker, json):
        df = dr(ticker, 'yahoo', dt.datetime(1980, 01, 01))
        pnl = pd.Series(np.zeros(len(df)), index=df.index)
        for i in xrange(1, len(pnl)): 
            pnl[pnl.index[i]] = df['Adj Close'][df.index[i]] - df['Adj Close'][df.index[i - 1]]
        df['PnL'] = pnl
        price_list = []
        pnl_list = []
        
        if json:
            newline = '\n'
        else:
            newline = '\\n'
        
        for date, row in df.T.iteritems():
            price_list.append(date.strftime('%Y-%m-%d') + ',' + str(row['Adj Close']) + newline)
            pnl_list.append(date.strftime('%Y-%m-%d') + ',' + str(row['PnL']) + newline)
        price_csv = 'Date,Price' + newline + ''.join(price_list) 
        pnl_csv = 'Date,PnL' + newline + ''.join(pnl_list)
        
        # cache values using object attributes
        self.ticker = ticker
        self.dataframe = df
        self.price_csv = price_csv
        self.pnl_csv = pnl_csv
        self.json = json
        
    # return statistical summary of ticker from start date to end date
    def summary_stats(self, startdate, enddate):
        adj = self.dataframe['Adj Close']
        start = dt.datetime.strptime(startdate, '%m/%d/%Y')
        end = dt.datetime.strptime(enddate, '%m/%d/%Y')
        selection = adj[np.logical_and(adj.index >= start, adj.index <= end)]
        return {'mean': selection.mean(), 'stdev': selection.std()}

    # return full summary to be delivered for ajax completion
    def full_summary(self, ticker, start, end, isInitial):
        if not ticker == self.ticker or (not isInitial and not self.json):
            self.__init__(ticker, True)
        csv = {'price_csv' : self.price_csv, 'pnl_csv' : self.pnl_csv}
        stats = self.summary_stats(start, end)
        return {'csv': csv, 'stats': stats}
        
    
    
    
    
    
