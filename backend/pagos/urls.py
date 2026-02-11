from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PlanViewSet, SuscripcionViewSet
from .dashboard import dashboard_pagos_negocio, dashboard_pagos_admin
from .views import crear_pago, simular_pago, webhook_paypal
   # Recibe notificación de PayPal y actualiza suscripción

router = DefaultRouter()
router.register(r'planes', PlanViewSet)
router.register(r'suscripciones', SuscripcionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/negocio/', dashboard_pagos_negocio, name='dashboard-pagos-negocio'),
    path('dashboard/admin/', dashboard_pagos_admin, name='dashboard-pagos-admin'),

    path('simular/<int:suscripcion_id>/', simular_pago, name='simular_pago'),
    path('crear/<int:plan_id>/', crear_pago, name='crear_pago'),
    path('webhook/', webhook_paypal, name='webhook_paypal'),
]
