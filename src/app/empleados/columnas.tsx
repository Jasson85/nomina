'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Empleado, EmpleadoConCalculos } from "@/lib/tipos"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  MessageSquare 
} from "lucide-react";
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columnasEmpleados = (onDeleteClick: (empleado: Empleado) => void): ColumnDef<EmpleadoConCalculos>[] => [
  {
    accessorKey: "cedula",
    header: "Cédula",
  },
  {
    accessorKey: "nombre",
    header: "Nombre Completo",
    cell: ({ row }) => {
      const { nombre_completo, } = row.original;
      return <div className="font-medium">{`${nombre_completo}'}`}</div>;
    },
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => {
      const depto = row.getValue("departamento") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {depto?.toLowerCase().replace('_', ' ')}
        </Badge>
      )
    }
  },

  {
    accessorKey: "eps_nombre", 
    header: "E.P.S.",
    cell: ({ row }) => <div className="text-xs">{row.getValue("eps_nombre") || "No afiliado"}</div>
  },
  {
    accessorKey: "afp_nombre", 
    header: "Fondo de Pensión",
    cell: ({ row }) => <div className="text-xs">{row.getValue("afp_nombre") || "No afiliado"}</div>
  },

  {
    accessorKey: "salario_base", 
    header: "Salario Base",
    cell: ({ row }) => {     
      const monto = row.original.salario_base || 0;
      const formateado = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(monto);
      return <div className="font-mono font-medium text-emerald-700">{formateado}</div>;
    },
  },

  {
  id: "neto_pagar",
  header: "Neto a Pagar",
  cell: ({ row }) => {    
    const neto = row.original.calculos?.netoPagar || 0;
    
    return (
      <div className="text-right">
        <div className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md inline-block">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          }).format(neto)}
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5">Post-deducciones</p>
      </div>
    );
  },
},

  {
    accessorKey: "observaciones",
    header: "Novedades",
    cell: ({ row }) => {
      const obs = row.original.observaciones;
      
      if (!obs || obs.trim() === "") {
        return <span className="text-muted-foreground italic text-[10px]">Sin novedades</span>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[150px] cursor-help">
                <MessageSquare className="h-3 w-3 flex-shrink-0 text-blue-500" />
                <span className="truncate text-xs text-muted-foreground">{obs}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[300px] bg-slate-900 text-white p-3">
              <p className="text-xs leading-relaxed">{obs}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const esActivo = row.original.activo === true;
      return (
        <Badge 
          className={esActivo ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200" : ""}
          variant={esActivo ? 'default' : 'destructive'}
        >
          {esActivo ? 'Activo' : 'Retirado'}
        </Badge>
      );
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      const empleado = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Gestión de Nómina</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/empleados/${empleado.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4 text-slate-500" /> Ver Ficha Técnica
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4 text-blue-500" /> Editar/Anotar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-red-50"
              onClick={() => onDeleteClick(empleado)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Desactivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];