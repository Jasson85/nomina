import Image from 'next/image';

export function AppFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        {/* Lado izquierdo - Logo y nombre */}
        <div className="flex items-center gap-3">          
          <Image 
            src="/imagen/vozip-icon.png" 
            alt="Logo Tu Empresa" 
            width={40} 
            height={40}
            priority
            className="opacity-80"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">
              Desarrollado por <span className="font-bold text-primary">VozIP</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Software de Nómina
            </p>
          </div>
        </div>

        {/* Lado derecho - Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-xs text-muted-foreground">
            © {currentYear} VozIP. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Versión 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}