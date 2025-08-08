import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Settings,
  AlertTriangle,
  TrendingUp,
  ChevronsUpDown,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function InventoryReports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("last30");
  const [reportType, setReportType] = useState("inventory");
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/magazyn")}>
          <ArrowLeft className="icon-balanced" />
        </Button>
        <h1>Raporty magazynowe</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="icon-balanced" />
            <span className="hidden sm:inline">Ustawienia</span>
          </Button>
          <Button className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
            <Download className="icon-balanced" />
            <span className="hidden sm:inline">Eksportuj raport</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parametry raportu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Typ raportu</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ raportu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Stan magazynowy</SelectItem>
                    <SelectItem value="movements">Ruchy magazynowe</SelectItem>
                    <SelectItem value="usage">Zużycie produktów</SelectItem>
                    <SelectItem value="valuation">Wycena magazynu</SelectItem>
                    <SelectItem value="orders">Zamówienia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Zakres czasowy</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz zakres czasowy" />
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
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategoria produktów</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
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
              
              <div className="pt-4">
                <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                  Generuj raport
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Zapisane raporty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Stan magazynowy - Kwiecień</p>
                      <p className="text-xs text-muted-foreground">25.04.2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Raport kwartalny - Q1 2025</p>
                      <p className="text-xs text-muted-foreground">05.04.2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="icon-balanced text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Zużycie czynników - Marzec</p>
                      <p className="text-xs text-muted-foreground">01.04.2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                {reportType === "inventory" && "Raport stanu magazynowego"}
                {reportType === "movements" && "Raport ruchów magazynowych"}
                {reportType === "usage" && "Raport zużycia produktów"}
                {reportType === "valuation" && "Raport wyceny magazynu"}
                {reportType === "orders" && "Raport zamówień"}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Calendar className="icon-balanced" />
                <span>
                  {dateRange === "last30" && "Ostatnie 30 dni"}
                  {dateRange === "last7" && "Ostatnie 7 dni"}
                  {dateRange === "last90" && "Ostatnie 90 dni"}
                  {dateRange === "thisMonth" && "Bieżący miesiąc"}
                  {dateRange === "lastMonth" && "Poprzedni miesiąc"}
                  {dateRange === "thisYear" && "Bieżący rok"}
                  {dateRange === "custom" && "Zakres niestandardowy"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
                  <div className="bg-brand-blue/10 p-2 rounded-full">
                    <BarChart3 className="size-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Wartość magazynu</p>
                    <p className="text-2xl font-medium">128 450 zł</p>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
                  <div className="bg-brand-orange/10 p-2 rounded-full">
                    <TrendingUp className="size-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Obrót w okresie</p>
                    <p className="text-2xl font-medium">42 680 zł</p>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <AlertTriangle className="size-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Niski stan</p>
                    <p className="text-2xl font-medium">8 pozycji</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                  <TabsTrigger value="charts">Wykresy</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <div className="flex items-center gap-1">
                              Produkt
                              <ChevronsUpDown className="size-3.5" />
                            </div>
                          </TableHead>
                          <TableHead>Kategoria</TableHead>
                          <TableHead className="text-center">
                            <div className="flex items-center gap-1 justify-center">
                              Stan
                              <ChevronDown className="size-3.5" />
                            </div>
                          </TableHead>
                          <TableHead className="text-center">Min. poziom</TableHead>
                          <TableHead className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              Wartość
                              <ChevronsUpDown className="size-3.5" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Filtr do klimatyzatora</TableCell>
                          <TableCell>Filtry</TableCell>
                          <TableCell className="text-center">35 szt.</TableCell>
                          <TableCell className="text-center">10 szt.</TableCell>
                          <TableCell className="text-right">1 575,00 zł</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">W magazynie</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Czynnik chłodniczy R32</TableCell>
                          <TableCell>Czynniki chłodnicze</TableCell>
                          <TableCell className="text-center">8 kg</TableCell>
                          <TableCell className="text-center">10 kg</TableCell>
                          <TableCell className="text-right">1 440,00 zł</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Niski stan</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Czujnik temperatury</TableCell>
                          <TableCell>Elektronika</TableCell>
                          <TableCell className="text-center">15 szt.</TableCell>
                          <TableCell className="text-center">5 szt.</TableCell>
                          <TableCell className="text-right">900,00 zł</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">W magazynie</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Presostat LP</TableCell>
                          <TableCell>Automatyka</TableCell>
                          <TableCell className="text-center">2 szt.</TableCell>
                          <TableCell className="text-center">5 szt.</TableCell>
                          <TableCell className="text-right">240,00 zł</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="destructive">Krytyczny stan</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Zawór trójdrogowy</TableCell>
                          <TableCell>Hydraulika</TableCell>
                          <TableCell className="text-center">0 szt.</TableCell>
                          <TableCell className="text-center">3 szt.</TableCell>
                          <TableCell className="text-right">0,00 zł</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Zamówione</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Wyświetlanie 5 z 124 produktów
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Poprzednia</Button>
                      <Button variant="outline" size="sm">Następna</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="charts">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Wartość magazynu wg kategorii</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <div className="h-64 w-64 bg-muted/30 rounded-full flex items-center justify-center relative">
                          <PieChart className="absolute size-8 text-muted-foreground" />
                          <div className="text-sm text-center text-muted-foreground">
                            Wykres kołowy
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Zużycie w okresie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
                          <div className="text-sm text-center text-muted-foreground">
                            Wykres słupkowy
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Trend zużycia głównych materiałów</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
                        <div className="text-sm text-center text-muted-foreground">
                          Wykres liniowy
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="text-sm text-center text-muted-foreground mt-4">
                    Dane na podstawie operacji magazynowych z ostatnich 30 dni
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rekomendowane działania</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md">
                <AlertTriangle className="size-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700">Niski stan czynnika chłodniczego R32</p>
                  <p className="text-sm text-amber-600">
                    Stan magazynowy (8 kg) jest poniżej minimalnego poziomu (10 kg).
                    Zalecane uzupełnienie zapasów.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="text-amber-700 border-amber-200 hover:bg-amber-50">
                      Utwórz zamówienie
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-md">
                <AlertTriangle className="size-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Krytyczny stan presostatu LP</p>
                  <p className="text-sm text-destructive/80">
                    Stan magazynowy (2 szt.) jest znacznie poniżej minimalnego poziomu (5 szt.).
                    Natychmiastowe uzupełnienie zapasów jest wymagane.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      Utwórz pilne zamówienie
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                <Calendar className="size-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700">Zamówienie zaworów trójdrogowych</p>
                  <p className="text-sm text-blue-600">
                    Zamówienie ZAM/2025/042 (6 szt.) zostało złożone 08.05.2025.
                    Oczekiwana dostawa: 15.05.2025.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                      Sprawdź status
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}