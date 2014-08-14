# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CssPool',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cssType', models.PositiveSmallIntegerField()),
                ('name', models.CharField(max_length=20)),
                ('description', models.CharField(max_length=100)),
                ('content', models.CharField(max_length=800)),
                ('testCode', models.CharField(max_length=800)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('email', models.CharField(max_length=40, serialize=False, primary_key=True)),
                ('password', models.CharField(max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='csspool',
            name='user',
            field=models.ForeignKey(to='csspool.User'),
            preserve_default=True,
        ),
    ]
