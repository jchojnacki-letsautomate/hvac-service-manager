import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Package, 
  Calendar, 
  FileText, 
  ArrowDown, 
  ArrowUp, 
  BarChart4, 
  TrendingUp, 
  AlertTriangle,
  MessageCircle,
  ShoppingCart
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ReservationDialog, ReservationData } from "./ReservationDialog";

interface StockMovement {
  id: string;
  date: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  document?: string;
  notes?: string;
}

interface InventoryReservation {
  id: string;
  orderId: string;
  client: string;
  quantity: number;
  reservationDate: string;
  plannedDate: string;
  status: "active" | "completed" | "cancelled";
}

export function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [stockAction, setStockAction] = useState<"in" | "out">("in");
  const [stockQuantity, setStockQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Przykładowe dane produktu
  const productDetails = getProductDetails(id || "1");
  
  // Przykładowa historia ruchów magazynowych
  const stockMovements: StockMovement[] = [
    { id: "1", date: "12.05.2025 10:15", type: "in", quantity: 20, user: "Jan Kowalski", document: "Dostawa DO/2025/042", notes: "Zamówienie kwartalne" },
    { id: "2", date: "25.04.2025 14:30", type: "out", quantity: 5, user: "Anna Nowak", document: "Zlecenie ZL/2025/073", notes: "Serwis Hotel Metropol" },
    { id: "3", date: "15.04.2025 09:45", type: "out", quantity: 2, user: "Piotr Wiśniewski", document: "Zlecenie ZL/2025/065", notes: "Serwis biurowiec Gamma" },
    { id: "4", date: "02.04.2025 11:20", type: "in", quantity: 25, user: "Jan Kowalski", document: "Dostawa DO/2025/031", notes: "" },
    { id: "5", date: "20.03.2025 15:10", type: "out", quantity: 3, user: "Anna Nowak", document: "Zlecenie ZL/2025/042", notes: "Wymiana na gwarancji" }
  ];
  
  // Przykładowe rezerwacje
  const [reservations, setReservations] = useState<InventoryReservation[]>([
    { id: "1", orderId: "ZL/2025/092", client: "Hotel Metropol", quantity: 4, reservationDate: "10.05.2025", plannedDate: "16.05.2025", status: "active" },
    { id: "2", orderId: "ZL/2025/087", client: "Biurowiec Delta", quantity: 2, reservationDate: "05.05.2025", plannedDate: "12.05.2025", status: "active" },
    { id: "3", orderId: "ZL/2025/072", client: "Akademia Medyczna", quantity: 3, reservationDate: "22.04.2025", plannedDate: "28.04.2025", status: "completed" }
  ]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">W magazynie</Badge>;
      case "low":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Niski stan</Badge>;
      case "critical":
        return <Badge variant="destructive">Krytyczny stan</Badge>;
      case "ordered":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Zamówione</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const getReservationStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Aktywna</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Zrealizowana</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-muted-foreground">Anulowana</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const openStockDialog = (action: "in" | "out") => {
    setStockAction(action);
    setStockQuantity(1);
    setShowStockDialog(true);
  };
  
  const handleStockChange = () => {
    if (!productDetails) return;
    
    const actionText = stockAction === "in" ? "przyjęto" : "wydano";
    const quantityText = `${stockQuantity} ${productDetails.unit}`;
    
    alert(`Z magazynu ${actionText} ${quantityText} towaru: ${productDetails.name}`);
    setShowStockDialog(false);
  };
  
  const handleCreateReservation = (data: ReservationData) => {
    if (!productDetails) return;
    
    // Tworzenie nowej rezerwacji
    const newReservation: InventoryReservation = {
      id: String(Date.now()),
      orderId: data.orderId || "Bez zlecenia",
      client: ["Biurowiec Gamma", "Hotel Metropol", "ABC Sp. z o.o.", "Delta Office Park"][Number(data.clientId) - 1],
      quantity: data.quantity,
      reservationDate: new Date().toLocaleDateString('pl-PL'),
      plannedDate: new Date(data.plannedDate).toLocaleDateString('pl-PL'),
      status: "active"
    };
    
    setReservations([...reservations, newReservation]);
    setActiveTab("reservations");
    
    alert(`Zarezerwowano ${data.quantity} ${productDetails.unit} produktu "${productDetails.name}"`);
  };
  
  if (!productDetails) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <h2>Produkt nie znaleziony</h2>
          <p className="text-muted-foreground mb-4">Nie znaleziono produktu o ID: {id}</p>
          <Button onClick={() => navigate("/magazyn")}>
            Powrót do magazynu
          </Button>
        </div>
      </div>
    );
  }
  
  const activeReservationsCount = reservations.filter(r => r.status === "active").length;
  const activeReservationsQuantity = reservations
    .filter(r => r.status === "active")
    .reduce((acc, r) => acc + r.quantity, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/magazyn")}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>{productDetails.name}</h1>
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate(`/magazyn/historia?productId=${id}`)}
          >
            <Calendar className="icon-balanced" />
            <span className="hidden sm:inline">Historia</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate(`/konwersacje?productId=${id}`)}
          >
            <MessageCircle className="icon-balanced" />
            <span className="hidden sm:inline">Konwersacje</span>
          </Button>
          <Button 
            className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => navigate(`/magazyn/edytuj/${id}`)}
          >
            <Edit className="icon-balanced" />
            <span className="hidden sm:inline">Edytuj</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="card-balanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Informacje o produkcie</CardTitle>
              <div className="flex items-center gap-2">
                {productDetails.status === "critical" && (
                  <AlertTriangle className="icon-balanced text-destructive" />
                )}
                {getStatusBadge(productDetails.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Kategoria</p>
                  <p className="font-medium">{productDetails.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Numer katalogowy</p>
                  <p className="font-medium">{productDetails.partNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lokalizacja</p>
                  <p className="font-medium">{productDetails.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cena jednostkowa</p>
                  <p className="font-medium">{productDetails.price.toFixed(2)} zł / {productDetails.unit}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="bg-muted/30 p-3 rounded-md flex-1 flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Stan magazynowy</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium">{productDetails.quantityAvailable}</span>
                    <span className="text-sm">{productDetails.unit}</span>
                  </div>
                  {activeReservationsCount > 0 && (
                    <div className="text-xs text-amber-600 mt-1">
                      (z czego {activeReservationsQuantity} {productDetails.unit} zarezerwowane)
                    </div>
                  )}
                </div>
                <div className="bg-muted/30 p-3 rounded-md flex-1 flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Minimalny poziom</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium">{productDetails.minLevel}</span>
                    <span className="text-sm">{productDetails.unit}</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-md flex-1 flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Wartość</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium">
                      {(productDetails.quantityAvailable * productDetails.price).toFixed(2)}
                    </span>
                    <span className="text-sm">zł</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button 
                  className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => openStockDialog("in")}
                >
                  <ArrowDown className="icon-balanced" />
                  <span>Przyjmij na magazyn</span>
                </Button>
                <Button 
                  className="gap-2 bg-brand-orange hover:bg-brand-orange/90"
                  onClick={() => openStockDialog("out")}
                  disabled={productDetails.quantityAvailable === 0}
                >
                  <ArrowUp className="icon-balanced" />
                  <span>Wydaj z magazynu</span>
                </Button>
                <Button 
                  className="gap-2"
                  onClick={() => setShowReservationDialog(true)}
                  disabled={productDetails.quantityAvailable === 0}
                >
                  <ShoppingCart className="icon-balanced" />
                  <span>Zarezerwuj</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Przegląd</TabsTrigger>
              <TabsTrigger value="movements">Ruchy magazynowe</TabsTrigger>
              <TabsTrigger value="reservations" className="relative">
                Rezerwacje
                {activeReservationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeReservationsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Opis produktu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Filtr wysokiej jakości przeznaczony do klimatyzatorów ściennych serii FTXM.
                    Wykonany z materiałów filtracyjnych zapewniających wysoką skuteczność w usuwaniu
                    zanieczyszczeń, alergenów i pyłów z powietrza. Zalecana wymiana co 6 miesięcy
                    dla utrzymania optymalnej jakości powietrza i wydajności urządzenia.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-muted/30 p-2 rounded">
                      <p className="text-sm text-muted-foreground">Wymiary</p>
                      <p className="font-medium">287 × 210 × 15 mm</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <p className="text-sm text-muted-foreground">Materiał</p>
                      <p className="font-medium">Polipropylen</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <p className="text-sm text-muted-foreground">Klasa filtracji</p>
                      <p className="font-medium">ISO ePM10 70%</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h4>Kompatybilność</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span>Klimatyzator ścienny Daikin FTXM35R</span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/urzadzenia/1`)}>
                        Podgląd
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span>Klimatyzator ścienny Daikin FTXM20R</span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/urzadzenia/6`)}>
                        Podgląd
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span>Klimatyzator ścienny Daikin FTXM50R</span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/urzadzenia/7`)}>
                        Podgląd
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Analiza zużycia</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart4 className="icon-balanced" />
                    <span>Szczegółowe statystyki</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-muted/30 p-3 rounded-md flex-1 flex flex-col items-center">
                      <TrendingUp className="icon-balanced text-brand-orange mb-2" />
                      <p className="text-muted-foreground text-sm">Średnie zużycie miesięczne</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-medium">8.2</span>
                        <span className="text-sm">{productDetails.unit}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md flex-1 flex flex-col items-center">
                      <Calendar className="icon-balanced text-brand-blue mb-2" />
                      <p className="text-muted-foreground text-sm">Prognoza wyczerpania</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-medium">~4</span>
                        <span className="text-sm">miesiące</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-48 bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Wykres zużycia</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="movements">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Historia ruchów magazynowych</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => navigate(`/magazyn/historia?productId=${id}`)}
                  >
                    <FileText className="icon-balanced" />
                    <span>Pełna historia</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Typ</TableHead>
                          <TableHead>Ilość</TableHead>
                          <TableHead>Dokument</TableHead>
                          <TableHead>Użytkownik</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>{movement.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {movement.type === "in" ? (
                                  <ArrowDown className="icon-balanced text-emerald-500" />
                                ) : (
                                  <ArrowUp className="icon-balanced text-amber-500" />
                                )}
                                <span>
                                  {movement.type === "in" ? "Przyjęcie" : "Wydanie"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {movement.quantity} {productDetails.unit}
                            </TableCell>
                            <TableCell>
                              {movement.document ? (
                                <Button variant="link" className="p-0 h-auto">
                                  {movement.document}
                                </Button>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{movement.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reservations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Rezerwacje produktu</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setShowReservationDialog(true)}
                  >
                    <ShoppingCart className="icon-balanced" />
                    <span>Nowa rezerwacja</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Zlecenie</TableHead>
                          <TableHead>Klient</TableHead>
                          <TableHead>Ilość</TableHead>
                          <TableHead>Data rezerwacji</TableHead>
                          <TableHead>Planowana data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              <div className="flex flex-col items-center">
                                <ShoppingCart className="size-10 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">Brak rezerwacji dla tego produktu</p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-3"
                                  onClick={() => setShowReservationDialog(true)}
                                >
                                  Utwórz rezerwację
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          reservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell>
                                <Button variant="link" className="p-0 h-auto">
                                  {reservation.orderId}
                                </Button>
                              </TableCell>
                              <TableCell>{reservation.client}</TableCell>
                              <TableCell className="font-medium">
                                {reservation.quantity} {productDetails.unit}
                              </TableCell>
                              <TableCell>{reservation.reservationDate}</TableCell>
                              <TableCell>{reservation.plannedDate}</TableCell>
                              <TableCell>
                                {getReservationStatusBadge(reservation.status)}
                              </TableCell>
                              <TableCell>
                                {reservation.status === "active" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const updatedReservations = reservations.map(res =>
                                        res.id === reservation.id ? {...res, status: "completed" as const} : res  
                                      );
                                      setReservations(updatedReservations);
                                    }}
                                  >
                                    Zrealizuj
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {activeReservationsCount > 0 && (
                    <div className="flex items-center gap-2 p-2 mt-4 bg-amber-50 text-amber-700 rounded">
                      <AlertTriangle className="icon-balanced" />
                      <p className="text-sm">
                        Zarezerwowano łącznie {activeReservationsQuantity} {productDetails.unit} produktu
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Zdjęcie produktu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <ImageWithFallback
                  src="/images/product-example.jpg"
                  alt={productDetails.name}
                  width={300}
                  height={300}
                  className="w-full object-cover"
                />
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="icon-balanced" />
                  <span>Pobierz zdjęcie</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Dostawcy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col p-3 bg-muted/30 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Daikin Polska Sp. z o.o.</span>
                    <Badge className="bg-emerald-100 text-emerald-700">Główny</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Cena: 41.50 zł / szt.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Czas dostawy: 3-5 dni roboczych
                  </div>
                </div>
                <div className="flex flex-col p-3 bg-muted/30 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Klimat-Max s.c.</span>
                    <Badge variant="outline">Alternatywny</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Cena: 48.00 zł / szt.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Czas dostawy: 1-2 dni robocze
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Powiązane dokumenty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="font-medium">Karta katalogowa</p>
                      <p className="text-xs text-muted-foreground">PDF, 1.2 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Pobierz
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="font-medium">Certyfikat CE</p>
                      <p className="text-xs text-muted-foreground">PDF, 0.5 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Pobierz
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="font-medium">Instrukcja montażu</p>
                      <p className="text-xs text-muted-foreground">PDF, 0.8 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Pobierz
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="icon-balanced" />
                  <span>Dodaj dokument</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Dialog zmiany stanu magazynowego */}
      <Dialog open={showStockDialog} onOpenChange={setShowStockDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>
              {stockAction === "in" ? "Przyjęcie towaru na magazyn" : "Wydanie towaru z magazynu"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <Package className="icon-md text-muted-foreground" />
                <div>
                  <p className="font-medium">{productDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{productDetails.partNumber}</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Aktualny stan: </span>
                  <span className="font-medium">{productDetails.quantityAvailable} {productDetails.unit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cena: </span>
                  <span className="font-medium">{productDetails.price.toFixed(2)} zł / {productDetails.unit}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Ilość ({productDetails.unit})</Label>
              <Input 
                id="quantity" 
                type="number"
                min="0.01"
                step={productDetails.unit === "kg" ? "0.1" : "1"}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                className="input-balanced"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document">Dokument powiązany</Label>
              <Select>
                <SelectTrigger id="document">
                  <SelectValue placeholder="Wybierz dokument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Brak</SelectItem>
                  <SelectItem value="delivery1">Dostawa DO/2025/042</SelectItem>
                  <SelectItem value="order1">Zlecenie ZL/2025/041</SelectItem>
                  <SelectItem value="invoice1">Faktura FV/2025/123</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Uwagi</Label>
              <Input id="notes" placeholder="Dodatkowe informacje..." className="input-balanced" />
            </div>
            
            {stockAction === "out" && productDetails.quantityAvailable < stockQuantity && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded">
                <AlertTriangle className="icon-balanced" />
                <p className="text-sm">Uwaga! Próba wydania większej ilości niż dostępna na magazynie.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStockDialog(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={handleStockChange}
              disabled={stockAction === "out" && (productDetails.quantityAvailable < stockQuantity || stockQuantity <= 0)}
              className={stockAction === "in" ? "bg-brand-blue hover:bg-brand-blue/90" : "bg-brand-orange hover:bg-brand-orange/90"}
            >
              {stockAction === "in" ? "Przyjmij na magazyn" : "Wydaj z magazynu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog rezerwacji produktu */}
      <ReservationDialog
        open={showReservationDialog}
        onOpenChange={setShowReservationDialog}
        productName={productDetails.name}
        productId={productDetails.id}
        partNumber={productDetails.partNumber}
        quantityAvailable={productDetails.quantityAvailable}
        unit={productDetails.unit}
        onConfirm={handleCreateReservation}
      />
    </div>
  );
}

// Helper function to get product details
function getProductDetails(id: string) {
  const products = [
    {
      id: "1",
      name: "Filtr do klimatyzatora",
      category: "Filtry",
      partNumber: "FLT-001",
      location: "Magazyn główny: Regał A, półka 1",
      unit: "szt.",
      quantityAvailable: 35,
      minLevel: 10,
      price: 45.00,
      status: "ok"
    },
    {
      id: "2",
      name: "Czynnik chłodniczy R32",
      partNumber: "R32-100",
      category: "Czynniki chłodnicze",
      location: "Magazyn główny: Strefa chemii",
      unit: "kg",
      quantityAvailable: 8,
      minLevel: 10,
      price: 180.00,
      status: "low"
    },
    {
      id: "3",
      name: "Czujnik temperatury",
      partNumber: "TMP-002",
      category: "Elektronika",
      location: "Magazyn główny: Regał C, półka 2",
      unit: "szt.",
      quantityAvailable: 15,
      minLevel: 5,
      price: 60.00,
      status: "ok"
    },
    {
      id: "4",
      name: "Presostat LP",
      partNumber: "PRS-001",
      category: "Automatyka",
      location: "Magazyn główny: Regał B, półka 3",
      unit: "szt.",
      quantityAvailable: 2,
      minLevel: 5,
      price: 120.00,
      status: "critical"
    }
  ];
  
  return products.find(product => product.id === id);
}

// Komponenty ikon
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}