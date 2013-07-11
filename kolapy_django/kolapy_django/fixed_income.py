from datetime import datetime
from datetime import date
from dateutil.relativedelta import relativedelta

def fixed_income_price(amount, N, start, end=None):   
    today = date.today()
    start = datetime.strptime(start, "%m/%d/%Y").date()
    end = datetime.strptime(end, "%m/%d/%Y").date()
    dates = []
    
    for i in xrange(N):
        dates.append(start + relativedelta(months=+i))
    
    price_lower = 0
    price_upper = 0
    price_interpolated = 0
    
    maturities = [30, 91, 182, 365, 730, 1095, 1825, 2555, 3650, 7300, 10950] 
    discount_rates = [0.0003, 0.0004, 0.0008, 0.0015, 0.004, 0.0077, 0.016, 0.0219, 0.0273, 0.0341, 0.0368]
    
    for i in xrange(N):
        t = (dates[i] - today).days
        j = 0
        for j in xrange(11):
            if maturities[j] > t:
                break
        
        yield_lower = discount_rates[j - 1]
        yield_upper = discount_rates[j]
        yield_interpolated = ((t - maturities[j - 1]) * yield_lower + (maturities[j] - t) * yield_upper) / (maturities[j] - maturities[j - 1])
        
        price_upper += amount / ((1 + yield_lower / 2) ** (2 * t / 365.25))
        price_lower += amount / ((1 + yield_upper / 2) ** (2 * t / 365.25))
        price_interpolated += amount / ((1 + yield_interpolated / 2) ** (2 * t / 365.25))
    
    return {"price_lower": price_lower, "price_upper": price_upper, "price_interpolated": price_interpolated}


