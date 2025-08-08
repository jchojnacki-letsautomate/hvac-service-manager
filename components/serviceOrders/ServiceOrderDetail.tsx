
import { useState } from "react";
import { 
  CalendarClock, 
  User, 
  Wrench, 
  Clipboard, 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Package, 
  ShoppingCart, 
  ReceiptText, 
  Wallet,
  Plus,
  Trash2,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PurchaseInvoicesList } from "./PurchaseInvoicesList";
import { RelatedOrdersList } from "./RelatedOrdersList";
import { OrderStatus } from "../orders/OrderStatusBadge";

// Define types for purchase invoices
interface PurchaseInvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface PurchaseInvoice {
  id: string;
  supplier: string;
  invoiceNumber: string;
  date: string;
  items: PurchaseInvoiceItem[];
  total: number;
  imageUrl?: string;
}

interface RelatedOrder {
  id: string;
  number: string;
  date: string;
  description: string;
  value: number;
  orderStatus: OrderStatus;
}

interface ServiceOrderDetailProps {
  id: string;
  onBack?: () => void;
}

export function ServiceOrderDetail({ id, onBack = () => window.location.hash = "zlecenia" }: ServiceOrderDetailProps) {
  const [status, setStatus] = useState<"nowy" | "w realizacji" | "zakończony">("w realizacji");
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>([]);
  
  // Mock data for related orders based on service order ID
  const relatedOrders: RelatedOrder[] = [
    {
      id: "1",
      number: "ZM/2025/001",
      date: "15.05.2025",
      description: "Zamówienie części do klimatyzatorów Daikin",
      value: 4500.00,
      orderStatus: "inquiry"
    },
    {
      id: "5",
      number: "ZM/2025/005",
      date: "10.05.2025",
      description: "Materiały instalacyjne",
      value: 3200.00,
      orderStatus: "delivered"
    }
  ];
  
  // Przykładowe dane zlecenia serwisowego
  const serviceOrder = {
    id: "ZS-2023-00845",
    title: "Przegląd klimatyzacji biurowej",
    status: status,
    priority: "Średni",
    createdAt: "10.05.2025",
    scheduledFor: "12.05.2025, 10:00-12:00",
    description: "Okresowy przegląd systemu klimatyzacji w biurze klienta. Sprawdzenie filtrów, czyszczenie jednostek wewnętrznych, kontrola czynnika chłodniczego.",
    hasConversation: true, // Czy zlecenie ma powiązaną konwersację
    conversationId: "1", // ID powiązanej konwersacji
    client: {
      id: "KL-458",
      name: "Biurotechnika Sp. z o.o.",
      address: "ul. Przemysłowa 45, 00-001 Warszawa",
      contactPerson: "Jan Kowalski",
      phone: "+48 500 600 700",
      email: "j.kowalski@biurotechnika.pl"
    },
    equipment: {
      id: "URZ-789",
      name: "Klimatyzator Daikin FTXZ25N",
      serialNumber: "DB78541254",
      installationDate: "15.06.2022",
      lastService: "12.11.2024"
    },
    technician: {
      id: "TECH-12",
      name: "Adam Nowak",
      phone: "+48 600 700 800",
      email: "a.nowak@hvacservice.pl"
    },
    documents: [
      { id: "DOK-123", name: "Protokół z poprzedniego przeglądu", type: "protokół", date: "12.11.2024" },
      { id: "DOK-124", name: "Karta gwarancyjna", type: "gwarancja", date: "15.06.2022" }
    ],
    notes: [
      { id: "1", text: "Klient zgłasza zwiększony hałas jednostki zewnętrznej", date: "10.05.2025", author: "Recepcja" },
      { id: "2", text: "Potwierdzono termin z klientem telefonicznie", date: "11.05.2025", author: "Planista" }
    ],
    // Nowe dane rozliczeniowe
    parts: [
      { id: "1", name: "Filtr do klimatyzatora", partNumber: "FLT-001", quantity: 2, unit: "szt.", price: 45.00 },
      { id: "2", name: "Czynnik chłodniczy R32", partNumber: "R32-100", quantity: 0.5, unit: "kg", price: 180.00 }
    ],
    services: [
      { id: "1", name: "Przegląd okresowy klimatyzacji", duration: 60, price: 200.00 },
      { id: "2", name: "Czyszczenie wymiennika", duration: 90, price: 250.00 }
    ],
    invoices: [
      { id: "FV/2025/123", date: "12.05.2025", amount: 745.00, status: "wystawiona", paid: false },
      { id: "FV/2025/085", date: "12.04.2025", amount: 150.00, status: "opłacona", paid: true, paidDate: "15.04.2025" }
    ],
    reservations: [
      { id: "REZ-001", name: "Filtr do klimatyzatora", partNumber: "FLT-001", quantity: 2, unit: "szt.", status: "aktywna", date: "11.05.2025" }
    ]
  };

  const handleStatusChange = (newStatus: "nowy" | "w realizacji" | "zakończony") => {
    setStatus(newStatus);
  };
  
  // Handle adding a new purchase invoice
  const handleAddPurchaseInvoice = (invoice: PurchaseInvoice) => {
    setPurchaseInvoices(prev => [...prev, invoice]);
    
    // Here, in a real application, you would also update the parts list with items from the invoice
    // For this example, we're just adding the invoice to the list
  };
  
  // Handle navigating to an order
  const handleOrderClick = (orderId: string) => {
    window.location.hash = `zamowienia/${orderId}`;
  };

  // Handle creating a new order
  const handleCreateOrder = () => {
    window.location.hash = `zamowienia/nowe?serviceOrderId=${id}`;
  };
  
  // Obliczanie sumy rozliczenia
  const calculateTotal = () => {
    const partsTotal = serviceOrder.parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);
    const servicesTotal = serviceOrder.services.reduce((sum, service) => sum + service.price, 0);
    
    // Include totals from purchase invoices
    const purchaseInvoicesTotal = purchaseInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    
    return { partsTotal, servicesTotal, purchaseInvoicesTotal, total: partsTotal + servicesTotal };
  };
  
  const totals = calculateTotal();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-2">
            <Wrench className="icon-balanced text-brand-blue" />
            Zlecenie {serviceOrder.id}
          </h1>
          <p className="text-muted-foreground">{serviceOrder.title}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge className={
              status === "nowy" ? "bg-blue-500" : 
              status === "w realizacji" ? "bg-brand-orange" : 
              "bg-green-600"
            }>
              {status}
            </Badge>
            
            {serviceOrder.hasConversation && (
              <Badge variant="outline" className="border-brand-orange text-brand-orange flex gap-1 items-center">
                <MessageCircle className="size-3" />
                <span>Konwersacja</span>
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className={`button-balanced ${serviceOrder.hasConversation ? "border-brand-orange text-brand-orange" : ""}`}
              onClick={() => {
                if (serviceOrder.hasConversation) {
                  window.location.hash = `konwersacje/${serviceOrder.conversationId}`;
                } else {
                  // Tworzenie nowej konwersacji powiązanej ze zleceniem
                  window.location.hash = `konwersacje/nowa`;
                }
              }}
            >
              {serviceOrder.hasConversation ? (
                <>
                  <MessageCircle className="icon-balanced mr-2 text-brand-orange" />
                  Otwórz konwersację
                </>
              ) : (
                <>
                  <MessageSquare className="icon-balanced mr-2" />
                  Nowa konwersacja
                </>
              )}
            </Button>
            <Button 
              className="button-balanced"
              onClick={() => alert("Zapisano zmiany w zleceniu")}
            >
              Zaktualizuj
            </Button>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Główny układ - podział na dwie kolumny */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa kolumna - szczegóły zlecenia */}
        <div className="space-y-6 lg:col-span-2">
          {/* Wiersze danych o kliencie, urządzeniu i techniku */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Karta klienta */}
            <Card className="card-balanced">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="icon-balanced text-brand-blue" />
                  Klient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{serviceOrder.client.name}</p>
                  <p className="text-sm text-muted-foreground">{serviceOrder.client.address}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="icon-balanced text-muted-foreground" />
                    {serviceOrder.client.contactPerson}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="icon-balanced text-muted-foreground" />
                    {serviceOrder.client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="icon-balanced text-muted-foreground" />
                    {serviceOrder.client.email}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Szczegóły klienta</Button>
              </CardFooter>
            </Card>

            {/* Karta urządzenia */}
            <Card className="card-balanced">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="icon-balanced text-brand-blue" />
                  Urządzenie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{serviceOrder.equipment.name}</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Numer seryjny:</span>
                    <span>{serviceOrder.equipment.serialNumber}</span>
                    
                    <span className="text-muted-foreground">Data instalacji:</span>
                    <span>{serviceOrder.equipment.installationDate}</span>
                    
                    <span className="text-muted-foreground">Ostatni serwis:</span>
                    <span>{serviceOrder.equipment.lastService}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Szczegóły urządzenia</Button>
              </CardFooter>
            </Card>

            {/* Karta technika */}
            <Card className="card-balanced">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="icon-balanced text-brand-blue" />
                  Przypisany technik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-larger">
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{serviceOrder.technician.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="icon-balanced text-muted-foreground" />
                      {serviceOrder.technician.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="icon-balanced text-muted-foreground" />
                      {serviceOrder.technician.email}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Zmień</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Karta szczegółów zlecenia */}
          <Card className="card-balanced">
            <CardHeader className="pb-2">
              <CardTitle>Szczegóły zlecenia</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <CalendarClock className="icon-balanced" />
                <span>Zaplanowano na: {serviceOrder.scheduledFor}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="opis">
                <TabsList className="mb-2">
                  <TabsTrigger value="opis">Opis</TabsTrigger>
                  <TabsTrigger value="notatki">Notatki</TabsTrigger>
                  <TabsTrigger value="dokumenty">Dokumenty</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opis" className="card-balanced bg-muted rounded-md">
                  <p>{serviceOrder.description}</p>
                </TabsContent>
                
                <TabsContent value="notatki">
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {serviceOrder.notes.map(note => (
                        <div key={note.id} className="p-3 bg-muted rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{note.author}</span>
                            <span className="text-sm text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">Dodaj notatkę</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="dokumenty">
                  <div className="space-y-2">
                    {serviceOrder.documents.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="icon-balanced text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.type} • {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Podgląd</Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">Dodaj dokument</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button variant={status === "nowy" ? "default" : "outline"} 
                       onClick={() => handleStatusChange("nowy")}
                       className="button-balanced">
                  Nowy
                </Button>
                <Button variant={status === "w realizacji" ? "default" : "outline"}
                       onClick={() => handleStatusChange("w realizacji")}
                       className="button-balanced">
                  W realizacji
                </Button>
                <Button variant={status === "zakończony" ? "default" : "outline"}
                       onClick={() => handleStatusChange("zakończony")}
                       className="button-balanced">
                  Zakończony
                </Button>
              </div>
              <Button className="button-balanced bg-brand-orange">
                <Clipboard className="icon-balanced mr-2" />
                Utwórz protokół
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Prawa kolumna - rozliczenie i powiązane zamówienia */}
        <div className="space-y-6 lg:col-span-1">
          {/* Sekcja z powiązanymi zamówieniami */}
          <RelatedOrdersList 
            orders={relatedOrders} 
            onOrderClick={handleOrderClick} 
            onCreateOrder={handleCreateOrder} 
          />
        
          {/* Karta rozliczenia */}
          <Card className="card-balanced">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="icon-balanced text-brand-blue" />
                Rozliczenie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="parts">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="parts" className="flex items-center gap-1 text-xs">
                    <Package className="icon-balanced" />
                    <span>Części</span>
                  </TabsTrigger>
                  <TabsTrigger value="services" className="flex items-center gap-1 text-xs">
                    <Wrench className="icon-balanced" />
                    <span>Usługi</span>
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="flex items-center gap-1 text-xs">
                    <ReceiptText className="icon-balanced" />
                    <span>Faktury</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="parts" className="pt-4">
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nazwa</TableHead>
                            <TableHead className="text-center">Ilość</TableHead>
                            <TableHead className="text-right">Cena</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceOrder.parts.length > 0 ? (
                            serviceOrder.parts.map((part) => (
                              <TableRow key={part.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{part.name}</p>
                                    <p className="text-xs text-muted-foreground">{part.partNumber}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center whitespace-nowrap">
                                  {part.quantity} {part.unit}
                                </TableCell>
                                <TableCell className="text-right">
                                  {(part.price * part.quantity).toFixed(2)} zł
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center h-12">
                                Brak części
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Plus className="icon-balanced" />
                      Dodaj część
                    </Button>
                    
                    <Separator />
                    
                    {/* Purchase Invoices Section */}
                    <PurchaseInvoicesList 
                      purchaseInvoices={purchaseInvoices} 
                      onAddInvoice={handleAddPurchaseInvoice} 
                    />
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Zarezerwowane części:</h4>
                      {serviceOrder.reservations.length > 0 ? (
                        <div className="space-y-2">
                          {serviceOrder.reservations.map(res => (
                            <div key={res.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                              <div>
                                <p className="font-medium text-sm">{res.name}</p>
                                <p className="text-xs text-muted-foreground">{res.quantity} {res.unit} • {res.date}</p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                {res.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Brak zarezerwowanych części</p>
                      )}
                      
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <ShoppingCart className="icon-balanced" />
                        Rezerwuj części
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="services" className="pt-4">
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usługa</TableHead>
                            <TableHead className="text-center">Czas</TableHead>
                            <TableHead className="text-right">Cena</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceOrder.services.length > 0 ? (
                            serviceOrder.services.map((service) => (
                              <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell className="text-center">{service.duration} min</TableCell>
                                <TableCell className="text-right">{service.price.toFixed(2)} zł</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center h-12">
                                Brak usług
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Plus className="icon-balanced" />
                      Dodaj usługę
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="invoices" className="pt-4">
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Numer</TableHead>
                            <TableHead className="text-center">Data</TableHead>
                            <TableHead className="text-right">Kwota</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceOrder.invoices.length > 0 ? (
                            serviceOrder.invoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                  <Button variant="link" className="p-0 h-auto text-left">
                                    {invoice.id}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">{invoice.date}</TableCell>
                                <TableCell className="text-right">{invoice.amount.toFixed(2)} zł</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={invoice.paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center h-12">
                                Brak faktur
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Plus className="icon-balanced" />
                      Wystaw fakturę
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Podsumowanie finansowe */}
              <div className="bg-muted/30 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Części:</span>
                  <span>{totals.partsTotal.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Usługi:</span>
                  <span>{totals.servicesTotal.toFixed(2)} zł</span>
                </div>
                {purchaseInvoices.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Faktury zakupowe:</span>
                    <span>{totals.purchaseInvoicesTotal.toFixed(2)} zł</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Razem:</span>
                  <span>{totals.total.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Netto:</span>
                  <span>{(totals.total / 1.23).toFixed(2)} zł</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                <ReceiptText className="icon-balanced mr-2" />
                Generuj fakturę
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
