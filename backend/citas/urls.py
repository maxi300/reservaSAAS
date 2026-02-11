from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CitaViewSet,ServicioViewSet
from .dashboard import dashboard_cliente, dashboard_negocio

router = DefaultRouter()
router.register(r'reserva', CitaViewSet)
router.register(r'servicios', ServicioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/cliente/', dashboard_cliente, name='dashboard-cliente'),
    path('dashboard/negocio/', dashboard_negocio, name='dashboard-negocio'),
]
