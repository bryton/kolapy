from django import forms

class StockForm(forms.Form):
    ticker = forms.CharField()
    startdate = forms.DateField(label='Start Date')
    enddate = forms.DateField(label='End Date')