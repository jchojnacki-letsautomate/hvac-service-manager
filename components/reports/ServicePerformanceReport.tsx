
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Separator } from "../ui/separator";
import { 
  User, 
  Clock, 
  Wrench, 
  BarChart3, 
  LineChart, 
  ArrowLeft, 
  Printer, 
  Download, 
  Star, 
  Check, 
  AlertTriangle, 
  ThumbsUp, 
  Calendar, 
  Search, 
  Filter,
  ChevronUp,
  ChevronDown,
  FileSpreadsheet
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as RechartLineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ServicePerformanceReport() {
  const [period, setPeriod] = useState("lastMonth");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  // const navigate = useNavigate(); // Removed - using hash routing

  // Przykładowe dane dla techników
  const technicians = [
    { id: "1", name: "Adam Nowak", avatar: "AN", role: "Starszy technik" },
    { id: "2", name: "Piotr Kowalski", avatar: "PK", role: "Technik" },
    { id: "3", name: "Anna Wiśniewska", avatar: "AW", role: "Technik specjalista" },
    { id: "4", name: "Marcin Dąbrowski", avatar: "MD", role: "Technik" },
    { id: "5", name: "Ewa Nowicka", avatar: "EN", role: "Młodszy technik" }
  ];

  // Przykładowe dane wydajności techników
  const technicianPerformance = [
    { 
      id: "1", 
      name: "Adam Nowak", 
      ordersCompleted: 42, 
      ordersPending: 5,
      avgCompletionTime: 4.2, 
      avgResponseTime: 1.3, 
      clientSatisfaction: 4.8,
      onTimePercentage: 94
    },
    { 
      id: "2", 
      name: "Piotr Kowalski", 
      ordersCompleted: 38, 
      ordersPending: 7,
      avgCompletionTime: 4.8, 
      avgResponseTime: 1.5, 
      clientSatisfaction: 4.7,
      onTimePercentage: 91
    },
    { 
      id: "3", 
      name: "Anna Wiśniewska", 
      ordersCompleted: 45, 
      ordersPending: 3,
      avgCompletionTime: 3.9, 
      avgResponseTime: 1.1, 
      clientSatisfaction: 4.9,
      onTimePercentage: 97
    },
    { 
      id: "4", 
      name: "Marcin Dąbrowski", 
      ordersCompleted: 36, 
      ordersPending: 8,
      avgCompletionTime: 5.1, 
      avgResponseTime: 1.8, 
      clientSatisfaction: 4.6,
      onTimePercentage: 89
    },
    { 
      id: "5", 
      name: "Ewa Nowicka", 
      ordersCompleted: 32, 
      ordersPending: 6,
      avgCompletionTime: 5.3, 
      avgResponseTime: 1.9, 
      clientSatisfaction: 4.5,
      onTimePercentage: 87
    }
  ];

  // Przykładowe dane dotyczące realizowanych zleceń
  const serviceOrders = [
    { date: "01.06.2025", client: "Hotel Metropol", type: "Przegląd klimatyzacji", technician: "Adam Nowak", status: "completed", completionTime: 3.5, onTime: true, rating: 5 },
    { date: "02.06.2025", client: "Biurowiec Gamma", type: "Naprawa systemu wentylacji", technician: "Anna Wiśniewska", status: "completed", completionTime: 4.2, onTime: true, rating: 5 },
    { date: "03.06.2025", client: "Centrum handlowe Plaza", type: "Wymiana filtrów", technician: "Piotr Kowalski", status: "completed", completionTime: 2.8, onTime: true, rating: 4 },
    { date: "05.06.2025", client: "Restauracja Milano", type: "Naprawa klimatyzacji", technician: "Marcin Dąbrowski", status: "completed", completionTime: 5.1, onTime: false, rating: 4 },
    { date: "07.06.2025", client: "Osiedle Parkowe", type: "Montaż pompy ciepła", technician: "Anna Wiśniewska", status: "completed", completionTime: 8.2, onTime: true, rating: 5 },
    { date: "08.06.2025", client: "Hotel Continental", type: "Przegląd klimatyzacji", technician: "Adam Nowak", status: "completed", completionTime: 3.2, onTime: true, rating: 5 },
    { date: "10.06.2025", client: "Szpital Miejski", type: "Konserwacja systemu HVAC", technician: "Ewa Nowicka", status: "completed", completionTime: 6.4, onTime: true, rating: 4 },
    { date: "12.06.2025", client: "Biurowiec Delta", type: "Konserwacja klimatyzacji", technician: "Piotr Kowalski", status: "completed", completionTime: 4.0, onTime: true, rating: 5 },
    { date: "14.06.2025", client: "Apartamenty Novum", type: "Montaż klimatyzacji", technician: "Marcin Dąbrowski", status: "completed", completionTime: 7.5, onTime: true, rating: 5 },
    { date: "15.06.2025", client: "Galeria Nowoczesna", type: "Przegląd systemu wentylacji", technician: "Ewa Nowicka", status: "completed", completionTime: 4.8, onTime: false, rating: 4 },
    { date: "17.06.2025", client: "Dom Seniora", type: "Naprawa pompy ciepła", technician: "Anna Wiśniewska", status: "completed", completionTime: 5.6, onTime: true, rating: 5 },
    { date: "19.06.2025", client: "Restauracja Vesuvio", type: "Uszczelnienie wycieków", technician: "Adam Nowak", status: "completed", completionTime: 2.7, onTime: true, rating: 4 }
  ];

  // Dane do wykresów wydajności
  const performanceByDateData = [
    { date: "01.06", count: 3, avgTime: 3.2 },
    { date: "02.06", count: 4, avgTime: 3.8 },
    { date: "03.06", count: 2, avgTime: 2.9 },
    { date: "04.06", count: 5, avgTime: 4.1 },
    { date: "05.06", count: 3, avgTime: 3.5 },
    { date: "06.06", count: 2, avgTime: 2.7 },
    { date: "07.06", count: 4, avgTime: 4.3 },
    { date: "08.06", count: 5, avgTime: 3.9 },
    { date: "09.06", count: 3, avgTime: 3.1 },
    { date: "10.06", count: 4, avgTime: 4.0 }
  ];

  // Dane do wykresu radarowego umiejętności techników
  const skillsData = [
    { 
      technician: "Adam Nowak", 
      skills: [
        { subject: "Klimatyzacje", A: 85 },
        { subject: "Wentylacje", A: 75 },
        { subject: "Pompy ciepła", A: 90 },
        { subject: "Sys. grzewcze", A: 65 },
        { subject: "Automatyka", A: 80 }
      ] 
    },
    { 
      technician: "Anna Wiśniewska", 
      skills: [
        { subject: "Klimatyzacje", A: 80 },
        { subject: "Wentylacje", A: 90 },
        { subject: "Pompy ciepła", A: 85 },
        { subject: "Sys. grzewcze", A: 75 },
        { subject: "Automatyka", A: 95 }
      ] 
    }
  ];

  // Dane do wykresu porównawczego
  const comparisonData = [
    { metric: "Czas realizacji (godz.)", Adam: 4.2, Anna: 3.9, Piotr: 4.8, Marcin: 5.1, Ewa: 5.3 },
    { metric: "Czas reakcji (godz.)", Adam: 1.3, Anna: 1.1, Piotr: 1.5, Marcin: 1.8, Ewa: 1.9 },
    { metric: "Satysfakcja klienta (1-5)", Adam: 4.8, Anna: 4.9, Piotr: 4.7, Marcin: 4.6, Ewa: 4.5 },
    { metric: "Terminowość (%)", Adam: 94, Anna: 97, Piotr: 91, Marcin: 89, Ewa: 87 }
  ];

  // Podsumowanie statystyk
  const totalOrders = technicianPerformance.reduce((sum, tech) => sum + tech.ordersCompleted, 0);
  const avgSatisfaction = technicianPerformance.reduce((sum, tech) => sum + tech.clientSatisfaction, 0) / technicianPerformance.length;
  const avgResponseTime = technicianPerformance.reduce((sum, tech) => sum + tech.avgResponseTime, 0) / technicianPerformance.length;
  const onTimePercentage = technicianPerformance.reduce((sum, tech) => sum + tech.onTimePercentage, 0) / technicianPerformance.length;

  // Przygotowanie danych do wykresu radarowego
  const [selectedTechnician, setSelectedTechnician] = useState("Adam Nowak");
  const selectedSkillsData = skillsData.find(tech => tech.technician === selectedTechnician)?.skills || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/raporty"}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1>Raport wydajności serwisu</h1>
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
            <Download className="size-4" />
            <span className="hidden md:inline">Pobierz</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Parametry raportu</CardTitle>
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
                  <SelectItem value="lastWeek">Ostatni tydzień</SelectItem>
                  <SelectItem value="lastMonth">Ostatni miesiąc</SelectItem>
                  <SelectItem value="lastQuarter">Ostatni kwartał</SelectItem>
                  <SelectItem value="lastYear">Ostatni rok</SelectItem>
                  <SelectItem value="custom">Niestandardowy zakres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicianFilter">Technik</Label>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger id="technicianFilter">
                  <SelectValue placeholder="Wybierz technika" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy technicy</SelectItem>
                  {technicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceTypeFilter">Typ serwisu</Label>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger id="serviceTypeFilter">
                  <SelectValue placeholder="Wybierz typ serwisu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  <SelectItem value="maintenance">Przeglądy i konserwacje</SelectItem>
                  <SelectItem value="repair">Naprawy</SelectItem>
                  <SelectItem value="installation">Instalacje i montaże</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Wrench className="size-8 text-brand-blue mb-2" />
              <p className="text-2xl font-medium">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">Ukończone zlecenia</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Star className="size-8 text-amber-500 mb-2" />
              <p className="text-2xl font-medium">{avgSatisfaction.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Średnia ocena (1-5)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="size-8 text-brand-blue mb-2" />
              <p className="text-2xl font-medium">{avgResponseTime.toFixed(1)} h</p>
              <p className="text-sm text-muted-foreground">Średni czas reakcji</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Check className="size-8 text-emerald-500 mb-2" />
              <p className="text-2xl font-medium">{onTimePercentage.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Terminowość realizacji</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="technicians">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="technicians" className="gap-2">
            <User className="size-4" />
            <span>Technicy</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart3 className="size-4" />
            <span>Wydajność</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <LineChart className="size-4" />
            <span>Szczegóły zleceń</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technicians">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Wydajność techników</CardTitle>
                  <CardDescription>Czerwiec 2025</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Szukaj technika..." 
                      className="pl-9 w-full md:w-[200px]" 
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technik</TableHead>
                      <TableHead className="text-center">Ukończone zlecenia</TableHead>
                      <TableHead className="text-center">Czas realizacji (h)</TableHead>
                      <TableHead className="text-center">Czas reakcji (h)</TableHead>
                      <TableHead className="text-center">Ocena klientów</TableHead>
                      <TableHead className="text-center">Terminowość (%)</TableHead>
                      <TableHead className="text-center">Wydajność</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicianPerformance.map((tech) => (
                      <TableRow key={tech.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                              <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{tech.name}</div>
                              <div className="text-xs text-muted-foreground">{technicians.find(t => t.id === tech.id)?.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{tech.ordersCompleted}</TableCell>
                        <TableCell className="text-center">{tech.avgCompletionTime.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{tech.avgResponseTime.toFixed(1)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="text-amber-500 mr-1">★</div>
                            <span>{tech.clientSatisfaction.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{tech.onTimePercentage}</TableCell>
                        <TableCell className="text-center">
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className={`rounded-full h-2.5 ${
                                tech.onTimePercentage >= 95 
                                  ? "bg-emerald-500" 
                                  : tech.onTimePercentage >= 90 
                                  ? "bg-brand-blue" 
                                  : tech.onTimePercentage >= 85 
                                  ? "bg-amber-500" 
                                  : "bg-destructive"
                              }`}
                              style={{ width: `${tech.onTimePercentage}%` }}
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Porównanie techników</CardTitle>
                <CardDescription>Kluczowe metryki według technika</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="metric" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Adam" name="Adam N." fill="var(--chart-1)" />
                      <Bar dataKey="Anna" name="Anna W." fill="var(--chart-2)" />
                      <Bar dataKey="Piotr" name="Piotr K." fill="var(--chart-3)" />
                      <Bar dataKey="Marcin" name="Marcin D." fill="var(--chart-4)" />
                      <Bar dataKey="Ewa" name="Ewa N." fill="var(--chart-5)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Profil umiejętności</CardTitle>
                    <CardDescription>Według technika</CardDescription>
                  </div>
                  <Select 
                    value={selectedTechnician} 
                    onValueChange={setSelectedTechnician}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Wybierz technika" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillsData.map(tech => (
                        <SelectItem key={tech.technician} value={tech.technician}>
                          {tech.technician}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedSkillsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name={selectedTechnician} dataKey="A" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Wydajność serwisu według dni</CardTitle>
              <CardDescription>Liczba zleceń i średni czas realizacji</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={performanceByDateData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="count" 
                      name="Liczba zleceń" 
                      stroke="var(--chart-1)" 
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgTime" 
                      name="Średni czas (h)" 
                      stroke="var(--chart-4)" 
                      strokeWidth={3}
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Kluczowe obserwacje:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronUp className="size-4 text-emerald-500 mt-0.5" />
                    <span>Najwyższa wydajność jest osiągana w dni, gdy liczba zleceń wynosi 3-4, a czas realizacji mieści się w zakresie 3-4 godzin.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronDown className="size-4 text-amber-500 mt-0.5" />
                    <span>Zauważono spadek wydajności w dni z większą liczbą zleceń (5+), prawdopodobnie związany z przeciążeniem techników.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="size-4 text-amber-500 mt-0.5" />
                    <span>Rekomendacja: Optymalizacja harmonogramu pracy w celu utrzymania liczby zleceń na poziomie nie przekraczającym 4 na dzień na technika.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rozkład ocen klientów</CardTitle>
                <CardDescription>Na podstawie wszystkich zleceń</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm flex items-center">
                        <span className="text-amber-500 mr-1">★★★★★</span> 5 gwiazdek
                      </span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-emerald-500 rounded-full h-2.5" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm flex items-center">
                        <span className="text-amber-500 mr-1">★★★★☆</span> 4 gwiazdki
                      </span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-emerald-400 rounded-full h-2.5" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm flex items-center">
                        <span className="text-amber-500 mr-1">★★★☆☆</span> 3 gwiazdki
                      </span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-500 rounded-full h-2.5" style={{ width: "8%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm flex items-center">
                        <span className="text-amber-500 mr-1">★★☆☆☆</span> 2 gwiazdki
                      </span>
                      <span className="text-sm font-medium">2%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-600 rounded-full h-2.5" style={{ width: "2%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm flex items-center">
                        <span className="text-amber-500 mr-1">★☆☆☆☆</span> 1 gwiazdka
                      </span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-destructive rounded-full h-2.5" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-medium">{avgSatisfaction.toFixed(1)}</div>
                    <div className="text-amber-500 text-2xl">★★★★★</div>
                    <div className="text-sm text-muted-foreground">
                      <p>Średnia ocena</p>
                      <p>Liczba opinii: {serviceOrders.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Czas realizacji według typów zleceń</CardTitle>
                <CardDescription>Średni czas realizacji w godzinach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Przeglądy klimatyzacji</span>
                        <span className="text-sm font-medium">3.4h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-brand-blue rounded-full h-2.5" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Naprawy systemów wentylacji</span>
                        <span className="text-sm font-medium">4.7h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-brand-blue rounded-full h-2.5" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Montaż klimatyzacji</span>
                        <span className="text-sm font-medium">7.5h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-brand-blue rounded-full h-2.5" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Montaż pomp ciepła</span>
                        <span className="text-sm font-medium">8.2h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-brand-blue rounded-full h-2.5" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Wymiana filtrów</span>
                        <span className="text-sm font-medium">2.8h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-brand-blue rounded-full h-2.5" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Średni czas realizacji wszystkich typów zleceń: 5.3h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Szczegóły zleceń</CardTitle>
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
                    <Calendar className="size-4" />
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
                      <TableHead>Klient</TableHead>
                      <TableHead>Typ usługi</TableHead>
                      <TableHead>Technik</TableHead>
                      <TableHead className="text-center">Czas realizacji</TableHead>
                      <TableHead className="text-center">Terminowość</TableHead>
                      <TableHead className="text-center">Ocena</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.client}</TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell>{order.technician}</TableCell>
                        <TableCell className="text-center">{order.completionTime}h</TableCell>
                        <TableCell className="text-center">
                          {order.onTime ? (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                              <Check className="size-3" />
                              <span>Na czas</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                              <Clock className="size-3" />
                              <span>Opóźnienie</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="text-amber-500">
                              {"★".repeat(order.rating)}
                              {"☆".repeat(5 - order.rating)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
