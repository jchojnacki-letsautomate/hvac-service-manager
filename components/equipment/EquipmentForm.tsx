import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Building2, Calendar, MapPin, Plus, Wrench, InfoIcon, UploadCloud, QrCode, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { toast } from "sonner@2.0.3";

interface EquipmentAttribute {
  id: string;
  name: string;
  value: string;
}

interface MaintenanceTask {
  id: string;
  name: string;
  frequency: number;
  frequencyUnit: string;
  description: string;
}

export function EquipmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [equipmentType, setEquipmentType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("operational");
  const [isUnderWarranty, setIsUnderWarranty] = useState(false);
  const [isUnderContract, setIsUnderContract] = useState(false);
  const [installDate, setInstallDate] = useState<Date | undefined>(new Date());
  const [warrantyDate, setWarrantyDate] = useState<Date | undefined>(new Date());
  const [attributes, setAttributes] = useState<EquipmentAttribute[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!id);
  
  // Check if we have equipment data to prefill
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      
      // In a real application, this would be an API call
      // For now we'll set mock data
      setEquipmentType("split");
      setManufacturer("daikin");
      setClientId("2");
      setStatus("operational");
      setIsUnderWarranty(true);
      setIsUnderContract(true);
      
      const mockInstallDate = new Date("2023-06-12");
      setInstallDate(mockInstallDate);
      
      const mockWarrantyDate = new Date("2025-06-12");
      setWarrantyDate(mockWarrantyDate);
      
      setAttributes([
        { id: "1", name: "Moc chłodnicza", value: "3,5 kW" },
        { id: "2", name: "Moc grzewcza", value: "4,0 kW" },
        { id: "3", name: "Poziom hałasu", value: "19 dB(A)" },
        { id: "4", name: "Czynnik chłodniczy", value: "R32" },
        { id: "5", name: "SEER", value: "8,65" },
        { id: "6", name: "SCOP", value: "5,10" }
      ]);
      
      setMaintenanceTasks([
        { id: "1", name: "Przegląd ogólny", frequency: 6, frequencyUnit: "months", description: "Ogólny przegląd urządzenia, czyszczenie filtrów" },
        { id: "2", name: "Czyszczenie wymiennika", frequency: 12, frequencyUnit: "months", description: "Czyszczenie chemiczne wymiennika jednostki wewnętrznej" },
        { id: "3", name: "Kontrola szczelności", frequency: 12, frequencyUnit: "months", description: "Kontrola szczelności układu chłodniczego, pomiar ciśnień" }
      ]);
    }
  }, [id]);

  // Mock clients data
  const clients = [
    { id: "1", name: "Biurowiec Gamma" },
    { id: "2", name: "Hotel Metropol" },
    { id: "3", name: "ABC Sp. z o.o." },
    { id: "4", name: "Delta Office Park" },
    { id: "5", name: "Jan Kowalski" },
    { id: "6", name: "Urząd Miasta Warszawa" }
  ];
  
  // Mock equipment types and manufacturers
  const equipmentTypes = [
    { id: "split", name: "Split ścienny" },
    { id: "cassette", name: "Kasetonowy" },
    { id: "duct", name: "Kanałowy" },
    { id: "standing", name: "Przypodłogowy" },
    { id: "console", name: "Konsolowy" },
    { id: "multi", name: "Multi Split" },
    { id: "chiller", name: "Agregat wody lodowej" },
    { id: "ahu", name: "Centrala wentylacyjna" },
    { id: "other", name: "Inne" }
  ];
  
  const manufacturers = [
    { id: "daikin", name: "Daikin" },
    { id: "mitsubishi", name: "Mitsubishi Electric" },
    { id: "lg", name: "LG" },
    { id: "samsung", name: "Samsung" },
    { id: "toshiba", name: "Toshiba" },
    { id: "carrier", name: "Carrier" },
    { id: "york", name: "York" },
    { id: "fujitsu", name: "Fujitsu" },
    { id: "hitachi", name: "Hitachi" },
    { id: "komfovent", name: "Komfovent" },
    { id: "other", name: "Inny" }
  ];
  
  // Add new attribute
  const [newAttribute, setNewAttribute] = useState<EquipmentAttribute>({
    id: "", name: "", value: ""
  });
  
  const addAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      const attributeToAdd = {
        ...newAttribute,
        id: `new-${Date.now()}`
      };
      
      setAttributes([...attributes, attributeToAdd]);
      
      // Reset form
      setNewAttribute({
        id: "", name: "", value: ""
      });
    }
  };
  
  // Add new maintenance task
  const [newTask, setNewTask] = useState<MaintenanceTask>({
    id: "", name: "", frequency: 6, frequencyUnit: "months", description: ""
  });
  
  const addMaintenanceTask = () => {
    if (newTask.name) {
      const taskToAdd = {
        ...newTask,
        id: `new-${Date.now()}`
      };
      
      setMaintenanceTasks([...maintenanceTasks, taskToAdd]);
      
      // Reset form
      setNewTask({
        id: "", name: "", frequency: 6, frequencyUnit: "months", description: ""
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      toast.success("Urządzenie zostało zaktualizowane", {
        description: "Zmiany zostały zapisane pomyślnie.",
        duration: 3000
      });
      navigate(`/urzadzenia/${id}`);
    } else {
      toast.success("Nowe urządzenie zostało dodane", {
        description: "Urządzenie zostało dodane do bazy danych.",
        duration: 3000
      });
      navigate("/urzadzenia");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => isEditMode ? navigate(`/urzadzenia/${id}`) : navigate("/urzadzenia")}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1>{isEditMode ? "Edytuj informacje o urządzeniu" : "Dodaj nowe urządzenie"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="general">Ogólne</TabsTrigger>
              <TabsTrigger value="technical">Parametry techniczne</TabsTrigger>
              <TabsTrigger value="maintenance">Serwisowanie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informacje podstawowe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="equipmentType">Typ urządzenia</Label>
                      <Select value={equipmentType} onValueChange={setEquipmentType}>
                        <SelectTrigger id="equipmentType">
                          <SelectValue placeholder="Wybierz typ urządzenia" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Producent</Label>
                      <Select value={manufacturer} onValueChange={setManufacturer}>
                        <SelectTrigger id="manufacturer">
                          <SelectValue placeholder="Wybierz producenta" />
                        </SelectTrigger>
                        <SelectContent>
                          {manufacturers.map(mfr => (
                            <SelectItem key={mfr.id} value={mfr.id}>
                              {mfr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input 
                        id="model" 
                        placeholder="np. FTXM35R"
                        defaultValue={isEditMode ? "FTXM35R" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Numer seryjny</Label>
                      <Input 
                        id="serialNumber" 
                        placeholder="np. AB12345678"
                        defaultValue={isEditMode ? "AB12345678" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Nazwa urządzenia</Label>
                      <Input 
                        id="name" 
                        placeholder="np. Klimatyzator ścienny w pokoju konferencyjnym"
                        defaultValue={isEditMode ? "Klimatyzator ścienny Daikin FTXM35R" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operational">Sprawny</SelectItem>
                          <SelectItem value="warning">Uwaga</SelectItem>
                          <SelectItem value="critical">Awaria</SelectItem>
                          <SelectItem value="maintenance">Serwis</SelectItem>
                          <SelectItem value="offline">Nieaktywny</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="installDate">Data instalacji</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {installDate ? format(installDate, "dd.MM.yyyy", {locale: pl}) : "Wybierz datę"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={installDate}
                            onSelect={setInstallDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="client">Klient</Label>
                      <Select value={clientId} onValueChange={setClientId}>
                        <SelectTrigger id="client">
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
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Lokalizacja</Label>
                      <div className="flex gap-3">
                        <div className="flex-grow">
                          <Input 
                            id="location" 
                            placeholder="np. Sala konferencyjna, 2 piętro"
                            defaultValue={isEditMode ? "Sala konferencyjna" : ""}
                          />
                        </div>
                        <Button type="button" variant="outline" className="gap-2">
                          <MapPin className="size-4" />
                          <span>Mapa</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Uwagi</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Dodatkowe informacje o urządzeniu..."
                        rows={3}
                        defaultValue={isEditMode ? "Urządzenie po wymianie płyty głównej w lutym 2025" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gwarancja i umowa serwisowa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isUnderWarranty" 
                        checked={isUnderWarranty} 
                        onCheckedChange={setIsUnderWarranty} 
                      />
                      <Label htmlFor="isUnderWarranty">Urządzenie na gwarancji</Label>
                    </div>
                    
                    {isUnderWarranty && (
                      <div className="space-y-2">
                        <Label htmlFor="warrantyDate">Data zakończenia gwarancji</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {warrantyDate ? format(warrantyDate, "dd.MM.yyyy", {locale: pl}) : "Wybierz datę"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={warrantyDate}
                              onSelect={setWarrantyDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isUnderContract" 
                        checked={isUnderContract} 
                        onCheckedChange={setIsUnderContract} 
                      />
                      <Label htmlFor="isUnderContract">Urządzenie objęte umową serwisową</Label>
                    </div>
                    
                    {isUnderContract && (
                      <div className="space-y-2">
                        <Label htmlFor="contract">Umowa serwisowa</Label>
                        <Select defaultValue={isEditMode ? "1" : ""}>
                          <SelectTrigger id="contract">
                            <SelectValue placeholder="Wybierz umowę" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">US/2025/001 - Hotel Metropol (Standard)</SelectItem>
                            <SelectItem value="2">US/2024/045 - Biurowiec Gamma (Premium)</SelectItem>
                            <SelectItem value="3">US/2025/012 - ABC Sp. z o.o. (Basic)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Dokumenty</Label>
                      <div className="border border-dashed rounded-lg p-6 text-center">
                        <div className="space-y-2">
                          <UploadCloud className="size-10 mx-auto text-muted-foreground" />
                          <div className="space-y-1">
                            <p>Przeciągnij pliki lub</p>
                            <div>
                              <Label htmlFor="file-upload" className="inline-block">
                                <Button 
                                  variant="outline" 
                                  className="cursor-pointer" 
                                  type="button"
                                  onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                  Wybierz pliki
                                </Button>
                                <Input 
                                  id="file-upload" 
                                  type="file" 
                                  className="hidden" 
                                  multiple
                                />
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Gwarancja, instrukcja, protokół montażu (max 10MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Parametry techniczne</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" type="button">
                      <QrCode className="size-4" />
                      <span>Generuj kod QR</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {attributes.length > 0 && (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Parametr</TableHead>
                              <TableHead>Wartość</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attributes.map((attr) => (
                              <TableRow key={attr.id}>
                                <TableCell className="font-medium">{attr.name}</TableCell>
                                <TableCell>{attr.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Dodaj nowy parametr</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="attributeName">Nazwa parametru</Label>
                            <Input 
                              id="attributeName" 
                              value={newAttribute.name}
                              onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                              placeholder="np. Moc chłodnicza"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="attributeValue">Wartość</Label>
                            <Input 
                              id="attributeValue" 
                              value={newAttribute.value}
                              onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
                              placeholder="np. 3,5 kW"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            type="button" 
                            onClick={addAttribute}
                            disabled={!newAttribute.name || !newAttribute.value}
                            className="gap-2"
                          >
                            <Plus className="size-4" />
                            Dodaj parametr
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Zadania serwisowe</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" type="button">
                      <Wrench className="size-4" />
                      <span>Ustal harmonogram</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {maintenanceTasks.length > 0 && (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Zadanie</TableHead>
                              <TableHead>Częstotliwość</TableHead>
                              <TableHead>Opis</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {maintenanceTasks.map((task) => (
                              <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.name}</TableCell>
                                <TableCell>Co {task.frequency} {task.frequencyUnit === "months" ? "miesięcy" : "dni"}</TableCell>
                                <TableCell>{task.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Dodaj nowe zadanie serwisowe</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="taskName">Nazwa zadania</Label>
                            <Input 
                              id="taskName" 
                              value={newTask.name}
                              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                              placeholder="np. Przegląd okresowy"
                            />
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="space-y-2 flex-1">
                              <Label htmlFor="frequency">Częstotliwość</Label>
                              <Input 
                                id="frequency" 
                                type="number"
                                min="1"
                                value={newTask.frequency}
                                onChange={(e) => setNewTask({...newTask, frequency: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            
                            <div className="space-y-2 flex-1">
                              <Label htmlFor="frequencyUnit">Jednostka</Label>
                              <Select 
                                value={newTask.frequencyUnit} 
                                onValueChange={(val) => setNewTask({...newTask, frequencyUnit: val})}
                              >
                                <SelectTrigger id="frequencyUnit">
                                  <SelectValue placeholder="Wybierz jednostkę" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Dni</SelectItem>
                                  <SelectItem value="months">Miesiące</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="taskDescription">Opis zadania</Label>
                            <Textarea 
                              id="taskDescription" 
                              value={newTask.description}
                              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                              placeholder="Opisz co należy wykonać..."
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            type="button" 
                            onClick={addMaintenanceTask}
                            disabled={!newTask.name}
                            className="gap-2"
                          >
                            <Plus className="size-4" />
                            Dodaj zadanie
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-center space-x-2">
                      <InfoIcon className="size-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Zadania serwisowe będą automatycznie umieszczane w harmonogramie prac serwisowych dla tego urządzenia.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => isEditMode ? navigate(`/urzadzenia/${id}`) : navigate("/urzadzenia")}
            >
              Anuluj
            </Button>
            <Button 
              type="submit"
              className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
            >
              <Save className="size-4" />
              {isEditMode ? "Zapisz zmiany" : "Dodaj urządzenie"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}