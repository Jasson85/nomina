
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionBackendProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginacionBackend({ currentPage, totalPages, onPageChange }: PaginacionBackendProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
             Página {currentPage} de {totalPages}
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
        >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
        >
            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
    </div>
  );
}