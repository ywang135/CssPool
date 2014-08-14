from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from models import User, CssPool
from django.db import IntegrityError, transaction

import datetime
import time
import hashlib
import json
import random

def index(request):
    template = loader.get_template('csspool/index.html')
    curtime = time.strftime("%x, %a")
    context = RequestContext(request, {
        'current_date': curtime,
        'hide':'hide',
    })
    return HttpResponse(template.render(context))
def redirect_index(request, error_id):
    template = loader.get_template('csspool/index.html')
    curtime = time.strftime("%x, %a")
    error_id = int(error_id)%4
    if error_id == 0:
        errorMsg = "Signup Failed. Please try again!"
    elif error_id == 1:
        errorMsg = "Email existed. Please try again!"
    elif error_id == 2:
        errorMsg = "Signin Failed. Please try again!"
    elif error_id == 3:
        errorMsg = "Signin Failed. Check your email and password Please try again!"    
    elif error_id == 4:
        errorMsg = "Process Failed. Check your email and password Please try again!"
    else:
        errorMsg = "Undefined Error. Please try again!"
    context = RequestContext(request, {
        'current_date': curtime,
        'error_msg': errorMsg,
    })
    return HttpResponse(template.render(context))

def getErrorCode(error_id):
    countError = 4
    error = str(random.randint(1000000, 99999999)/countError*countError+error_id)
    return error
def signup(request):
    if request.method == 'POST':
        new_email = request.POST['signup_email']
        password = request.POST['signup_password']
        m = hashlib.md5()
        m.update(new_email+password)
        pwd = m.hexdigest()
        user = User(email=new_email, password = pwd)
        try:
            User.objects.get(email = new_email)
            error = getErrorCode(1)
            return HttpResponseRedirect('redirect/'+error)
        except User.DoesNotExist:
            user.save()
        response = HttpResponseRedirect('showcss')
        set_cookie(response, 'csspool_username', new_email)
        return response
    error = getErrorCode(0)
    return HttpResponseRedirect('redirect/'+error)
def signin(request):
    if request.method == 'POST':
        new_email = request.POST['signin_email']
        password = request.POST['signin_password']
        m = hashlib.md5()
        m.update(new_email+password)
        pwd = m.hexdigest()
        user = User(email=new_email, password = pwd)
        try:
            for signin_user in User.objects.filter(email = new_email):
                if signin_user.password == pwd:
                    response = HttpResponseRedirect('success')
                    set_cookie(response, 'csspool_username', new_email) 
                    return response
            error = getErrorCode(2)
            return HttpResponseRedirect('redirect/'+error)
        except User.DoesNotExist:
            user.save()
        response = HttpResponseRedirect('showcss')
        set_cookie(response, 'csspool_username', new_email)
        return response
    error = getErrorCode(2)
    return HttpResponseRedirect('redirect/'+error)
def addcss(request):
    if request.method == 'POST':
        new_email = request.POST['addcss_email']
        password = request.POST['addcss_password']
        m = hashlib.md5()
        m.update(new_email+password)
        pwd = m.hexdigest()
        css_type = int(request.POST['css_type'])
        addcss_name = request.POST['addcss_name']
        addcss_description = request.POST['addcss_description']
        css_content = request.POST['css_content']
        addcss_testcode = request.POST['addcss_testcode']
        if request.POST.get('useBootstrap'):
            addcss_useBootstrap = request.POST.get('useBootstrap')
        else:
            addcss_useBootstrap = False
        try:
            for signin_user in User.objects.filter(email = new_email):
                if signin_user.password == pwd:
                    cp = CssPool(user=signin_user, name=addcss_name, cssType=css_type, description=addcss_description, content=css_content, testCode=addcss_testcode, useBootstrap=addcss_useBootstrap)
                    cp.save()
                    response = HttpResponseRedirect('success')
                    return response           
        except User.DoesNotExist:
            error = getErrorCode(2)
            return HttpResponseRedirect('redirect/'+error)
    error = getErrorCode(2)
    return HttpResponseRedirect('redirect/'+error)
def set_cookie(response, key, value, days_expire = 7):
    if days_expire is None:
        max_age = 365 * 24 * 60 * 60  #one year
    else:
        max_age = days_expire * 24 * 60 * 60 
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires)
    
def showcss(request, error_msg=None):
    hide = ""
    if error_msg is None:
        error_msg = ""
        hide = "hide"
    template = loader.get_template('csspool/showcss.html')
    curtime = time.strftime("%x, %a")
    user_email = request.COOKIES.get('csspool_username')
    for signin_user in User.objects.filter(email = user_email):
        cp = CssPool.objects.filter(user = signin_user)
        context = RequestContext(request, {
            'current_date': curtime,
            'cssPool': cp,
            'email_address': user_email,
            'error_msg': error_msg,
            'hide': hide,
        })
        return HttpResponse(template.render(context))
    error = getErrorCode(2)
    return HttpResponseRedirect('redirect/'+error)

def logout(request):
    response = HttpResponseRedirect('/csspool')
    set_cookie(response, 'csspool_username', '', 0) 
    return response

def success(request):
    template = loader.get_template('csspool/success.html')
    curtime = time.strftime("%x, %a")
    context = RequestContext(request, {
        'current_date': curtime,
    })
    return HttpResponse(template.render(context))

def ajaxaccesscss(request, id):
    try:
        cp = CssPool.objects.filter(pk=id)
        dic = {}
        dic["user"] = cp[0].user.email
        dic["name"] = cp[0].name
        if cp[0].cssType == 1:
            dic["type"] = "id"
        else:
            dic["type"] = "class"
        dic["description"] = cp[0].description
        dic["content"] = cp[0].content
        dic["testCode"] = cp[0].testCode
        if cp[0].useBootstrap:
            dic["useBootstrap"] = "Yes"
        else:
            dic["useBootstrap"] = "No"
        return HttpResponse(json.dumps(dic), content_type="application/json")
    except CssPool.DoesNotExist:
        return None
def frame(request, bootstrap):
    if request.method == 'GET':
        code = request.GET['code']
        if int(bootstrap) == 1:
            template = loader.get_template('csspool/iframe.html')
            context = RequestContext(request, {
                'code': code,
            })
            return HttpResponse(template.render(context))
        elif int(bootstrap) == 0:
            return HttpResponse(code)       
    return HttpResponse("Test Error")