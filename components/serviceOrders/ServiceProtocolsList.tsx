
import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Search, Filter, Plus, Eye, 
  FileText, Printer, ArrowRight, 
  CheckCircle, Clock, Calendar, XCircle
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";

type ProtocolStatus = "draft" | "pending" | "completed" | "rejected";

interface ServiceProtocol {
  id: string;
  number: string;
  date: string;
  client: string;
  serviceOrderNumber: string;
  serviceOrderId: string;
  type: string;
  status: ProtocolStatus;
  technician: string;
  equipmentCount: number;
}

export function ServiceProtocolsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<ServiceProtocol | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  // const navigate = useNavigate(); // Removed - using hash routing
  
  // Przykładowe dane
  const serviceProtocols: ServiceProtocol[] = [
    {
      id: "1",
      number: "PS/2025/075",
      date: "10.05.2025",
      client: "Biurowiec Gamma",
      serviceOrderNumber: "ZL/2025/042",
      serviceOrderId: "1",
      type: "Protokół serwisowy",
      status: "completed",
      technician: "Jan Kowalski",
      equipmentCount: 2
    },
    {
      id: "2",
      number: "PK/2025/032",
      date: "09.05.2025",
      client: "Hotel Metropol",
      serviceOrderNumber: "ZL/2025/041",
      serviceOrderId: "2",
      type: "Protokół konserwacji",
      status: "pending",
      technician: "Anna Nowak",
      equipmentCount: 3
    },
    {
      id: "3",
      number: "PM/2025/022",
      date: "08.05.2025",
      client: "ABC Sp. z o.o.",
      serviceOrderNumber: "ZL/2025/040",
      serviceOrderId: "3",
      type: "Protokół montażowy",
      status: "completed",
      technician: "Piotr Wiśniewski",
      equipmentCount: 1
    },
    {
      id: "4",
      number: "PP/2025/015",
      date: "07.05.2025",
      client: "Delta Office Park",
      serviceOrderNumber: "ZL/2025/039",
      serviceOrderId: "4",
      type: "Protokół pomiarowy",
      status: "draft",
      technician: "Jan Kowalski",
      equipmentCount: 4
    }
  ];

  const getStatusBadge = (status: ProtocolStatus) => {
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

  const getStatusIcon = (status: ProtocolStatus) => {
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

  const getProtocolTypeIcon = (type: string) => {
    if (type.includes("serwisowy")) return <FileText className="size-4 text-brand-blue" />;
    if (type.includes("konserwacji")) return <Calendar className="size-4 text-brand-orange" />;
    if (type.includes("montażowy")) return <CheckCircle className="size-4 text-blue-600" />;
    if (type.includes("pomiarowy")) return <FileText className="size-4 text-emerald-600" />;
    return <FileText className="size-4" />;
  };

  const filteredProtocols = serviceProtocols.filter(protocol => {
    // Filtrowanie wg wyszukiwania
    const matchesSearch = 
      protocol.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.serviceOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrowanie wg statusu
    const matchesStatus = statusFilter === "all" || protocol.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handlePrintProtocol = (protocol: ServiceProtocol) => {
    alert(`Drukowanie protokołu: ${protocol.number}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Protokoły serwisowe</h1>
        <Button 
          className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                      onClick={() => window.location.hash = "#/protokoly/nowy"}
        >
          <Plus className="size-4" />
          <span>Nowy protokół</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista protokołów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj protokołu..." 
                className="pl-9" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
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
                  <SelectItem value="draft">Wersje robocze</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="completed">Zatwierdzone</SelectItem>
                  <SelectItem value="rejected">Odrzucone</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry protokołów")}
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
                  <TableHead>Numer protokołu</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Klient</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Nr zlecenia</TableHead>
                  <TableHead>Technik</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProtocols.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Brak protokołów spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProtocols.map((protocol) => (
                    <TableRow key={protocol.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(protocol.status)}
                          {getStatusBadge(protocol.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{protocol.number}</TableCell>
                      <TableCell>{protocol.date}</TableCell>
                      <TableCell>{protocol.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getProtocolTypeIcon(protocol.type)}
                          <span>{protocol.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="px-0 h-auto"
                          onClick={() => window.location.hash = `#/zlecenia/${protocol.serviceOrderId}`}
                        >
                          {protocol.serviceOrderNumber}
                        </Button>
                      </TableCell>
                      <TableCell>{protocol.technician}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedProtocol(protocol);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePrintProtocol(protocol)}
                          >
                            <Printer className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => window.location.hash = `#/protokoly/${protocol.id}`}
                          >
                            <ArrowRight className="size-4" />
                          </Button>
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
      
      {/* Dialog szczegółów protokołu */}
      {selectedProtocol && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Szczegóły protokołu {selectedProtocol.number}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Szczegóły</TabsTrigger>
                <TabsTrigger value="equipment">Urządzenia</TabsTrigger>
                <TabsTrigger value="signatures">Podpisy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedProtocol.status)}
                      {getStatusBadge(selectedProtocol.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data</Label>
                    <p className="font-medium">{selectedProtocol.date}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Klient</Label>
                    <p className="font-medium">{selectedProtocol.client}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Typ protokołu</Label>
                    <p className="font-medium">{selectedProtocol.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Technik</Label>
                    <p className="font-medium">{selectedProtocol.technician}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Zlecenie</Label>
                    <Button 
                      variant="link" 
                      className="px-0 h-auto"
                      onClick={() => {
                        setShowDetailsDialog(false);
                        window.location.hash = `#/zlecenia/${selectedProtocol.serviceOrderId}`;
                      }}
                    >
                      {selectedProtocol.serviceOrderNumber}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Uwagi techniczne</Label>
                  <p className="p-3 bg-muted/30 rounded-md mt-1">
                    Wykonano przegląd zgodnie z dokumentacją techniczną. Urządzenia działają prawidłowo, wymieniono filtry. Zalecana ponowna kontrola za 6 miesięcy.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment" className="space-y-4">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Urządzenie</TableHead>
                        <TableHead>Nr seryjny</TableHead>
                        <TableHead>Lokalizacja</TableHead>
                        <TableHead>Stan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Klimatyzator ścienny Daikin FTXM35R</TableCell>
                        <TableCell>AB12345678</TableCell>
                        <TableCell>Sala konferencyjna</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700">Sprawny</Badge>
                        </TableCell>
                      </TableRow>
                      {selectedProtocol.equipmentCount > 1 && (
                        <TableRow>
                          <TableCell className="font-medium">Jednostka zewnętrzna Daikin 3MXM68N</TableCell>
                          <TableCell>CD87654321</TableCell>
                          <TableCell>Dach budynku</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 text-emerald-700">Sprawny</Badge>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="signatures" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Podpis technika</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="italic text-brand-blue">Jan Kowalski</div>
                      <div className="text-xs text-muted-foreground mt-1">10.05.2025, 14:32</div>
                    </div>
                  </div>
                  
                  {selectedProtocol.status === "completed" ? (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Podpis klienta</Label>
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                        <div className="italic text-brand-blue">Anna Nowak</div>
                        <div className="text-xs text-muted-foreground mt-1">10.05.2025, 14:45</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Podpis klienta</Label>
                      <div className="border border-dashed rounded-md p-4 flex items-center justify-center text-muted-foreground h-[80px]">
                        Oczekiwanie na podpis klienta
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handlePrintProtocol(selectedProtocol)}
              >
                <Printer className="size-4" />
                Drukuj protokół
              </Button>
              
              <Button 
                onClick={() => {
                  setShowDetailsDialog(false);
                  window.location.hash = `#/protokoly/${selectedProtocol.id}`;
                }}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                Edytuj
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
