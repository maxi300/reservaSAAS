from django.db import models
#usuarios/model
# Create your models here.
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROL_CHOICES = (
        ('admin', 'Administrador'),
        ('negocio', 'Negocio'),
        ('cliente', 'Cliente'),
    )
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='admin')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    negocio = models.CharField(max_length=100, blank=True, null=True)  # Ej: "Barbería San Miguel"
    

    def __str__(self):
        return f"{self.username} ({self.rol})"