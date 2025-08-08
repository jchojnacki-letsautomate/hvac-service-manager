
import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Search, Filter, Plus, 
  Settings, Clock, Calendar, ArrowUpDown,
  Building2, MapPin, AlertTriangle, CheckCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Badge } from "../ui/badge";

type EquipmentStatus = "operational" | "warning" | "critical" | "maintenance" | "offline";

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  installDate: string;
  lastService: string;
  nextService: string;
  client: {
    id: string;
    name: string;
  };
  location: string;
  status: EquipmentStatus;
}

export function EquipmentList() {
  const [searchQuery, setSearchQuery] = useState("");
  // const navigate = useNavigate(); // Removed - using hash routing
  
  // Przykładowe dane
  const equipmentList: Equipment[] = [
    {
      id: "1",
      name: "Klimatyzator ścienny Daikin FTXM35R",
      type: "Split ścienny",
      model: "FTXM35R",
      serialNumber: "AB12345678",
      installDate: "12.06.2023",
      lastService: "12.03.2025",
      nextService: "12.09.2025",
      client: {
        id: "2",
        name: "Hotel Metropol"
      },
      location: "Sala konferencyjna",
      status: "operational"
    },
    {
      id: "2",
      name: "Klimatyzator kasetonowy LG UT36R",
      type: "Kasetonowy",
      model: "UT36R",
      serialNumber: "CD98765432",
      installDate: "15.05.2022",
      lastService: "05.04.2025",
      nextService: "05.10.2025",
      client: {
        id: "2",
        name: "Hotel Metropol"
      },
      location: "Restauracja",
      status: "warning"
    },
    {
      id: "3",
      name: "Centrala wentylacyjna Komfovent Domekt",
      type: "Centrala wentylacyjna",
      model: "Domekt R 450V",
      serialNumber: "EF34567890",
      installDate: "20.03.2024",
      lastService: "20.03.2025",
      nextService: "20.06.2025",
      client: {
        id: "1",
        name: "Biurowiec Gamma"
      },
      location: "Dach",
      status: "operational"
    },
    {
      id: "4",
      name: "Klimatyzator kanałowy Mitsubishi PEAD-M100JA",
      type: "Kanałowy",
      model: "PEAD-M100JA",
      serialNumber: "GH12345678",
      installDate: "10.07.2023",
      lastService: "15.02.2025",
      nextService: "15.08.2025",
      client: {
        id: "3",
        name: "ABC Sp. z o.o."
      },
      location: "Biuro - open space",
      status: "maintenance"
    },
    {
      id: "5",
      name: "Klimatyzator ścienny Mitsubishi MSZ-AP25VG",
      type: "Split ścienny",
      model: "MSZ-AP25VG",
      serialNumber: "IJ23456789",
      installDate: "05.05.2024",
      lastService: "-",
      nextService: "05.11.2025",
      client: {
        id: "5",
        name: "Jan Kowalski"
      },
      location: "Salon",
      status: "operational"
    },
    {
      id: "6",
      name: "Agregat wody lodowej Carrier 30RB",
      type: "Agregat chłodniczy",
      model: "30RB-302",
      serialNumber: "KL34567890",
      installDate: "12.04.2022",
      lastService: "10.04.2025",
      nextService: "10.07.2025",
      client: {
        id: "6",
        name: "Urząd Miasta Warszawa"
      },
      location: "Dach budynku głównego",
      status: "critical"
    }
  ];

  const getStatusBadge = (status: EquipmentStatus) => {
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

  const getStatusIcon = (status: EquipmentStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="size-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="size-4 text-amber-500" />;
      case "critical":
        return <AlertTriangle className="size-4 text-destructive" />;
      case "maintenance":
        return <Settings className="size-4 text-blue-500" />;
      case "offline":
        return <Clock className="size-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="size-4" />;
    }
  };

  const filteredEquipment = equipmentList.filter(equipment => 
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Urządzenia</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => window.location.hash = "#/urzadzenia/import"}
          >
            <ArrowUpDown className="size-4" />
            <span>Import</span>
          </Button>
          <Button 
            className="gap-2"
            onClick={() => window.location.hash = "#/urzadzenia/nowe"}
          >
            <Plus className="size-4" />
            <span>Dodaj urządzenie</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista urządzeń</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj urządzenia..." 
                className="pl-9" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="operational">Sprawne</SelectItem>
                  <SelectItem value="warning">Uwaga</SelectItem>
                  <SelectItem value="critical">Awaria</SelectItem>
                  <SelectItem value="maintenance">Serwis</SelectItem>
                  <SelectItem value="offline">Nieaktywne</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry urządzeń")}
              >
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Urządzenie</TableHead>
                  <TableHead>Klient</TableHead>
                  <TableHead>Lokalizacja</TableHead>
                  <TableHead>Ostatni serwis</TableHead>
                  <TableHead>Następny serwis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Brak urządzeń spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipment.map((equipment) => (
                    <TableRow key={equipment.id} className="cursor-pointer hover:bg-muted/50" onClick={() => window.location.hash = `#/urzadzenia/${equipment.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(equipment.status)}
                          {getStatusBadge(equipment.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-brand-blue hover:underline">{equipment.name}</p>
                          <p className="text-xs text-muted-foreground">SN: {equipment.serialNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span>{equipment.client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-muted-foreground" />
                          <span>{equipment.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span>{equipment.lastService}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span>{equipment.nextService}</span>
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
    </div>
  );
}
