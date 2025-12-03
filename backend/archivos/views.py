from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.utils import timezone
from .models import Archivo, ArchivoCurso, ArchivoPersona
from .serializers import ArchivoSerializer, ArchivoCursoSerializer, ArchivoPersonaSerializer
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter


class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.all()
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='descargar-comprobante')
    def descargar_comprobante(self, request):
        """Descarga el comprobante asociado a un pago. Si no existe archivo, genera un PDF."""
        pap_id = request.query_params.get('pap_id')
        if not pap_id:
            return Response({'detail': 'pap_id es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from pagos.models import PagoComprobante, PagoPersona
            from pagos.utils import generate_payment_pdf

            # 1. Intentar buscar archivo físico existente (Legacy)
            pago_comprobante = PagoComprobante.objects.select_related('cpa_id').filter(pap_id=pap_id).first()
            
            if pago_comprobante and pago_comprobante.cpa_id.cpa_archivo:
                archivo = pago_comprobante.cpa_id.cpa_archivo
                try:
                    response = HttpResponse(archivo.open(), content_type='application/octet-stream')
                    response['Content-Disposition'] = f'attachment; filename="{archivo.name.split("/")[-1]}"'
                    return response
                except FileNotFoundError:
                    pass # Si el archivo no está en disco, generamos PDF

            # 2. Generar PDF dinámico
            pago = PagoPersona.objects.select_related('per_id', 'cur_id', 'usu_id').get(pap_id=pap_id)
            pdf_buffer = generate_payment_pdf(pago)
            
            response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="comprobante_pago_{pap_id}.pdf"'
            return response

        except PagoPersona.DoesNotExist:
            return Response({'detail': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error descargando comprobante: {e}")
            return Response({'detail': 'Error al procesar la solicitud.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ArchivoCursoViewSet(viewsets.ModelViewSet):
    queryset = ArchivoCurso.objects.all()
    serializer_class = ArchivoCursoSerializer
    permission_classes = [IsAuthenticated]


class ArchivoPersonaViewSet(viewsets.ModelViewSet):
    queryset = ArchivoPersona.objects.all()
    serializer_class = ArchivoPersonaSerializer
    permission_classes = [IsAuthenticated]

