from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Plan, Suscripcion
from .serializers import PlanSerializer, SuscripcionSerializer
from core.permissions import  EsNegocio, EsAdmin
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

# --- Planes ---
class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated, EsAdmin]  # solo admin puede crear/editar planes
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre', 'precio_mensual']


# --- Suscripciones ---
class SuscripcionViewSet(viewsets.ModelViewSet):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer
    permission_classes = [IsAuthenticated, EsNegocio]  # solo negocio puede suscribirse
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['negocio', 'plan', 'activa']

    def get_queryset(self):
        # un negocio ve solo sus suscripciones
        user = self.request.user
        return Suscripcion.objects.filter(negocio=user)





#Plan de paypal 

#######################################################################
###########################################################################



# Simular pago (solo para pruebas)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simular_pago(request, suscripcion_id):
    try:
        suscripcion = Suscripcion.objects.get(id=suscripcion_id, negocio=request.user)
        suscripcion.activa = True
        suscripcion.save()
        return Response({"mensaje": "Pago simulado, suscripción activada"})
    except Suscripcion.DoesNotExist:
        return Response({"error": "Suscripción no encontrada o no autorizada"}, status=404)

# Crear pago (link a PayPal u otra pasarela)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_pago(request, plan_id):
    try:
        plan = Plan.objects.get(id=plan_id)
        # Aquí generas token de PayPal / link
        url_pago = f"https://paypal.com/checkout/?plan={plan.id}&usuario={request.user.id}"
        return Response({"url_pago": url_pago})
    except Plan.DoesNotExist:
        return Response({"error": "Plan no encontrado"}, status=404)

# Webhook para recibir notificación de pago
@api_view(['POST'])
def webhook_paypal(request):
    """
    Endpoint que llamará PayPal tras un pago exitoso
    """
    # Aquí validarías la información recibida
    # Ejemplo: activar la suscripción
    suscripcion_id = request.data.get("suscripcion_id")
    try:
        suscripcion = Suscripcion.objects.get(id=suscripcion_id)
        suscripcion.activa = True
        suscripcion.save()
        return Response({"status": "ok"})
    except Suscripcion.DoesNotExist:
        return Response({"error": "Suscripción no encontrada"}, status=404)
