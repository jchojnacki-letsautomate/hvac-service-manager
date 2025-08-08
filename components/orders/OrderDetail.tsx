
import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // Removed - using hash routing
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription 
} from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  ShoppingBag, 
  Calendar, 
  Building2, 
  User, 
  ArrowLeft,
  ArrowRight,
  Phone, 
  Mail, 
  Package, 
  FileText, 
  MessageSquare, 
  Wallet, 
  Send, 
  Clock, 
  CheckCircle, 
  Truck, 
  CreditCard, 
  Plus,
  Trash2,
  ExternalLink,
  DownloadCloud,
  Upload
} from "lucide-react";
import { OrderStatus, OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailProps {
  id?: string;
}

interface OrderItem {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unit: string;
  price: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

interface Quote {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  total: number;
  deliveryTime: string;
  status: "pending" | "accepted" | "rejected";
  fileUrl?: string;
}

export function OrderDetail({ id: propId }: OrderDetailProps) {
  // const { id: paramId } = useParams(); // Removed - using hash routing
  // const navigate = useNavigate(); // Removed - using hash routing
  const id = propId;
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("waitingForOffers");
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showSendInquiryDialog, setShowSendInquiryDialog] = useState(false);
  const [showUploadQuoteDialog, setShowUploadQuoteDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  // Mock order data - in a real app, this would be fetched from an API
  const order = {
    id: "2",
    number: "ZM/2025/002",
    date: "14.05.2025",
    client: {
      id: "2",
      name: "Hotel Metropol",
      address: "ul. Marszałkowska 99a, 00-693 Warszawa",
      contactPerson: "Maria Kowalska",
      phone: "+48 600 700 800",
      email: "m.kowalska@hotel-metropol.pl"
    },
    serviceType: "Zamówienie",
    status: orderStatus,
    description: "Narzędzia serwisowe do obsługi układów klimatyzacji",
    technician: {
      id: "2",
      name: "Anna Nowak",
      specialization: "Wentylacje",
      phone: "+48 600 700 800",
      email: "a.nowak@hvacservice.pl"
    },
    value: 2350.00,
    items: [
      { id: "1", name: "Manometr cyfrowy", partNumber: "TL-001", quantity: 1, unit: "szt.", price: 850.00 },
      { id: "2", name: "Zestaw kluczy serwisowych", partNumber: "TL-002", quantity: 2, unit: "kpl.", price: 450.00 },
      { id: "3", name: "Wykrywacz nieszczelności", partNumber: "TL-003", quantity: 1, unit: "szt.", price: 600.00 }
    ] as OrderItem[],
    suppliers: [
      { id: "1", name: "HVACSklep.pl", contact: "Jan Nowak", email: "zamowienia@hvacsklep.pl", phone: "+48 111 222 333" },
      { id: "2", name: "Chłodnictwo Pro", contact: "Anna Wiśniewska", email: "biuro@chlodnictwo-pro.pl", phone: "+48 222 333 444" },
      { id: "3", name: "Tech Tools", contact: "Piotr Zieliński", email: "kontakt@techtools.pl", phone: "+48 333 444 555" }
    ] as Supplier[],
    quotes: [
      { 
        id: "1", 
        supplierId: "1", 
        supplierName: "HVACSklep.pl", 
        date: "15.05.2025", 
        total: 2450.00, 
        deliveryTime: "3-5 dni", 
        status: "pending",
        fileUrl: "/quotes/quote-001.pdf"
      },
      { 
        id: "2", 
        supplierId: "2", 
        supplierName: "Chłodnictwo Pro", 
        date: "16.05.2025", 
        total: 2300.00, 
        deliveryTime: "5-7 dni", 
        status: "pending",
        fileUrl: "/quotes/quote-002.pdf"
      }
    ] as Quote[],
    notes: [
      { id: "1", author: "Anna Nowak", date: "14.05.2025", content: "Utworzono zamówienie" },
      { id: "2", author: "System", date: "15.05.2025", content: "Wysłano zapytania ofertowe do 3 dostawców" }
    ]
  };
  
  const calculateTotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const getNextStatusOptions = () => {
    switch (orderStatus) {
      case "inquiry":
        return [{ value: "waitingForOffers", label: "Oznacz jako: Oczekiwanie na oferty" }];
      case "waitingForOffers":
        return [{ value: "confirmed", label: "Oznacz jako: Zamówienie potwierdzone" }];
      case "confirmed":
        return [{ value: "waitingForDelivery", label: "Oznacz jako: Oczekiwanie na dostawę" }];
      case "waitingForDelivery":
        return [{ value: "delivered", label: "Oznacz jako: Dostarczono" }];
      default:
        return [];
    }
  };
  
  const handleUpdateStatus = (newStatus: OrderStatus) => {
    setOrderStatus(newStatus);
    setShowUpdateStatusDialog(false);
  };
  
  const handleAcceptQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    // In a real app, this would update the quote status and maybe the order status
    alert(`Zaakceptowano ofertę od ${quote.supplierName} na kwotę ${quote.total.toFixed(2)} zł`);
    setOrderStatus("confirmed");
  };
  
  return (
    <div className="space-y-6">
      {/* Header with navigation and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/zamowienia"}>
            <ArrowLeft className="icon-balanced" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 mb-0">
              <ShoppingBag className="icon-balanced text-brand-blue" />
              Zamówienie {order.number}
            </h1>
            <p className="text-muted-foreground m-0">{order.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={orderStatus} />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
                              onClick={() => {
                window.location.hash = "#/konwersacje/nowa";
                // W rzeczywistej aplikacji przekazalibyśmy dane przez sessionStorage
                sessionStorage.setItem('conversationData', JSON.stringify({
                  relatedEntityType: "order", 
                  relatedEntityId: order.id, 
                  relatedEntityName: `Zamówienie ${order.number}: ${order.description}` 
                }));
              }}
              className="gap-1"
            >
              <MessageSquare className="icon-balanced" />
              <span>Nowa konwersacja</span>
            </Button>
            
            {getNextStatusOptions().length > 0 && (
              <Button onClick={() => setShowUpdateStatusDialog(true)} className="bg-brand-blue hover:bg-brand-blue/90">
                Aktualizuj status
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Main content - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order info, client and technician cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="icon-balanced text-brand-blue" />
                  Informacje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data zamówienia:</span>
                    <span className="font-medium">{order.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <OrderStatusBadge status={orderStatus} className="py-0.5" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wartość:</span>
                    <span className="font-medium">{calculateTotal().toFixed(2)} zł</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Client info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="icon-balanced text-brand-blue" />
                  Klient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.client.name}</p>
                  <p className="text-sm text-muted-foreground">{order.client.address}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="icon-balanced text-muted-foreground" />
                    <span>{order.client.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="icon-balanced text-muted-foreground" />
                    <span>{order.client.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Technician info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="icon-balanced text-brand-blue" />
                  Opiekun zamówienia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-larger">
                    <AvatarFallback>{order.technician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{order.technician.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="icon-balanced text-muted-foreground" />
                      <span>{order.technician.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="icon-balanced text-muted-foreground" />
                      <span>{order.technician.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Items and Quotes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Szczegóły zamówienia</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="items">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="items" className="flex items-center gap-2">
                    <Package className="icon-balanced" />
                    <span>Zamawiane pozycje</span>
                  </TabsTrigger>
                  <TabsTrigger value="quotes" className="flex items-center gap-2">
                    <FileText className="icon-balanced" />
                    <span>Oferty dostawców</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <Clock className="icon-balanced" />
                    <span>Historia</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Items Tab */}
                <TabsContent value="items">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => setShowAddItemDialog(true)}
                      >
                        <Plus className="icon-balanced" />
                        <span>Dodaj pozycję</span>
                      </Button>
                    </div>
                    
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">Nazwa</TableHead>
                            <TableHead className="w-[15%]">Numer katalogowy</TableHead>
                            <TableHead className="w-[15%]">Ilość</TableHead>
                            <TableHead className="text-right w-[15%]">Cena jedn.</TableHead>
                            <TableHead className="text-right w-[15%]">Wartość</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.partNumber}</TableCell>
                              <TableCell>{item.quantity} {item.unit}</TableCell>
                              <TableCell className="text-right">{item.price.toFixed(2)} zł</TableCell>
                              <TableCell className="text-right font-medium">
                                {(item.quantity * item.price).toFixed(2)} zł
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium">Razem:</TableCell>
                            <TableCell className="text-right font-medium">{calculateTotal().toFixed(2)} zł</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    {orderStatus === "inquiry" && (
                      <Button 
                        variant="default" 
                        className="w-full mt-4 gap-2 bg-brand-blue hover:bg-brand-blue/90"
                        onClick={() => setShowSendInquiryDialog(true)}
                      >
                        <Send className="icon-balanced" />
                        <span>Wyślij zapytania ofertowe</span>
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                {/* Quotes Tab */}
                <TabsContent value="quotes">
                  <div className="space-y-4">
                    {orderStatus === "waitingForOffers" && (
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => setShowUploadQuoteDialog(true)}
                        >
                          <Upload className="icon-balanced" />
                          <span>Dodaj ofertę</span>
                        </Button>
                      </div>
                    )}
                    
                    {order.quotes.length > 0 ? (
                      <div className="space-y-4">
                        {order.quotes.map((quote) => (
                          <Card key={quote.id} className="overflow-hidden">
                            <div className={`h-1 ${
                              quote.status === 'accepted' ? 'bg-emerald-500' : 
                              quote.status === 'rejected' ? 'bg-destructive' : 
                              'bg-amber-500'
                            }`} />
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{quote.supplierName}</h4>
                                  <div className="flex gap-4 text-sm">
                                    <div className="text-muted-foreground">Data: {quote.date}</div>
                                    <div className="text-muted-foreground">Czas dostawy: {quote.deliveryTime}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-lg">{quote.total.toFixed(2)} zł</div>
                                  <div className="flex gap-2 mt-2">
                                    {quote.fileUrl && (
                                      <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <DownloadCloud className="size-3.5" />
                                        <span>Pobierz</span>
                                      </Button>
                                    )}
                                    
                                    {orderStatus === "waitingForOffers" && quote.status === "pending" && (
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        className="h-8 gap-1 bg-brand-blue hover:bg-brand-blue/90"
                                        onClick={() => handleAcceptQuote(quote)}
                                      >
                                        <CheckCircle className="size-3.5" />
                                        <span>Akceptuj</span>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground">Brak ofert od dostawców</p>
                        {orderStatus === "inquiry" && (
                          <p className="text-muted-foreground text-sm">Wyślij zapytania ofertowe, aby otrzymać oferty</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* History Tab */}
                <TabsContent value="history">
                  <div className="space-y-4">
                    {order.notes.map((note, index) => (
                      <div key={note.id} className="relative pl-6 pb-4">
                        {index < order.notes.length - 1 && (
                          <div className="absolute left-2.5 top-2.5 w-0.5 h-full bg-muted" />
                        )}
                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{note.author}</span>
                            <span className="text-sm text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Actions and Status */}
        <div className="space-y-6">
          {/* Suppliers Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="icon-balanced text-brand-blue" />
                Dostawcy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-muted/30 rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{supplier.name}</h4>
                    <Button variant="ghost" size="sm" className="h-6 p-0">
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">{supplier.contact}</div>
                  <div className="flex gap-4 text-sm mt-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="size-3" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="size-3" />
                      <span>{supplier.email}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Plus className="icon-balanced" />
                <span>Dodaj dostawcę</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="icon-balanced text-brand-blue" />
                Status zamówienia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center ${
                    orderStatus === "inquiry" || orderStatus === "waitingForOffers" || 
                    orderStatus === "confirmed" || orderStatus === "waitingForDelivery" || 
                    orderStatus === "delivered" ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Send className="size-3" />
                  </div>
                  <span>Zapytania ofertowe</span>
                </div>
                
                <div className="h-6 border-l border-dashed border-muted ml-2.5" />
                
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center ${
                    orderStatus === "waitingForOffers" || orderStatus === "confirmed" || 
                    orderStatus === "waitingForDelivery" || orderStatus === "delivered" ? 
                    'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Clock className="size-3" />
                  </div>
                  <span>Oczekiwanie na oferty</span>
                </div>
                
                <div className="h-6 border-l border-dashed border-muted ml-2.5" />
                
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center ${
                    orderStatus === "confirmed" || orderStatus === "waitingForDelivery" || 
                    orderStatus === "delivered" ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    <CheckCircle className="size-3" />
                  </div>
                  <span>Zamówienie potwierdzone</span>
                </div>
                
                <div className="h-6 border-l border-dashed border-muted ml-2.5" />
                
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center ${
                    orderStatus === "waitingForDelivery" || orderStatus === "delivered" ? 
                    'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Truck className="size-3" />
                  </div>
                  <span>Oczekiwanie na dostawę</span>
                </div>
                
                <div className="h-6 border-l border-dashed border-muted ml-2.5" />
                
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center ${
                    orderStatus === "delivered" ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Package className="size-3" />
                  </div>
                  <span>Dostarczono</span>
                </div>
              </div>
              
              {getNextStatusOptions().length > 0 && (
                <Button 
                  variant="default" 
                  className="w-full mt-4 gap-2 bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => setShowUpdateStatusDialog(true)}
                >
                  Aktualizuj status
                </Button>
              )}
              
              {orderStatus === "delivered" && (
                <Button 
                  variant="default" 
                  className="w-full mt-4 gap-2 bg-brand-orange hover:bg-brand-orange/90"
                >
                  <FileText className="icon-balanced" />
                  <span>Generuj dokument PZ</span>
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Financial Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="icon-balanced text-brand-blue" />
                Rozliczenie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 rounded-md p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wartość zamówienia:</span>
                  <span className="font-medium">{calculateTotal().toFixed(2)} zł</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Razem brutto:</span>
                  <span>{(calculateTotal() * 1.23).toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>w tym VAT (23%):</span>
                  <span>{(calculateTotal() * 0.23).toFixed(2)} zł</span>
                </div>
              </div>
              
              <Button 
                variant="default" 
                className="w-full gap-2"
                disabled={orderStatus !== "delivered"}
              >
                <CreditCard className="icon-balanced" />
                <span>Utwórz fakturę kosztową</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Update status dialog */}
      <Dialog open={showUpdateStatusDialog} onOpenChange={setShowUpdateStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktualizacja statusu zamówienia</DialogTitle>
            <DialogDescription>
              Zmiana statusu zamówienia wpłynie na dostępne akcje oraz widoczność zamówienia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={orderStatus} />
              <ArrowRight className="text-muted-foreground" />
              {getNextStatusOptions().length > 0 && (
                <OrderStatusBadge status={getNextStatusOptions()[0].value as OrderStatus} />
              )}
            </div>
            
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription>
                Zmiana statusu zamówienia może wpłynąć na dostępne akcje oraz widoczność zamówienia w różnych filtrach.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="statusNote">Notatka do zmiany statusu</Label>
              <Textarea
                id="statusNote"
                placeholder="Opcjonalna notatka o zmianie statusu..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateStatusDialog(false)}>
              Anuluj
            </Button>
            {getNextStatusOptions().length > 0 && (
              <Button 
                variant="default"
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => handleUpdateStatus(getNextStatusOptions()[0].value as OrderStatus)}
              >
                {getNextStatusOptions()[0].label}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add item dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj nową pozycję do zamówienia</DialogTitle>
            <DialogDescription>
              Uzupełnij informacje o produkcie, który chcesz dodać do zamówienia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Nazwa</Label>
              <Input id="itemName" placeholder="Nazwa produktu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemPartNumber">Numer katalogowy</Label>
              <Input id="itemPartNumber" placeholder="Numer katalogowy" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemQuantity">Ilość</Label>
                <Input id="itemQuantity" type="number" min="1" defaultValue="1" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemUnit">Jednostka</Label>
                <Select defaultValue="szt.">
                  <SelectTrigger id="itemUnit">
                    <SelectValue placeholder="Wybierz jednostkę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="szt.">szt.</SelectItem>
                    <SelectItem value="kpl.">kpl.</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="op.">op.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Cena jednostkowa (netto)</Label>
              <Input id="itemPrice" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={() => {
                // In a real app, this would add the item to the order
                alert("Dodano nową pozycję do zamówienia");
                setShowAddItemDialog(false);
              }}
            >
              Dodaj pozycję
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send inquiry dialog */}
      <Dialog open={showSendInquiryDialog} onOpenChange={setShowSendInquiryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wyślij zapytania ofertowe</DialogTitle>
            <DialogDescription>
              Wybierz dostawców, do których chcesz wysłać zapytanie ofertowe dotyczące tego zamówienia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Wybierz dostawców</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {order.suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`supplier-${supplier.id}`} 
                      className="size-4 border border-input rounded" 
                      defaultChecked
                    />
                    <Label htmlFor={`supplier-${supplier.id}`} className="flex-1 cursor-pointer">
                      {supplier.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inquiryMessage">Wiadomość do dostawców</Label>
              <Textarea
                id="inquiryMessage"
                placeholder="Opcjonalna wiadomość do dostawców..."
                rows={4}
                defaultValue="Prosimy o przesłanie oferty na wymienione w załączniku produkty. Oferta powinna zawierać ceny oraz przewidywany czas dostawy."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Załączone pozycje ({order.items.length})</Label>
              <div className="text-sm text-muted-foreground">
                Do zapytania zostaną załączone wszystkie pozycje z zamówienia.
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendInquiryDialog(false)}>
              Anuluj
            </Button>
            <Button 
              className="gap-1"
              onClick={() => {
                // In a real app, this would send inquiries to suppliers
                alert("Wysłano zapytania ofertowe do wybranych dostawców");
                setOrderStatus("waitingForOffers");
                setShowSendInquiryDialog(false);
              }}
            >
              <Send className="size-4" />
              <span>Wyślij zapytania</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload quote dialog */}
      <Dialog open={showUploadQuoteDialog} onOpenChange={setShowUploadQuoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj ofertę od dostawcy</DialogTitle>
            <DialogDescription>
              Wprowadź szczegóły oferty otrzymanej od dostawcy dla tego zamówienia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quoteSupplier">Dostawca</Label>
              <Select>
                <SelectTrigger id="quoteSupplier">
                  <SelectValue placeholder="Wybierz dostawcę" />
                </SelectTrigger>
                <SelectContent>
                  {order.suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quoteDate">Data oferty</Label>
              <Input id="quoteDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quoteTotal">Wartość oferty (netto)</Label>
                <Input id="quoteTotal" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quoteDeliveryTime">Czas dostawy</Label>
                <Input id="quoteDeliveryTime" placeholder="np. 3-5 dni" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quoteFile">Załącz plik oferty</Label>
              <Input id="quoteFile" type="file" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadQuoteDialog(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={() => {
                // In a real app, this would add the quote to the order
                alert("Dodano ofertę od dostawcy");
                setShowUploadQuoteDialog(false);
              }}
            >
              Dodaj ofertę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
