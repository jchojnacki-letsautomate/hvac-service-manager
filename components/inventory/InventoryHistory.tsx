import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, 
  Download, 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  User, 
  Package, 
  Search,
  Filter,
  FileText,
  Clock,
  ChevronDown,
  ChevronsUpDown,
  PanelLeft,
  ReceiptText,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface InventoryMovement {
  id: string;
  date: string;
  type: "in" | "out";
  productId: string;
  productName: string;
  partNumber: string;
  category: string;
  quantity: number;
  unit: string;
  user: string;
  document?: string;
  notes?: string;
}

export function InventoryHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("last30");
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  
  // Przykładowe dane ruchów magazynowych
  const inventoryMovements: InventoryMovement[] = [
    { 
      id: "1", 
      date: "12.05.2025 10:15", 
      type: "in", 
      productId: "1", 
      productName: "Filtr do klimatyzatora", 
      partNumber: "FLT-001", 
      category: "Filtry", 
      quantity: 20, 
      unit: "szt.", 
      user: "Jan Kowalski", 
      document: "Dostawa DO/2025/042", 
      notes: "Zamówienie kwartalne" 
    },
    { 
      id: "2", 
      date: "11.05.2025 15:30", 
      type: "out", 
      productId: "2", 
      productName: "Czynnik chłodniczy R32", 
      partNumber: "R32-100", 
      category: "Czynniki chłodnicze", 
      quantity: 2.5, 
      unit: "kg", 
      user: "Piotr Wiśniewski", 
      document: "Zlecenie ZL/2025/078", 
      notes: "Serwis roczny biurowiec Alfa" 
    },
    { 
      id: "3", 
      date: "10.05.2025 09:45", 
      type: "in", 
      productId: "4", 
      productName: "Presostat LP", 
      partNumber: "PRS-001", 
      category: "Automatyka", 
      quantity: 5, 
      unit: "szt.", 
      user: "Anna Nowak", 
      document: "Dostawa DO/2025/039", 
      notes: "" 
    },
    { 
      id: "4", 
      date: "09.05.2025 14:20", 
      type: "out", 
      productId: "1", 
      productName: "Filtr do klimatyzatora", 
      partNumber: "FLT-001", 
      category: "Filtry", 
      quantity: 4, 
      unit: "szt.", 
      user: "Jan Kowalski", 
      document: "Zlecenie ZL/2025/076", 
      notes: "Wymiana filtrów sieć sklepów Sigma" 
    },
    { 
      id: "5", 
      date: "08.05.2025 11:10", 
      type: "out", 
      productId: "3", 
      productName: "Czujnik temperatury", 
      partNumber: "TMP-002", 
      category: "Elektronika", 
      quantity: 2, 
      unit: "szt.", 
      user: "Anna Nowak", 
      document: "Zlecenie ZL/2025/075", 
      notes: "Wymiana uszkodzonych czujników" 
    },
    { 
      id: "6", 
      date: "07.05.2025 09:30", 
      type: "in", 
      productId: "5", 
      productName: "Zawór trójdrogowy", 
      partNumber: "VLV-003", 
      category: "Hydraulika", 
      quantity: 3, 
      unit: "szt.", 
      user: "Jan Kowalski", 
      document: "Dostawa DO/2025/038", 
      notes: "Uzupełnienie stanów magazynowych" 
    }
  ];
  
  const filteredMovements = productId
    ? inventoryMovements.filter(movement => movement.productId === productId)
    : inventoryMovements.filter(movement => 
        movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/magazyn")}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>
          {productId 
            ? `Historia operacji magazynowych - ${filteredMovements[0]?.productName || "Produkt"}`
            : "Historia operacji magazynowych"
          }
        </h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="icon-balanced" />
            <span className="hidden sm:inline">Zakres dat</span>
          </Button>
          <Button className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
            <Download className="icon-balanced" />
            <span className="hidden sm:inline">Eksportuj</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[280px]">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="icon-balanced" />
            <span>Lista operacji</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="icon-balanced" />
            <span>Statystyki</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card className="card-balanced">
            <CardHeader className="pb-3">
              <CardTitle>Lista operacji magazynowych</CardTitle>
            </CardHeader>
            <CardContent>
              {!productId && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Szukaj produktu..." 
                      className="pl-9 input-balanced" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Typ operacji" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Wszystkie operacje</SelectItem>
                        <SelectItem value="in">Przyjęcia</SelectItem>
                        <SelectItem value="out">Wydania</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Zakres dat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last7">Ostatnie 7 dni</SelectItem>
                        <SelectItem value="last30">Ostatnie 30 dni</SelectItem>
                        <SelectItem value="last90">Ostatnie 90 dni</SelectItem>
                        <SelectItem value="thisMonth">Bieżący miesiąc</SelectItem>
                        <SelectItem value="lastMonth">Poprzedni miesiąc</SelectItem>
                        <SelectItem value="thisYear">Bieżący rok</SelectItem>
                        <SelectItem value="custom">Niestandardowy zakres</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => alert("Otworzono zaawansowane filtry")}
                    >
                      <Filter className="icon-balanced" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Data i czas
                          <ChevronsUpDown className="size-3.5" />
                        </div>
                      </TableHead>
                      <TableHead>Typ</TableHead>
                      {!productId && <TableHead>Produkt</TableHead>}
                      <TableHead className="text-center">Ilość</TableHead>
                      <TableHead>Użytkownik</TableHead>
                      <TableHead>Dokument</TableHead>
                      <TableHead className="text-right">Szczegóły</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={productId ? 6 : 7} className="text-center py-8">
                          <Package className="mx-auto size-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Brak operacji magazynowych</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{movement.date.split(" ")[0]}</span>
                              <span className="text-xs text-muted-foreground">{movement.date.split(" ")[1]}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {movement.type === "in" ? (
                                <ArrowDown className="icon-balanced text-emerald-500" />
                              ) : (
                                <ArrowUp className="icon-balanced text-amber-500" />
                              )}
                              <span>
                                {movement.type === "in" ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Przyjęcie</Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Wydanie</Badge>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          {!productId && (
                            <TableCell>
                              <div>
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto"
                                  onClick={() => navigate(`/magazyn/produkt/${movement.productId}`)}
                                >
                                  {movement.productName}
                                </Button>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span>{movement.partNumber}</span>
                                  <span>•</span>
                                  <span>{movement.category}</span>
                                </p>
                              </div>
                            </TableCell>
                          )}
                          <TableCell className="text-center font-medium">
                            {movement.quantity} {movement.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="icon-balanced text-muted-foreground" />
                              <span>{movement.user}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {movement.document ? (
                              <Button variant="link" className="p-0 h-auto">
                                {movement.document}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedMovement(movement)}
                                >
                                  <span className="sm:inline">Szczegóły</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent side="right">
                                <SheetHeader>
                                  <SheetTitle>Szczegóły operacji magazynowej</SheetTitle>
                                </SheetHeader>
                                {selectedMovement && (
                                  <div className="py-4 space-y-4">
                                    <div className="flex items-center gap-2">
                                      {selectedMovement.type === "in" ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                          Przyjęcie towaru na magazyn
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                          Wydanie towaru z magazynu
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <Clock className="icon-balanced text-muted-foreground" />
                                      <div>
                                        <p className="text-sm text-muted-foreground">Data i czas</p>
                                        <p className="font-medium">{selectedMovement.date}</p>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="p-3 bg-muted/30 rounded-md">
                                      <div className="flex items-center gap-2">
                                        <Package className="icon-balanced text-muted-foreground" />
                                        <div>
                                          <p className="font-medium">{selectedMovement.productName}</p>
                                          <p className="text-sm text-muted-foreground">{selectedMovement.partNumber}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Kategoria: </span>
                                          <span className="font-medium">{selectedMovement.category}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Ilość: </span>
                                          <span className="font-medium">{selectedMovement.quantity} {selectedMovement.unit}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <User className="icon-balanced text-muted-foreground" />
                                        <div>
                                          <p className="text-sm text-muted-foreground">Użytkownik</p>
                                          <p className="font-medium">{selectedMovement.user}</p>
                                        </div>
                                      </div>
                                      
                                      {selectedMovement.document && (
                                        <div className="flex items-center gap-3">
                                          <ReceiptText className="icon-balanced text-muted-foreground" />
                                          <div>
                                            <p className="text-sm text-muted-foreground">Dokument powiązany</p>
                                            <Button variant="link" className="p-0 h-auto">
                                              {selectedMovement.document}
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {selectedMovement.notes && (
                                      <>
                                        <Separator />
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">Uwagi</p>
                                          <p>{selectedMovement.notes}</p>
                                        </div>
                                      </>
                                    )}
                                    
                                    <div className="flex justify-between mt-8">
                                      <Button variant="outline" onClick={() => navigate(`/magazyn/produkt/${selectedMovement.productId}`)}>
                                        Przejdź do produktu
                                      </Button>
                                      <Button className="bg-brand-blue hover:bg-brand-blue/90">
                                        <FileText className="mr-2 icon-balanced" />
                                        Raport PDF
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Wyświetlanie {filteredMovements.length} operacji
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Poprzednia</Button>
                  <Button variant="outline" size="sm">Następna</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Statystyki ruchów magazynowych</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Dane za okres:</p>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Zakres dat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7">Ostatnie 7 dni</SelectItem>
                      <SelectItem value="last30">Ostatnie 30 dni</SelectItem>
                      <SelectItem value="last90">Ostatnie 90 dni</SelectItem>
                      <SelectItem value="thisMonth">Bieżący miesiąc</SelectItem>
                      <SelectItem value="lastMonth">Poprzedni miesiąc</SelectItem>
                      <SelectItem value="thisYear">Bieżący rok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="bg-brand-blue/10 p-2 rounded-full mb-2">
                      <ArrowDown className="icon-balanced text-brand-blue" />
                    </div>
                    <p className="text-muted-foreground text-sm">Przyjęcia</p>
                    <p className="text-2xl font-medium">
                      {filteredMovements.filter(m => m.type === "in").length}
                    </p>
                    <p className="text-sm text-muted-foreground">operacji</p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="bg-brand-orange/10 p-2 rounded-full mb-2">
                      <ArrowUp className="icon-balanced text-brand-orange" />
                    </div>
                    <p className="text-muted-foreground text-sm">Wydania</p>
                    <p className="text-2xl font-medium">
                      {filteredMovements.filter(m => m.type === "out").length}
                    </p>
                    <p className="text-sm text-muted-foreground">operacji</p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="bg-emerald-100 p-2 rounded-full mb-2">
                      <TrendingUp className="icon-balanced text-emerald-500" />
                    </div>
                    <p className="text-muted-foreground text-sm">Łączna wartość przyjęć</p>
                    <p className="text-2xl font-medium">
                      {/* Symulowana wartość */}
                      14 250 zł
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="bg-amber-100 p-2 rounded-full mb-2">
                      <TrendingUp className="icon-balanced text-amber-500" />
                    </div>
                    <p className="text-muted-foreground text-sm">Łączna wartość wydań</p>
                    <p className="text-2xl font-medium">
                      {/* Symulowana wartość */}
                      8 650 zł
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Operacje wg kategorii</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="h-60 w-60 bg-muted/30 rounded-full flex items-center justify-center relative">
                        <PieChart className="absolute size-8 text-muted-foreground" />
                        <div className="text-sm text-center text-muted-foreground">
                          Wykres kołowy
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Obrót w czasie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                        <div className="text-sm text-center text-muted-foreground">
                          Wykres liniowy
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {productId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Historia produktu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                        <div className="text-sm text-center text-muted-foreground">
                          Wykres zmian stanu magazynowego
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
                    <Download className="icon-balanced" />
                    <span>Eksportuj statystyki</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-balanced">
            <CardHeader>
              <CardTitle>Najpopularniejsze produkty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead className="text-center">Ilość operacji</TableHead>
                      <TableHead className="text-center">Przyjęcia</TableHead>
                      <TableHead className="text-center">Wydania</TableHead>
                      <TableHead className="text-right">Obrót</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto"
                            onClick={() => navigate(`/magazyn/produkt/1`)}
                          >
                            Filtr do klimatyzatora
                          </Button>
                          <p className="text-xs text-muted-foreground">FLT-001</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">8</TableCell>
                      <TableCell className="text-center text-emerald-600">+40 szt.</TableCell>
                      <TableCell className="text-center text-amber-600">-32 szt.</TableCell>
                      <TableCell className="text-right font-medium">2 920 zł</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto"
                            onClick={() => navigate(`/magazyn/produkt/2`)}
                          >
                            Czynnik chłodniczy R32
                          </Button>
                          <p className="text-xs text-muted-foreground">R32-100</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">5</TableCell>
                      <TableCell className="text-center text-emerald-600">+24 kg</TableCell>
                      <TableCell className="text-center text-amber-600">-18.5 kg</TableCell>
                      <TableCell className="text-right font-medium">7 650 zł</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto"
                            onClick={() => navigate(`/magazyn/produkt/3`)}
                          >
                            Czujnik temperatury
                          </Button>
                          <p className="text-xs text-muted-foreground">TMP-002</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">4</TableCell>
                      <TableCell className="text-center text-emerald-600">+10 szt.</TableCell>
                      <TableCell className="text-center text-amber-600">-7 szt.</TableCell>
                      <TableCell className="text-right font-medium">1 020 zł</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}