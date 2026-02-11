from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class Servicio(models.Model):
    negocio = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="servicios",
        limit_choices_to={'rol': 'negocio'}
    )
    nombre = models.CharField(max_length=100)
    duracion = models.IntegerField(help_text="Duración en minutos")
    precio = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.nombre} - {self.negocio.username}"


class Cita(models.Model):
    negocio = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="citas_negocio",
        limit_choices_to={'rol': 'negocio'}
    )
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="citas_cliente",
        limit_choices_to={'rol': 'cliente'}
    )
    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.CASCADE,
        related_name="citas"
    )
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(
        max_length=20,
        choices=[("pendiente", "Pendiente"), ("confirmada", "Confirmada"), ("cancelada", "Cancelada")],
        default="pendiente"
    )

    def __str__(self):
        return f"{self.servicio.nombre} - {self.fecha} {self.hora} ({self.estado})"
