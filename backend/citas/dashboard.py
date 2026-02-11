from datetime import date
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cita

# -----------------------
# Dashboard Cliente
# -----------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_cliente(request):
    """
    Dashboard para clientes:
    - Próximas citas
    - Historial de citas pasadas
    """
    user = request.user
    if user.rol != 'cliente':
        return Response({"detail": "No autorizado"}, status=403)

    hoy = date.today()
    citas_proximas = Cita.objects.filter(cliente=user, fecha__gte=hoy).order_by('fecha', 'hora')
    historial = Cita.objects.filter(cliente=user, fecha__lt=hoy).order_by('-fecha', '-hora')

    data = {
        "citas_proximas": [
            {
                "id": c.id,
                "negocio": c.negocio.username,
                "servicio": c.servicio.nombre,
                "fecha": c.fecha,
                "hora": c.hora,
                "estado": c.estado
            }
            for c in citas_proximas
        ],
        "historial": [
            {
                "id": c.id,
                "negocio": c.negocio.username,
                "servicio": c.servicio.nombre,
                "fecha": c.fecha,
                "hora": c.hora,
                "estado": c.estado
            }
            for c in historial
        ]
    }
    return Response(data)


# -----------------------
# Dashboard Negocio
# -----------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_negocio(request):
    """
    Dashboard para negocios:
    - Citas pendientes
    - Ingresos generados
    - Servicios más usados
    """
    user = request.user
    if user.rol != 'negocio':
        return Response({"detail": "No autorizado"}, status=403)

    # Citas pendientes
    citas_pendientes = Cita.objects.filter(negocio=user, estado='pendiente').order_by('fecha', 'hora')

    # Ingresos (solo citas confirmadas)
    ingresos = Cita.objects.filter(negocio=user, estado='confirmada').aggregate(
        total=Sum('servicio__precio')
    )['total'] or 0

    # Servicios más usados (TOP 5)
    servicios_mas_usados = (
        Cita.objects.filter(negocio=user)
        .values("servicio__nombre")
        .annotate(cantidad=Count("id"))
        .order_by("-cantidad")[:5]
    )

    data = {
        "citas_pendientes": [
            {
                "id": c.id,
                "cliente": c.cliente.username,
                "servicio": c.servicio.nombre,
                "fecha": c.fecha,
                "hora": c.hora,
                "estado": c.estado
            }
            for c in citas_pendientes
        ],
        "ingresos_totales": ingresos,
        "servicios_mas_usados": list(servicios_mas_usados),
    }
    return Response(data)
