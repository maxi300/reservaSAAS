from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UsuarioViewSet, login_usuario, UsuarioMeView
from .dashboard import dashboard_usuarios_admin

router = DefaultRouter()
router.register(r'', UsuarioViewSet)

urlpatterns = [
    path('login/', login_usuario, name='login_usuario'),
    path('dashboard/admin/', dashboard_usuarios_admin, name='dashboard_usuarios_admin'),
    path('me/', UsuarioMeView.as_view(), name='usuario-me'),
    path('', include(router.urls)),
]
