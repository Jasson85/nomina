'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'; 
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  Gavel,
  Lightbulb,
  XCircle,
} from 'lucide-react';
import type { FormState } from '@/app/asesor-ia/actions';

interface RecommendationDisplayProps {
  state: FormState;
  isPending: boolean;
}

export function RecommendationDisplay({
  state,
  isPending,
}: RecommendationDisplayProps) {
  //Estado de carga profesional con Skeletons
  if (isPending) {
    return (
      <Card className="mt-6 border-primary/20 animate-pulse">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  //Manejo de estados vacíos o errores de validación
  if (!state.data && !state.message) return null;
  
  if (!state.data) {
    if (state.message) {
      return (
        <div className="mt-6 p-4 border border-destructive/50 bg-destructive/10 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{state.message}</p>
        </div>
      );
    }
    return null;
  }

  const {
    policyRecommendation,
    relevantPolicyDetails,
    relevantLawDetails,
    additionalNotes,
  } = state.data;

  // Lógica de validación visual (Aprobado vs Rechazado)
  const isApproval = policyRecommendation.toLowerCase().includes('aprobar') || 
                     policyRecommendation.toLowerCase().includes('cumple');

  return (
    <div className="mt-8 space-y-6">
      <Card className={`border-2 shadow-xl ${isApproval ? 'border-green-500/30' : 'border-red-500/30'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {isApproval ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-bold">Análisis Legal de IA</CardTitle>
                <CardDescription className="text-lg font-medium mt-1 text-foreground">
                  {policyRecommendation}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isApproval ? "outline" : "destructive"} className="uppercase">
              {isApproval ? "Sugerencia: Proceder" : "Sugerencia: Revisar"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Sección de Políticas Internas */}
          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              Marco Normativo Interno
            </h3>
            <div className="text-sm leading-relaxed text-muted-foreground pl-7">
              {relevantPolicyDetails}
            </div>
          </div>

          {/* Sección de Leyes Colombianas */}
          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <Gavel className="h-5 w-5" />
              Código Sustantivo del Trabajo (Colombia)
            </h3>
            <div className="text-sm leading-relaxed text-muted-foreground pl-7 border-l-2 border-primary/20">
              {relevantLawDetails}
            </div>
          </div>

          {/* Notas y Observaciones Finales */}
          {additionalNotes && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2 text-blue-700">
                <Lightbulb className="h-5 w-5" />
                Recomendaciones Adicionales
              </h3>
              <p className="text-sm text-blue-900/80 pl-7 italic">
                {additionalNotes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground">
        Este análisis es generado por IA y debe ser validado por el departamento jurídico.
      </p>
    </div>
  );
}