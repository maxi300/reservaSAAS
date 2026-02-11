from django.contrib import admin

# Register your models here.
from .models import Plan
from .models import Suscripcion

admin.site.register(Suscripcion)
admin.site.register(Plan)