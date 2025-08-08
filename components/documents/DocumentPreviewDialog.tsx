
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { DocumentPreviewSimple } from "./DocumentPreviewSimple";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileText, Info } from "lucide-react";
import { DocumentSummary } from "./DocumentSummary";
import { DocumentLinkDialog } from "./DocumentLinkDialog";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface DocumentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  documentNumber: string;
  documentId: string;
}

export function DocumentPreviewDialog({
  open,
  onClose,
  documentNumber,
  documentId,
}: DocumentPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<"verified" | "pending" | "error" | "closed">(
    documentNumber.includes("125") ? "closed" : 
    documentNumber.includes("124") ? "verified" : 
    documentNumber.includes("123") ? "pending" : "error"
  );
  // const navigate = useNavigate(); // Removed - using hash routing

  // Przykładowe dane dokumentu - w rzeczywistej aplikacji pobierane z API
  const documentData = {
    id: documentId,
    type: documentNumber.startsWith("FV") ? "invoice" : "protocol",
    documentNumber,
    client: documentNumber.includes("123") 
      ? "Biurowiec Gamma" 
      : documentNumber.includes("124") 
        ? "ABC Sp. z o.o." 
        : "Hotel Metropol",
    uploadDate: "10.05.2025",
    status: documentStatus,
    preview: "/docs/invoice-preview-1.jpg",
    relationships: [
      { id: "3", type: "serviceOrder" as const, number: "ZL/2025/036" },
      { id: "5", type: "invoice" as const, number: "FV/2025/125" },
      { id: "6", type: "protocol" as const, number: "PS/2025/075" }
    ].filter((_, index) => index % (parseInt(documentId) || 1) === 0) // Generuje różne powiązania dla różnych dokumentów
  };

  const handleLinkToOrder = (orderId: string) => {
    // W rzeczywistej aplikacji aktualizowalibyśmy dane na serwerze
    alert(`Dokument ${documentNumber} został powiązany z elementem o ID: ${orderId}`);
    setLinkDialogOpen(false);
  };

  const handleViewRelationship = (type: string, id: string, number: string) => {
    switch (type) {
      case "invoice":
        // W rzeczywistej aplikacji przekierowalibyśmy do faktury
        alert(`Przekierowanie do faktury ${number}`);
        break;
        
      case "protocol":
        // W rzeczywistej aplikacji przekierowalibyśmy do protokołu
        alert(`Przekierowanie do protokołu ${number}`);
        break;
        
      case "serviceOrder":
        // Przekierowanie do zlecenia serwisowego
        window.location.hash = `#/zlecenia/${id}`;
        break;
        
      default:
        break;
    }
    
    onClose();
  };

  const handleCloseDocument = () => {
    setDocumentStatus("closed");
    setCloseDialogOpen(false);
    
    // W rzeczywistej aplikacji wysłalibyśmy żądanie do API
    alert(`Dokument ${documentNumber} i wszystkie powiązane dokumenty zostały oznaczone jako rozliczone`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Podgląd dokumentu</span>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden sm:flex">
                <TabsList>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <FileText className="size-4" />
                    <span>Dokument</span>
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <Info className="size-4" />
                    <span>Informacje</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Podgląd dokumentu {documentNumber} wraz z informacjami. Możliwość przełączania między widokiem dokumentu a szczegółowymi informacjami.
            </DialogDescription>
          </DialogHeader>
          
          <div className="block sm:hidden mt-4 mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <FileText className="size-4" />
                  <span>Dokument</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <Info className="size-4" />
                  <span>Informacje</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Main content tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="preview" className="mt-0">
              <DocumentPreviewSimple 
                documentNumber={documentNumber}
                className="h-[70vh] w-full"
              />
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <DocumentSummary 
                {...documentData}
                status={documentStatus}
                onAddRelationship={() => setLinkDialogOpen(true)}
                onViewRelationship={handleViewRelationship}
                onCloseDocument={
                  documentStatus !== "closed"
                    ? () => setCloseDialogOpen(true)
                    : undefined
                }
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <DocumentLinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        documentNumber={documentNumber}
        onLink={handleLinkToOrder}
      />
      
      <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Oznaczanie dokumentu jako zamknięty</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz oznaczyć dokument <span className="font-medium">{documentNumber}</span> jako zamknięty?
              Ta operacja oznaczy również wszystkie powiązane dokumenty jako zamknięte, a cały zestaw będzie traktowany jako w pełni rozliczony.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCloseDocument}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              Oznacz jako zamknięty
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
