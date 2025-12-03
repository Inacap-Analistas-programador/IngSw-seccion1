import io
import qrcode
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from django.utils.timezone import localtime

def generate_payment_pdf(pago):
    """
    Genera un PDF para un objeto PagoPersona.
    Retorna un buffer de bytes con el contenido del PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    # Estilos
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1  # Center
    normal_style = styles['Normal']

    # Título
    elements.append(Paragraph("Comprobante de Pago", title_style))
    elements.append(Spacer(1, 0.2 * inch))

    # Información de la Organización (Hardcoded por ahora, podría venir de config)
    elements.append(Paragraph("<b>GIC - Gestión de Institución</b>", normal_style))
    elements.append(Paragraph("Dirección: Calle Falsa 123", normal_style))
    elements.append(Paragraph("Teléfono: +56 9 1234 5678", normal_style))
    elements.append(Spacer(1, 0.3 * inch))

    # Datos del Pago
    tipo_pago = "Ingreso" if pago.pap_tipo == 1 else "Egreso"
    estado_pago = "PAGADO" if pago.pap_estado == 1 else "ANULADO"
    
    # Formatear fecha
    fecha = localtime(pago.pap_fecha_hora).strftime("%d/%m/%Y %H:%M")

    # Datos de la Persona
    persona = pago.per_id
    nombre_completo = f"{persona.per_nombres} {persona.per_apelpat} {persona.per_apelmat}"
    rut = f"{persona.per_run}-{persona.per_dv}"

    # Datos del Curso
    curso = pago.cur_id.cur_descripcion if pago.cur_id else "N/A"

    data = [
        ["N° Comprobante:", str(pago.pap_id)],
        ["Fecha:", fecha],
        ["Estado:", estado_pago],
        ["Tipo:", tipo_pago],
        ["", ""], # Spacer row
        ["<b>Detalles del Pagador/Beneficiario</b>", ""],
        ["Nombre:", nombre_completo],
        ["RUT:", rut],
        ["Curso:", curso],
        ["", ""], # Spacer row
        ["<b>Detalles Financieros</b>", ""],
        ["Monto:", f"${int(pago.pap_valor):,} CLP"],
        ["Observación:", pago.pap_observacion or "Sin observaciones"],
    ]

    # Crear tabla
    table = Table(data, colWidths=[2 * inch, 4 * inch])
    
    # Estilo de la tabla
    table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey), # Header-like background for first rows if needed, but here we mix
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'), # First column bold
        ('SPAN', (0, 5), (1, 5)), # Span headers
        ('SPAN', (0, 10), (1, 10)), # Span headers
        ('TEXTCOLOR', (1, 2), (1, 2), colors.green if pago.pap_estado == 1 else colors.red), # Estado color
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.3 * inch))

    # QR Code for Location (if available)
    if pago.cur_id and pago.cur_id.cur_latitud and pago.cur_id.cur_longitud:
        try:
            lat = pago.cur_id.cur_latitud
            lon = pago.cur_id.cur_longitud
            maps_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(maps_url)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to ReportLab Image
            img_buffer = io.BytesIO()
            img.save(img_buffer, format="PNG")
            img_buffer.seek(0)
            
            qr_image = Image(img_buffer, width=1.5*inch, height=1.5*inch)
            qr_image.hAlign = 'LEFT'
            
            elements.append(Paragraph("<b>Ubicación del Curso (Escanear para ver en Mapa):</b>", normal_style))
            elements.append(Spacer(1, 0.1 * inch))
            elements.append(qr_image)
            elements.append(Spacer(1, 0.2 * inch))
        except Exception as e:
            print(f"Error generating QR code: {e}")

    # Footer
    elements.append(Paragraph(f"Registrado por: {pago.usu_id.usu_username if pago.usu_id else 'Sistema'}", normal_style))
    elements.append(Paragraph("Este documento es un comprobante generado electrónicamente.", styles['Italic']))

    doc.build(elements)
    buffer.seek(0)
    return buffer
