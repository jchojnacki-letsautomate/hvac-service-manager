
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Building2,
  FileText, 
  Calendar,
  ShoppingBag,
  MessageCircle
} from "lucide-react";
import { Badge } from "../ui/badge";
import { OrderStatusBadge, OrderStatus } from "./OrderStatusBadge";

interface Order {
  id: string;
  number: string;
  date: string;
  client: string;
  address: string;
  serviceType: string; // Always "Zamówienie" for this component
  orderStatus: OrderStatus;
  description: string;
  technician: string;
  value: number;
  hasConversation?: boolean;
  conversationId?: string;
  serviceOrderId?: string; // Added to connect with service orders
}

interface OrdersListProps {
  onSelect?: (id: string) => void;
  onCreate?: () => void;
  orders?: Order[];
}

export function OrdersList({ 
  onSelect = (id) => window.location.hash = `zamowienia/${id}`,
  onCreate = () => window.location.hash = "zamowienia/nowe",
  orders: providedOrders
}: OrdersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  
  // Use provided orders or fallback to mock data
  const orders: Order[] = providedOrders || [
    {
      id: "1",
      number: "ZM/2025/001",
      date: "15.05.2025",
      client: "Biurowiec Gamma",
      address: "ul. Marszałkowska 142, Warszawa",
      serviceType: "Zamówienie",
      orderStatus: "inquiry",
      description: "Zamówienie części do klimatyzatorów Daikin",
      technician: "Jan Kowalski",
      value: 4500.00,
      hasConversation: true,
      conversationId: "5",
      serviceOrderId: "1" // Connected to service order 1
    },
    {
      id: "2",
      number: "ZM/2025/002",
      date: "14.05.2025",
      client: "Hotel Metropol",
      address: "ul. Marszałkowska 99a, Warszawa",
      serviceType: "Zamówienie",
      orderStatus: "waitingForOffers",
      description: "Narzędzia serwisowe",
      technician: "Anna Nowak",
      value: 2350.00,
      serviceOrderId: "2" // Connected to service order 2
    },
    {
      id: "3",
      number: "ZM/2025/003",
      date: "13.05.2025",
      client: "ABC Sp. z o.o.",
      address: "ul. Złota 59, Warszawa",
      serviceType: "Zamówienie",
      orderStatus: "confirmed",
      description: "Filtry i czynnik chłodniczy",
      technician: "Piotr Wiśniewski",
      value: 1800.00,
      hasConversation: true,
      conversationId: "6",
      serviceOrderId: "3" // Connected to service order 3
    },
    {
      id: "4",
      number: "ZM/2025/004",
      date: "12.05.2025",
      client: "Delta Office Park",
      address: "ul. Konstruktorska 13, Warszawa",
      serviceType: "Zamówienie",
      orderStatus: "waitingForDelivery",
      description: "Systemy wentylacyjne",
      technician: "Jan Kowalski",
      value: 12500.00
    },
    {
      id: "5",
      number: "ZM/2025/005",
      date: "10.05.2025",
      client: "Biurowiec Gamma",
      address: "ul. Marszałkowska 142, Warszawa",
      serviceType: "Zamówienie",
      orderStatus: "delivered",
      description: "Materiały instalacyjne",
      technician: "Magdalena Jankowska",
      value: 3200.00,
      serviceOrderId: "1" // Also connected to service order 1
    }
  ];
  
  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleOrderClick = (order: Order) => {
    onSelect(order.id);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-5 text-brand-blue" />
          <h1 className="mb-0">Zamówienia</h1>
        </div>
        
        <Button 
          className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
          onClick={onCreate}
        >
          <Plus className="size-4" />
          <span>Nowe zamówienie</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista zamówień</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj zamówienia..." 
                className="pl-9" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Status zamówienia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="inquiry">Do wysłania zapytań</SelectItem>
                  <SelectItem value="waitingForOffers">Oczekiwanie na oferty</SelectItem>
                  <SelectItem value="confirmed">Zamówienie potwierdzone</SelectItem>
                  <SelectItem value="waitingForDelivery">Oczekiwanie na dostawę</SelectItem>
                  <SelectItem value="delivered">Dostarczono</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry zamówień")}
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
                  <TableHead>Numer</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Klient</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead className="text-right">Wartość</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Brak zamówień spełniających kryteria wyszukiwania
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
                          <OrderStatusBadge status={order.orderStatus} />
                          {order.hasConversation && (
                            <Badge variant="outline" className="border-brand-orange text-brand-orange flex gap-1 items-center px-1.5 py-0">
                              <MessageCircle className="size-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-brand-blue underline">{order.number}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          <span>{order.client}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.description}</TableCell>
                      <TableCell className="text-right font-medium">{order.value.toFixed(2)} zł</TableCell>
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
