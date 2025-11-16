import qrcode
from io import BytesIO
from typing import Dict, Any
import json


def generate_qr_code(data: Dict[str, Any], size: int = 300) -> bytes:
    """
    Genera un código QR con la información proporcionada
    
    Args:
        data: Diccionario con la información a codificar
        size: Tamaño del QR en píxeles (default: 300x300)
    
    Returns:
        bytes: Imagen QR en formato PNG
    """
    # Convertir datos a JSON string
    qr_data = json.dumps(data)
    
    # Crear objeto QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Añadir datos
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Crear imagen
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Redimensionar si es necesario
    if size != 300:
        img = img.resize((size, size))
    
    # Convertir a bytes
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    
    return buffer.getvalue()


def generate_course_qr(user, course) -> bytes:
    """
    Genera un código QR para inscripción a curso
    
    Args:
        user: Usuario inscrito
        course: Curso
    
    Returns:
        bytes: Imagen QR en formato PNG
    """
    data = {
        'type': 'course_enrollment',
        'user_id': user.usu_id,
        'username': user.usu_username,
        'email': user.usu_email,
        'course_id': course.cur_id,
        'course_code': course.cur_codigo,
        'course_name': course.cur_descripcion,
    }
    
    return generate_qr_code(data)


def generate_event_qr(user, event_id: int, event_name: str) -> bytes:
    """
    Genera un código QR para acceso a evento
    
    Args:
        user: Usuario
        event_id: ID del evento
        event_name: Nombre del evento
    
    Returns:
        bytes: Imagen QR en formato PNG
    """
    data = {
        'type': 'event_access',
        'user_id': user.usu_id,
        'username': user.usu_username,
        'email': user.usu_email,
        'event_id': event_id,
        'event_name': event_name,
    }
    
    return generate_qr_code(data)
