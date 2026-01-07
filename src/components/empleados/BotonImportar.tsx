
'use client';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BotonImportar({ onComplete }: { onComplete: () => void }) {
  const { toast } = useToast();

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];        
        
        const data = XLSX.utils.sheet_to_json(ws);

        const response = await fetch('http://localhost:8000/empleados/importar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          toast({ title: "Importación Exitosa", description: "La base de datos se ha actualizado." });
          onComplete(); 
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "El formato del Excel no es válido." });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="relative">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={manejarArchivo}
      />
      <Button variant="outline" className="gap-2">
        <Upload className="h-4 w-4" /> Importar Excel
      </Button>
    </div>
  );
}