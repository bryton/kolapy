import os 
import sys
 
# this line is added so python is aware of the application
# this is absolute path to the app.
sys.path.append('/home/ubuntu/kolapy/kolapy_django/kolapy_django')
 
# this is simply a check to see if the site is in syspath as well this is one directory up from application
path = '/home/ubuntu/kolapy/kolapy_django'
if path not in sys.path:
    sys.path.insert(0,'/home/ubuntu/kolapy/kolapy_django')
 
# this is the settings file needed to start django with.
os.environ['DJANGO_SETTINGS_MODULE'] = 'kolapy_django.settings'
 
# import handler and activate application
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
