from mongoengine import *

class Stock(Document):
    _id = StringField()
    Symbol = StringField()
    Date = StringField()
    Open = FloatField()
    High = FloatField()
    Low = FloatField()
    Close = FloatField()
    Volume = FloatField()
    
    
    