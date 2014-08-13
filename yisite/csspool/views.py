from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from models import User, CssPool
from django.db import IntegrityError, transaction

import datetime
import time
import hashlib
import json

def index(request):
    template = loader.get_template('csspool/index.html')
    curtime = time.strftime("%x, %a")
    context = RequestContext(request, {
        'current_date': curtime,
    })
    return HttpResponse(template.render(context))