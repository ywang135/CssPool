from django.db import models
from fragments import CssType

class User(models.Model):
    email = models.CharField(max_length = 40, primary_key=True)
    password = models.CharField(max_length=128)
    def __unicode__(self):
        return self.email
    
class CssPool(models.Model):
    user = models.ForeignKey(User)
    cssType = models.PositiveSmallIntegerField ()
    name = models.CharField(max_length = 20)
    description = models.CharField(max_length = 100) 
    content = models.CharField(max_length = 800)
    testCode = models.CharField(max_length = 800)
    useBootstrap = models.BooleanField()
    def __unicode__(self):
        if self.cssType == CssType.ID:
            return "#"+self.name+": "+self.description[:20]
        else :
            return "."+self.name+": "+self.description[:20]
