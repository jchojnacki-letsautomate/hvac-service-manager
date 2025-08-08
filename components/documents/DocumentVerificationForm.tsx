import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Check, X, FileText } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface OcrField {
  name: string;
  label: string;
  value: string;
  confidence: number;
  isCorrect: boolean;
}

export function DocumentVerificationForm() {
  // const navigate = useNavigate(); // Removed - using hash routing
  const [ocrData, setOcrData] = useState<OcrField[]>([
    { name: "documentNumber", label: "Numer dokumentu", value: "FV/2025/123", confidence: 0.95, isCorrect: true },
    { name: "issueDate", label: "Data wystawienia", value: "09.05.2025", confidence: 0.98, isCorrect: true },
    { name: "dueDate", label: "Termin płatności", value: "23.05.2025", confidence: 0.89, isCorrect: true },
    { name: "sellerName", label: "Sprzedawca", value: "Clima Systems Sp. z o.o.", confidence: 0.92, isCorrect: true },
    { name: "sellerNIP", label: "NIP sprzedawcy", value: "5272851631", confidence: 0.87, isCorrect: true },
    { name: "buyerName", label: "Nabywca", value: "Hotel Metropol", confidence: 0.96, isCorrect: true },
    { name: "buyerNIP", label: "NIP nabywcy", value: "7792433421", confidence: 0.76, isCorrect: false },
    { name: "netAmount", label: "Kwota netto", value: "3.450,00 PLN", confidence: 0.93, isCorrect: true },
    { name: "vatAmount", label: "Kwota VAT", value: "793,50 PLN", confidence: 0.91, isCorrect: true },
    { name: "grossAmount", label: "Kwota brutto", value: "4.243,50 PLN", confidence: 0.94, isCorrect: true },
  ]);

  const updateFieldValue = (index: number, value: string) => {
    const updatedData = [...ocrData];
    updatedData[index].value = value;
    updatedData[index].isCorrect = true;
    setOcrData(updatedData);
  };

  const markAsCorrect = (index: number) => {
    const updatedData = [...ocrData];
    updatedData[index].isCorrect = true;
    setOcrData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Dokument został zweryfikowany i zapisany.");
    window.location.hash = "#/dokumenty";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-emerald-600";
    if (confidence >= 0.8) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/dokumenty"}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1>Weryfikacja danych dokumentu</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Rozpoznane dane</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex flex-wrap gap-4 items-center mb-4">
                  <div className="flex-grow space-y-1">
                    <Label>Typ dokumentu</Label>
                    <Select defaultValue="invoice">
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ dokumentu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Faktura</SelectItem>
                        <SelectItem value="protocol">Protokół serwisowy</SelectItem>
                        <SelectItem value="installation">Protokół montażowy</SelectItem>
                        <SelectItem value="other">Inny dokument</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-grow space-y-1">
                    <Label>Klient</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Biurowiec Gamma</SelectItem>
                        <SelectItem value="2">Hotel Metropol</SelectItem>
                        <SelectItem value="3">ABC Sp. z o.o.</SelectItem>
                        <SelectItem value="4">Delta Office Park</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Pole</TableHead>
                      <TableHead>Wartość</TableHead>
                      <TableHead className="w-[100px] text-right">Pewność</TableHead>
                      <TableHead className="w-[100px] text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ocrData.map((field, index) => (
                      <TableRow key={field.name}>
                        <TableCell>{field.label}</TableCell>
                        <TableCell>
                          <Input 
                            value={field.value}
                            onChange={(e) => updateFieldValue(index, e.target.value)}
                            className={!field.isCorrect ? "border-red-300" : ""}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={getConfidenceColor(field.confidence)}>
                            {Math.round(field.confidence * 100)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {!field.isCorrect && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsCorrect(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="size-4 text-emerald-600" />
                              <span className="sr-only">Zatwierdź</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-2">
                  <Label htmlFor="notes">Uwagi</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Dodatkowe informacje o dokumencie"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Podgląd dokumentu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <ImageWithFallback
                    src="/docs/invoice-preview-1.jpg"
                    alt="Podgląd dokumentu"
                    width={300}
                    height={400}
                    className="w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informacje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nazwa pliku</p>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <p className="font-medium">FV-2025-123.pdf</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data dodania</p>
                    <p className="font-medium">10.05.2025, 14:23</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dodał(a)</p>
                    <p className="font-medium">Anna Nowak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button 
            variant="outline" 
            type="button" 
                          onClick={() => window.location.hash = "#/dokumenty"}
          >
            Anuluj
          </Button>
          <Button 
            type="submit" 
            className="gap-2"
          >
            <Check className="size-4" />
            Zatwierdź dane
          </Button>
        </div>
      </form>
    </div>
  );
}