import numpy as np
import pandas as pd
import data_analysis as da

class backtester:
    
    # initialize a backtester for a given strategy
    def __init__(self, strategy, ticker, start, end, minIncrease, N, D, shares):
        prices = da.dataframe(ticker)['Adj_Close']
        prices = da.selection(prices, start, end)
        signals = strategy(prices, start, end, minIncrease, N, D, shares)
        self.pnl = pd.Series(np.zeros(len(prices)), index=prices.index)
        
        shares = 0
        for i in xrange(len(self.pnl)):
            self.pnl[i] = (prices[i]-prices[i-1])*shares
            print self.pnl[i]
            shares += signals[i]
    # run the test for the given strategy/series pair
    def csv(self):
        return {'csv' : {'pnl_csv' : da.csv(self.pnl, True), 'cum_pnl_csv' : da.csv(np.cumsum(self.pnl), True)}}
    
