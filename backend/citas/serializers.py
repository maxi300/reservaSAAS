from rest_framework import serializers
from .models import Cita, Servicio
from pagos.models import Suscripcion

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'
    def validate(self, data):
        cliente = data['cliente']
        negocio = data['negocio']
        fecha = data['fecha']
        hora = data['hora']
        servicio = data['servicio']

        # Evitar duplicados
        if Cita.objects.filter(cliente=cliente, fecha=fecha, hora=hora).exists():
            raise serializers.ValidationError("Ya tienes una cita en esa fecha y hora.")

        # Límite por plan
        suscripcion = Suscripcion.objects.filter(negocio=negocio, activa=True).first()
        if suscripcion:
            max_citas = suscripcion.plan.max_citas
            total_citas = Cita.objects.filter(negocio=negocio, fecha=fecha).count()
            if total_citas >= max_citas:
                raise serializers.ValidationError("Este negocio ya alcanzó el límite de citas para hoy.")

        # Validar servicio
        if servicio.negocio != negocio:
            raise serializers.ValidationError("El servicio no pertenece a este negocio.")

        return data

    def create(self, validated_data):
        # Asegurar que el cliente real sea el usuario autenticado
        if 'cliente' not in validated_data:
            validated_data['cliente'] = self.context['request'].user
        return super().create(validated_data)
   
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'