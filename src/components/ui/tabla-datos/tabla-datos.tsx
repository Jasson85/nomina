// src/componentes/ui/tabla-datos/tabla-datos.tsx
"use client"

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; 
import { Button } from "@/components/ui/button";
import { BarraHerramientasTablaDatos } from "@/components/ui/tabla-datos/barra-herramientas-tabla-datos";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablaDatosProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string; 
  toolbarActions?: React.ReactNode;
}

export function TablaDatos<TData, TValue>({
  columns,
  data,
  searchKey,
  toolbarActions,
}: TablaDatosProps<TData, TValue>) {
  const [filtrosColumna, setFiltrosColumna] = useState<any[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setFiltrosColumna,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        columnFilters: filtrosColumna,
    },
  });

  return (
    <div className="space-y-4">
      {/* Barra de Herramientas (Búsqueda y Acciones) */}
      <BarraHerramientasTablaDatos table={table} searchKey={searchKey} actions={toolbarActions} /> 
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Renderizado de Filas */}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Control de Paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} fila(s) visible(s).
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}