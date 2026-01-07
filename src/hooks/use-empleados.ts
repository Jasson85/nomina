"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Empleado, EmpleadoConCalculos } from '@/lib/tipos';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosInstance';

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const { toast } = useToast();

  const cargarEmpleados = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/empleados/');
      setEmpleados(Array.isArray(response.data) ? response.data : response.data.items || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo conectar con la API." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { cargarEmpleados(); }, [cargarEmpleados]);
  
  const actualizarEmpleado = async (id: number, datos: Partial<Empleado>) => {
    try {      
      setEmpleados(prev => prev.map(e => e.id === id ? { ...e, ...datos } : e));

      const response = await axiosInstance.patch(`/empleados/${id}`, datos);

      if (response.status < 200 || response.status >= 300) throw new Error();
      toast({ title: "Guardado", description: "Sincronizado con PostgreSQL." });
    } catch (error) {
      cargarEmpleados(); 
      toast({ variant: "destructive", title: "Error", description: "No se guardó el cambio." });
    }
  };

  const empleadosConCalculos = useMemo((): EmpleadoConCalculos[] => {
    return empleados.map(emp => {
      const salario = Number(emp.salario_base) || 0;
      const salud = salario * 0.04;
      const pension = salario * 0.04;
      
      const auxilio = salario <= 2600000 ? 162000 : 0; 
      
      return {
        ...emp,
        calculos: { 
          salud, 
          pension, 
          auxilio, 
          netoPagar: salario - salud - pension + auxilio 
        }
      };
    });
  }, [empleados]);
  
  const listaFiltrada = useMemo(() => {
    return empleadosConCalculos.filter(e => {
      const search = terminoBusqueda.toLowerCase();
      const nombreParaFiltrar = e.nombre_completo || `${e.primer_nombre} ${e.primer_apellido}`;
      
      return (
        nombreParaFiltrar.toLowerCase().includes(search) || 
        e.numero_documento.includes(search)
      );
    });
  }, [empleadosConCalculos, terminoBusqueda]);

  const estadisticas = useMemo(() => {
    const activos = empleadosConCalculos.filter(e => e.activo);
    return {
      nominaTotal: activos.reduce((acc, curr) => acc + (curr.calculos?.netoPagar || 0), 0),
      conteoActivos: activos.length,      
      conNovedades: activos.filter(e => e.observaciones && e.observaciones.trim() !== "").length,
      promedioSalarial: activos.length > 0 
        ? activos.reduce((acc, curr) => acc + curr.salario_base, 0) / activos.length 
        : 0 
    };
  }, [empleadosConCalculos]);

  return {
    empleados: listaFiltrada,
    isLoading,
    terminoBusqueda,
    setTerminoBusqueda,
    estadisticas,
    paginacion: { currentPage: 1, totalPages: 1, onPageChange: () => {} }, 
    refrescar: cargarEmpleados,
    actualizarEmpleado
  };
}