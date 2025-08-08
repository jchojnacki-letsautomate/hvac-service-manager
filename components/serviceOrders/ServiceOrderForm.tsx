import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  CalendarIcon, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Building2, 
  User2, 
  MapPin, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Wrench,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Calendar as CalendarIcon2,
  ClipboardList
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InventoryReservation, InventoryReservationItem } from "../inventory/InventoryReservation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  installationDate?: string;
  lastService?: string;
}

export function ServiceOrderForm({ isNew = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [plannedDate, setPlannedDate] = useState<Date>(new Date());
  const [clientId, setClientId] = useState("");
  const [serviceType, setServiceType] = useState("maintenance");
  const [priority, setPriority] = useState("normal");
  const [status, setStatus] = useState("new");
  const [technicianId, setTechnicianId] = useState("");
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [isFromDocument, setIsFromDocument] = useState(false);
  const [documentData, setDocumentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("materials");
  const [inventoryReservations, setInventoryReservations] = useState<InventoryReservationItem[]>([]);
  const [showReservationWarning, setShowReservationWarning] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [activeFinanceTab, setActiveFinanceTab] = useState("parts");

  // Prefill data from document if available
  useEffect(() => {
    const storedData = sessionStorage.getItem('documentData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setDocumentData(parsed);
      setIsFromDocument(true);
      setClientId(parsed.client === "Biurowiec Gamma" ? "1" : 
               parsed.client === "Hotel Metropol" ? "2" : 
               parsed.client === "ABC Sp. z o.o." ? "3" : "4");
      
      sessionStorage.removeItem('documentData');
    }
  }, []);

  // Prefill equipment data if available
  useEffect(() => {
    const storedEquipData = sessionStorage.getItem('equipmentData');
    if (storedEquipData) {
      const parsed = JSON.parse(storedEquipData);
      if (parsed.clientId) {
        setClientId(parsed.clientId);
      }
      if (parsed.equipmentId) {
        setSelectedEquipmentId(parsed.equipmentId);
      }
      
      sessionStorage.removeItem('equipmentData');
    }
  }, []);
  
  // Check for conflicts between directly added parts and reservations
  useEffect(() => {
    if (selectedItems.length > 0 && inventoryReservations.length > 0) {
      const reservedItemIds = inventoryReservations.map(res => res.productId);
      const itemOverlap = selectedItems.some(item => reservedItemIds.includes(item.id));
      setShowReservationWarning(itemOverlap);
    } else {
      setShowReservationWarning(false);
    }
  }, [selectedItems, inventoryReservations]);

  // Set default description and service type based on query parameters
  useEffect(() => {
    if (isEditMode) {
      setDescription("Okresowy przegląd systemu klimatyzacji w biurze klienta. Sprawdzenie filtrów, czyszczenie jednostek wewnętrznych, kontrola czynnika chłodniczego.");
    } else {
      // Check for type parameter in URL
      const searchParams = new URLSearchParams(window.location.search);
      const orderType = searchParams.get("type");
      if (orderType === "order") {
        setServiceType("order");
        setDescription("Zamówienie części i materiałów dla wykonania prac serwisowych.");
      }
    }
  }, [isEditMode]);

  // Mock data
  const clients = [
    { id: "1", name: "Biurowiec Gamma", address: "ul. Marszałkowska 142, 00-061 Warszawa" },
    { id: "2", name: "Hotel Metropol", address: "ul. Marszałkowska 99a, 00-693 Warszawa" },
    { id: "3", name: "ABC Sp. z o.o.", address: "ul. Złota 59, 00-120 Warszawa" },
    { id: "4", name: "Delta Office Park", address: "ul. Konstruktorska 13, 02-673 Warszawa" },
  ];

  const technicians = [
    { id: "1", name: "Jan Kowalski", specialization: "Klimatyzacje", phone: "+48 500 600 700", email: "j.kowalski@hvacservice.pl" },
    { id: "2", name: "Anna Nowak", specialization: "Wentylacje", phone: "+48 600 700 800", email: "a.nowak@hvacservice.pl" },
    { id: "3", name: "Piotr Wiśniewski", specialization: "Kompleksowy", phone: "+48 700 800 900", email: "p.wisniewski@hvacservice.pl" },
    { id: "4", name: "Magdalena Jankowska", specialization: "Klimatyzacje", phone: "+48 800 900 100", email: "m.jankowska@hvacservice.pl" },
  ];

  const equipmentList: Equipment[] = [
    { id: "1", name: "Klimatyzator ścienny Daikin FTXM35R", serialNumber: "AB12345678", location: "Sala konferencyjna", installationDate: "15.06.2022", lastService: "12.11.2024" },
    { id: "2", name: "Klimatyzator kasetonowy LG UT36R", serialNumber: "CD98765432", location: "Open space", installationDate: "20.03.2021", lastService: "05.09.2024" },
    { id: "3", name: "Jednostka kanałowa Mitsubishi PEAD-M50JA", serialNumber: "EF45678901", location: "Serwerownia", installationDate: "10.09.2023", lastService: "01.04.2025" },
    { id: "4", name: "Centrala wentylacyjna Komfovent Domekt", serialNumber: "GH23456789", location: "Dach", installationDate: "25.11.2020", lastService: "15.02.2025" },
  ];

  const inventoryItems: InventoryItem[] = [
    { id: "1", name: "Filtr do klimatyzatora", partNumber: "FLT-001", qty: 1, unit: "szt.", unitPrice: 45.00 },
    { id: "2", name: "Czynnik chłodniczy R32", partNumber: "R32-100", qty: 1, unit: "kg", unitPrice: 180.00 },
    { id: "3", name: "Czujnik temperatury", partNumber: "TMP-002", qty: 1, unit: "szt.", unitPrice: 60.00 },
    { id: "4", name: "Presostat LP", partNumber: "PRS-001", qty: 1, unit: "szt.", unitPrice: 120.00 },
    { id: "5", name: "Zawór trójdrogowy", partNumber: "VLV-003", qty: 1, unit: "szt.", unitPrice: 95.00 },
  ];

  const services: Service[] = [
    { id: "1", name: "Przegląd okresowy klimatyzacji", duration: 60, price: 200.00 },
    { id: "2", name: "Czyszczenie wymiennika", duration: 90, price: 250.00 },
    { id: "3", name: "Dezynfekcja układu", duration: 45, price: 150.00 },
    { id: "4", name: "Sprawdzenie szczelności", duration: 30, price: 100.00 },
    { id: "5", name: "Pomiar parametrów pracy", duration: 30, price: 80.00 },
  ];

  // Helper functions
  const addInventoryItem = (item: InventoryItem) => {
    setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
  };

  const updateItemQuantity = (id: string, qty: number) => {
    setSelectedItems(
      selectedItems.map((item) => 
        item.id === id ? { ...item, qty: qty < 1 ? 1 : qty } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const addService = (service: Service) => {
    setSelectedServices([...selectedServices, service]);
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter((service) => service.id !== id));
  };

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    return { itemsTotal, servicesTotal, total: itemsTotal + servicesTotal };
  };
  
  const handleReservationsChange = (reservations: InventoryReservationItem[]) => {
    setInventoryReservations(reservations);
  };
  
  const selectedEquipment = equipmentList.find(eq => eq.id === selectedEquipmentId);
  const selectedClient = clients.find(c => c.id === clientId);
  const selectedTechnician = technicians.find(tech => tech.id === technicianId);
  const totals = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode) {
      alert("Zlecenie zostało zaktualizowane");
    } else {
      alert("Nowe zlecenie zostało utworzone");
    }
    
    navigate("/zlecenia");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header with navigation and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/zlecenia")}>
            <ArrowLeft className="icon-balanced" />
          </Button>
          <h1 className="mb-0">{isEditMode ? "Edytuj zlecenie" : "Nowe zlecenie serwisowe"}</h1>
          {isFromDocument && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Na podstawie dokumentu {documentData?.documentNumber}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/zlecenia")} type="button">
            Anuluj
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={handleSubmit}>
            {isEditMode ? "Zaktualizuj zlecenie" : "Utwórz zlecenie"}
          </Button>
        </div>
      </div>

      <Separator />

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Order Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="icon-balanced text-brand-blue" />
                Informacje o zleceniu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Numer zlecenia</Label>
                  <Input 
                    id="orderNumber" 
                    placeholder="Automatycznie wygenerowany" 
                    disabled={!isEditMode}
                    defaultValue={isEditMode ? "ZL/2025/042" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data zlecenia</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 icon-balanced" />
                        {date ? format(date, "dd.MM.yyyy", {locale: pl}) : "Wybierz datę"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plannedDate">Planowana data realizacji</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 icon-balanced" />
                        {plannedDate ? format(plannedDate, "dd.MM.yyyy", {locale: pl}) : "Wybierz datę"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={plannedDate}
                        onSelect={(date) => date && setPlannedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Rodzaj usługi</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Wybierz rodzaj usługi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Montaż</SelectItem>
                      <SelectItem value="maintenance">Przegląd</SelectItem>
                      <SelectItem value="repair">Naprawa</SelectItem>
                      <SelectItem value="diagnosis">Diagnostyka</SelectItem>
                      <SelectItem value="warranty">Gwarancja</SelectItem>
                      <SelectItem value="order">Zamówienie</SelectItem>
                      <SelectItem value="other">Inna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorytet</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Wybierz priorytet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niski</SelectItem>
                      <SelectItem value="normal">Normalny</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                      <SelectItem value="urgent">Pilny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Wybierz status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nowe</SelectItem>
                      <SelectItem value="planned">Zaplanowane</SelectItem>
                      <SelectItem value="inProgress">W realizacji</SelectItem>
                      <SelectItem value="completed">Wykonane</SelectItem>
                      <SelectItem value="cancelled">Anulowane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="description">Opis zlecenia</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Opisz problem i zakres prac..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Client and Equipment Section (2 cards in 1 row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="icon-balanced text-brand-blue" />
                  Klient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz klienta" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedClient && (
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="flex gap-2 items-start">
                      <Building2 className="size-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedClient.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedClient.address}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Button variant="outline" size="sm" className="h-8">
                            <MapPin className="size-3.5 mr-1" /> Lokalizacje
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            <User2 className="size-3.5 mr-1" /> Kontakty
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Equipment Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="icon-balanced text-brand-blue" />
                  Urządzenie
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedEquipmentId ? (
                  <div className="space-y-4">
                    <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz urządzenie" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentList.map((equipment) => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="icon-balanced mr-2" /> Dodaj nowe urządzenie
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{selectedEquipment?.name}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => setSelectedEquipmentId("")}
                      >
                        Zmień
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Numer seryjny:</span>
                      <span>{selectedEquipment?.serialNumber}</span>
                      
                      <span className="text-muted-foreground">Lokalizacja:</span>
                      <span>{selectedEquipment?.location}</span>
                      
                      {selectedEquipment?.installationDate && (
                        <>
                          <span className="text-muted-foreground">Data instalacji:</span>
                          <span>{selectedEquipment.installationDate}</span>
                        </>
                      )}
                      
                      {selectedEquipment?.lastService && (
                        <>
                          <span className="text-muted-foreground">Ostatni serwis:</span>
                          <span>{selectedEquipment.lastService}</span>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => alert(`Przejście do szczegółów urządzenia ${selectedEquipment?.id}`)}
                    >
                      Szczegóły urządzenia
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Services and Parts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="icon-balanced text-brand-blue" />
                Usługi i materiały
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="services" className="flex items-center gap-2">
                    <Wrench className="icon-balanced" />
                    <span>Usługi</span>
                  </TabsTrigger>
                  <TabsTrigger value="parts" className="flex items-center gap-2">
                    <Package className="icon-balanced" />
                    <span>Części</span>
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="flex items-center gap-2">
                    <ShoppingCart className="icon-balanced" />
                    <span>Rezerwacje</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4">
                  <div className="flex justify-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-1" type="button">
                          <Plus className="icon-balanced" /> Dodaj usługę
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Dostępne usługi</h4>
                          <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {services
                              .filter(service => !selectedServices.some(s => s.id === service.id))
                              .map(service => (
                                <div 
                                  key={service.id} 
                                  className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer"
                                  onClick={() => {
                                    addService(service);
                                    document.body.click(); // Close popover
                                  }}
                                >
                                  <div>
                                    <p className="font-medium">{service.name}</p>
                                    <p className="text-sm text-muted-foreground">{service.duration} min</p>
                                  </div>
                                  <p className="font-medium">{service.price.toFixed(2)} zł</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Usługa</TableHead>
                          <TableHead className="w-[20%]">Czas</TableHead>
                          <TableHead className="text-right w-[20%]">Cena</TableHead>
                          <TableHead className="w-[10%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedServices.length > 0 ? (
                          selectedServices.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell className="font-medium">{service.name}</TableCell>
                              <TableCell>{service.duration} min</TableCell>
                              <TableCell className="text-right">{service.price.toFixed(2)} zł</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeService(service.id)}
                                  type="button"
                                >
                                  <Trash2 className="icon-balanced text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-12">
                              Brak usług
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Parts Tab */}
                <TabsContent value="parts" className="space-y-4">
                  <div className="flex justify-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-1" type="button">
                          <Plus className="icon-balanced" /> Dodaj część
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Dostępne części</h4>
                          <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {inventoryItems
                              .filter(item => !selectedItems.some(i => i.id === item.id))
                              .map(item => (
                                <div 
                                  key={item.id} 
                                  className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer"
                                  onClick={() => {
                                    addInventoryItem(item);
                                    document.body.click(); // Close popover
                                  }}
                                >
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.partNumber}</p>
                                  </div>
                                  <p className="font-medium">{item.unitPrice.toFixed(2)} zł</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Nazwa</TableHead>
                          <TableHead className="w-[25%]">Ilość</TableHead>
                          <TableHead className="text-right w-[25%]">Razem</TableHead>
                          <TableHead className="w-[10%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItems.length > 0 ? (
                          selectedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p>{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.partNumber}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    className="w-16"
                                    type="number"
                                    min="1"
                                    value={item.qty}
                                    onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                                  />
                                  <span>{item.unit}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{(item.unitPrice * item.qty).toFixed(2)} zł</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.id)}
                                  type="button"
                                >
                                  <Trash2 className="icon-balanced text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-12">
                              Brak części
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {showReservationWarning && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded">
                      <AlertTriangle className="icon-balanced" />
                      <p className="text-sm">
                        Niektóre z wybranych części są również zarezerwowane w zakładce "Rezerwacje magazynowe".
                        Zalecamy korzystanie tylko z jednej metody, aby uniknąć podwójnego dodania tych samych produktów.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Reservations Tab */}
                <TabsContent value="reservations" className="min-h-[200px]">
                  <InventoryReservation 
                    orderId={isEditMode ? "ZL/2025/042" : undefined}
                    clientId={clientId}
                    clientName={clients.find(c => c.id === clientId)?.name}
                    onReservationsChange={handleReservationsChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Technician Assignment Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User2 className="icon-balanced text-brand-blue" />
                Przypisany technik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedTechnician ? (
                <div className="space-y-4">
                  <Select value={technicianId} onValueChange={setTechnicianId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Przypisz technika" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} ({tech.specialization})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-larger">
                      <AvatarFallback>{selectedTechnician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedTechnician.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedTechnician.specialization}</p>
                      <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground">
                        <Phone className="size-3" />
                        {selectedTechnician.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setTechnicianId("")}
                    >
                      Zmień
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="icon-balanced mr-2 size-3.5" />
                      Kontakt
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Financial Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="icon-balanced text-brand-blue" />
                Rozliczenie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="text-muted-foreground">Wartość usług:</span>
                    <span>{totals.servicesTotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="text-muted-foreground">Wartość części:</span>
                    <span>{totals.itemsTotal.toFixed(2)} zł</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-medium">Razem brutto:</span>
                    <span className="font-medium">{totals.total.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Netto:</span>
                    <span>{(totals.total * 0.77).toFixed(2)} zł</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="vat" />
                  <label
                    htmlFor="vat"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Kwota zawiera podatek VAT (23%)
                  </label>
                </div>
                
                {totals.total > 0 && (
                  <Button 
                    className="w-full mt-4 bg-brand-blue hover:bg-brand-blue/90 gap-2"
                    onClick={() => alert("Przekierowanie do generowania faktury zaliczkowej")}
                  >
                    <FileText className="icon-balanced size-4" />
                    Generuj fakturę zaliczkową
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="icon-balanced text-brand-blue" />
                Status zlecenia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={status === "new" ? "default" : "outline"}
                  onClick={() => setStatus("new")}
                  size="sm"
                  className={status === "new" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                >
                  Nowe
                </Button>
                <Button 
                  variant={status === "inProgress" ? "default" : "outline"}
                  onClick={() => setStatus("inProgress")}
                  size="sm"
                  className={status === "inProgress" ? "bg-brand-orange hover:bg-brand-orange/90" : ""}
                >
                  W realizacji
                </Button>
                <Button 
                  variant={status === "completed" ? "default" : "outline"}
                  onClick={() => setStatus("completed")}
                  size="sm"
                  className={status === "completed" ? "bg-green-600 hover:bg-green-600/90" : ""}
                >
                  Zakończone
                </Button>
              </div>
              
              {clientId && selectedEquipmentId && (
                <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 gap-2 mt-4"
                      onClick={() => alert("Przekierowanie do generowania protokołu")}>
                  <FileText className="icon-balanced size-4" />
                  Utwórz protokół
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}