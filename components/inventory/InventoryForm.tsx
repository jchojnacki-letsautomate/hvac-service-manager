import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, Save, Package, Trash2, Upload } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom"; // Removed - using hash routing
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface InventoryFormProps {
  isNew?: boolean;
}

export function InventoryForm({ isNew = false }: InventoryFormProps) {
  // const { id } = useParams(); // Removed - using hash routing
  // const navigate = useNavigate(); // Removed - using hash routing
  const id = "";
  const [productName, setProductName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("szt.");
  const [initialQuantity, setInitialQuantity] = useState("0");
  const [minLevel, setMinLevel] = useState("5");
  const [isImported, setIsImported] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Jeśli edytujemy istniejący produkt, pobieramy dane
    if (!isNew && id) {
      // W rzeczywistej aplikacji tutaj byłoby pobieranie danych z API
      // Dla przykładu użyjemy hardkodowanych danych
      const mockProduct = getMockProduct(id);
      if (mockProduct) {
        setProductName(mockProduct.name);
        setPartNumber(mockProduct.partNumber);
        setCategory(mockProduct.category);
        setPrice(mockProduct.price.toString());
        setUnit(mockProduct.unit);
        setInitialQuantity(mockProduct.quantityAvailable.toString());
        setMinLevel(mockProduct.minLevel.toString());
        setLocation(mockProduct.location);
        setDescription("Szczegółowy opis produktu - dane techniczne, wymiary, specyfikacja.");
        setIsImported(mockProduct.isImported || false);
      }
    }
  }, [isNew, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!productName || !partNumber || !category || !price || !unit || !location) {
      alert("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    // W rzeczywistej aplikacji tutaj byłoby zapisywanie do API
    alert(`Produkt ${isNew ? "dodany" : "zaktualizowany"} pomyślnie`);
    window.location.hash = "#/magazyn";
  };

  const handleDelete = () => {
    alert(`Produkt "${productName}" został usunięty z magazynu`);
    window.location.hash = "#/magazyn";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/magazyn"}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>{isNew ? "Nowy produkt w magazynie" : `Edycja produktu: ${productName}`}</h1>
        {!isNew && (
          <div className="ml-auto">
            <Button 
              variant="outline" 
              className="gap-2 text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="icon-balanced" />
              <span>Usuń produkt</span>
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informacje podstawowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="productName" className="required">Nazwa produktu</Label>
                    <Input 
                      id="productName" 
                      value={productName} 
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Np. Filtr do klimatyzatora"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="partNumber" className="required">Numer katalogowy</Label>
                    <Input 
                      id="partNumber" 
                      value={partNumber} 
                      onChange={(e) => setPartNumber(e.target.value)}
                      placeholder="Np. FLT-001"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="required">Kategoria</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Filtry">Filtry</SelectItem>
                        <SelectItem value="Czynniki chłodnicze">Czynniki chłodnicze</SelectItem>
                        <SelectItem value="Elektronika">Elektronika</SelectItem>
                        <SelectItem value="Automatyka">Automatyka</SelectItem>
                        <SelectItem value="Hydraulika">Hydraulika</SelectItem>
                        <SelectItem value="Narzędzia">Narzędzia</SelectItem>
                        <SelectItem value="Inne">Inne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price" className="required">Cena jednostkowa (zł)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="required">Jednostka miary</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Wybierz jednostkę" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="szt.">sztuka</SelectItem>
                        <SelectItem value="kg">kilogram</SelectItem>
                        <SelectItem value="m">metr</SelectItem>
                        <SelectItem value="l">litr</SelectItem>
                        <SelectItem value="m2">metr kwadratowy</SelectItem>
                        <SelectItem value="m3">metr sześcienny</SelectItem>
                        <SelectItem value="opak.">opakowanie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="required">Lokalizacja w magazynie</Label>
                    <Input 
                      id="location" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Np. Regał A, półka 1"
                      required
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="initialQuantity">Stan początkowy ({unit})</Label>
                      <Input 
                        id="initialQuantity" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={initialQuantity} 
                        onChange={(e) => setInitialQuantity(e.target.value)}
                        disabled={!isNew}
                      />
                      {!isNew && (
                        <p className="text-sm text-muted-foreground">
                          Stan początkowy można ustawić tylko przy dodawaniu nowego produktu
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minLevel">Minimalny poziom ({unit})</Label>
                      <Input 
                        id="minLevel" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={minLevel} 
                        onChange={(e) => setMinLevel(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Minimalna ilość, poniżej której produkt będzie oznaczony jako "niski stan"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isImported" 
                      checked={isImported}
                      onCheckedChange={setIsImported}
                    />
                    <Label htmlFor="isImported">Produkt importowany</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="description">Opis produktu</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Szczegółowy opis produktu, specyfikacja techniczna, etc."
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => window.location.hash = "#/magazyn"}>
                Anuluj
              </Button>
              <Button type="submit" className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
                <Save className="icon-balanced" />
                <span>Zapisz produkt</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zdjęcie produktu</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="mb-4 border rounded-md overflow-hidden w-full aspect-square">
                  <ImageWithFallback
                    src={isImported || !isNew ? "/images/product-example.jpg" : "/images/product-placeholder.jpg"}
                    alt={productName || "Zdjęcie produktu"}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" className="gap-2 w-full">
                  <Upload className="icon-balanced" />
                  <span>Dodaj zdjęcie</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dostawcy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Daikin Polska Sp. z o.o.</span>
                    <Button variant="ghost" size="sm">Edytuj</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Klimat-Max s.c.</span>
                    <Button variant="ghost" size="sm">Edytuj</Button>
                  </div>
                  <Button variant="outline" className="gap-2 w-full mt-4">
                    <Plus className="icon-balanced" />
                    <span>Dodaj dostawcę</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Powiązane dokumenty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Karta katalogowa.pdf</span>
                    <Button variant="ghost" size="sm">Podgląd</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Certyfikat CE.pdf</span>
                    <Button variant="ghost" size="sm">Podgląd</Button>
                  </div>
                  <Button variant="outline" className="gap-2 w-full mt-4">
                    <FileText className="icon-balanced" />
                    <span>Dodaj dokument</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuwanie produktu</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć produkt <span className="font-medium">{productName}</span> z magazynu?
              Ta operacja spowoduje usunięcie wszystkich danych produktu oraz jego historii magazynowej.
              Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń produkt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper function for demo purposes only
function getMockProduct(id: string) {
  const mockProducts = [
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
      isImported: false
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
      status: "low",
      isImported: true
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
      status: "ok",
      isImported: false
    }
  ];
  
  return mockProducts.find(product => product.id === id);
}

// Komponent Plus dla ikony plus
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

// Komponent FileText dla ikony dokumentu
function FileText({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}