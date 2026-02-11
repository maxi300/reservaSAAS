from rest_framework import permissions

class EsAdmin(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'admin'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'admin')


class EsNegocio(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'negocio'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'negocio')


class EsCliente(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'cliente'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'cliente')
