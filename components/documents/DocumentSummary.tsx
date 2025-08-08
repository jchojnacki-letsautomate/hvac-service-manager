import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DocumentRelationships, Relationship } from "./DocumentRelationships";
import { AlertTriangle, Check, Clock, Download, FileText, Lock, PlusCircle, Printer, ReceiptText, ClipboardList } from "lucide-react";
import { Separator } from "../ui/separator";

export interface DocumentSummaryProps {
  id: string;
  type: "invoice" | "protocol";
  documentNumber: string;
  client: string;
  uploadDate: string;
  status: "verified" | "pending" | "error" | "closed";
  description?: string;
  relationships: Relationship[];
  onAddRelationship?: () => void;
  onViewRelationship?: (type: string, id: string, number: string) => void;
  onCloseDocument?: () => void;
}

export function DocumentSummary({
  id,
  type,
  documentNumber,
  client,
  uploadDate,
  status,
  description,
  relationships,
  onAddRelationship,
  onViewRelationship,
  onCloseDocument
}: DocumentSummaryProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <div className="flex items-center gap-2">
            <Check className="size-4 text-emerald-500" />
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Zweryfikowany</Badge>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive" />
            <Badge variant="destructive">Wymaga weryfikacji</Badge>
          </div>
        );
      case "closed":
        return (
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-brand-blue" />
            <Badge className="bg-brand-blue text-white hover:bg-brand-blue/90">Zamknięty</Badge>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-amber-500" />
            <Badge variant="outline" className="text-amber-600">Przetwarzanie</Badge>
          </div>
        );
    }
  };
  
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <ReceiptText className="size-5 text-brand-orange" />;
      case "protocol":
        return <FileText className="size-5 text-emerald-600" />;
      default:
        return <FileText className="size-5" />;
    }
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "invoice":
        return "Faktura";
      case "protocol":
        return "Protokół";
      default:
        return "Dokument";
    }
  };
  
  // Sprawdzanie brakujących powiązań
  const hasMissingRelationships = () => {
    const hasServiceOrder = relationships.some(r => r.type === "serviceOrder");
    const hasInvoice = relationships.some(r => r.type === "invoice");
    const hasProtocol = relationships.some(r => r.type === "protocol");
    
    return !hasServiceOrder || !hasInvoice || !hasProtocol;
  };
  
  const getMissingRelationshipsInfo = () => {
    const missing = [];
    
    if (!relationships.some(r => r.type === "serviceOrder")) {
      missing.push("zlecenie");
    }
    
    if (!relationships.some(r => r.type === "invoice")) {
      missing.push("faktura");
    }
    
    if (!relationships.some(r => r.type === "protocol")) {
      missing.push("protokół");
    }
    
    if (missing.length === 0) return null;
    
    return (
      <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-md">
        <p className="text-amber-700 text-sm flex items-center gap-2">
          <AlertTriangle className="size-4" />
          <span>
            Brakuje powiązań: <strong>{missing.join(", ")}</strong>
          </span>
        </p>
      </div>
    );
  };
  
  return (
    <Card className={status === "closed" ? "bg-slate-50" : ""}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {getDocumentTypeIcon(type)}
            <CardTitle>{getDocumentTypeLabel(type)}: {documentNumber}</CardTitle>
          </div>
          {getStatusBadge(status)}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="mb-2 text-muted-foreground">Informacje podstawowe</h4>
            <dl className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-muted-foreground">Klient:</dt>
              <dd className="font-medium">{client}</dd>
              
              <dt className="text-muted-foreground">Data dodania:</dt>
              <dd>{uploadDate}</dd>
              
              <dt className="text-muted-foreground">ID dokumentu:</dt>
              <dd className="text-sm text-muted-foreground">{id}</dd>
            </dl>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-muted-foreground">Szybkie akcje</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <Download className="size-4" />
                <span>Pobierz</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
              >
                <Printer className="size-4" />
                <span>Drukuj</span>
              </Button>
              
              {status !== "closed" && onCloseDocument && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                  onClick={onCloseDocument}
                >
                  <Lock className="size-4" />
                  <span>Oznacz jako zamknięty</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-muted-foreground">Powiązania</h4>
            {status !== "closed" && onAddRelationship && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={onAddRelationship}
              >
                <PlusCircle className="size-4" />
                <span>Dodaj powiązanie</span>
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {relationships.length === 0 ? (
              <p className="text-muted-foreground text-sm py-2">
                Ten dokument nie ma jeszcze żadnych powiązań. Powiąż go z fakturą, protokołem lub zleceniem.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <ClipboardList className="size-4 text-brand-blue" />
                      <span>Zlecenia</span>
                    </h5>
                    {relationships.filter(r => r.type === "serviceOrder").length > 0 ? (
                      <DocumentRelationships 
                        relationships={relationships.filter(r => r.type === "serviceOrder")}
                        onViewRelationship={onViewRelationship}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Brak</span>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <ReceiptText className="size-4 text-brand-orange" />
                      <span>Faktury</span>
                    </h5>
                    {relationships.filter(r => r.type === "invoice").length > 0 ? (
                      <DocumentRelationships 
                        relationships={relationships.filter(r => r.type === "invoice")}
                        onViewRelationship={onViewRelationship}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Brak</span>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <FileText className="size-4 text-emerald-600" />
                      <span>Protokoły</span>
                    </h5>
                    {relationships.filter(r => r.type === "protocol").length > 0 ? (
                      <DocumentRelationships 
                        relationships={relationships.filter(r => r.type === "protocol")}
                        onViewRelationship={onViewRelationship}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Brak</span>
                    )}
                  </div>
                </div>
                
                {status !== "closed" && hasMissingRelationships() && getMissingRelationshipsInfo()}
              </div>
            )}
          </div>
        </div>
        
        {status === "closed" && (
          <>
            <Separator />
            <div className="bg-brand-blue/5 p-4 rounded-md">
              <p className="text-brand-blue flex items-center gap-2">
                <Lock className="size-4" />
                <span>
                  Ten dokument został oznaczony jako zamknięty i w pełni rozliczony.
                </span>
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}