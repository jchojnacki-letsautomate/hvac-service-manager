
import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  ArrowLeft, FileText, Download, Printer, 
  Share2, CheckCircle, XCircle, Clock, FileSignature,
  Camera, Edit, Trash2, ExternalLink
} from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom"; // Removed - using hash routing
import { Label } from "../ui/label";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "../ui/tabs";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "../ui/dialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "../ui/alert-dialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ProtocolAttachment {
  id: string;
  type: "photo" | "document";
  filename: string;
  description: string;
  url: string;
  thumbnail: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ServiceProtocolDetailProps {
  protocolId?: string;
}

export function ServiceProtocolDetail({ protocolId }: ServiceProtocolDetailProps) {
  // const { id } = useParams(); // Removed - using hash routing
  // const navigate = useNavigate(); // Removed - using hash routing
  const id = protocolId;
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ProtocolAttachment | null>(null);
  
  // Dla celów demonstracyjnych używamy danych statycznych
  // W rzeczywistej aplikacji dane byłyby pobierane z API
  const protocolData = {
    id: id || "1",
    number: "PS/2025/075",
    date: "10.05.2025",
    client: "Biurowiec Gamma",
    address: "ul. Marszałkowska 142, Warszawa",
    contactPerson: "Anna Nowak",
    contactPhone: "+48 123 456 789",
    serviceOrderNumber: "ZL/2025/042",
    serviceOrderId: "1",
    protocolType: "Protokół serwisowy",
    workStartTime: "09:00",
    workEndTime: "11:30",
    totalWorkTime: "2.5h",
    technicianName: "Jan Kowalski",
    technicianNotes: "Wykonano przegląd zgodnie z dokumentacją techniczną. Urządzenia działają prawidłowo, wymieniono filtry. Zalecana ponowna kontrola za 6 miesięcy.",
    clientNotes: "Brak uwag do wykonanej usługi.",
    status: "completed", // draft, pending, completed, rejected
    hasTechnicianSignature: true,
    hasClientSignature: true,
    technicianSignatureDate: "10.05.2025, 11:30",
    clientSignatureDate: "10.05.2025, 11:45",
    createdAt: "10.05.2025, 09:05",
    updatedAt: "10.05.2025, 11:45"
  };
  
  const equipment = [
    {
      id: "1",
      name: "Klimatyzator ścienny Daikin FTXM35R",
      serialNumber: "AB12345678",
      location: "Sala konferencyjna",
      condition: "ok",
      notes: "Urządzenie działa prawidłowo, wymieniono filtry"
    },
    {
      id: "2",
      name: "Jednostka zewnętrzna Daikin 3MXM68N",
      serialNumber: "CD87654321",
      location: "Dach budynku",
      condition: "ok",
      notes: "Urządzenie działa prawidłowo, oczyszczono wymiennik"
    }
  ];

  const serviceTasks = [
    {
      id: "1",
      name: "Czyszczenie filtrów",
      completed: true,
      notes: ""
    },
    {
      id: "2",
      name: "Kontrola ciśnienia czynnika chłodniczego",
      completed: true,
      notes: "7.2 bar - w normie"
    },
    {
      id: "3",
      name: "Czyszczenie wymiennika",
      completed: true,
      notes: ""
    },
    {
      id: "4",
      name: "Kontrola odpływu skroplin",
      completed: true,
      notes: "Drożny, poprawnie odprowadza skropliny"
    }
  ];

  const replacements = [
    {
      id: "1",
      name: "Filtr powietrza",
      quantity: 2,
      isOriginal: true
    }
  ];
  
  const attachments: ProtocolAttachment[] = [
    {
      id: "1",
      type: "photo",
      filename: "klimatyzator_po_serwisie.jpg",
      description: "Klimatyzator po czyszczeniu filtrów",
      url: "https://images.unsplash.com/photo-1540414185315-2fc7d4fdf22f",
      thumbnail: "https://images.unsplash.com/photo-1540414185315-2fc7d4fdf22f?w=200",
      uploadedBy: "Jan Kowalski",
      uploadedAt: "10.05.2025, 10:15"
    },
    {
      id: "2",
      type: "photo",
      filename: "jednostka_zewnetrzna.jpg",
      description: "Jednostka zewnętrzna po czyszczeniu",
      url: "https://images.unsplash.com/photo-1641151787332-de66d3a2902b",
      thumbnail: "https://images.unsplash.com/photo-1641151787332-de66d3a2902b?w=200",
      uploadedBy: "Jan Kowalski",
      uploadedAt: "10.05.2025, 10:25"
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="text-blue-600">Wersja robocza</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Oczekujący</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Zatwierdzony</Badge>;
      case "rejected":
        return <Badge variant="destructive">Odrzucony</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="size-4 text-blue-600" />;
      case "pending":
        return <Clock className="size-4 text-amber-600" />;
      case "completed":
        return <CheckCircle className="size-4 text-emerald-600" />;
      case "rejected":
        return <XCircle className="size-4 text-destructive" />;
      default:
        return <FileText className="size-4" />;
    }
  };
  
  const getEquipmentStatusBadge = (condition: string) => {
    switch (condition) {
      case "ok":
        return <Badge className="bg-emerald-100 text-emerald-700">Sprawny</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700">Wymaga uwagi</Badge>;
      case "error":
        return <Badge variant="destructive">Uszkodzony</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const handlePrint = () => {
    alert(`Drukowanie protokołu: ${protocolData.number}`);
  };
  
  const handleDelete = () => {
    alert(`Protokół ${protocolData.number} został usunięty`);
    setShowDeleteDialog(false);
    window.location.hash = "#/protokoly";
  };
  
  const handleAttachmentClick = (attachment: ProtocolAttachment) => {
    setSelectedAttachment(attachment);
    setShowImageDialog(true);
  };
  
  const handleDownload = () => {
    alert(`Pobieranie protokołu: ${protocolData.number}`);
  };
  
  const handleShare = () => {
    alert(`Udostępnianie protokołu: ${protocolData.number}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/protokoly"}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="m-0">Protokół {protocolData.number}</h1>
          <div className="ml-2 flex items-center gap-2">
            {getStatusIcon(protocolData.status)}
            {getStatusBadge(protocolData.status)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleDownload}
            title="Pobierz protokół"
          >
            <Download className="size-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            title="Pobierz protokół"
            onClick={() => {
              const sanitized = (protocolData.number + " - " + protocolData.technicianNotes.slice(0, 30)).replace(/\s+/g, " ");
              const filename = `${sanitized}.pdf`;
              const blob = new Blob([""], { type: "application/pdf" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleShare}
            title="Udostępnij protokół"
          >
            <Share2 className="size-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2"
                            onClick={() => window.location.hash = `#/protokoly/${id}/edytuj`}
          >
            <Edit className="size-4" />
            <span>Edytuj</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Usuń</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informacje o protokole */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Szczegóły protokołu</CardTitle>
            <CardDescription>
              Protokół serwisowy dla {protocolData.client} z dnia {protocolData.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label className="text-muted-foreground">Numer protokołu</Label>
                <p className="font-medium">{protocolData.number}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Data</Label>
                <p className="font-medium">{protocolData.date}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Typ protokołu</Label>
                <p className="font-medium">{protocolData.protocolType}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Zlecenie serwisowe</Label>
                <p className="font-medium">
                  <Button 
                    variant="link" 
                    className="px-0 h-auto"
                    onClick={() => window.location.hash = `#/zlecenia/${protocolData.serviceOrderId}`}
                  >
                    {protocolData.serviceOrderNumber}
                    <ExternalLink className="size-3 ml-1" />
                  </Button>
                </p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Klient</Label>
                <p className="font-medium">{protocolData.client}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Osoba kontaktowa</Label>
                <p className="font-medium">{protocolData.contactPerson}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Adres</Label>
                <p className="font-medium">{protocolData.address}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Technik</Label>
                <p className="font-medium">{protocolData.technicianName}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Czas pracy</Label>
                <p className="font-medium">
                  {protocolData.workStartTime} - {protocolData.workEndTime} 
                  <span className="text-muted-foreground ml-2">({protocolData.totalWorkTime})</span>
                </p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Data utworzenia</Label>
                <p className="font-medium">{protocolData.createdAt}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-muted-foreground">Uwagi techniczne</Label>
              <p className="p-3 bg-muted/30 rounded-md mt-1">
                {protocolData.technicianNotes}
              </p>
            </div>
            
            <div>
              <Label className="text-muted-foreground">Uwagi klienta</Label>
              <p className="p-3 bg-muted/30 rounded-md mt-1">
                {protocolData.clientNotes || "Brak uwag"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Status i podpisy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Status protokołu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Status protokołu</Label>
              <div className="flex items-center gap-2">
                {getStatusIcon(protocolData.status)}
                {getStatusBadge(protocolData.status)}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-muted-foreground mb-2 block">Podpis technika</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                {protocolData.hasTechnicianSignature ? (
                  <>
                    <div className="italic text-brand-blue">{protocolData.technicianName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {protocolData.technicianSignatureDate}
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Brak podpisu technika</div>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground mb-2 block">Podpis klienta</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                {protocolData.hasClientSignature ? (
                  <>
                    <div className="italic text-brand-blue">{protocolData.contactPerson}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {protocolData.clientSignatureDate}
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Brak podpisu klienta</div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-muted-foreground mb-2 block">Załączniki</Label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAttachmentClick(attachment)}
                  >
                    <div className="w-[100px] h-[75px] relative">
                      <ImageWithFallback
                        src={attachment.thumbnail}
                        alt={attachment.description}
                        width={100}
                        height={75}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 right-0 bg-black/60 text-white p-0.5 rounded-tl-md">
                        <Camera className="size-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Zakładki z listą urządzeń i zadań */}
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="equipment">Urządzenia</TabsTrigger>
          <TabsTrigger value="tasks">Wykonane czynności</TabsTrigger>
          <TabsTrigger value="parts">Materiały</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Lista urządzeń</CardTitle>
              <CardDescription>
                Urządzenia objęte protokołem serwisowym
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Urządzenie</TableHead>
                      <TableHead>Nr seryjny</TableHead>
                      <TableHead>Lokalizacja</TableHead>
                      <TableHead>Stan</TableHead>
                      <TableHead>Uwagi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.serialNumber}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          {getEquipmentStatusBadge(item.condition)}
                        </TableCell>
                        <TableCell>{item.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Wykonane czynności</CardTitle>
              <CardDescription>
                Lista czynności wykonanych podczas wizyty serwisowej
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Czynność</TableHead>
                      <TableHead>Uwagi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          {task.completed ? (
                            <CheckCircle className="size-4 text-emerald-600" />
                          ) : (
                            <XCircle className="size-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.notes || "Brak uwag"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Wymienione komponenty</CardTitle>
              <CardDescription>
                Lista materiałów i komponentów wykorzystanych podczas serwisu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Komponent</TableHead>
                      <TableHead>Ilość</TableHead>
                      <TableHead>Oryginalny</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {replacements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity} szt.</TableCell>
                        <TableCell>
                          {item.isOriginal ? (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <CheckCircle className="size-3 mr-1" />
                              Oryginalny
                            </Badge>
                          ) : (
                            <Badge variant="outline">Zamiennik</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog wyświetlania zdjęcia */}
      {selectedAttachment && (
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedAttachment.description}</DialogTitle>
              <DialogDescription>
                Dodano przez {selectedAttachment.uploadedBy} • {selectedAttachment.uploadedAt}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center p-2 bg-black/5 rounded-md">
              <ImageWithFallback
                src={selectedAttachment.url}
                alt={selectedAttachment.description}
                width={500}
                height={400}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Pobierz zdjęcie
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog usuwania protokołu */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuwanie protokołu</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć protokół <span className="font-medium">{protocolData.number}</span>?
              Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń protokół
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
