from django.db import models

# Create your models here.
#pagos/models.py
from django.db import models
from django.conf import settings

class Plan(models.Model):
    nombre = models.CharField(max_length=50)
    precio_mensual = models.DecimalField(max_digits=8, decimal_places=2)
    max_citas = models.IntegerField(default=50)

    def __str__(self):
        return f"{self.nombre} (${self.precio_mensual}/mes)"


class Suscripcion(models.Model):
    negocio = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="suscripciones",
        limit_choices_to={'rol': 'negocio'}
    )
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="suscripciones")
    fecha_inicio = models.DateField(auto_now_add=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.negocio.username} - {self.plan.nombre} ({'Activa' if self.activa else 'Inactiva'})"

