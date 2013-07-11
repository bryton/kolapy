import datetime as dt
import pandas as pd
from pandas.io.data import DataReader as dr
import numpy as np 
import StringIO

class data_analysis: 
    current_ticker = None;
    current_dataframe = None;
    
    # return stock data-frame for ticker
    def finance_data(self, ticker):
        if ticker == self.current_ticker and not self.current_dataframe.empty:
            return self.current_dataframe
        else: 
            df = dr(ticker, 'yahoo', dt.datetime(1980, 01, 01))
            pnl = pd.Series(np.zeros(len(df)), index=df.index)
            for i in xrange(1, len(pnl)): 
                pnl[pnl.index[i]] = df['Adj Close'][df.index[i]] - df['Adj Close'][df.index[i - 1]]
            df['PnL'] = pnl
            self.current_ticker = ticker
            self.current_dataframe = df
            return df
    
    
    def data_to_csv(self, ticker):
        df = self.finance_data(ticker)
        s = []
        for day in df.itertuples():
            csvDay = day[0].strftime('%Y-%m-%d') + ',' + str(day[6]) + ',' + str(day[7]) + '\\n'
            s.append(csvDay)
        return 'Date,Price,PnL\\n' + ''.join(s)
    
    def data_to_csv2(self, ticker):
        df = self.finance_data(ticker)
        s = []
        for day in df.itertuples():
            csvDay = day[0].strftime('%Y-%m-%d') + ',' + str(day[6]) + ',' + str(day[7]) + '\n'
            s.append(csvDay)
        return 'Date,Price,PnL\n' + ''.join(s)
    
    # return csv-formatted string of Adjusted Closing prices
    def adj_closed_csv(self, ticker):
        df = self.finance_data(ticker)
        adj = df['Adj Close']
        output = StringIO.StringIO()
        adj.to_csv(output, sep=',')
        val = output.getvalue()
        output.close()
        return val
    
    def pnl_csv(self, ticker):
        df = self.finance_data(ticker)
        pnl = df['PnL']
        output = StringIO.StringIO()
        pnl.to_csv(output, sep=',')
        val = output.getvalue()
        output.close()
        return val
    
    # return csv-formatted string of Adjusted Closing prices and PnL
    def csv_price_pnl(self, ticker):
        df = self.finance_data(ticker)
        data = pd.concat([df['Adj Close'], df['PnL']], axis=1)
        output = StringIO.StringIO()
        data.to_csv(output, sep=',')
        val = output.getvalue()
        output.close()
        return val   

    def price_pnl_csv(self,ticker):
        return {"price_csv" : self.adj_closed_csv(ticker), "pnl_csv" : self.pnl_csv(ticker)}


    # return statistical summary of ticker from start date to end date
    def summary_stats(self, ticker, startdate, enddate):
        df = self.finance_data(ticker)
        adj = df['Adj Close']
        start = dt.datetime.strptime(startdate, "%m/%d/%Y")
        end = dt.datetime.strptime(enddate, "%m/%d/%Y")
        selection = adj[np.logical_and(adj.index >= start, adj.index <= end)]
        return {"mean": selection.mean(), "stdev": selection.std()}

    # return full summary to be delivered for ajax completion
    def full_summary(self, ticker, start, end):
        csv = self.data_to_csv2(ticker)
        #csv = self.csv_price_pnl(ticker)
        stats = self.summary_stats(ticker, start, end)
        return {"csv": csv, "stats": stats}
        
        
            
