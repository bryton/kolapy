import data_analysis as da
import numpy as np
import pandas as pd

class one_stock_analysis:
    
    def __init__(self, ticker, json):
        self.ticker = ticker
        self.df = da.dataframe(ticker)
        self.df_spy = da.dataframe('SPY')
        self.price_csv = da.csv(self.df['Adj_Close'], json)
        pnl = self.df['Adj_Close'].diff()
        pnl[0] = 0
        self.pnl_csv = da.csv(pnl, json)
        self.json = json
#---------------------------------------------------------------------------------------   
       
    def summary_stats(self, start, end):
        selection = da.selection(self.df['Adj_Close'], start, end)
        selection_spy = da.selection(self.df_spy['Adj_Close'], start, end)
        returns = selection.pct_change()
        print returns
        returns_spy = selection_spy.pct_change()
        beta = returns.cov(returns_spy)/returns_spy.var()
        return {'mean': returns.mean(), 'stdev': returns.std(), 'beta': beta}
        
#---------------------------------------------------------------------------------------   
 
    def full_summary(self, ticker, start, end, isInitial):
        if not ticker == self.ticker or (not isInitial and not self.json):
            self.__init__(ticker, True)
        csv = {'price_csv' : self.price_csv, 'pnl_csv' : self.pnl_csv}
        stats = self.summary_stats(start, end)
        return {'csv' : csv , 'stats' : stats}
    
#---------------------------------------------------------------------------------------   

# The following is code for the momentum strategy. A strategy is a function that receives
# a time series as an input and outputs "signals" about whether to buy or sell on any given 
# date and the number of shares involved in the transaction (by performing a trade "on" a date,
# we mean at the time the market opens on that date). 

# This algorithm is as follows: 
    
    def momentum(self, prices, start, end, minIncrease, N, D, shares):
        signals = np.zeros(len(prices))
        signals = pd.Series(signals, index=prices.index)
        returns = prices.pct_change()
        run = 1
        for i in xrange(1, len(returns) - D):
            if returns[i] >= minIncrease:
                run += 1
            else:
                run = 1
                continue
            if run >= N:
                signals[i] += shares
                signals[i+D] -= shares
                run = 1
            
        return signals
                
        
        
        
        
        
        
        
        
