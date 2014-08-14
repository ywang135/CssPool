from django.conf.urls import patterns, url

from csspool import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'redirect/(?P<error_id>[0-9]+)$', views.redirect_index, name='redirect_index'),
    url(r'signup$', views.signup, name='signup'),
    url(r'signin$', views.signin, name='signin'),
    url(r'showcss$', views.showcss, name='showcss'),
    url(r'addcss$', views.addcss, name='addcss'),
    url(r'logout$', views.logout, name='logout'),
    url(r'success$', views.success, name='success'),
#    url(r'ajaxaccesscss/(\d{1,7})$', views.ajaxaccesscss, name='ajaxaccesscss')
)