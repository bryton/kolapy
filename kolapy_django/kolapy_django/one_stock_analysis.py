import data_analysis as da

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
        returns_spy = selection_spy.pct_change()
        beta = returns.cov(returns_spy)/returns_spy.var()
        return {'mean': returns.mean(), 'stdev': returns.std(), 'beta': beta}
        
#---------------------------------------------------------------------------------------   
 
    def full_summary(self, ticker, start, end, isInitial):
        if not ticker == self.ticker or (not isInitial and not self.json):
            self.__init__(ticker, True)
        csv = {'price_csv' : self.price_csv, 'pnl_csv' : self.pnl_csv}
        stats = self.summary_stats(start, end)
        name = da.name(self.ticker)
        return {'csv' : csv , 'stats' : stats, 'name' : name}
    
#---------------------------------------------------------------------------------------   
        
        
        
        
        
        
