import pica from 'pica';
import { PDFDocument } from 'pdf-lib';

/**
 * Optimasi client-side menggunakan Pica untuk gambar,
 * dan pdf-lib untuk validasi/optimasi PDF.
 * Sesuai arahan StorageRule.md
 */
export async function optimizeFile(file: File): Promise<File | Blob> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // 1. Gambar
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
    return optimizeImage(file);
  }

  // 2. PDF
  if (extension === 'pdf') {
    return optimizePdf(file);
  }

  // 3. Lainnya (txt, doc, xls, ppt, dsb) - dikembalikan as-is
  return file;
}

async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);
      
      const picaClient = pica();
      
      // Ukuran maksimum untuk canvas resizing
      const MAX_WIDTH = 1280;
      const MAX_HEIGHT = 1280;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      try {
        const resizedCanvas = await picaClient.resize(img, canvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        });

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const blob = await picaClient.toBlob(resizedCanvas, mimeType, 0.85); // Compress to 85% Quality
        
        const optimizedFile = new File([blob], file.name, {
          type: mimeType,
          lastModified: Date.now()
        });
        
        resolve(optimizedFile);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Gagal membaca file gambar"));
    img.src = url;
  });
}

async function optimizePdf(file: File): Promise<File> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Opsional: Hapus metadata / lakukan kompresi struktur PDF di sini
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    
    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes], file.name, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
  } catch (error) {
    console.error("Gagal optimasi PDF, mengirim file asli", error);
    return file;
  }
}

/**
 * Mengambil Thumbnail Placeholder untuk tipe non-gambar 
 * Sesuai StorageRule.md
 */
export function getDocThumbnail(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch(ext) {
    case 'pdf':
      return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
    case 'doc':
    case 'docx':
      return 'https://cdn-icons-png.flaticon.com/512/337/337932.png';
    case 'xls':
    case 'xlsx':
      return 'https://cdn-icons-png.flaticon.com/512/337/337958.png';
    case 'ppt':
    case 'pptx':
      return 'https://cdn-icons-png.flaticon.com/512/337/337949.png';
    case 'txt':
      return 'https://cdn-icons-png.flaticon.com/512/337/337956.png';
    default:
      return 'https://cdn-icons-png.flaticon.com/512/337/337936.png'; // File default
  }
}
