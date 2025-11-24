/**
 * Utilidades para manejo y compresión de imágenes
 */

/**
 * Comprime una imagen a un tamaño máximo en KB
 * @param {File} file - Archivo de imagen
 * @param {number} maxSizeKB - Tamaño máximo en KB (default: 100)
 * @param {number} maxWidth - Ancho máximo (default: 800)
 * @param {number} maxHeight - Alto máximo (default: 800)
 * @returns {Promise<Blob>} - Imagen comprimida
 */
export async function compressImage(file, maxSizeKB = 100, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Función para comprimir con calidad ajustable
        const compressWithQuality = (quality) => {
          canvas.toBlob(
            (blob) => {
              const sizeKB = blob.size / 1024;
              
              // Si el tamaño es aceptable o la calidad es muy baja, retornar
              if (sizeKB <= maxSizeKB || quality <= 0.1) {
                resolve(blob);
              } else {
                // Reducir calidad y volver a intentar
                compressWithQuality(quality - 0.1);
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        // Comenzar con calidad del 90%
        compressWithQuality(0.9);
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Valida que un archivo sea una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {boolean} - true si es válido
 */
export function validateImageFile(file) {
  if (!file) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Convierte un Blob a File
 * @param {Blob} blob - Blob a convertir
 * @param {string} filename - Nombre del archivo
 * @returns {File} - Archivo resultante
 */
export function blobToFile(blob, filename) {
  return new File([blob], filename, { type: blob.type });
}

/**
 * Obtiene las dimensiones de una imagen
 * @param {File} file - Archivo de imagen
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Crea una vista previa de la imagen
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen
 */
export function createImagePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al crear vista previa'));
    };
    
    reader.readAsDataURL(file);
  });
}

export default {
  compressImage,
  validateImageFile,
  blobToFile,
  getImageDimensions,
  createImagePreview,
};
