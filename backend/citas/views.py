from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cita, Servicio
from .serializers import CitaSerializer, ServicioSerializer
from core.permissions import EsCliente, EsNegocio
from django_filters.rest_framework import DjangoFilterBackend 

from rest_framework import filters

# --- Servicios ---
class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticated, EsNegocio]  # solo negocios gestionan servicios

    def get_queryset(self):
        # un negocio ve solo sus servicios
        user = self.request.user
        return Servicio.objects.filter(negocio=user)

# --- Citas ---
class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related("cliente", "negocio", "servicio")
    serializer_class = CitaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['negocio', 'cliente', 'fecha']  # filtros exactos
    search_fields = ['servicio__nombre', 'cliente__username']  # búsqueda parcial
    ordering_fields = ['fecha', 'id']  # orden dinámico
    ordering = ['fecha']  # orden por defecto
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, EsCliente]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, EsNegocio]
        else:
            permission_classes = [IsAuthenticated]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'cliente':
            return Cita.objects.filter(cliente=user)
        elif user.rol == 'negocio':
            return Cita.objects.filter(negocio=user)
        else:  # admin
            return Cita.objects.all()
