
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  ArrowLeft, Save, FileText, FileSignature, 
  Printer, CheckCircle, ListChecks, Clipboard, 
  AlertTriangle, Timer, Camera
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "../ui/select";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, 
  DialogTrigger 
} from "../ui/dialog";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  condition: "ok" | "warning" | "error";
  notes: string;
}

interface ServiceTask {
  id: string;
  name: string;
  completed: boolean;
  notes: string;
}

interface ComponentReplacement {
  id: string;
  name: string;
  quantity: number;
  isOriginal: boolean;
}

export function ServiceProtocolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== undefined && id !== "nowy";
  
  const [protocolData, setProtocolData] = useState({
    number: isEditMode ? "PS/2025/075" : "PS/2025/078", // Autogenerowany numer
    date: new Date().toISOString().split('T')[0],
    client: "Biurowiec Gamma",
    address: "ul. Marszałkowska 142, Warszawa",
    contactPerson: "Anna Nowak",
    contactPhone: "+48 123 456 789",
    serviceOrderNumber: "ZL/2025/042",
    serviceOrderId: "1",
    protocolType: "service", // service, maintenance, installation, measurements
    workStartTime: "09:00",
    workEndTime: "11:30",
    technicianId: "1",
    technicianName: "Jan Kowalski",
    technicianNotes: isEditMode ? 
      "Wykonano przegląd zgodnie z dokumentacją techniczną. Urządzenia działają prawidłowo, wymieniono filtry. Zalecana ponowna kontrola za 6 miesięcy." : "",
    clientNotes: isEditMode ? "Brak uwag do wykonanej usługi." : "",
    status: isEditMode ? "completed" : "draft", // draft, pending, completed, rejected
    hasTechnicianSignature: isEditMode,
    hasClientSignature: isEditMode,
    attachmentCount: isEditMode ? 2 : 0,
  });
  
  const [equipment, setEquipment] = useState<Equipment[]>([
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
  ]);

  const [serviceTasks, setServiceTasks] = useState<ServiceTask[]>([
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
  ]);

  const [replacements, setReplacements] = useState<ComponentReplacement[]>([
    {
      id: "1",
      name: "Filtr powietrza",
      quantity: 2,
      isOriginal: true
    }
  ]);

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<"technician" | "client">("technician");
  
  const getEquipmentStatusBadge = (condition: "ok" | "warning" | "error") => {
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
  
  const getProtocolTypeName = (type: string) => {
    switch (type) {
      case "service":
        return "Protokół serwisowy";
      case "maintenance":
        return "Protokół konserwacji";
      case "installation":
        return "Protokół montażowy";
      case "measurements":
        return "Protokół pomiarowy";
      default:
        return "Protokół";
    }
  };
  
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

  const handleSaveAsDraft = () => {
    alert("Protokół został zapisany jako wersja robocza");
    navigate("/protokoly");
  };

  const handleSubmitForSignature = () => {
    alert("Protokół został zapisany i przygotowany do podpisu klienta");
    navigate("/protokoly");
  };

  const handleAddPhoto = () => {
    setPhotoDialogOpen(false);
    alert("Zdjęcie zostało dodane do protokołu");
    setProtocolData(prev => ({
      ...prev,
      attachmentCount: prev.attachmentCount + 1
    }));
  };

  const handleAddSignature = () => {
    setSignatureDialogOpen(false);
    
    if (signatureType === "technician") {
      setProtocolData(prev => ({
        ...prev,
        hasTechnicianSignature: true
      }));
      alert("Podpis technika został dodany");
    } else {
      setProtocolData(prev => ({
        ...prev,
        hasClientSignature: true,
        status: "completed"
      }));
      alert("Podpis klienta został dodany, protokół oznaczono jako zatwierdzony");
    }
  };

  const handleAddEquipment = () => {
    alert("Funkcja dodawania urządzenia");
  };

  const handleAddTask = () => {
    alert("Funkcja dodawania zadania");
  };

  const handleAddReplacement = () => {
    alert("Funkcja dodawania wymienionych części");
  };

  const handlePrint = () => {
    alert(`Drukowanie protokołu: ${protocolData.number}`);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setServiceTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: checked } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/protokoly")}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="m-0">{isEditMode ? `Edycja protokołu ${protocolData.number}` : "Nowy protokół"}</h1>
          {protocolData.status !== "draft" && (
            <div className="ml-2">
              {getStatusBadge(protocolData.status)}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {protocolData.status === "draft" && (
            <>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleSaveAsDraft}
              >
                <Save className="size-4" />
                <span className="hidden sm:inline">Zapisz wersję roboczą</span>
                <span className="sm:hidden">Zapisz</span>
              </Button>
              
              <Button 
                className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                onClick={handleSubmitForSignature}
              >
                <FileSignature className="size-4" />
                <span className="hidden sm:inline">Zapisz i przygotuj do podpisu</span>
                <span className="sm:hidden">Do podpisu</span>
              </Button>
            </>
          )}
          
          {protocolData.status !== "draft" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="size-4" />
              <span>Drukuj</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informacje podstawowe */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-brand-blue" />
              Informacje o protokole
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocolNumber">Numer protokołu</Label>
                <Input 
                  id="protocolNumber" 
                  value={protocolData.number} 
                  readOnly 
                  className="bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protocolDate">Data protokołu</Label>
                <Input 
                  id="protocolDate" 
                  type="date" 
                  value={protocolData.date}
                  onChange={e => setProtocolData({...protocolData, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protocolType">Typ protokołu</Label>
                <Select 
                  defaultValue={protocolData.protocolType}
                  onValueChange={value => setProtocolData({...protocolData, protocolType: value})}
                >
                  <SelectTrigger id="protocolType">
                    <SelectValue placeholder="Wybierz typ protokołu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Protokół serwisowy</SelectItem>
                    <SelectItem value="maintenance">Protokół konserwacji</SelectItem>
                    <SelectItem value="installation">Protokół montażowy</SelectItem>
                    <SelectItem value="measurements">Protokół pomiarowy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceOrder">Powiązane zlecenie</Label>
                <Input 
                  id="serviceOrder" 
                  value={protocolData.serviceOrderNumber} 
                  readOnly 
                  className="bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technicianName">Technik</Label>
                <Select defaultValue={protocolData.technicianId}>
                  <SelectTrigger id="technicianName">
                    <SelectValue placeholder="Wybierz technika" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jan Kowalski</SelectItem>
                    <SelectItem value="2">Anna Nowak</SelectItem>
                    <SelectItem value="3">Piotr Wiśniewski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Klient</Label>
                <Input 
                  id="client" 
                  value={protocolData.client} 
                  readOnly 
                  className="bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workStartTime">Czas rozpoczęcia prac</Label>
                <Input 
                  id="workStartTime" 
                  type="time" 
                  value={protocolData.workStartTime}
                  onChange={e => setProtocolData({...protocolData, workStartTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workEndTime">Czas zakończenia prac</Label>
                <Input 
                  id="workEndTime" 
                  type="time" 
                  value={protocolData.workEndTime}
                  onChange={e => setProtocolData({...protocolData, workEndTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technicianNotes">Uwagi technika</Label>
              <Textarea 
                id="technicianNotes" 
                placeholder="Opisz wykonane prace, zalecenia, itp."
                rows={4}
                value={protocolData.technicianNotes}
                onChange={e => setProtocolData({...protocolData, technicianNotes: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientNotes">Uwagi klienta</Label>
              <Textarea 
                id="clientNotes" 
                placeholder="Uwagi i spostrzeżenia klienta"
                rows={3}
                value={protocolData.clientNotes}
                onChange={e => setProtocolData({...protocolData, clientNotes: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Panel statusu */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Status protokołu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Status protokołu</Label>
              <div>{getStatusBadge(protocolData.status)}</div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Podpis technika</Label>
                <div>
                  {protocolData.hasTechnicianSignature ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle className="size-3 mr-1" />
                      Podpisano
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Brak podpisu
                    </Badge>
                  )}
                </div>
              </div>
              
              {!protocolData.hasTechnicianSignature && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    setSignatureType("technician");
                    setSignatureDialogOpen(true);
                  }}
                >
                  <FileSignature className="size-4 mr-2" />
                  Podpisz jako technik
                </Button>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Podpis klienta</Label>
                <div>
                  {protocolData.hasClientSignature ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle className="size-3 mr-1" />
                      Podpisano
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Brak podpisu
                    </Badge>
                  )}
                </div>
              </div>
              
              {!protocolData.hasClientSignature && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    setSignatureType("client");
                    setSignatureDialogOpen(true);
                  }}
                >
                  <FileSignature className="size-4 mr-2" />
                  Podpisz jako klient
                </Button>
              )}
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Załączniki</Label>
                <Badge variant="outline">
                  {protocolData.attachmentCount} zdjęć
                </Badge>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => setPhotoDialogOpen(true)}
              >
                <Camera className="size-4 mr-2" />
                Dodaj zdjęcie
              </Button>
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                Drukuj protokół
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Zakładki z listą urządzeń i zadań */}
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Clipboard className="size-4" />
            <span>Urządzenia</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListChecks className="size-4" />
            <span>Czynności</span>
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <FileText className="size-4" />
            <span>Materiały</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Urządzenia</CardTitle>
                <CardDescription>Lista urządzeń objętych protokołem</CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={handleAddEquipment}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                <Plus className="size-4 mr-2" />
                Dodaj urządzenie
              </Button>
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
                    {equipment.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <AlertTriangle className="size-10 mb-2" />
                            <p>Brak urządzeń w protokole</p>
                            <Button 
                              variant="link" 
                              onClick={handleAddEquipment}
                              className="mt-2"
                            >
                              Dodaj urządzenie
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      equipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            {getEquipmentStatusBadge(item.condition)}
                          </TableCell>
                          <TableCell>{item.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Wykonane czynności</CardTitle>
                <CardDescription>Lista czynności wykonanych podczas wizyty serwisowej</CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={handleAddTask}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                <Plus className="size-4 mr-2" />
                Dodaj czynność
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Wykonano</TableHead>
                      <TableHead>Czynność</TableHead>
                      <TableHead>Uwagi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <AlertTriangle className="size-10 mb-2" />
                            <p>Brak czynności w protokole</p>
                            <Button 
                              variant="link" 
                              onClick={handleAddTask}
                              className="mt-2"
                            >
                              Dodaj czynność
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      serviceTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox 
                              id={`task-${task.id}`} 
                              checked={task.completed}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange(task.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <label 
                              htmlFor={`task-${task.id}`}
                              className="cursor-pointer"
                            >
                              {task.name}
                            </label>
                          </TableCell>
                          <TableCell>{task.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Wymienione komponenty</CardTitle>
                <CardDescription>Lista materiałów i komponentów wykorzystanych podczas serwisu</CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={handleAddReplacement}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                <Plus className="size-4 mr-2" />
                Dodaj komponent
              </Button>
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
                    {replacements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <AlertTriangle className="size-10 mb-2" />
                            <p>Brak wymienionych komponentów</p>
                            <Button 
                              variant="link" 
                              onClick={handleAddReplacement}
                              className="mt-2"
                            >
                              Dodaj komponent
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      replacements.map((item) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog dodawania zdjęcia */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dodaj zdjęcie do protokołu</DialogTitle>
            <DialogDescription>
              Zrób zdjęcie lub wybierz istniejące z urządzenia
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center bg-muted/30">
              <Camera className="size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-2">
                Przeciągnij i upuść zdjęcie lub kliknij, aby wybrać
              </p>
              <Button variant="outline" size="sm">
                Wybierz plik
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="photoDescription">Opis zdjęcia</Label>
              <Textarea 
                id="photoDescription" 
                placeholder="Opisz to, co widać na zdjęciu, np. 'Wymiennik jednostki zewnętrznej po czyszczeniu'"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddPhoto} className="bg-brand-blue hover:bg-brand-blue/90">
              Dodaj zdjęcie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog zbierania podpisu */}
      <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {signatureType === "technician" ? "Podpis technika" : "Podpis klienta"}
            </DialogTitle>
            <DialogDescription>
              {signatureType === "technician" 
                ? "Złóż podpis potwierdzający wykonanie prac serwisowych"
                : "Poproś klienta o podpis potwierdzający odbiór wykonanych prac"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="border-2 rounded-md h-[200px] flex items-center justify-center bg-muted/30">
              <p className="text-muted-foreground">
                Tutaj będzie obszar do składania podpisu
              </p>
            </div>
            
            {signatureType === "client" && (
              <Alert>
                <AlertTitle className="flex items-center gap-1">
                  <InfoIcon className="size-4" />
                  Informacja
                </AlertTitle>
                <AlertDescription>
                  Podpis klienta oznacza protokół jako zatwierdzony i zakończony.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignatureDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddSignature} className="bg-brand-blue hover:bg-brand-blue/90">
              Zatwierdź podpis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
