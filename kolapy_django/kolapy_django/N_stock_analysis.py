import numpy as np
import pandas as pd
import data_analysis as da
import datetime as dt

def function(tickers, start, end):
    start = dt.datetime(start)
    end = dt.datetime(end)
    all_price_data = {}
    for ticker in tickers:
        p = da.dataframe(ticker)['Adj_Close']
        all_price_data[ticker] = p[np.logical_and(p.index>start, p.index<end)]
    
    price = pd.DataFrame(all_price_data)
    returns_meandev = price.pct_change()
    for col in returns_meandev:
        returns_meandev[col] = returns_meandev[col] - returns_meandev[col].mean()
        
    
    