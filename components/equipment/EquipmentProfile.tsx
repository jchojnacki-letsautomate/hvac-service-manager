
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, CheckCircle, Settings, Building2, MapPin, Calendar, Wrench, 
  FileText, Clock, MessageCircle, Pencil, Plus, Save, X, Link2, Upload 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog";
import { toast } from "sonner";

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  technician: string;
  notes: string;
  orderNumber: string;
}

interface Document {
  name: string;
  type: string;
}

interface RelatedEquipment {
  id: string;
  name: string;
}

export function EquipmentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // States for editable fields
  const [manufacturer, setManufacturer] = useState("Daikin");
  const [model, setModel] = useState("FTXM35R");
  const [serialNumber, setSerialNumber] = useState("AB12345678");
  const [type, setType] = useState("Split ścienny");
  const [installDate, setInstallDate] = useState("12.06.2023");
  const [warrantyExpiry, setWarrantyExpiry] = useState("12.06.2025");
  const [clientName, setClientName] = useState("Hotel Metropol");
  const [location, setLocation] = useState("Sala konferencyjna");
  const [equipmentName, setEquipmentName] = useState("Klimatyzator ścienny Daikin FTXM35R");
  const [status, setStatus] = useState("operational");
  
  // States for adding related equipment
  const [newRelatedEquipment, setNewRelatedEquipment] = useState("");
  const [relatedEquipmentList, setRelatedEquipmentList] = useState<RelatedEquipment[]>([
    { id: "5", name: "Jednostka zewnętrzna 2MXM40N" },
    { id: "6", name: "Klimatyzator ścienny FTXM20R" }
  ]);
  
  // States for adding documents
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentType, setNewDocumentType] = useState("PDF");
  const [documentsList, setDocumentsList] = useState<Document[]>([
    { name: "Instrukcja obsługi", type: "PDF" },
    { name: "Karta katalogowa", type: "PDF" },
    { name: "Protokół montażu", type: "PDF" },
    { name: "Karta gwarancyjna", type: "PDF" }
  ]);
  
  // Mock data for selections
  const equipmentTypes = [
    "Split ścienny",
    "Kasetonowy",
    "Kanałowy",
    "Przypodłogowy",
    "Konsolowy",
    "Multi Split",
    "Agregat wody lodowej",
    "Centrala wentylacyjna"
  ];
  
  const manufacturers = [
    "Daikin",
    "Mitsubishi Electric",
    "LG",
    "Samsung",
    "Toshiba",
    "Carrier",
    "York",
    "Fujitsu",
    "Hitachi",
    "Komfovent"
  ];
  
  const documentTypes = ["PDF", "DOC", "JPG", "PNG", "XLS"];
  
  const availableEquipment = [
    { id: "7", name: "Klimatyzator ścienny FTXM25R" },
    { id: "8", name: "Jednostka zewnętrzna 3MXM52N" },
    { id: "9", name: "Klimatyzator kanałowy FDXM35F" }
  ];
  
  // Mock equipment data for other components
  const equipment = {
    id: id || "1",
    name: equipmentName,
    type: type,
    model: model,
    serialNumber: serialNumber,
    manufacturer: manufacturer,
    installDate: installDate,
    lastService: "12.03.2025",
    nextService: "12.09.2025",
    warrantyExpiry: warrantyExpiry,
    status: status,
    client: {
      id: "2",
      name: clientName,
      address: "ul. Marszałkowska 99a, 00-693 Warszawa"
    },
    location: location,
    attributes: [
      { name: "Moc chłodnicza", value: "3,5 kW" },
      { name: "Moc grzewcza", value: "4,0 kW" },
      { name: "Poziom hałasu", value: "19 dB(A)" },
      { name: "Czynnik chłodniczy", value: "R32" },
      { name: "SEER", value: "8,65" },
      { name: "SCOP", value: "5,10" }
    ],
    maintenanceHistory: [
      { id: "1", date: "12.03.2025", type: "Przegląd okresowy", technician: "Jan Kowalski", notes: "Wymiana filtrów, czyszczenie wymiennika, kontrola parametrów pracy", orderNumber: "ZL/2025/035" },
      { id: "2", date: "15.09.2024", type: "Przegląd okresowy", technician: "Anna Nowak", notes: "Wymiana filtrów, kontrola parametrów pracy", orderNumber: "ZL/2024/187" },
      { id: "3", date: "10.03.2024", type: "Naprawa", technician: "Jan Kowalski", notes: "Wymiana płyty elektroniki jednostki wewnętrznej", orderNumber: "ZL/2024/052" }
    ],
    hasConversations: true
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Sprawny</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Uwaga</Badge>;
      case "critical":
        return <Badge variant="destructive">Awaria</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Serwis</Badge>;
      case "offline":
        return <Badge variant="outline" className="text-muted-foreground">Nieaktywny</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const createServiceOrder = () => {
    sessionStorage.setItem('equipmentData', JSON.stringify({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      serialNumber: equipment.serialNumber,
      clientId: equipment.client.id,
      clientName: equipment.client.name,
      location: equipment.location
    }));
    
    navigate('/zlecenia/nowe');
  };
  
  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success("Zmiany zostały zapisane", {
      description: "Informacje o urządzeniu zostały zaktualizowane."
    });
  };
  
  const handleCancelEdit = () => {
    // Reset form values to original
    setManufacturer("Daikin");
    setModel("FTXM35R");
    setSerialNumber("AB12345678");
    setType("Split ścienny");
    setInstallDate("12.06.2023");
    setWarrantyExpiry("12.06.2025");
    setClientName("Hotel Metropol");
    setLocation("Sala konferencyjna");
    setStatus("operational");
    setIsEditing(false);
  };
  
  const addRelatedEquipment = (selectedId: string) => {
    const selected = availableEquipment.find(e => e.id === selectedId);
    if (selected) {
      setRelatedEquipmentList(prev => [...prev, selected]);
      toast.success("Urządzenie dodane", {
        description: `Powiązano urządzenie: ${selected.name}`
      });
    }
    setNewRelatedEquipment("");
  };
  
  const addDocument = () => {
    if (newDocumentName.trim()) {
      setDocumentsList(prev => [...prev, { name: newDocumentName, type: newDocumentType }]);
      setNewDocumentName("");
      toast.success("Dokument dodany", {
        description: `Dokument "${newDocumentName}" został dodany.`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/urzadzenia")}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>{equipment.name}</h1>
        <div className="ml-auto flex gap-2">
          {equipment.hasConversations && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate(`/konwersacje?equipmentId=${equipment.id}`)}
            >
              <MessageCircle className="icon-balanced" />
              <span className="hidden sm:inline">Konwersacje</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => createServiceOrder()}
          >
            <Wrench className="icon-balanced" />
            <span className="hidden sm:inline">Utwórz zlecenie</span>
          </Button>
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleCancelEdit}
              >
                <X className="icon-balanced" />
                <span className="sm:inline">Anuluj</span>
              </Button>
              <Button 
                className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
                onClick={handleSaveChanges}
              >
                <Save className="icon-balanced" />
                <span className="sm:inline">Zapisz</span>
              </Button>
            </>
          ) : (
            <Button 
              className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="icon-balanced" />
              <span className="sm:inline">Edytuj</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Główna karta informacyjna - połączone informacje */}
          <Card className="card-balanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Informacje o urządzeniu</CardTitle>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Sprawny</SelectItem>
                      <SelectItem value="warning">Uwaga</SelectItem>
                      <SelectItem value="critical">Awaria</SelectItem>
                      <SelectItem value="maintenance">Serwis</SelectItem>
                      <SelectItem value="offline">Nieaktywny</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <CheckCircle className="icon-balanced text-emerald-500" />
                    {getStatusBadge(equipment.status)}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Producent</p>
                  {isEditing ? (
                    <Select value={manufacturer} onValueChange={setManufacturer}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz producenta" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map((mfr) => (
                          <SelectItem key={mfr} value={mfr}>{mfr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{equipment.manufacturer}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  {isEditing ? (
                    <Input 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)} 
                      placeholder="Wpisz model urządzenia"
                    />
                  ) : (
                    <p className="font-medium">{equipment.model}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Numer seryjny</p>
                  {isEditing ? (
                    <Input 
                      value={serialNumber} 
                      onChange={(e) => setSerialNumber(e.target.value)} 
                      placeholder="Wpisz numer seryjny"
                    />
                  ) : (
                    <p className="font-medium">{equipment.serialNumber}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Typ urządzenia</p>
                  {isEditing ? (
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz typ urządzenia" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map((eqType) => (
                          <SelectItem key={eqType} value={eqType}>{eqType}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{equipment.type}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Data instalacji</p>
                  {isEditing ? (
                    <Input 
                      type="text" 
                      value={installDate} 
                      onChange={(e) => setInstallDate(e.target.value)} 
                      placeholder="dd.mm.rrrr"
                    />
                  ) : (
                    <p className="font-medium">{equipment.installDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Gwarancja</p>
                  {isEditing ? (
                    <Input 
                      type="text" 
                      value={warrantyExpiry} 
                      onChange={(e) => setWarrantyExpiry(e.target.value)} 
                      placeholder="dd.mm.rrrr"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="icon-balanced text-muted-foreground" />
                      <p className="font-medium">Do {equipment.warrantyExpiry}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Klient</p>
                  {isEditing ? (
                    <Input 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      placeholder="Nazwa klienta"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="icon-balanced text-muted-foreground" />
                      <p className="font-medium">{equipment.client.name}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Lokalizacja</p>
                  {isEditing ? (
                    <Input 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      placeholder="Lokalizacja urządzenia"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="icon-balanced text-muted-foreground" />
                      <p className="font-medium">{equipment.location}, {equipment.client.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Ostatni serwis</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="icon-balanced text-muted-foreground" />
                    <p className="font-medium">{equipment.lastService}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Następny serwis</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="icon-balanced text-muted-foreground" />
                    <p className="font-medium">{equipment.nextService}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sekcja Historia serwisowa */}
          <Card className="card-balanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Historia serwisowa</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 button-balanced"
                onClick={() => navigate(`/zlecenia/nowe`)}
              >
                <Wrench className="icon-balanced" />
                <span>Zaplanuj serwis</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Technik</TableHead>
                      <TableHead>Zlecenie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.maintenanceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="font-medium">{record.type}</TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/zlecenia/${record.id}`)}>
                            {record.orderNumber}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {/* Zdjęcie urządzenia */}
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Urządzenie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <ImageWithFallback
                  src="/images/daikin-ftxm35r.jpg"
                  alt={equipment.name}
                  width={300}
                  height={200}
                  className="w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Powiązane urządzenia */}
          <Card className="card-balanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Powiązane urządzenia</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="size-4" /> Dodaj
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj powiązane urządzenie</DialogTitle>
                    <DialogDescription>
                      Wybierz urządzenie, które chcesz powiązać z obecnym.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={newRelatedEquipment} onValueChange={setNewRelatedEquipment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz urządzenie" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEquipment.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewRelatedEquipment("")}>Anuluj</Button>
                    <Button 
                      onClick={() => addRelatedEquipment(newRelatedEquipment)}
                      disabled={!newRelatedEquipment}
                      className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
                    >
                      <Link2 className="size-4" />
                      Powiąż urządzenie
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedEquipmentList.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Brak powiązanych urządzeń</p>
                ) : (
                  relatedEquipmentList.map((relatedEq) => (
                    <div key={relatedEq.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <Settings className="icon-balanced text-muted-foreground" />
                        <span>{relatedEq.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/urzadzenia/${relatedEq.id}`)}>
                        Podgląd
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Dokumenty */}
          <Card className="card-balanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Dokumenty</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="size-4" /> Dodaj
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj dokument</DialogTitle>
                    <DialogDescription>
                      Wprowadź informacje o dokumencie lub prześlij plik.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="docName" className="text-sm font-medium">Nazwa dokumentu</label>
                      <Input 
                        id="docName" 
                        value={newDocumentName} 
                        onChange={(e) => setNewDocumentName(e.target.value)} 
                        placeholder="Np. Instrukcja obsługi"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="docType" className="text-sm font-medium">Typ dokumentu</label>
                      <Select value={newDocumentType} onValueChange={setNewDocumentType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wybierz typ dokumentu" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prześlij plik</label>
                      <div className="border border-dashed rounded p-4 text-center">
                        <Upload className="size-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Przeciągnij i upuść plik lub</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Wybierz plik
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewDocumentName("")}>Anuluj</Button>
                    <Button 
                      onClick={addDocument}
                      disabled={!newDocumentName.trim()}
                      className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
                    >
                      <Plus className="size-4" />
                      Dodaj dokument
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentsList.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Brak dokumentów</p>
                ) : (
                  documentsList.map((doc, index) => (
                    <div key={index} className="flex items-center p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2 flex-grow">
                        <FileText className="icon-balanced text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Podgląd
                      </Button>
                    </div>
                  ))
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Dokumenty powiązane</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Protokół montażowy PM/2023/056</span>
                    <Button variant="ghost" size="sm">Podgląd</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Faktura FV/2023/211</span>
                    <Button variant="ghost" size="sm">Podgląd</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
