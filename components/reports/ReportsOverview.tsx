
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Wrench, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Users,
  Star
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
  Legend,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from "recharts";

export function ReportsOverview() {
  const [dateRange, setDateRange] = useState("month");

  // Dane przykładowe - w rzeczywistej aplikacji pobierane z API
  const revenueData = [
    { name: "Sty", revenue: 45000, expenses: 32000, profit: 13000 },
    { name: "Lut", revenue: 52000, expenses: 36000, profit: 16000 },
    { name: "Mar", revenue: 48000, expenses: 34000, profit: 14000 },
    { name: "Kwi", revenue: 61000, expenses: 39000, profit: 22000 },
    { name: "Maj", revenue: 58000, expenses: 37000, profit: 21000 },
    { name: "Cze", revenue: 59000, expenses: 38000, profit: 21000 }
  ];

  const serviceOrdersData = [
    { name: "Sty", completed: 35 },
    { name: "Lut", completed: 38 },
    { name: "Mar", completed: 33 },
    { name: "Kwi", completed: 42 },
    { name: "Maj", completed: 39 },
    { name: "Cze", completed: 38 }
  ];

  const serviceTypeData = [
    { name: "Klimatyzacje", value: 45 },
    { name: "Pompy ciepła", value: 30 },
    { name: "Wentylatory", value: 25 }
  ];

  const technicianData = [
    { name: "Adam Nowak", ordersCompleted: 42, avgRating: 4.8 },
    { name: "Anna Wiśniewska", ordersCompleted: 45, avgRating: 4.9 },
    { name: "Piotr Kowalski", ordersCompleted: 38, avgRating: 4.7 }
  ];

  const COLORS = ['var(--chart-1)', 'var(--chart-4)', 'var(--chart-3)'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
  };

  // Obliczanie statystyk
  const totalRevenueCurrentPeriod = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalRevenueLastPeriod = totalRevenueCurrentPeriod * 0.92; // Przykładowe dane: 8% wzrostu
  const percentageChange = ((totalRevenueCurrentPeriod - totalRevenueLastPeriod) / totalRevenueLastPeriod) * 100;

  const totalOrders = serviceOrdersData.reduce((sum, item) => sum + item.completed, 0);
  const avgOrderValue = totalRevenueCurrentPeriod / totalOrders;
  const avgRating = technicianData.reduce((sum, tech) => sum + tech.avgRating, 0) / technicianData.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Raporty i statystyki</h1>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz zakres dat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ostatni miesiąc</SelectItem>
              <SelectItem value="quarter">Ostatni kwartał</SelectItem>
              <SelectItem value="year">Ostatni rok</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            <span className="hidden md:inline">Eksportuj</span>
          </Button>
        </div>
      </div>

      {/* Karty z kluczowymi wskaźnikami */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5 text-brand-blue" />
                  <p className="text-muted-foreground text-sm">Przychód</p>
                </div>
                <p className="text-2xl font-medium">{formatCurrency(totalRevenueCurrentPeriod)}</p>
              </div>
              <div className={`flex items-center ${percentageChange >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                {percentageChange >= 0 ? <ArrowUpRight className="size-4 mr-1" /> : <ArrowDownRight className="size-4 mr-1" />}
                <span className="font-medium">{percentageChange.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wrench className="size-5 text-brand-blue" />
                  <p className="text-muted-foreground text-sm">Zlecenia</p>
                </div>
                <p className="text-2xl font-medium">{totalOrders}</p>
              </div>
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="size-4 mr-1" />
                <span className="font-medium">12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-brand-blue" />
                  <p className="text-muted-foreground text-sm">Średnia wartość</p>
                </div>
                <p className="text-2xl font-medium">{formatCurrency(avgOrderValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-brand-orange" />
                  <p className="text-muted-foreground text-sm">Satysfakcja</p>
                </div>
                <p className="text-2xl font-medium">{avgRating.toFixed(1)}/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Główne wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Przychody</CardTitle>
                <CardDescription>Ostatnie 6 miesięcy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-0 pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" name="Przychód" fill="var(--chart-4)" />
                  <Bar dataKey="profit" name="Zysk" fill="var(--chart-3)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Struktura serwisu</CardTitle>
                <CardDescription>Rodzaje urządzeń</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Podsumowanie techników */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-brand-blue" />
            Najlepsi technicy
          </CardTitle>
          <CardDescription>Podsumowanie wyników</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicianData.map((tech, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{tech.name}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Wrench className="size-4 text-muted-foreground" />
                      <span>{tech.ordersCompleted}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 text-amber-500" />
                      <span>{tech.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-brand-blue rounded-full h-2.5" 
                    style={{ width: `${(tech.ordersCompleted / 45) * 100}%` }}
                  ></div>
                </div>
                {index < technicianData.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kluczowe wnioski */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-brand-blue" />
            Kluczowe wnioski
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Wzrost przychodów</p>
                <p className="text-sm text-muted-foreground">
                  Przychody wzrosły o 8% w porównaniu do poprzedniego okresu, co wskazuje na skuteczność działań marketingowych.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                <Star className="size-4 text-brand-blue" />
              </div>
              <div>
                <p className="font-medium">Wysoki poziom satysfakcji</p>
                <p className="text-sm text-muted-foreground">
                  Średnia ocena 4.8/5.0 potwierdza dobrą jakość obsługi i zadowolenie klientów z wykonanych usług.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="size-4 text-brand-orange" />
              </div>
              <div>
                <p className="font-medium">Większość zleceń dotyczy klimatyzacji</p>
                <p className="text-sm text-muted-foreground">
                  45% wszystkich zleceń związanych jest z serwisem klimatyzacji, co wskazuje na potrzebę zwiększenia specjalizacji w tym obszarze.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
