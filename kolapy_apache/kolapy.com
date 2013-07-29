# i would suggest naming the file that this is contained in after the website. 
 
# this will respond to everything on port 80 regardless of the site.
<VirtualHost *:80>
    # this will limit it to requests coming to kolapy.com
    ServerName kolapy.com
    # apps directory
    DocumentRoot /home/ubuntu/kolapy/kolapy_django/kolapy_django
 
    <Directory /home/ubuntu/kolapy/kolapy_django/kolapy_django>
        Order allow,deny
        Allow from all
    </Directory>
 
    # paths to MEDIA_ROOT AND STATIC ROOT
    Alias /static /home/ubuntu/kolapy/kolapy_django/kolapy_django/static
    Alias /media /home/ubuntu/kolapy/kolapy_django/kolapy_django/media
 
    #absolute path to wsgi file, this is what routes requests to your app. 
    WSGIScriptAlias / /home/ubuntu/kolapy/kolapy_apache/kolapy.wsgi
 
</VirtualHost>
