import React from "react";
import { StatsCard } from "./StatsCard";
import { TaskCard } from "./TaskCard";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ClipboardList, FileText, CreditCard, Bell, 
  Plus, Upload, Receipt, CheckSquare
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function Dashboard() {
  // Przykładowe dane
  const statsData = [
    { 
      title: "Nowe zlecenia", 
      value: "12", 
      icon: <ClipboardList className="size-5" />,
      trend: { value: 8, isPositive: true }
    },
    { 
      title: "Dokumenty OCR", 
      value: "7", 
      icon: <FileText className="size-5" />,
      description: "Oczekujące na weryfikację"
    },
    { 
      title: "Do rozliczenia", 
      value: "15", 
      icon: <CheckSquare className="size-5" />
    },
    { 
      title: "Nieopłacone faktury", 
      value: "24 500 zł", 
      icon: <CreditCard className="size-5" />,
      trend: { value: 12, isPositive: false }
    }
  ];

  const urgentTasks = [
    {
      id: "1",
      title: "Przegląd klimatyzacji - Hotel Metropol",
      description: "Zaplanowany przegląd kwartalny 10 jednostek",
      priority: "urgent" as const,
      dueDate: "15.05.2025",
      type: "Przegląd"
    },
    {
      id: "2",
      title: "Faktura #F-2025/123 - weryfikacja OCR",
      description: "System OCR nie rozpoznał numeru zlecenia",
      priority: "normal" as const,
      type: "OCR"
    },
    {
      id: "3",
      title: "Awaria klimatyzacji - Biurowiec Gamma",
      description: "Jednostka zewnętrzna nie uruchamia się",
      priority: "urgent" as const,
      dueDate: "12.05.2025",
      type: "Awaria"
    }
  ];

  const recentNotifications = [
    {
      id: "1",
      title: "Nowe zlecenie #ZL-2025/078",
      description: "Dodano nowe zlecenie serwisowe dla klienta ABC Sp. z o.o.",
      priority: "normal" as const,
      type: "Zlecenie"
    },
    {
      id: "2",
      title: "Faktura FV-2025/045 opłacona",
      description: "Klient Hotel Metropol opłacił fakturę na kwotę 3 450 zł",
      priority: "completed" as const,
      type: "Płatność"
    }
  ];

  const quickActions = [
    { title: "Dodaj zlecenie", icon: <Plus className="size-4" />, color: "bg-brand-blue/10 text-brand-blue" },
    { title: "Prześlij dokument", icon: <Upload className="size-4" />, color: "bg-brand-orange/10 text-brand-orange" },
    { title: "Wystaw fakturę", icon: <Receipt className="size-4" />, color: "bg-brand-blue/10 text-brand-blue" },
    { title: "Dodaj klienta", icon: <Plus className="size-4" />, color: "bg-brand-orange/10 text-brand-orange" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-brand-blue text-brand-blue hover:text-white hover:bg-brand-blue"
          onClick={() => {
            alert("Otworzono panel powiadomień");
          }}
        >
          <Bell className="size-4" />
          <span>Powiadomienia</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskCard 
          title="Pilne zadania" 
          tasks={urgentTasks} 
          onViewAll={() => {
            // Przekierowanie do widoku wszystkich pilnych zadań
            alert("Przekierowanie do widoku wszystkich pilnych zadań");
          }}
        />

        <Tabs defaultValue="notifications" className="h-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Aktywność</CardTitle>
              <TabsList>
                <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
                <TabsTrigger value="quickActions">Szybkie akcje</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="notifications" className="mt-0 pt-3">
              <TaskCard 
                title="" 
                tasks={recentNotifications} 
              />
            </TabsContent>
            <TabsContent value="quickActions" className="mt-0 pt-3">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="flex items-center justify-start gap-3 h-auto py-3 border-muted hover:border-brand-blue"
                    onClick={() => {
                      // Obsługa różnych akcji w zależności od tytułu
                      switch(action.title) {
                        case "Dodaj zlecenie":
                          window.location.hash = "#/zlecenia/nowe";
                          break;
                        case "Prześlij dokument":
                          window.location.hash = "#/dokumenty";
                          alert("Otworzono okno dodawania dokumentu");
                          break;
                        case "Wystaw fakturę":
                          window.location.hash = "#/rozliczenia";
                          alert("Rozpoczęto proces wystawiania faktury");
                          break;
                        case "Dodaj klienta":
                          window.location.hash = "#/klienci";
                          alert("Otworzono formularz dodawania klienta");
                          break;
                        default:
                          alert(`Wybrano akcję: ${action.title}`);
                      }
                    }}
                  >
                    <span className={`${action.color} p-2 rounded-full`}>
                      {action.icon}
                    </span>
                    <span>{action.title}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </div>
    </div>
  );
}