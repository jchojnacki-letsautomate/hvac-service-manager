
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  DollarSign, 
  Printer, 
  FileText, 
  TrendingUp, 
  ArrowLeft,
  FileSpreadsheet,
  DownloadCloud,
  Mail,
  Filter,
  PieChart,
  Search
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from "recharts";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing

export function FinancialReportDetail() {
  const [period, setPeriod] = useState("currentMonth");
  const [compareWith, setCompareWith] = useState("previousPeriod");
  const [reportType, setReportType] = useState("revenue");
  // const navigate = useNavigate(); // Removed - using hash routing

  // Dane przykładowe dla raportu przychodów
  const revenueData = [
    { date: "01.06.2025", category: "Serwis klimatyzacji", client: "Hotel Metropol", amount: 2450.00 },
    { date: "03.06.2025", category: "Montaż pompy ciepła", client: "Osiedle Parkowe", amount: 12800.00 },
    { date: "05.06.2025", category: "Przegląd wentylacji", client: "Biurowiec Gamma", amount: 3200.00 },
    { date: "08.06.2025", category: "Naprawa klimatyzacji", client: "Restauracja Milano", amount: 1850.00 },
    { date: "10.06.2025", category: "Konserwacja systemu HVAC", client: "Szpital Miejski", amount: 4500.00 },
    { date: "12.06.2025", category: "Wymiana filtrów", client: "Centrum handlowe Plaza", amount: 980.00 },
    { date: "15.06.2025", category: "Serwis klimatyzacji", client: "Hotel Continental", amount: 3200.00 },
    { date: "17.06.2025", category: "Montaż klimatyzacji", client: "Apartamenty Novum", amount: 8500.00 },
    { date: "20.06.2025", category: "Naprawa pompy ciepła", client: "Dom Seniora", amount: 2350.00 },
    { date: "23.06.2025", category: "Przegląd systemu wentylacji", client: "Galeria Nowoczesna", amount: 2950.00 },
    { date: "25.06.2025", category: "Konserwacja klimatyzacji", client: "Biurowiec Delta", amount: 1850.00 },
    { date: "28.06.2025", category: "Uszczelnienie wycieków", client: "Restauracja Vesuvio", amount: 750.00 },
  ];

  // Dane przykładowe dla raportu kategorii
  const categoryData = [
    { category: "Serwis klimatyzacji", count: 58, amount: 142500.00 },
    { category: "Montaż systemów", count: 23, amount: 287500.00 },
    { category: "Przeglądy i konserwacje", count: 85, amount: 93500.00 },
    { category: "Naprawy", count: 42, amount: 78800.00 },
    { category: "Modernizacje", count: 12, amount: 156000.00 },
    { category: "Sprzedaż części", count: 128, amount: 84200.00 }
  ];

  // Dane przykładowe dla miesięcznego zestawienia
  const monthlyComparisonData = [
    { month: 'Sty', currentYear: 125000, previousYear: 105000 },
    { month: 'Lut', currentYear: 138000, previousYear: 118000 },
    { month: 'Mar', currentYear: 142000, previousYear: 124000 },
    { month: 'Kwi', currentYear: 156000, previousYear: 132000 },
    { month: 'Maj', currentYear: 170000, previousYear: 145000 },
    { month: 'Cze', currentYear: 182000, previousYear: 152000 },
    { month: 'Lip', currentYear: 0, previousYear: 158000 },
    { month: 'Sie', currentYear: 0, previousYear: 170000 },
    { month: 'Wrz', currentYear: 0, previousYear: 153000 },
    { month: 'Paź', currentYear: 0, previousYear: 140000 },
    { month: 'Lis', currentYear: 0, previousYear: 132000 },
    { month: 'Gru', currentYear: 0, previousYear: 148000 }
  ];

  // Funkcje pomocnicze
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  
  // Obliczanie statystyk według kategorii
  const categoryTotals = revenueData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryBreakdown = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category],
    percentage: (categoryTotals[category] / totalRevenue) * 100
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/raporty"}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1>Raport finansowy</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="size-4" />
            <span className="hidden md:inline">Drukuj</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="size-4" />
            <span className="hidden md:inline">Excel</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="size-4" />
            <span className="hidden md:inline">PDF</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="size-4" />
            <span className="hidden md:inline">Email</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Parametry raportu</CardTitle>
          <CardDescription>Wybierz zakres dat i typ raportu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Okres</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Wybierz okres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="currentMonth">Bieżący miesiąc</SelectItem>
                  <SelectItem value="previousMonth">Poprzedni miesiąc</SelectItem>
                  <SelectItem value="currentQuarter">Bieżący kwartał</SelectItem>
                  <SelectItem value="previousQuarter">Poprzedni kwartał</SelectItem>
                  <SelectItem value="currentYear">Bieżący rok</SelectItem>
                  <SelectItem value="previousYear">Poprzedni rok</SelectItem>
                  <SelectItem value="custom">Niestandardowy zakres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareWith">Porównaj z</Label>
              <Select value={compareWith} onValueChange={setCompareWith}>
                <SelectTrigger id="compareWith">
                  <SelectValue placeholder="Wybierz porównanie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previousPeriod">Poprzedni okres</SelectItem>
                  <SelectItem value="samePeriodLastYear">Ten sam okres rok temu</SelectItem>
                  <SelectItem value="budget">Budżet</SelectItem>
                  <SelectItem value="none">Bez porównania</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Typ raportu</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Wybierz typ raportu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Raport przychodów</SelectItem>
                  <SelectItem value="expenses">Raport kosztów</SelectItem>
                  <SelectItem value="profit">Raport zysków</SelectItem>
                  <SelectItem value="categories">Raport kategorii usług</SelectItem>
                  <SelectItem value="clients">Raport klientów</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {period === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data początkowa</Label>
                <div className="flex">
                  <Input type="date" id="startDate" defaultValue="2025-06-01" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data końcowa</Label>
                <div className="flex">
                  <Input type="date" id="endDate" defaultValue="2025-06-30" className="flex-1" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">Generuj raport</Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <DollarSign className="size-8 text-brand-blue mb-2" />
              <p className="text-2xl font-medium">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Całkowity przychód w okresie</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="size-8 text-brand-blue mb-2" />
              <p className="text-2xl font-medium">{revenueData.length}</p>
              <p className="text-sm text-muted-foreground">Liczba transakcji</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="size-8 text-brand-blue mb-2" />
              <p className="text-2xl font-medium">{formatCurrency(totalRevenue / revenueData.length)}</p>
              <p className="text-sm text-muted-foreground">Średnia wartość transakcji</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="details" className="gap-2">
            <FileText className="size-4" />
            <span>Szczegóły</span>
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-2">
            <BarChart3 className="size-4" />
            <span>Wykresy</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-2">
            <PieChart className="size-4" />
            <span>Porównanie i trendy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Szczegóły transakcji</CardTitle>
                  <CardDescription>Czerwiec 2025</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Szukaj..." 
                      className="pl-9 w-full md:w-[200px]" 
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <DownloadCloud className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Kategoria</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead className="text-right">Kwota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.client}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Przychody według kategorii</CardTitle>
                <CardDescription>Podział przychodów na poszczególne kategorie usług</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryBreakdown}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(value) => `${formatCurrency(value)}`} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Przychód"]}
                        labelFormatter={(value) => `Kategoria: ${value}`}
                      />
                      <Bar dataKey="value" name="Przychód" fill="var(--chart-1)" radius={[0, 4, 4, 0]}>
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Struktura przychodów</CardTitle>
                <CardDescription>Procentowy udział poszczególnych kategorii w przychodach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryBreakdown.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm font-medium">{formatCurrency(category.value)} ({category.percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="rounded-full h-2.5" 
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: `var(--chart-${(index % 5) + 1})`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Porównanie z rokiem poprzednim</CardTitle>
              <CardDescription>Zestawienie miesięcznych przychodów</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), ""]}
                      labelFormatter={(value) => `Miesiąc: ${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="currentYear" 
                      name="2025" 
                      stroke="var(--chart-1)" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previousYear" 
                      name="2024" 
                      stroke="var(--chart-4)" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Analiza trendu:</h4>
                <p className="text-sm text-muted-foreground">
                  Przychody w bieżącym roku wykazują stały wzrost w porównaniu do analogicznych okresów roku poprzedniego. 
                  Średni wzrost wynosi 18.5% r/r, co wskazuje na pozytywny trend rozwojowy firmy i skuteczną strategię sprzedaży.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Przychód YTD 2025</p>
                    <p className="text-lg font-medium">{formatCurrency(913000)}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Przychód YTD 2024</p>
                    <p className="text-lg font-medium">{formatCurrency(776000)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
