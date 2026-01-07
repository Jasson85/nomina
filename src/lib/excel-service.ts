// src/lib/excel-service.ts

import * as XLSX from 'xlsx';

export interface EmpleadoExcel {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  email?: string;
  telefono?: string;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  fecha_ingreso?: string;
  eps?: string;
  afp?: string;
  arl?: string;
  tipo_contrato?: string;
  estado?: string;
}

export interface ResultadoImportacion {
  exito: boolean;
  mensaje: string;
  empleados: EmpleadoExcel[];
  errores: string[];
  advertencias: string[];
}

export class ExcelService {
  // Mapeo de posibles nombres de columnas a nuestro formato estándar
  private static columnasAlternativas: { [key: string]: string[] } = {
    nombre: ['nombre', 'nombres', 'name', 'primer nombre'],
    apellido: ['apellido', 'apellidos', 'last name'],
    cedula: ['cedula', 'cédula', 'cc', 'documento', 'identificacion', 'identificación'],
    email: ['email', 'correo', 'e-mail', 'correo electronico', 'mail'],
    telefono: ['telefono', 'teléfono', 'celular', 'phone', 'tel'],
    cargo: ['cargo', 'position', 'puesto', 'rol'],
    departamento: ['departamento', 'department', 'area', 'área'],
    salario_base: ['salario', 'salario base', 'salary', 'sueldo', 'remuneracion'],
    fecha_ingreso: ['fecha ingreso', 'fecha de ingreso', 'start date', 'fecha inicio'],
    eps: ['eps', 'salud', 'health'],
    afp: ['afp', 'pension', 'pensión'],
    arl: ['arl', 'riesgos'],
    tipo_contrato: ['tipo contrato', 'contrato', 'contract type'],
    estado: ['estado', 'status', 'activo'],
  };

  /**
   * Lee un archivo Excel y retorna los datos procesados
   */
  static async procesarArchivoExcel(file: File): Promise<ResultadoImportacion> {
    try {
      const data = await this.leerArchivo(file);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Obtener la primera hoja
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
      
      // Convertir a JSON
      const datosRaw: any[] = XLSX.utils.sheet_to_json(hoja, { 
        defval: '',
        raw: false 
      });

      if (datosRaw.length === 0) {
        return {
          exito: false,
          mensaje: 'El archivo Excel está vacío',
          empleados: [],
          errores: ['No se encontraron datos en el archivo'],
          advertencias: []
        };
      }

      // Procesar los datos
      const resultado = this.procesarDatos(datosRaw);
      
      return resultado;
    } catch (error: any) {
      return {
        exito: false,
        mensaje: 'Error al procesar el archivo',
        empleados: [],
        errores: [error.message || 'Error desconocido'],
        advertencias: []
      };
    }
  }

  private static leerArchivo(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error('No se pudo leer el archivo'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  
  private static procesarDatos(datosRaw: any[]): ResultadoImportacion {
    const empleados: EmpleadoExcel[] = [];
    const errores: string[] = [];
    const advertencias: string[] = [];

   
    const mapeoColumnas = this.detectarColumnas(datosRaw[0]);

    datosRaw.forEach((fila, index) => {
      const numeroFila = index + 2; 

      try {
        const empleado: EmpleadoExcel = {};

        // Mapear cada columna
        Object.keys(mapeoColumnas).forEach((nuestraColumna) => {
          const columnaExcel = mapeoColumnas[nuestraColumna];

          if (columnaExcel && fila[columnaExcel] !== undefined) {
            let valor = fila[columnaExcel];

            const key = nuestraColumna as keyof EmpleadoExcel;

            // Limpiar y convertir el valor
            if (key === 'salario_base') {

              const numValor = String(valor).replace(/[^\d.,]/g, '').replace(/,/g, '');
              
              empleado[key] = parseFloat(numValor) || 0;
            } else if (key === 'fecha_ingreso') {
              empleado[key] = this.parsearFecha(valor);
            } else {

      const valorLimpio = String(valor).trim();
      (empleado as any)[key] = valorLimpio;
    }
  }
});

        // Validaciones básicas
        const erroresFila = this.validarEmpleado(empleado, numeroFila);
        
        if (erroresFila.length > 0) {
          errores.push(...erroresFila);
        } else {
          empleados.push(empleado);
        }

        // Advertencias
        if (!empleado.eps) {
          advertencias.push(`Fila ${numeroFila}: No se especificó EPS para ${empleado.nombre}`);
        }
        if (!empleado.afp) {
          advertencias.push(`Fila ${numeroFila}: No se especificó AFP para ${empleado.nombre}`);
        }

      } catch (error: any) {
        errores.push(`Fila ${numeroFila}: Error al procesar - ${error.message}`);
      }
    });

    return {
      exito: errores.length === 0,
      mensaje: errores.length === 0 
        ? `Se procesaron ${empleados.length} empleados correctamente` 
        : `Se encontraron ${errores.length} errores`,
      empleados,
      errores,
      advertencias
    };
  }

  /**
   * Detecta automáticamente las columnas del Excel
   */
  private static detectarColumnas(primeraFila: any): { [key: string]: string } {
    const mapeo: { [key: string]: string } = {};
    const columnasExcel = Object.keys(primeraFila);

    Object.keys(this.columnasAlternativas).forEach((nuestraColumna) => {
      const alternativas = this.columnasAlternativas[nuestraColumna];
      
      for (const columnaExcel of columnasExcel) {
        const columnaLower = columnaExcel.toLowerCase().trim();
        
        if (alternativas.some(alt => columnaLower.includes(alt))) {
          mapeo[nuestraColumna] = columnaExcel;
          break;
        }
      }
    });

    return mapeo;
  }

  /**
   * Valida los datos de un empleado
   */
  private static validarEmpleado(empleado: EmpleadoExcel, fila: number): string[] {
    const errores: string[] = [];

    if (!empleado.nombre || empleado.nombre.length === 0) {
      errores.push(`Fila ${fila}: El nombre es obligatorio`);
    }

    if (!empleado.cedula || empleado.cedula.length === 0) {
      errores.push(`Fila ${fila}: La cédula es obligatoria`);
    }

    if (!empleado.email || !this.validarEmail(empleado.email)) {
      errores.push(`Fila ${fila}: Email inválido o no proporcionado`);
    }

    if (!empleado.salario_base || empleado.salario_base <= 0) {
      errores.push(`Fila ${fila}: El salario debe ser mayor a 0`);
    }

    return errores;
  }

  /**
   * Valida formato de email
   */
  private static validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Parsea diferentes formatos de fecha
   */
  private static parsearFecha(valor: any): string {
    if (!valor) return '';

    try {
      // Si es un número serial de Excel
      if (typeof valor === 'number') {
        const fecha = XLSX.SSF.parse_date_code(valor);
        return `${fecha.y}-${String(fecha.m).padStart(2, '0')}-${String(fecha.d).padStart(2, '0')}`;
      }

      // Si ya es una fecha en formato string
      const fechaStr = String(valor);
      
      // Intentar varios formatos comunes
      const formatos = [
        /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
        /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
        /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
      ];

      for (const formato of formatos) {
        const match = fechaStr.match(formato);
        if (match) {
          if (formato === formatos[0]) {
            // Ya está en formato correcto
            return fechaStr;
          } else {
            // Convertir a YYYY-MM-DD
            return `${match[3]}-${match[2]}-${match[1]}`;
          }
        }
      }

      return fechaStr;
    } catch (error) {
      return '';
    }
  }

  /**
   * Descarga una plantilla de Excel con las columnas esperadas
   */
  static descargarPlantilla() {
    const plantilla = [
      {
        'Nombre': 'Juan',
        'Apellido': 'Pérez',
        'Cédula': '1234567890',
        'Email': 'juan.perez@empresa.com',
        'Teléfono': '3001234567',
        'Cargo': 'Desarrollador',
        'Departamento': 'Tecnología',
        'Salario Base': '3500000',
        'Fecha Ingreso': '2024-01-15',
        'EPS': 'Sanitas',
        'AFP': 'Porvenir',
        'ARL': 'Sura',
        'Tipo Contrato': 'Indefinido',
        'Estado': 'Activo'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(plantilla);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Empleados');

    // Ajustar ancho de columnas
    const maxWidth = 20;
    worksheet['!cols'] = Object.keys(plantilla[0]).map(() => ({ wch: maxWidth }));

    XLSX.writeFile(workbook, 'Plantilla_Empleados.xlsx');
  }
}