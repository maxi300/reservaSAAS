from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pagos.models import Suscripcion, Plan
from citas.models import Cita
from django.db.models import Count, Sum



@api_view(['GET'])
def dashboard_pagos_negocio(request):
    # Verificar que sea negocio usando el campo rol
    if request.user.rol != "negocio":
        return Response({"error": "No autorizado"}, status=403)

    try:
        suscripcion = Suscripcion.objects.get(negocio=request.user, activa=True)
    except Suscripcion.DoesNotExist:
        return Response({"error": "No tiene suscripción activa"}, status=404)

    # Contar citas usadas por este negocio
    citas_usadas = Cita.objects.filter(negocio=request.user).count()
    citas_restantes = suscripcion.plan.max_citas - citas_usadas
    estado = "activo" if suscripcion.activa else "vencido"

    # Ejemplo de cálculo de fecha de expiración: 1 año desde fecha_inicio
    fecha_fin = suscripcion.fecha_inicio.replace(year=suscripcion.fecha_inicio.year + 1)

    return Response({
        "plan_actual": suscripcion.plan.nombre,
        "estado": estado,
        "vence_el": fecha_fin,
        "citas_permitidas": suscripcion.plan.max_citas,
        "citas_usadas": citas_usadas,
        "citas_restantes": citas_restantes
    })













@api_view(['GET'])
def dashboard_pagos_admin(request):
    if not request.user.is_superuser:
        return Response({"error": "No autorizado"}, status=403)

    hoy = date.today()
    suscripciones = Suscripcion.objects.all()
    suscripciones_activas = suscripciones.filter(activa=True).count()
    suscripciones_vencidas = suscripciones.filter(activa=False).count()
    ingresos_totales = suscripciones.aggregate(total=Sum('plan__precio_mensual'))['total'] or 0

    # Ranking de planes más vendidos
    planes_populares = Plan.objects.annotate(cantidad=Count('suscripciones')).order_by('-cantidad')
    planes_populares_list = [
        {"plan": p.nombre, "cantidad": p.cantidad} for p in planes_populares
    ]

    return Response({
        "suscripciones_activas": suscripciones_activas,
        "suscripciones_vencidas": suscripciones_vencidas,
        "ingresos_totales": ingresos_totales,
        "planes_populares": planes_populares_list
    })