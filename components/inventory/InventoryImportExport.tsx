import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle,
  Info,
  FileUp,
  FileDown,
  ExternalLink,
  Settings,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Switch } from "../ui/switch";

export function InventoryImportExport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("import");
  const [importMethod, setImportMethod] = useState("file");
  const [exportFormat, setExportFormat] = useState("excel");
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  
  const handleFileUpload = () => {
    setImportStatus("processing");
    
    // Symulacja procesu importu
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setImportStatus("success");
      }
    }, 300);
  };
  
  const resetImport = () => {
    setImportProgress(0);
    setImportStatus("idle");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/magazyn")}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>Import/Export danych magazynowych</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileUp className="icon-balanced" />
            <span>Import</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileDown className="icon-balanced" />
            <span>Export</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import danych do magazynu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Metoda importu</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={importMethod === "file" ? "default" : "outline"} 
                          className={importMethod === "file" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                          onClick={() => setImportMethod("file")}
                        >
                          <FileSpreadsheet className="mr-2 icon-balanced" />
                          Z pliku
                        </Button>
                        <Button 
                          variant={importMethod === "api" ? "default" : "outline"}
                          className={importMethod === "api" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                          onClick={() => setImportMethod("api")}
                        >
                          <ExternalLink className="mr-2 icon-balanced" />
                          Z API
                        </Button>
                      </div>
                    </div>
                    
                    {importMethod === "file" ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Format pliku</Label>
                          <Select defaultValue="excel">
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excel">Excel (XLSX)</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="xml">XML</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Plik z danymi</Label>
                          <div className="border-2 border-dashed rounded-md p-6 text-center">
                            {importStatus === "idle" ? (
                              <>
                                <FileText className="mx-auto size-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">
                                  Przeciągnij plik lub kliknij poniżej, aby wybrać
                                </p>
                                <Button onClick={handleFileUpload}>
                                  <Upload className="mr-2 icon-balanced" />
                                  Wybierz plik
                                </Button>
                              </>
                            ) : importStatus === "processing" ? (
                              <>
                                <p className="text-sm font-medium mb-2">Przetwarzanie pliku...</p>
                                <Progress value={importProgress} className="mb-2" />
                                <p className="text-xs text-muted-foreground">
                                  Postęp importu: {importProgress}%
                                </p>
                              </>
                            ) : importStatus === "success" ? (
                              <>
                                <CheckCircle className="mx-auto size-8 text-emerald-500 mb-2" />
                                <p className="text-emerald-600 font-medium mb-2">
                                  Import zakończony pomyślnie
                                </p>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Zaimportowano 52 produkty
                                </p>
                                <Button variant="outline" onClick={resetImport}>
                                  <RefreshCw className="mr-2 icon-balanced" />
                                  Importuj ponownie
                                </Button>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="mx-auto size-8 text-destructive mb-2" />
                                <p className="text-destructive font-medium mb-2">
                                  Wystąpił błąd podczas importu
                                </p>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Sprawdź format danych w pliku
                                </p>
                                <Button variant="outline" onClick={resetImport}>
                                  <RefreshCw className="mr-2 icon-balanced" />
                                  Spróbuj ponownie
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Adres URL API</Label>
                          <Input placeholder="https://api.example.com/inventory" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Klucz API</Label>
                          <Input type="password" placeholder="Wprowadź klucz API" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Parametry zapytania</Label>
                          <Textarea placeholder='{"limit": 100, "offset": 0}' />
                        </div>
                        
                        <Button className="bg-brand-blue hover:bg-brand-blue/90">
                          <ExternalLink className="mr-2 icon-balanced" />
                          Połącz z API
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Opcje importu</Label>
                    <Card>
                      <CardContent className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="update-existing" className="cursor-pointer">
                            Aktualizuj istniejące produkty
                          </Label>
                          <Switch id="update-existing" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="add-new" className="cursor-pointer">
                            Dodawaj nowe produkty
                          </Label>
                          <Switch id="add-new" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="override-stock" className="cursor-pointer">
                            Nadpisuj stany magazynowe
                          </Label>
                          <Switch id="override-stock" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="override-prices" className="cursor-pointer">
                            Aktualizuj ceny
                          </Label>
                          <Switch id="override-prices" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="create-log" className="cursor-pointer">
                            Utwórz log importu
                          </Label>
                          <Switch id="create-log" defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-md">
                    <div className="flex gap-2">
                      <Info className="size-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-700 font-medium">Wskazówki dotyczące importu</p>
                        <ul className="text-sm text-blue-600 list-disc ml-4 mt-1 space-y-1">
                          <li>Upewnij się, że plik CSV zawiera nagłówki kolumn</li>
                          <li>Kolumny z cenami powinny zawierać tylko wartości liczbowe</li>
                          <li>Kategorie produktów muszą być zgodne z systemowymi</li>
                          <li>Numery katalogowe muszą być unikalne</li>
                        </ul>
                        <Button variant="link" className="p-0 h-auto mt-1 text-blue-700">
                          Pobierz szablon pliku
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/magazyn")}>
                  Anuluj
                </Button>
                <Button className="bg-brand-blue hover:bg-brand-blue/90">
                  Rozpocznij import
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historia importów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Użytkownik</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Dodane</TableHead>
                      <TableHead>Zaktualizowane</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>12.05.2025 09:15</TableCell>
                      <TableCell>Jan Kowalski</TableCell>
                      <TableCell>Aktualizacja cennika</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>28</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="size-4 text-emerald-500" />
                          <span className="text-emerald-600">Sukces</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Pobierz log</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10.05.2025 14:30</TableCell>
                      <TableCell>Anna Nowak</TableCell>
                      <TableCell>Nowe produkty</TableCell>
                      <TableCell>14</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="size-4 text-emerald-500" />
                          <span className="text-emerald-600">Sukces</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Pobierz log</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>05.05.2025 11:05</TableCell>
                      <TableCell>Piotr Wiśniewski</TableCell>
                      <TableCell>Aktualizacja stanów</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>64</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="size-4 text-amber-500" />
                          <span className="text-amber-600">Częściowy</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Pobierz log</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export danych magazynowych</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Format exportu</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={exportFormat === "excel" ? "default" : "outline"} 
                        className={exportFormat === "excel" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                        onClick={() => setExportFormat("excel")}
                      >
                        <FileSpreadsheet className="mr-2 icon-balanced" />
                        Excel (XLSX)
                      </Button>
                      <Button 
                        variant={exportFormat === "csv" ? "default" : "outline"}
                        className={exportFormat === "csv" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                        onClick={() => setExportFormat("csv")}
                      >
                        <FileText className="mr-2 icon-balanced" />
                        CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Zakres danych</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz zakres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Wszystkie produkty</SelectItem>
                        <SelectItem value="low">Produkty z niskim stanem</SelectItem>
                        <SelectItem value="critical">Produkty z krytycznym stanem</SelectItem>
                        <SelectItem value="active">Tylko aktywne produkty</SelectItem>
                        <SelectItem value="custom">Niestandardowy zakres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kategorie produktów</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorie" />
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kolumny do wyeksportowania</Label>
                    <Card>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-id" className="cursor-pointer">ID produktu</Label>
                          <Switch id="col-id" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-name" className="cursor-pointer">Nazwa produktu</Label>
                          <Switch id="col-name" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-partnum" className="cursor-pointer">Numer katalogowy</Label>
                          <Switch id="col-partnum" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-category" className="cursor-pointer">Kategoria</Label>
                          <Switch id="col-category" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-quantity" className="cursor-pointer">Stan magazynowy</Label>
                          <Switch id="col-quantity" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-unit" className="cursor-pointer">Jednostka miary</Label>
                          <Switch id="col-unit" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-price" className="cursor-pointer">Cena</Label>
                          <Switch id="col-price" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-location" className="cursor-pointer">Lokalizacja</Label>
                          <Switch id="col-location" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="col-desc" className="cursor-pointer">Opis</Label>
                          <Switch id="col-desc" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Opcje exportu</Label>
                    <Card>
                      <CardContent className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-header" className="cursor-pointer">
                            Dołącz nagłówki kolumn
                          </Label>
                          <Switch id="include-header" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-zero" className="cursor-pointer">
                            Uwzględnij produkty z zerowym stanem
                          </Label>
                          <Switch id="include-zero" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="format-numbers" className="cursor-pointer">
                            Formatuj liczby
                          </Label>
                          <Switch id="format-numbers" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-date" className="cursor-pointer">
                            Dołącz datę w nazwie pliku
                          </Label>
                          <Switch id="include-date" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-schedule" className="cursor-pointer">
                            Zaplanuj cykliczny export
                          </Label>
                          <Switch id="auto-schedule" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-md">
                    <div className="flex gap-2">
                      <Info className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-700 font-medium">Uwaga dotycząca danych poufnych</p>
                        <p className="text-sm text-amber-600 mt-1">
                          Eksportowane dane mogą zawierać informacje poufne.
                          Upewnij się, że eksportowany plik będzie przechowywany
                          w bezpiecznym miejscu i udostępniany tylko uprawnionym osobom.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">Podgląd nazwy pliku:</p>
                    <p className="text-sm text-muted-foreground break-all font-mono">
                      magazyn_hvac_export_12-05-2025.{exportFormat}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/magazyn")}>
                  Anuluj
                </Button>
                <Button className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
                  <Download className="icon-balanced" />
                  Eksportuj dane
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Zaplanowane exporty</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="icon-balanced" />
                <span>Zarządzaj</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa</TableHead>
                      <TableHead>Częstotliwość</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Ostatnie wykonanie</TableHead>
                      <TableHead>Następne wykonanie</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Raport miesięczny</TableCell>
                      <TableCell>Co miesiąc (1 dzień)</TableCell>
                      <TableCell>Excel</TableCell>
                      <TableCell>01.05.2025</TableCell>
                      <TableCell>01.06.2025</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="size-4 text-emerald-500" />
                          <span className="text-emerald-600">Aktywny</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Produkty na wyczerpaniu</TableCell>
                      <TableCell>Co tydzień (poniedziałek)</TableCell>
                      <TableCell>CSV</TableCell>
                      <TableCell>06.05.2025</TableCell>
                      <TableCell>13.05.2025</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="size-4 text-emerald-500" />
                          <span className="text-emerald-600">Aktywny</span>
                        </div>
                      </TableCell>
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