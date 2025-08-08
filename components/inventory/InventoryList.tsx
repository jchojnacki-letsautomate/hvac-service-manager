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
  Package, AlertTriangle, Edit, Trash2, 
  Download, ArrowDown, ArrowUp,
  FileText, ShoppingBag,
  MessageCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Badge } from "../ui/badge";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  partNumber: string;
  location: string;
  unit: string;
  quantityAvailable: number;
  minLevel: number;
  price: number;
  status: "ok" | "low" | "critical" | "ordered";
  hasConversations?: boolean;
}

export function InventoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [stockAction, setStockAction] = useState<"in" | "out">("in");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  // const navigate = useNavigate(); // Removed - using hash routing
  
  // Przykładowe dane
  const inventoryItems: InventoryItem[] = [
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
      status: "ok",
      hasConversations: true
    },
    {
      id: "2",
      name: "Czynnik chłodniczy R32",
      category: "Czynniki chłodnicze",
      partNumber: "R32-100",
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
      category: "Elektronika",
      partNumber: "TMP-002",
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
      category: "Automatyka",
      partNumber: "PRS-001",
      location: "Magazyn główny: Regał B, półka 3",
      unit: "szt.",
      quantityAvailable: 2,
      minLevel: 5,
      price: 120.00,
      status: "critical",
      hasConversations: true
    },
    {
      id: "5",
      name: "Zawór trójdrogowy",
      category: "Hydraulika",
      partNumber: "VLV-003",
      location: "Magazyn główny: Regał A, półka 4",
      unit: "szt.",
      quantityAvailable: 0,
      minLevel: 3,
      price: 95.00,
      status: "ordered"
    },
    {
      id: "6",
      name: "Płyta główna PCB",
      category: "Elektronika",
      partNumber: "PCB-112",
      location: "Magazyn główny: Strefa elektroniki",
      unit: "szt.",
      quantityAvailable: 6,
      minLevel: 2,
      price: 350.00,
      status: "ok"
    }
  ];

  const exportInventoryToCsv = (rows: InventoryItem[]) => {
    const header = ["Nazwa","Kategoria","Nr kat.","Lokalizacja","Jedn.","Ilość","Min","Cena","Status"]; 
    const body = rows.map(i => [i.name,i.category,i.partNumber,i.location,i.unit,i.quantityAvailable,i.minLevel,i.price.toFixed(2),i.status]);
    const csv = [header, ...body].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "magazyn.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-emerald-500/15 text-emerald-800 border-emerald-500/40">W magazynie</Badge>;
      case "low":
        return <Badge className="bg-amber-500/20 text-amber-800 border-amber-500/40">Niski stan</Badge>;
      case "critical":
        return <Badge variant="destructive">Krytyczny stan</Badge>;
      case "ordered":
        return <Badge className="bg-blue-500/15 text-blue-800 border-blue-500/40">Zamówione</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };

  const getStatusIndicator = (item: InventoryItem) => {
    const percentage = (item.quantityAvailable / item.minLevel) * 100;
    
    if (item.status === "ordered") {
      return <Package className="icon-balanced text-blue-500" />;
    } else if (percentage === 0) {
      return <AlertTriangle className="icon-balanced text-destructive" />;
    } else if (percentage <= 50) {
      return <AlertTriangle className="icon-balanced text-amber-500" />;
    } else {
      return <Package className="icon-balanced text-emerald-500" />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    // Filtrowanie według zakładki
    if (activeTab === "low" && item.status !== "low" && item.status !== "critical") return false;
    if (activeTab === "ordered" && item.status !== "ordered") return false;

    // Filtrowanie według wyszukiwania
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleDeleteItem = () => {
    alert(`Pozycja "${selectedItem?.name}" została usunięta z magazynu`);
    setShowDeleteDialog(false);
  };
  
  const openStockDialog = (item: InventoryItem, action: "in" | "out") => {
    setSelectedItem(item);
    setStockAction(action);
    setStockQuantity(1);
    setShowStockDialog(true);
  };
  
  const handleStockChange = () => {
    if (!selectedItem) return;
    
    const actionText = stockAction === "in" ? "przyjęto" : "wydano";
    const quantityText = `${stockQuantity} ${selectedItem.unit}`;
    
    alert(`Z magazynu ${actionText} ${quantityText} towaru: ${selectedItem.name}`);
    setShowStockDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Magazyn</h1>
        <div className="flex gap-2">
          <Button 
            className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => window.location.hash = "#/magazyn/nowy-produkt"}
          >
            <Plus className="icon-balanced" />
            <span>Dodaj produkt</span>
          </Button>
        </div>
      </div>

      <Card className="card-balanced">
        <CardHeader className="pb-3">
          <CardTitle>Stan magazynowy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 icon-balanced text-muted-foreground" />
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
                  <SelectValue placeholder="Kategoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kategorie</SelectItem>
                  <SelectItem value="filters">Filtry</SelectItem>
                  <SelectItem value="refrigerants">Czynniki chłodnicze</SelectItem>
                  <SelectItem value="electronics">Elektronika</SelectItem>
                  <SelectItem value="automation">Automatyka</SelectItem>
                  <SelectItem value="hydraulics">Hydraulika</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry magazynu")}
                className="text-brand-blue border-brand-blue"
              >
                <Filter className="icon-balanced" />
              </Button>
              <Button
                variant="outline"
                className="text-brand-blue border-brand-blue"
                onClick={() => exportInventoryToCsv(filteredItems)}
              >
                Eksport CSV
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">Wszystkie</TabsTrigger>
              <TabsTrigger value="low" className="flex items-center gap-1">
                <AlertTriangle className="size-3.5" />
                <span>Niski stan</span>
              </TabsTrigger>
              <TabsTrigger value="ordered" className="flex items-center gap-1">
                <ShoppingBag className="size-3.5" />
                <span>Zamówione</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Nazwa produktu</TableHead>
                  <TableHead>Nr katalogowy</TableHead>
                  <TableHead className="text-center">Stan</TableHead>
                  <TableHead className="text-center">Min. poziom</TableHead>
                  <TableHead className="text-right">Cena jedn.</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Brak produktów spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIndicator(item)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-left"
                            onClick={() => window.location.hash = `#/magazyn/produkt/${item.id}`}
                          >
                            {item.name}
                            {item.hasConversations && (
                              <MessageCircle className="inline-block ml-1 size-3.5 text-brand-orange" />
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.partNumber}</TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantityAvailable} {item.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.minLevel} {item.unit}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.price.toFixed(2)} zł
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openStockDialog(item, "in")}
                            title="Przyjmij na magazyn"
                          >
                            <ArrowDown className="icon-balanced text-emerald-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openStockDialog(item, "out")}
                            disabled={item.quantityAvailable === 0}
                            title="Wydaj z magazynu"
                          >
                            <ArrowUp className="icon-balanced text-amber-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => window.location.hash = `#/magazyn/edytuj/${item.id}`}
                            title="Edytuj produkt"
                          >
                            <Edit className="icon-balanced" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowDeleteDialog(true);
                            }}
                            title="Usuń produkt"
                          >
                            <Trash2 className="icon-balanced" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Wyświetlanie {filteredItems.length} z {inventoryItems.length} produktów
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog usuwania produktu */}
      {selectedItem && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Usuwanie produktu</AlertDialogTitle>
              <AlertDialogDescription>
                Czy na pewno chcesz usunąć produkt <span className="font-medium">{selectedItem.name}</span> z magazynu?
                Ta operacja spowoduje usunięcie wszystkich danych produktu oraz jego historii magazynowej.
                Tej operacji nie można cofnąć.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteItem}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Usuń produkt
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {/* Dialog zmiany stanu magazynowego */}
      {selectedItem && (
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
                    <p className="font-medium">{selectedItem.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.partNumber}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Aktualny stan: </span>
                    <span className="font-medium">{selectedItem.quantityAvailable} {selectedItem.unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cena: </span>
                    <span className="font-medium">{selectedItem.price.toFixed(2)} zł / {selectedItem.unit}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Ilość ({selectedItem.unit})</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  min="0.01"
                  step="0.01"
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
              
              {stockAction === "out" && selectedItem.quantityAvailable < stockQuantity && (
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
                disabled={stockAction === "out" && (selectedItem.quantityAvailable < stockQuantity || stockQuantity <= 0)}
                className={stockAction === "in" ? "bg-brand-blue hover:bg-brand-blue/90" : "bg-brand-orange hover:bg-brand-orange/90"}
              >
                {stockAction === "in" ? "Przyjmij na magazyn" : "Wydaj z magazynu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}