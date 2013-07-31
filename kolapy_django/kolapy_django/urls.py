from django.conf.urls import patterns, include, url
from kolapy_django import views_home

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
      url(r'^$', views_home.home),                  
      url(r'^home/$', views_home.home),
      url(r'^googlefinanceapi/$', views_home.google_finance_api),
      url(r'^typeahead/$', views_home.typeahead),
      url(r'^display1/$', views_home.display_view1),
      url(r'^algorithm/$', views_home.algorithm),
      url(r'^display2/$', views_home.display_view2),
      url(r'^cointegrate/$', views_home.cointegration),
      url(r'^settlement/$', views_home.settlement),
      url(r'^addtab/$', views_home.load_tab)
    # Examples:
    # url(r'^$', 'kolapy_django.views.home', name='home'),
    # url(r'^kolapy_django/', include('kolapy_django.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
