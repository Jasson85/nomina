'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  HeaderGroup,
  Header,
  Row,
  Cell
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Empleado } from "@/lib/tipos";
import { columnasEmpleados } from "@/app/empleados/columnas";
import { Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { AccionesEmpleado } from "./acciones-empleado"; 

interface TablaEmpleadosProps {
  empleados: Empleado[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onActionComplete: () => void; 
}

export function TablaEmpleados({ 
  empleados, 
  isLoading, 
  pagination,
  onActionComplete 
}: TablaEmpleadosProps) {  
 
  const columns = columnasEmpleados(onActionComplete);

  const table = useReactTable({
    data: empleados,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-base font-medium text-muted-foreground">
          Sincronizando con PostgreSQL...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de utilidades de la tabla */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-bold text-foreground">{empleados.length}</span> empleados en esta página.
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onActionComplete}
          className="h-8 gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refrescar datos
        </Button>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Empleado>) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: Header<Empleado, unknown>) => (
                  <TableHead key={header.id} className="h-12 font-bold text-foreground border-b">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<Empleado>) => (
                <TableRow 
                  key={row.id} 
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell: Cell<Empleado, unknown>) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-lg font-semibold text-muted-foreground">No hay registros</p>
                    <p className="text-sm text-muted-foreground">
                      No se encontraron empleados con los filtros actuales en la base de datos.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Navegación de Paginación Profesional */}
      <div className="flex items-center justify-between px-2 py-4 border-t">
        <div className="text-sm text-muted-foreground font-medium">
          Página <span className="text-foreground">{pagination.currentPage}</span> de <span className="text-foreground">{pagination.totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="h-9"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="h-9"
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}