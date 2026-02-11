from rest_framework.decorators import api_view
from rest_framework.response import Response
from usuarios.models import Usuario
from django.db.models import Count

@api_view(['GET'])
def dashboard_usuarios_admin(request):
    if not request.user.is_superuser:
        return Response({"error": "No autorizado"}, status=403)

    total_clientes = Usuario.objects.filter(rol="cliente").count()
    total_negocios = Usuario.objects.filter(rol="negocio").count()
    total_admins = Usuario.objects.filter(rol="admin").count()

    # Opcional: negocios con más servicios registrados
    negocios_con_servicios = Usuario.objects.filter(rol="negocio").annotate(
        num_servicios=Count('servicios')
    ).order_by('-num_servicios')
    ranking_negocios = [
        {"negocio": b.username, "servicios_registrados": b.num_servicios}
        for b in negocios_con_servicios
    ]

    return Response({
        "total_clientes": total_clientes,
        "total_negocios": total_negocios,
        "total_admins": total_admins,
        "ranking_negocios": ranking_negocios
    })
