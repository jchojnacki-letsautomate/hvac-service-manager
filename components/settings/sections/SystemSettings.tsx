
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { 
  Settings, 
  Clock, 
  Calendar, 
  CreditCard, 
  Languages, 
  MapPin, 
  BarChart3,
  Printer,
  RefreshCw,
  HardDrive,
  Database,
  CornerDownRight
} from "lucide-react";
import { Slider } from "../../ui/slider";

export function SystemSettings() {
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [autoLogout, setAutoLogout] = React.useState(true);
  const [autoLogoutTime, setAutoLogoutTime] = React.useState(30);
  const [lowStockThreshold, setLowStockThreshold] = React.useState(10);
  
  return (
    <div className="space-y-6">
      {/* Ustawienia ogólne */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Settings className="size-5 text-brand-blue" />
          Ustawienia ogólne
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Strefa czasowa</Label>
              <Select defaultValue="Europe/Warsaw">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Wybierz strefę czasową" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Warsaw">Europa/Warszawa (GMT+1/GMT+2)</SelectItem>
                  <SelectItem value="Europe/London">Europa/Londyn (GMT+0/GMT+1)</SelectItem>
                  <SelectItem value="America/New_York">Ameryka/Nowy Jork (GMT-5/GMT-4)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Azja/Tokio (GMT+9)</SelectItem>
                  <SelectItem value="Australia/Sydney">Australia/Sydney (GMT+10/GMT+11)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Format daty</Label>
              <Select defaultValue="DD.MM.YYYY">
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Wybierz format daty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (np. 14.05.2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (np. 05/14/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (np. 2025-05-14)</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (np. 14/05/2025)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Format czasu</Label>
              <Select defaultValue="24h">
                <SelectTrigger id="timeFormat">
                  <SelectValue placeholder="Wybierz format czasu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24-godzinny (np. 14:30)</SelectItem>
                  <SelectItem value="12h">12-godzinny (np. 2:30 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstDayOfWeek">Pierwszy dzień tygodnia</Label>
              <Select defaultValue="monday">
                <SelectTrigger id="firstDayOfWeek">
                  <SelectValue placeholder="Wybierz pierwszy dzień tygodnia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Poniedziałek</SelectItem>
                  <SelectItem value="sunday">Niedziela</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <div className="font-medium">Automatyczne odświeżanie</div>
              <div className="text-sm text-muted-foreground">
                Automatycznie odświeżaj dane co 5 minut
              </div>
            </div>
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Automatyczne wylogowanie</div>
              <div className="text-sm text-muted-foreground">
                Automatycznie wyloguj po okresie nieaktywności
              </div>
            </div>
            <Switch 
              checked={autoLogout} 
              onCheckedChange={setAutoLogout} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          {autoLogout && (
            <div className="pl-7 border-l-2 border-muted space-y-2">
              <div className="flex justify-between items-center">
                <Label>Czas nieaktywności (minuty):</Label>
                <span className="text-sm font-medium">{autoLogoutTime} min</span>
              </div>
              <Slider 
                value={[autoLogoutTime]} 
                onValueChange={(value) => setAutoLogoutTime(value[0])} 
                min={5} 
                max={60} 
                step={5} 
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Magazyn i zasoby */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <HardDrive className="size-5 text-brand-blue" />
          Magazyn i zasoby
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inventoryWarningThreshold">Próg ostrzeżenia o niskim stanie</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  id="inventoryWarningThreshold"
                  value={[lowStockThreshold]} 
                  onValueChange={(value) => setLowStockThreshold(value[0])} 
                  min={1} 
                  max={50} 
                  step={1} 
                  className="flex-1"
                />
                <div className="w-14 text-center font-medium">{lowStockThreshold} %</div>
              </div>
              <p className="text-xs text-muted-foreground">
                System wygeneruje ostrzeżenie gdy stan magazynowy spadnie poniżej tego progu.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultSupplier">Domyślny dostawca</Label>
              <Select defaultValue="supplier1">
                <SelectTrigger id="defaultSupplier">
                  <SelectValue placeholder="Wybierz dostawcę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Clima-Parts Sp. z o.o.</SelectItem>
                  <SelectItem value="supplier2">Technika Chłodnicza S.A.</SelectItem>
                  <SelectItem value="supplier3">HVAC Components Ltd.</SelectItem>
                  <SelectItem value="none">Brak domyślnego dostawcy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Automatyczne zamówienia</div>
                <div className="text-sm text-muted-foreground">
                  Automatycznie generuj zamówienia przy niskim stanie
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Blokada niedostępnych produktów</div>
                <div className="text-sm text-muted-foreground">
                  Zapobiegaj dodawaniu produktów o zerowym stanie
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Faktury i płatności */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <CreditCard className="size-5 text-brand-blue" />
          Faktury i płatności
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Prefiks faktury</Label>
              <Input id="invoicePrefix" defaultValue="FV" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoiceNumberingPattern">Format numeracji</Label>
              <Input id="invoiceNumberingPattern" defaultValue="FV/YYYY/###" />
              <p className="text-xs text-muted-foreground">
                YYYY = rok, MM = miesiąc, ### = numer sekwencyjny
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vatRate">Domyślna stawka VAT</Label>
              <Select defaultValue="23">
                <SelectTrigger id="vatRate">
                  <SelectValue placeholder="Wybierz stawkę VAT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="23">23%</SelectItem>
                  <SelectItem value="8">8%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="exempt">Zwolniony</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Domyślny termin płatności</Label>
              <Select defaultValue="14">
                <SelectTrigger id="paymentTerms">
                  <SelectValue placeholder="Wybierz termin płatności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dni</SelectItem>
                  <SelectItem value="14">14 dni</SelectItem>
                  <SelectItem value="21">21 dni</SelectItem>
                  <SelectItem value="30">30 dni</SelectItem>
                  <SelectItem value="0">Płatność natychmiastowa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceFooter">Stopka faktury</Label>
            <Input id="invoiceFooter" defaultValue="Dziękujemy za skorzystanie z naszych usług!" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Wydruki i raporty */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Printer className="size-5 text-brand-blue" />
          Wydruki i raporty
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="defaultPrinter">Domyślna drukarka</Label>
            <Select defaultValue="printer1">
              <SelectTrigger id="defaultPrinter">
                <SelectValue placeholder="Wybierz drukarkę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer1">HP LaserJet Pro (Biuro)</SelectItem>
                <SelectItem value="printer2">Epson WorkForce (Recepcja)</SelectItem>
                <SelectItem value="printer3">Canon PIXMA (Magazyn)</SelectItem>
                <SelectItem value="pdf">Eksport do PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paperSize">Domyślny rozmiar papieru</Label>
            <Select defaultValue="a4">
              <SelectTrigger id="paperSize">
                <SelectValue placeholder="Wybierz rozmiar papieru" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="a5">A5</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Automatyczny eksport raportów</div>
              <div className="text-sm text-muted-foreground">
                Eksportuj raporty miesięczne automatycznie
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Wydajność systemu */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <RefreshCw className="size-5 text-brand-blue" />
          Wydajność systemu
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Keszowanie danych</div>
              <div className="text-sm text-muted-foreground">
                Włącz keszowanie danych dla szybszego ładowania
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Preładowanie danych</div>
              <div className="text-sm text-muted-foreground">
                Preładuj dane w tle dla szybszej nawigacji
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Ograniczenie elementów w tabelach</Label>
              <span className="text-sm font-medium">50 elementów</span>
            </div>
            <Select defaultValue="50">
              <SelectTrigger>
                <SelectValue placeholder="Wybierz limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 elementów</SelectItem>
                <SelectItem value="25">25 elementów</SelectItem>
                <SelectItem value="50">50 elementów</SelectItem>
                <SelectItem value="100">100 elementów</SelectItem>
                <SelectItem value="unlimited">Bez limitu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Czyszczenie danych */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-destructive">
          <Database className="size-5" />
          Czyszczenie danych
        </h3>
        
        <div className="space-y-3 p-4 border border-destructive/20 rounded-md">
          <p className="text-sm text-muted-foreground">
            Te operacje są nieodwracalne. Upewnij się, że masz kopię zapasową danych przed kontynuowaniem.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Button variant="outline" className="border-destructive/30 text-destructive">
              Wyczyść dane tymczasowe
            </Button>
            
            <Button variant="outline" className="border-destructive/30 text-destructive">
              Wyczyść kosz (30 dni)
            </Button>
            
            <Button variant="outline" className="border-destructive/30 text-destructive">
              Zresetuj statystyki
            </Button>
            
            <Button variant="outline" className="border-destructive/30 text-destructive">
              Zresetuj preferencje
            </Button>
          </div>
          
          <div className="pt-2">
            <Button variant="destructive" className="w-full">
              Całkowite czyszczenie danych
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
