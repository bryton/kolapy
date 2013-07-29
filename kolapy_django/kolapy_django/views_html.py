from django.http import HttpResponse
import json
import os

def load_tab(request):
    tabCounter = str(request.POST.get('tabCounter'))
    current_dir = os.path.dirname(__file__)
    path = os.path.join(current_dir, 'templates2/view1.html')
    html = open(path).read()
    html = html.replace('\n', '').replace('\t', '').replace('tabCounter', tabCounter)
    response_data = {'html' : html}
    return HttpResponse(json.dumps(response_data), content_type="application/json")
