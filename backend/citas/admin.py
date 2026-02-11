from django.contrib import admin
# Register your models here.
from .models import Cita
from .models import Servicio


admin.site.register(Cita)
admin.site.register(Servicio)
