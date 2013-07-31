import numpy as np
import statsmodels.api as sm
import statsmodels.tsa.stattools as ts
from statsmodels.sandbox.tsa import movvar
import data_analysis as da
import pandas as pd


class two_stock_analysis:
    
    def __init__(self, ticker1, ticker2, json):
        self.df1 = da.dataframe(ticker1)
        self.df2 = da.dataframe(ticker2)
        self.ticker1 = ticker1
        self.ticker2 = ticker2
        self.price_csv1 = da.csv(self.df1['Adj_Close'], json)
        self.price_csv2 = da.csv(self.df2['Adj_Close'], json)
        pnl1 = self.df1['Adj_Close'].diff()
        pnl1[0] = 0
        pnl2 = self.df2['Adj_Close'].diff()
        pnl2[0] = 0
        self.pnl_csv1 = da.csv(pnl1, json)
        self.pnl_csv2 = da.csv(pnl2, json)
        self.json = json
        
        self.flip = 'False'
        if self.df2.index[0] > self.df1.index[0]:
            self.flip = 'True'
#---------------------------------------------------------------------------------------   
    
    def cointegration_test(self, start, end):
        x = da.selection(self.df1['Adj_Close'], start, end)
        y = da.selection(self.df2['Adj_Close'], start, end)
        ols_result = sm.OLS(x, y).fit()
        resid = ols_result.resid   
        
        # compute regression residuals
        adfuller_results = ts.adfuller(resid)
        print "cointegration: " + str(adfuller_results[1])
        bound = pd.Series(movvar(resid, 30)) ** 0.5
        resid_rolling_average = da.exp_moving_average(resid, 0.1)
        resid_with_bounds = np.array([resid_rolling_average, bound, -bound]).T
        columns = ['Residuals', 'Upper', 'Lower']
        resid_with_bounds_df = pd.DataFrame(resid_with_bounds, index=resid.index, columns=columns)
        return {'csv' : da.csv(resid_with_bounds_df, True)}
    
#---------------------------------------------------------------------------------------   
    
    def full_summary(self, ticker1, ticker2, start, end, isInitial):
        if not (ticker1 == self.ticker1 and ticker2 == self.ticker2) or (not isInitial and not self.json):
            print "yikes"
            self.__init__(ticker1, ticker2, True)
        csv = {
            'price_csv1' : self.price_csv1, 
            'price_csv2' : self.price_csv2, 
            'pnl_csv1' : self.pnl_csv1, 
            'pnl_csv2' : self.pnl_csv2
        }
        return {'csv' : csv, 'flip': self.flip}    
            