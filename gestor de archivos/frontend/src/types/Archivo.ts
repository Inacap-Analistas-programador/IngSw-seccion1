// Define la estructura de los datos que esperas recibir de Django
export interface Archivo {
    id: number;
    nombre: string;
    categoria: number; // ID de la categoría
    categoria_nombre: string;
    archivo_subido: string; // URL del archivo
    fecha_subida: string;
    es_favorito: boolean;
    extension: string;
    size: number; // Asumiendo que Django lo provee en bytes o similar
}

export interface Categoria {
    id: number;
    nombre: string;
}