import numpy as np
import pandas as pd
import data_analysis as da

class backtester:
    
    # initialize a back-tester for a given strategy
    def __init__(self, strategy, ticker, start, end):
        prices = da.dataframe(ticker)['Adj_Close']
        prices = da.selection(prices, start, end)
        self.signals = strategy(prices)
        self.pnl = pd.Series(np.zeros(len(prices)), index=prices.index)
        
        shares = 0
        for i in xrange(len(self.pnl)):
            self.pnl[i] = (prices[i]-prices[i-1])*shares
            shares += self.signals[i]
    
    def cps(self):
        cents = self.pnl[len(self.pnl)-1]*100.00
        cum_share_holdings = np.array(self.signals.cumsum())
        nonzero_share_holdings = np.nonzero(cum_share_holdings)
        shares = np.mean(nonzero_share_holdings)
        return cents/shares
    
    def full_summary(self):
        return {'csv' : {'pnl_csv' : da.csv(self.pnl, True), 'cum_pnl_csv' : da.csv(self.pnl.cumsum(), True)},
                'cps' : self.cps()}
