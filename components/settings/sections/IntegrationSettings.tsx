
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { 
  Plug, 
  Check, 
  AlertTriangle, 
  Copy, 
  Clock, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Key,
  GanttChart,
  CalendarDays,
  CreditCard,
  MessageSquare,
  Mail,
  ArrowRight,
  Plus,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export function IntegrationSettings() {
  const [showSecret, setShowSecret] = React.useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Skopiowano do schowka!");
  };
  
  const availableIntegrations = [
    {
      id: "calendar_google",
      name: "Google Calendar",
      description: "Synchronizacja zleceń z kalendarzem Google",
      icon: <CalendarDays className="size-5 text-brand-blue" />,
      status: "active"
    },
    {
      id: "crm_salesforce",
      name: "Salesforce CRM",
      description: "Integracja z systemem Salesforce CRM",
      icon: <GanttChart className="size-5 text-brand-blue" />,
      status: "active"
    },
    {
      id: "payment_przelewy24",
      name: "Przelewy24",
      description: "Bramka płatności elektronicznych",
      icon: <CreditCard className="size-5 text-brand-blue" />,
      status: "inactive"
    },
    {
      id: "sms_smsapi",
      name: "SMSAPI",
      description: "Usługa wysyłania wiadomości SMS do klientów",
      icon: <MessageSquare className="size-5 text-brand-blue" />,
      status: "inactive"
    },
    {
      id: "mail_mailchimp",
      name: "Mailchimp",
      description: "Usługa wysyłki kampanii email",
      icon: <Mail className="size-5 text-brand-blue" />,
      status: "inactive"
    },
    {
      id: "erp_comarch",
      name: "Comarch ERP",
      description: "Integracja z systemem Comarch ERP",
      icon: <FileText className="size-5 text-brand-blue" />,
      status: "active"
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Klucze API */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Key className="size-5 text-brand-blue" />
          Klucze API
        </h3>
        
        <div className="space-y-3 p-4 border rounded-md">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="apiKey">Klucz API</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1 text-xs"
                onClick={() => copyToClipboard("ak_6284fa17e9b84f3f8d5c3c10f2a87652")}
              >
                <Copy className="size-3.5" />
                <span>Kopiuj</span>
              </Button>
            </div>
            <Input 
              id="apiKey" 
              value="ak_6284fa17e9b84f3f8d5c3c10f2a87652" 
              readOnly 
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="apiSecret">Sekret API</Label>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-1 text-xs"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  <span>{showSecret ? "Ukryj" : "Pokaż"}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-1 text-xs"
                  onClick={() => copyToClipboard("sk_a18cbe25f6d749eab7df9b3f15e79dcf")}
                >
                  <Copy className="size-3.5" />
                  <span>Kopiuj</span>
                </Button>
              </div>
            </div>
            <Input 
              id="apiSecret" 
              type={showSecret ? "text" : "password"} 
              value="sk_a18cbe25f6d749eab7df9b3f15e79dcf"
              readOnly 
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm font-medium">Ostatnie odświeżenie: <span className="text-muted-foreground">14.05.2025, 08:30</span></p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> Wygasa za 345 dni
              </p>
            </div>
            <Button size="sm" className="gap-1">
              <RefreshCw className="size-4" />
              <span>Odśwież klucze</span>
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1 px-1">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Nigdy nie udostępniaj kluczy API osobom trzecim. Klucze mają pełny dostęp do Twojego konta.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              W przypadku podejrzenia, że Twoje klucze API zostały naruszone, natychmiast je odśwież.
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Aktywne integracje */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Plug className="size-5 text-brand-blue" />
          Aktywne integracje
        </h3>
        
        <div className="space-y-4">
          {availableIntegrations
            .filter((integration) => integration.status === "active")
            .map((integration) => (
              <div key={integration.id} className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{integration.name}</h4>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Aktywna</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">Ostatnia synchronizacja: 14.05.2025, 08:00</p>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="size-3" /> 
                        <span>Sukces</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 gap-1"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Synchronizuj</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 size-8 p-0"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Dostępne integracje */}
      <div className="space-y-3">
        <h3>Dostępne integracje</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIntegrations
            .filter((integration) => integration.status === "inactive")
            .map((integration) => (
              <div key={integration.id} className="border rounded-md p-4 group hover:border-brand-blue transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        className="w-full justify-between group-hover:bg-brand-blue group-hover:text-white"
                      >
                        <span>Połącz</span>
                        <ArrowRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
          <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center h-[148px] hover:border-brand-blue transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center mb-2">
              <Plus className="size-5 text-muted-foreground" />
            </div>
            <h4 className="font-medium">Więcej integracji</h4>
            <p className="text-sm text-muted-foreground">Przeglądaj wszystkie dostępne integracje</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Ustawienia synchronizacji */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <RefreshCw className="size-5 text-brand-blue" />
          Ustawienia synchronizacji
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Automatyczna synchronizacja</div>
              <div className="text-sm text-muted-foreground">
                Automatycznie synchronizuj dane z integracjami
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Synchronizacja dwukierunkowa</div>
              <div className="text-sm text-muted-foreground">
                Synchronizuj zmiany w obu kierunkach
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="syncFrequency">Częstotliwość synchronizacji</Label>
              <Select defaultValue="60">
                <SelectTrigger id="syncFrequency">
                  <SelectValue placeholder="Wybierz częstotliwość" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Co 15 minut</SelectItem>
                  <SelectItem value="30">Co 30 minut</SelectItem>
                  <SelectItem value="60">Co godzinę</SelectItem>
                  <SelectItem value="360">Co 6 godzin</SelectItem>
                  <SelectItem value="720">Co 12 godzin</SelectItem>
                  <SelectItem value="1440">Raz dziennie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="syncConflicts">Rozwiązywanie konfliktów</Label>
              <Select defaultValue="remote">
                <SelectTrigger id="syncConflicts">
                  <SelectValue placeholder="Wybierz sposób rozwiązywania konfliktów" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Preferuj dane lokalne</SelectItem>
                  <SelectItem value="remote">Preferuj dane zdalne</SelectItem>
                  <SelectItem value="newer">Preferuj nowsze dane</SelectItem>
                  <SelectItem value="ask">Pytaj za każdym razem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Logi integracji */}
      <div className="space-y-3">
        <h3>Logi integracji</h3>
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 flex justify-between items-center border-b">
            <h4 className="font-medium">Ostatnie zdarzenia synchronizacji</h4>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="size-3.5" />
              <span>Pełne logi</span>
            </Button>
          </div>
          
          <div className="overflow-hidden">
            <pre className="text-xs bg-muted/20 p-4 overflow-x-auto h-48">
              {`[2025-05-14 08:00:12] INFO: Rozpoczęto synchronizację z Google Calendar
[2025-05-14 08:00:14] INFO: Pobrano 24 zdarzenia z Google Calendar
[2025-05-14 08:00:16] INFO: Wysłano 12 zleceń do Google Calendar
[2025-05-14 08:00:18] INFO: Synchronizacja z Google Calendar zakończona pomyślnie
[2025-05-14 08:00:20] INFO: Rozpoczęto synchronizację z Salesforce CRM
[2025-05-14 08:00:23] INFO: Pobrano 36 klientów z Salesforce CRM
[2025-05-14 08:00:25] INFO: Znaleziono 5 konfliktów danych
[2025-05-14 08:00:27] INFO: Rozwiązano 5 konfliktów (strategia: preferuj dane zdalne)
[2025-05-14 08:00:30] INFO: Wysłano 8 nowych klientów do Salesforce CRM
[2025-05-14 08:00:32] INFO: Synchronizacja z Salesforce CRM zakończona pomyślnie
[2025-05-14 08:00:35] INFO: Rozpoczęto synchronizację z Comarch ERP
[2025-05-14 08:00:38] INFO: Pobrano dane finansowe z Comarch ERP
[2025-05-14 08:00:40] INFO: Synchronizacja faktur w toku...
[2025-05-14 08:00:46] INFO: Zaktualizowano 47 faktur
[2025-05-14 08:00:48] INFO: Synchronizacja z Comarch ERP zakończona pomyślnie
[2025-05-14 08:00:50] INFO: Wszystkie synchronizacje zakończone pomyślnie`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
