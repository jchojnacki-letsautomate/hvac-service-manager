import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DocumentPreviewProps {
  documentId: string;
  documentNumber: string;
  documentType: "invoice" | "protocol";
  previewImageUrl: string;
  onBack: () => void;
}

export function DocumentPreview({
  documentId,
  documentNumber,
  documentType,
  previewImageUrl,
  onBack,
}: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "data" | "history">("preview");

  // Mock extracted data based on document type
  const extractedData = documentType === "invoice" 
    ? {
        invoiceNumber: documentNumber,
        issueDate: "10.05.2025",
        dueDate: "24.05.2025",
        seller: "Clima Systems Sp. z o.o.",
        buyer: "Biurowiec Gamma",
        netAmount: "3450,00 PLN",
        taxAmount: "793,50 PLN",
        grossAmount: "4243,50 PLN",
      }
    : {
        protocolNumber: documentNumber,
        serviceDate: "09.05.2025", 
        clientName: "Hotel Metropol",
        serviceTechnician: "Jan Kowalski",
        equipmentType: "Klimatyzator ścienny",
        model: "Daikin FTXM35R",
        serialNumber: "AB12345678",
        workPerformed: "Przegląd okresowy, wymiana filtrów, czyszczenie wymiennika",
      };

  // Mock history events
  const historyEvents = [
    { date: "10.05.2025 14:23", user: "System OCR", action: "Dokument dodany i automatycznie przetworzony" },
    { date: "10.05.2025 14:24", user: "System OCR", action: "Dane rozpoznane i wyodrębnione" },
    { date: "10.05.2025 14:30", user: "Anna Nowak", action: "Podgląd dokumentu" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1>Podgląd dokumentu: {documentNumber}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            <span className="hidden sm:inline">Pobierz</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Drukuj</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Udostępnij</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="preview" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="preview">Podgląd</TabsTrigger>
              <TabsTrigger value="data">Dane</TabsTrigger>
              <TabsTrigger value="history">Historia</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="preview" className="mt-0">
            <div className="flex justify-center border rounded-md p-4 bg-gray-50">
              <ImageWithFallback
                src={previewImageUrl}
                alt={`Podgląd dokumentu ${documentNumber}`}
                width={600}
                height={800}
                className="max-w-full h-auto object-contain"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="mt-0">
            <div className="border rounded-md p-4">
              <h3 className="mb-4">{documentType === "invoice" ? "Dane faktury" : "Dane protokołu"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-muted-foreground">{formatFieldName(key)}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="border rounded-md p-4">
              <h3 className="mb-4">Historia dokumentu</h3>
              <div className="space-y-4">
                {historyEvents.map((event, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap justify-between">
                      <p className="font-medium">{event.user}</p>
                      <p className="text-muted-foreground">{event.date}</p>
                    </div>
                    <p>{event.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to format field names for display
function formatFieldName(key: string): string {
  const formats: Record<string, string> = {
    invoiceNumber: "Numer faktury",
    issueDate: "Data wystawienia",
    dueDate: "Termin płatności",
    seller: "Sprzedawca",
    buyer: "Nabywca",
    netAmount: "Kwota netto",
    taxAmount: "Kwota VAT",
    grossAmount: "Kwota brutto",
    protocolNumber: "Numer protokołu",
    serviceDate: "Data serwisu",
    clientName: "Klient",
    serviceTechnician: "Technik serwisowy",
    equipmentType: "Typ urządzenia",
    model: "Model",
    serialNumber: "Numer seryjny",
    workPerformed: "Wykonane prace",
  };
  
  return formats[key] || key;
}