
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
  FileText, Calendar, Clock,
  CheckCircle, AlertTriangle,
  MessageCircle
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type ServiceOrderStatus = "new" | "planned" | "inProgress" | "completed" | "cancelled";

interface ServiceOrder {
  id: string;
  number: string;
  date: string;
  client: string;
  address: string;
  serviceType: string;
  status: ServiceOrderStatus;
  priority: string;
  technician: string;
  hasConversation?: boolean;
  conversationId?: string;
}

interface ServiceOrdersListProps {
  onSelect?: (id: string) => void;
  onCreate?: () => void;
}

export function ServiceOrdersList({ 
  onSelect = (id) => window.location.hash = `zlecenia/${id}`,
  onCreate = () => window.location.hash = "zlecenia/nowe" 
}: ServiceOrdersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  
  // Przykładowe dane
  const serviceOrders: ServiceOrder[] = [
    {
      id: "1",
      number: "ZL/2025/042",
      date: "10.05.2025",
      client: "Biurowiec Gamma",
      address: "ul. Marszałkowska 142, Warszawa",
      serviceType: "Przegląd",
      status: "planned",
      priority: "normal",
      technician: "Jan Kowalski",
      hasConversation: true,
      conversationId: "2"
    },
    {
      id: "2",
      number: "ZL/2025/041",
      date: "09.05.2025",
      client: "Hotel Metropol",
      address: "ul. Marszałkowska 99a, Warszawa",
      serviceType: "Naprawa",
      status: "inProgress",
      priority: "high",
      technician: "Anna Nowak",
      hasConversation: true,
      conversationId: "1"
    },
    {
      id: "3",
      number: "ZL/2025/040",
      date: "08.05.2025",
      client: "ABC Sp. z o.o.",
      address: "ul. Złota 59, Warszawa",
      serviceType: "Montaż",
      status: "completed",
      priority: "normal",
      technician: "Piotr Wiśniewski"
    },
    {
      id: "4",
      number: "ZL/2025/039",
      date: "07.05.2025",
      client: "Delta Office Park",
      address: "ul. Konstruktorska 13, Warszawa",
      serviceType: "Diagnostyka",
      status: "new",
      priority: "urgent",
      technician: "-"
    },
    {
      id: "5",
      number: "ZL/2025/038",
      date: "06.05.2025",
      client: "Biurowiec Gamma",
      address: "ul. Marszałkowska 142, Warszawa",
      serviceType: "Zamówienie",
      status: "planned",
      priority: "normal",
      technician: "Jan Kowalski"
    }
  ];

  const exportToCsv = (rows: ServiceOrder[]) => {
    const header = ["Numer","Data","Klient","Usługa","Status","Technik"];
    const body = rows.map(o => [o.number,o.date,o.client,o.serviceType,o.status,o.technician]);
    const csv = [header, ...body].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zlecenia.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: ServiceOrderStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-600 text-white">Nowe</Badge>;
      case "planned":
        return <Badge className="bg-amber-500/20 text-amber-800 border-amber-500/40">Zaplanowane</Badge>;
      case "inProgress":
        return <Badge className="bg-blue-500/15 text-blue-800 border-blue-500/40">W realizacji</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500/15 text-emerald-800 border-emerald-500/40">Wykonane</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Anulowane</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };

  const getStatusIcon = (status: ServiceOrderStatus) => {
    switch (status) {
      case "new":
        return <FileText className="size-4 text-blue-600" />;
      case "planned":
        return <Calendar className="size-4 text-amber-600" />;
      case "inProgress":
        return <Clock className="size-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="size-4 text-emerald-600" />;
      case "cancelled":
        return <AlertTriangle className="size-4 text-destructive" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const filteredOrders = serviceOrders.filter(order => 
    order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCancelOrder = () => {
    alert(`Zlecenie ${selectedOrder?.number} zostało anulowane`);
    setShowCancelDialog(false);
  };
  
  const handleCompleteOrder = () => {
    alert(`Zlecenie ${selectedOrder?.number} zostało oznaczone jako wykonane`);
    setShowCompleteDialog(false);
  };
  
  const handleOrderClick = (order: ServiceOrder) => {
    onSelect(order.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Zlecenia serwisowe</h1>
        <Button 
          className="gap-2"
          onClick={onCreate}
        >
          <Plus className="size-4" />
          <span>Nowe zlecenie</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista zleceń</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj zlecenia..." 
                className="pl-9 rounded-full h-10" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-10 rounded-full px-4">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="new">Nowe</SelectItem>
                  <SelectItem value="planned">Zaplanowane</SelectItem>
                  <SelectItem value="inProgress">W realizacji</SelectItem>
                  <SelectItem value="completed">Wykonane</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px] h-10 rounded-full px-4">
                  <SelectValue placeholder="Rodzaj usługi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie rodzaje</SelectItem>
                  <SelectItem value="maintenance">Przegląd</SelectItem>
                  <SelectItem value="repair">Naprawa</SelectItem>
                  <SelectItem value="installation">Montaż</SelectItem>
                  <SelectItem value="diagnosis">Diagnostyka</SelectItem>
                  <SelectItem value="order">Zamówienie</SelectItem>
                  <SelectItem value="warranty">Gwarancja</SelectItem>
                  <SelectItem value="other">Inna</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry zleceń")}
                className="text-brand-blue border-brand-blue rounded-full h-10 w-10"
              >
                <Filter className="size-4" />
              </Button>
              <Button 
                variant="outline"
                className="text-brand-blue border-brand-blue rounded-full px-5 h-10"
                onClick={() => exportToCsv(filteredOrders)}
              >
                Eksport CSV
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Numer</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Klient</TableHead>
                  <TableHead>Usługa</TableHead>
                  <TableHead>Technik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Brak zleceń spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleOrderClick(order)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                          {order.hasConversation && (
                            <Badge variant="outline" className="border-brand-orange text-brand-orange flex gap-1 items-center px-1.5 py-0">
                              <MessageCircle className="size-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-brand-blue underline">
                        {order.number}
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell>{order.serviceType}</TableCell>
                      <TableCell>{order.technician}</TableCell>
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
