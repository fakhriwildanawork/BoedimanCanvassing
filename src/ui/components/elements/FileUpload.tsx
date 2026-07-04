import React, { useState, useEffect } from 'react';
import { ImageIcon, X } from 'lucide-react';

interface FileUploadProps {
  initialPhotos?: string[];
  onFilesChange?: (files: File[], keptInitial: string[]) => void;
}

export default function FileUpload({ initialPhotos = [], onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<{file: File, preview: string}[]>([]);
  const [keptInitial, setKeptInitial] = useState<string[]>(initialPhotos);

  useEffect(() => {
    setKeptInitial(initialPhotos);
  }, [initialPhotos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      const updated = [...files, ...newFiles];
      setFiles(updated);
      if (onFilesChange) onFilesChange(updated.map(u => u.file), keptInitial);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated.map(u => u.file), keptInitial);
  };

  const removeInitial = (url: string) => {
    const updated = keptInitial.filter(u => u !== url);
    setKeptInitial(updated);
    if (onFilesChange) onFilesChange(files.map(u => u.file), updated);
  };

  return (
    <div>
      <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-teal-400 transition-colors cursor-pointer mb-4">
        <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
        <ImageIcon className="w-6 h-6 mb-2 text-teal-400" />
        <span className="text-sm font-medium text-center">Klik untuk upload foto/file<br/>(Bisa lebih dari satu)</span>
      </label>
      
      {(files.length > 0 || keptInitial.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {keptInitial.map((url, idx) => (
            <div key={`init-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
              <img src={url} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => window.open(url, '_blank')} className="text-white text-xs bg-teal-500 px-2 py-1 rounded">View</button>
                <button type="button" onClick={() => removeInitial(url)} className="text-white text-xs bg-red-500 px-2 py-1 rounded"><X className="w-3 h-3"/></button>
              </div>
            </div>
          ))}
          {files.map((fileObj, idx) => (
            <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
              <img src={fileObj.preview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => window.open(fileObj.preview, '_blank')} className="text-white text-xs bg-teal-500 px-2 py-1 rounded">View</button>
                <button type="button" onClick={() => removeFile(idx)} className="text-white text-xs bg-red-500 px-2 py-1 rounded"><X className="w-3 h-3"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
