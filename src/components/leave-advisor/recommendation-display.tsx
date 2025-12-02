'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  Gavel,
  Lightbulb,
  XCircle,
} from 'lucide-react';
import type { FormState } from '@/app/leave-advisor/actions';

interface RecommendationDisplayProps {
  state: FormState;
  isPending: boolean;
}

export function RecommendationDisplay({
  state,
  isPending,
}: RecommendationDisplayProps) {
  if (isPending) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!state.data && !state.message) {
    return null;
  }
  
  if (!state.data) {
     if(state.message && state.errors){
        return (
            <div className="mt-6">
                <p className="text-sm text-destructive">{state.message}</p>
            </div>
        )
     }
     return null
  }

  const {
    policyRecommendation,
    relevantPolicyDetails,
    relevantLawDetails,
    additionalNotes,
  } = state.data;
  const isApproval = policyRecommendation.toLowerCase().includes('aprobar');

  return (
    <div className="mt-8">
      <Card className="border-primary/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            {isApproval ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            <div>
              <CardTitle className="text-2xl">Recomendación de la IA</CardTitle>
              <CardDescription className="text-base">
                {policyRecommendation}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Políticas Relevantes de la Empresa
            </h3>
            <p className="text-muted-foreground border-l-4 border-primary/50 pl-4">
              {relevantPolicyDetails}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Leyes Colombianas Aplicables
            </h3>
            <p className="text-muted-foreground border-l-4 border-primary/50 pl-4">
              {relevantLawDetails}
            </p>
          </div>
          {additionalNotes && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Notas Adicionales
              </h3>
              <p className="text-muted-foreground border-l-4 border-primary/50 pl-4">
                {additionalNotes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
