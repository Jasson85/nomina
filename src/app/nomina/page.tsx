'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { DialogGenerarNomina } from '@/components/dialogs/DialogGenerarNomina';
import axiosInstance from '@/api/axiosInstance';

//DEFINICIÓN INTERFAZ DE NÓMINA
interface Nomina {
    id: number;
    empleado_id: number;
    salario_neto: number;
    estado: string;
    fecha_pago: string;    
    
    empleado?: { 
        id: number;
        nombre_completo: string;
    } | null; 
    nombre_completo?: string; // fallback para compatibilidad
}


const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PayrollPage() {
    // ESTADOS
    const [nominas, setNominas] = useState<Nomina[]>([]);
    const [mesSeleccionado, setMesSeleccionado] = useState(MESES[new Date().getMonth()]);
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDialogGenerar, setShowDialogGenerar] = useState(false);

    
    // FUNCIONES DE CARGA Y GENERACIÓN
   

    const getNumMes = (nombreMes: string) => MESES.indexOf(nombreMes) + 1; 

    // obtener listado de nóminas
    const cargarNominas = async (mes: string, anio: string) => {
        setLoading(true);
        try {
            const numMes = getNumMes(mes);

            const response = await axiosInstance.get(`/nominas/periodo/${numMes}/${anio}`);
            
            if (response.status === 200) {
                const data: Nomina[] = response.data; 
                setNominas(data); 
            } else {
                console.error('Error al cargar nóminas');
                setNominas([]);
            }

        } catch (error) {
            console.error('Error de red al cargar nóminas:', error);
            setNominas([]);
        } finally {
            setLoading(false);
        }
    };



    // generar una nueva nómina (POST /nomina/generar)
    const handleRefrescarNominas = async () => {
        cargarNominas(mesSeleccionado, anioSeleccionado);
    };

    useEffect(() => {
        cargarNominas(mesSeleccionado, anioSeleccionado);
    }, [mesSeleccionado, anioSeleccionado]);


   
    // RENDERIZADO DEL COMPONENTE    

    // calcular totales
    const totalSalarios = nominas.reduce((sum, n) => sum + (n.salario_neto || 0), 0);
    const nominasPendientes = nominas.filter(n => n.estado === 'Generada' || n.estado === 'Pendiente').length;
    
    // formatear dinero 
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }); 
    };


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nómina</h1>
                    <p className="text-muted-foreground mt-2">Gestiona y genera nóminas mensuales</p>
                </div>
                
                {/* BOTÓN GENERAR NÓMINA */}
                <Button onClick={() => setShowDialogGenerar(true)} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generar Nómina
                </Button>
            </div>

            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="text-sm font-medium">Mes</label>
                    <select 
                        className="w-full mt-2 px-3 py-2 border rounded-md"
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(e.target.value)}
                    >
                        {MESES.map(mes => <option key={mes} value={mes}>{mes}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Año</label>
                    <select 
                        className="w-full mt-2 px-3 py-2 border rounded-md"
                        value={anioSeleccionado}
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
                    >
                        {/* Generar un rango de años */}
                        {[2024, 2025, 2026].map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Estado</label>
                    <select className="w-full mt-2 px-3 py-2 border rounded-md">
                        <option>Todos</option>
                        <option>Pendiente</option>
                        <option>Generada</option>
                        <option>Pagada</option>
                    </select>
                </div>
            </div>

            {/* Tabla de nóminas */}
            <Card>
                <CardHeader>
                    <CardTitle>Nóminas Registradas ({mesSeleccionado} {anioSeleccionado})</CardTitle>
                    <CardDescription>Listado de todas las nóminas generadas en el periodo seleccionado</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 px-4 text-center text-muted-foreground">Cargando nóminas...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">ID</th>
                                        <th className="text-left py-3 px-4">Empleados</th>
                                        <th className="text-left py-3 px-4">Total Neto</th>
                                        <th className="text-left py-3 px-4">Estado</th>
                                        <th className="text-left py-3 px-4">Fecha Pago</th>
                                        <th className="text-left py-3 px-4">Acciones</th>
                                    </tr>
                                </thead><tbody>{ /* Corrección de hidratación */ }
                                    {nominas.length === 0 ? (
                                        <tr className="border-b hover:bg-muted/50">
                                            <td colSpan={6} className="py-8 px-4 text-center text-muted-foreground">
                                                No hay nóminas registradas para este período.
                                            </td>
                                        </tr>
                                    ) : (
                                        nominas.map((nomina: Nomina) => ( 
                                            <tr key={nomina.id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{nomina.id}</td>
                                                
                                                {/* Acceso seguro */}
                                                <td className="py-3 px-4">{nomina.empleado?.nombre_completo || nomina.nombre_completo || 'N/A'}</td> 
                                                
                                                <td className="py-3 px-4 font-bold">{formatCurrency(nomina.salario_neto)}</td>
                                                <td className="py-3 px-4">{nomina.estado}</td>
                                                <td className="py-3 px-4">{new Date(nomina.fecha_pago).toLocaleDateString()}</td>
                                                <td className="py-3 px-4">
                                                    <Link href={`/nomina/detalles/${nomina.id}`}>
                                                        <Button variant="link" size="sm">Ver</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resumen */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Total Empleados Procesados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nominas.length}</div>
                        <p className="text-xs text-muted-foreground">En el periodo seleccionado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Neto Pagado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalSalarios)}</div>
                        <p className="text-xs text-muted-foreground">Suma de salarios netos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nominasPendientes}</div>
                        <p className="text-xs text-muted-foreground">Nóminas generadas, no pagadas</p>
                    </CardContent>
                </Card>
            </div>

            <DialogGenerarNomina
                open={showDialogGenerar}
                onOpenChange={setShowDialogGenerar}
                onSuccess={handleRefrescarNominas}
            />
        </div>
    );
}