export interface Participante {
    id: number;
    nombre_completo: string;
    rut: string;
    correo: string;
    estado_acreditacion: 'Acreditado' | 'Pendiente' | 'Ausente';
    codigo_qr: string; // El valor encriptado/único para el QR
}
