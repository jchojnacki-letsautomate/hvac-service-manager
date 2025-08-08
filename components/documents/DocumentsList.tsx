import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Upload, Search, Filter, Eye, 
  FileText, FilePlus, Link as LinkIcon, Archive,
  Check, AlertTriangle, Clock, PlusCircle, Lock,
  ClipboardList, Receipt, FileText
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
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
import { Relationship } from "./DocumentRelationships";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "../ui/utils";

type DocumentStatus = "verified" | "pending" | "error" | "closed";

interface Document {
  id: string;
  type: "invoice" | "protocol";
  filename: string;
  uploadDate: string;
  client: string;
  documentNumber: string;
  status: DocumentStatus;
  preview: string;
  relationships: Relationship[];
}

export function DocumentsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // const navigate = useNavigate(); // Removed - using hash routing
  
  // Przykładowe dane z powiązaniami
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      type: "invoice",
      filename: "FV-2025-123.pdf",
      uploadDate: "10.05.2025",
      client: "Biurowiec Gamma",
      documentNumber: "FV/2025/123",
      status: "pending",
      preview: "/docs/invoice-preview-1.jpg",
      relationships: [
        { id: "3", type: "serviceOrder", number: "ZL/2025/036" }
      ]
    },
    {
      id: "2",
      type: "protocol",
      filename: "protokol-serwisowy-hotel-metropol.pdf",
      uploadDate: "09.05.2025",
      client: "Hotel Metropol",
      documentNumber: "PS/2025/078",
      status: "error",
      preview: "/docs/protocol-preview-1.jpg",
      relationships: [
        { id: "1", type: "serviceOrder", number: "ZL/2025/042" },
        { id: "5", type: "invoice", number: "FV/2025/125" }
      ]
    },
    {
      id: "3",
      type: "invoice",
      filename: "FV-2025-124.pdf",
      uploadDate: "08.05.2025",
      client: "ABC Sp. z o.o.",
      documentNumber: "FV/2025/124",
      status: "verified",
      preview: "/docs/invoice-preview-2.jpg",
      relationships: [
        { id: "4", type: "serviceOrder", number: "ZL/2025/032" },
        { id: "6", type: "protocol", number: "PS/2025/075" }
      ]
    },
    {
      id: "4",
      type: "protocol",
      filename: "protokol-montazowy-delta.pdf",
      uploadDate: "07.05.2025",
      client: "Delta Office Park",
      documentNumber: "PM/2025/022",
      status: "pending",
      preview: "/docs/protocol-preview-2.jpg",
      relationships: []
    },
    {
      id: "5",
      type: "invoice",
      filename: "FV-2025-125.pdf",
      uploadDate: "06.05.2025",
      client: "Hotel Metropol",
      documentNumber: "FV/2025/125",
      status: "closed",
      preview: "/docs/invoice-preview-3.jpg",
      relationships: [
        { id: "2", type: "protocol", number: "PS/2025/078" },
        { id: "1", type: "serviceOrder", number: "ZL/2025/042" }
      ]
    }
  ]);

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Zweryfikowany</Badge>;
      case "error":
        return <Badge variant="destructive">Wymaga weryfikacji</Badge>;
      case "closed":
        return <Badge className="bg-brand-blue text-white hover:bg-brand-blue/90">Zamknięty</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="text-amber-600">Przetwarzanie</Badge>;
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return <Check className="size-4 text-emerald-500" />;
      case "error":
        return <AlertTriangle className="size-4 text-destructive" />;
      case "closed":
        return <Lock className="size-4 text-brand-blue" />;
      case "pending":
      default:
        return <Clock className="size-4 text-amber-500" />;
    }
  };

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="icon-balanced mr-1 text-brand-orange" />;
      case "protocol":
        return <FileText className="icon-balanced mr-1 text-emerald-600" />;
      case "serviceOrder":
        return <ClipboardList className="icon-balanced mr-1 text-brand-blue" />;
      default:
        return null;
    }
  };

  // Funkcja pomocnicza do renderowania pojedynczego powiązania
  const renderRelationship = (relationships: Relationship[], type: string) => {
    const filtered = relationships.filter(r => r.type === type);
    
    if (filtered.length === 0) {
      return (
        <span className="text-muted-foreground text-sm italic">
          Brak
        </span>
      );
    }
    
    return filtered.map((rel) => (
      <Badge
        key={`${rel.type}-${rel.id}`}
        variant="outline"
        className={cn(
          "flex items-center gap-1 cursor-pointer transition-colors",
          type === "serviceOrder" 
            ? "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20" 
            : type === "invoice" 
              ? "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20" 
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        )}
        onClick={() => handleViewRelationship(rel.type, rel.id, rel.number)}
      >
        {getRelationshipIcon(rel.type)}
        {rel.number}
      </Badge>
    ));
  };

  // Filtrowanie dokumentów według wyszukiwania i wybranych filtrów
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "closed" && doc.status === "closed") ||
      (statusFilter === "open" && doc.status !== "closed");
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleLinkToOrder = (orderId: string) => {
    // Symulacja powiązania dokumentu ze zleceniem
    if (selectedDocument) {
      const updatedRelationships = [
        ...selectedDocument.relationships,
        { 
          id: orderId, 
          type: "serviceOrder", 
          number: `ZL/2025/${orderId.padStart(3, '0')}` 
        }
      ];
      
      // W rzeczywistej aplikacji zaktualizowalibyśmy dane na serwerze
      alert(`Dokument ${selectedDocument.documentNumber} został powiązany ze zleceniem o ID: ${orderId}`);
      setLinkDialogOpen(false);
    }
  };
  
  const handleArchiveDocument = () => {
    alert(`Dokument ${selectedDocument?.documentNumber} został zarchiwizowany`);
    setArchiveDialogOpen(false);
  };

  const handleCloseDocument = () => {
    if (selectedDocument) {
      // W rzeczywistej aplikacji wysłalibyśmy żądanie do API
      // Tutaj symulujemy aktualizację lokalnego stanu
      const updatedDocuments = documents.map(doc => {
        if (doc.id === selectedDocument.id) {
          return { ...doc, status: "closed" as DocumentStatus };
        }
        
        // Sprawdzamy czy dokument jest powiązany z wybranym dokumentem
        const isRelated = selectedDocument.relationships.some(rel => 
          (rel.type === doc.type && doc.documentNumber === rel.number) ||
          doc.relationships.some(docRel => 
            docRel.type === selectedDocument.type && docRel.number === selectedDocument.documentNumber
          )
        );
        
        if (isRelated) {
          return { ...doc, status: "closed" as DocumentStatus };
        }
        
        return doc;
      });
      
      setDocuments(updatedDocuments);
      setCloseDialogOpen(false);
      
      alert(`Dokument ${selectedDocument.documentNumber} i wszystkie powiązane dokumenty zostały oznaczone jako rozliczone`);
    }
  };
  
  const navigateToServiceOrder = (doc: Document) => {
    // Simulate data transfer to the service order form
    sessionStorage.setItem('documentData', JSON.stringify({
      documentId: doc.id,
      documentNumber: doc.documentNumber,
      documentType: doc.type,
      client: doc.client
    }));
    
    window.location.hash = "#/zlecenia/nowe";
  };

  const handleViewRelationship = (type: string, id: string, number: string) => {
    switch (type) {
      case "invoice":
        // Znajdź dokument faktury po numerze
        const invoiceDoc = documents.find(doc => 
          doc.type === "invoice" && doc.documentNumber === number
        );
        
        if (invoiceDoc) {
          setSelectedDocument(invoiceDoc);
          setPreviewDialogOpen(true);
        } else {
          alert(`Faktura ${number} nie jest dostępna w systemie.`);
        }
        break;
        
      case "protocol":
        // Znajdź dokument protokołu po numerze
        const protocolDoc = documents.find(doc => 
          doc.type === "protocol" && doc.documentNumber === number
        );
        
        if (protocolDoc) {
          setSelectedDocument(protocolDoc);
          setPreviewDialogOpen(true);
        } else {
          alert(`Protokół ${number} nie jest dostępny w systemie.`);
        }
        break;
        
      case "serviceOrder":
        // Przejdź do szczegółów zlecenia serwisowego
        window.location.hash = `#/zlecenia/${id}`;
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Dokumenty OCR</h1>
        <Button 
          className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => window.location.hash = "#/dokumenty/dodaj"}
        >
          <Upload className="size-4" />
          <span>Dodaj dokument</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Dokumenty wymagające akcji</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj dokumentu..." 
                className="pl-9" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select 
                defaultValue="all" 
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Typ dokumentu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  <SelectItem value="invoice">Faktury</SelectItem>
                  <SelectItem value="protocol">Protokoły</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                defaultValue="all" 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="open">Otwarte</SelectItem>
                  <SelectItem value="closed">Zamknięte</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  alert("Otworzono zaawansowane filtry dokumentów");
                }}
              >
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Numer dokumentu</TableHead>
                  <TableHead>Klient</TableHead>
                  <TableHead>Zlecenie</TableHead>
                  <TableHead>Faktura</TableHead>
                  <TableHead>Protokół</TableHead>
                  <TableHead>Data dodania</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Brak dokumentów spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className={doc.status === "closed" ? "bg-slate-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          {getStatusBadge(doc.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {doc.type === "invoice" ? (
                            <FileText className="size-4 text-brand-orange" />
                          ) : (
                            <FileText className="size-4 text-emerald-600" />
                          )}
                          <span>{doc.type === "invoice" ? "Faktura" : "Protokół"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                      <TableCell>{doc.client}</TableCell>
                      <TableCell>
                        {renderRelationship(doc.relationships, "serviceOrder")}
                      </TableCell>
                      <TableCell>
                        {renderRelationship(doc.relationships, "invoice")}
                      </TableCell>
                      <TableCell>
                        {renderRelationship(doc.relationships, "protocol")}
                      </TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    if (doc.status === "error") {
                                      window.location.hash = `#/dokumenty/weryfikacja/${doc.id}`;
                                    } else {
                                      setSelectedDocument(doc);
                                      setPreviewDialogOpen(true);
                                    }
                                  }}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Podgląd</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {doc.status !== "closed" && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        navigateToServiceOrder(doc);
                                      }}
                                    >
                                      <FilePlus className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Utwórz zlecenie</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        setSelectedDocument(doc);
                                        setLinkDialogOpen(true);
                                      }}
                                    >
                                      <LinkIcon className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Powiąż dokument</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-brand-blue hover:text-white hover:bg-brand-blue"
                                      onClick={() => {
                                        setSelectedDocument(doc);
                                        setCloseDialogOpen(true);
                                      }}
                                    >
                                      <Lock className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Oznacz jako zamknięty</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setArchiveDialogOpen(true);
                                  }}
                                >
                                  <Archive className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Archiwizuj</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog do podglądu dokumentu */}
      {selectedDocument && (
        <DocumentPreviewDialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          documentNumber={selectedDocument.documentNumber}
          documentId={selectedDocument.id}
        />
      )}
      
      {/* Dialog do powiązania dokumentu ze zleceniem */}
      {selectedDocument && (
        <DocumentLinkDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          documentNumber={selectedDocument.documentNumber}
          onLink={handleLinkToOrder}
        />
      )}
      
      {/* Dialog potwierdzenia archiwizacji */}
      {selectedDocument && (
        <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiwizacja dokumentu</AlertDialogTitle>
              <AlertDialogDescription>
                Czy na pewno chcesz zarchiwizować dokument <span className="font-medium">{selectedDocument.documentNumber}</span>?
                Zarchiwizowane dokumenty można przywrócić później, ale nie będą widoczne na głównej liście.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchiveDocument}>
                Archiwizuj
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {/* Dialog oznaczania dokumentu jako zamknięty */}
      {selectedDocument && (
        <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Oznaczanie dokumentu jako zamknięty</AlertDialogTitle>
              <AlertDialogDescription>
                Czy na pewno chcesz oznaczyć dokument <span className="font-medium">{selectedDocument.documentNumber}</span> jako zamknięty?
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
      )}
    </div>
  );
}