'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { useToast } from '@/hooks/use-toast';

interface DialogSubirHojaVidaProps {
  empleadoId: number;
  empleadoNombre: string;
  onSubirExitoso?: () => void;
}

export function DialogSubirHojaVida({ empleadoId, empleadoNombre, onSubirExitoso }: DialogSubirHojaVidaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivos(prev => [...prev, ...nuevosArchivos]);
    }
  };

  const eliminarArchivo = (index: number) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubir = async () => {
    if (archivos.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "Selecciona al menos un archivo" });
      return;
    }

    setIsLoading(true);
    
    try {
      for (const archivo of archivos) {
        const formData = new FormData();
        formData.append('file', archivo);
        formData.append('tipo', 'cv');

        const response = await axiosInstance.post(`/empleados/${empleadoId}/archivos?tipo=cv`, formData);
        
        if (response.status !== 201) {
          throw new Error('Error al subir archivo');
        }
      }

      toast({ title: "Éxito", description: "Hoja de vida subida correctamente" });
      setArchivos([]);
      setIsOpen(false);
      onSubirExitoso?.();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo subir la hoja de vida" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Subir Hoja de Vida
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Hoja de Vida</DialogTitle>
          <DialogDescription>
            Sube el CV o hoja de vida para {empleadoNombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Zona de carga */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Haz clic para seleccionar archivos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOCX, DOC (máximo 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Lista de archivos */}
          {archivos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
              {archivos.map((archivo, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">{archivo.name}</span>
                  </div>
                  <button
                    onClick={() => eliminarArchivo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setArchivos([]);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubir}
              disabled={isLoading || archivos.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Subir
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
