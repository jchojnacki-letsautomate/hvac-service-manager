
import React from "react";
import { Separator } from "../../ui/separator";
import { Switch } from "../../ui/switch";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  ClipboardList, 
  Calendar, 
  AlarmClock,
  Clock,
  Users,
  Package,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";

export function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [inAppEnabled, setInAppEnabled] = React.useState(true);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  
  const [digestFrequency, setDigestFrequency] = React.useState("daily");
  
  return (
    <div className="space-y-6">
      {/* Kanały powiadomień */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Bell className="size-5 text-brand-blue" />
          Kanały powiadomień
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Mail className="size-5 text-brand-blue" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienia wysyłane na adres j.kowalski@acsystem.pl
                </div>
              </div>
            </div>
            <Switch 
              checked={emailEnabled} 
              onCheckedChange={setEmailEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-brand-blue" />
              </div>
              <div>
                <div className="font-medium">Powiadomienia w aplikacji</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienia wyświetlane podczas korzystania z aplikacji
                </div>
              </div>
            </div>
            <Switch 
              checked={inAppEnabled} 
              onCheckedChange={setInAppEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Mail className="size-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">SMS</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienia wysyłane na numer +48 500 600 700
                </div>
              </div>
            </div>
            <Switch 
              checked={smsEnabled} 
              onCheckedChange={setSmsEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Bell className="size-5 text-brand-blue" />
              </div>
              <div>
                <div className="font-medium">Powiadomienia push</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienia na urządzeniach mobilnych
                </div>
              </div>
            </div>
            <Switch 
              checked={pushEnabled} 
              onCheckedChange={setPushEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Ustawienia powiadomień według kategorii */}
      <div className="space-y-6">
        <h3>Kategorie powiadomień</h3>
        
        {/* Zlecenia serwisowe */}
        <div className="space-y-3 border-l-2 border-brand-blue pl-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-brand-blue" />
            <h4 className="font-medium">Zlecenia serwisowe</h4>
          </div>
          
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Nowe zlecenie</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienie o nowym zleceniu serwisowym
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Zmiana statusu zlecenia</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienie o zmianie statusu zlecenia
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Zakończenie zlecenia</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienie o zakończeniu zlecenia
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Przypomnienia */}
        <div className="space-y-3 border-l-2 border-brand-orange pl-4">
          <div className="flex items-center gap-2">
            <AlarmClock className="size-5 text-brand-orange" />
            <h4 className="font-medium">Przypomnienia</h4>
          </div>
          
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Zbliżające się zlecenia</div>
                <div className="text-sm text-muted-foreground">
                  Przypomnienie o nadchodzących zleceniach
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-orange" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Zaplanowane konserwacje</div>
                <div className="text-sm text-muted-foreground">
                  Przypomnienie o zaplanowanych konserwacjach
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-orange" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-orange" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Magazyn */}
        <div className="space-y-3 border-l-2 border-muted pl-4">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-muted-foreground" />
            <h4 className="font-medium">Magazyn</h4>
          </div>
          
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Niski stan magazynowy</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienie o niskim stanie magazynowym
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Nowa dostawa</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienie o nowej dostawie towaru
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${pushEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
          </div>
        </div>
        
        {/* System */}
        <div className="space-y-3 border-l-2 border-destructive pl-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <h4 className="font-medium">System</h4>
          </div>
          
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Alerty bezpieczeństwa</div>
                <div className="text-sm text-muted-foreground">
                  Krytyczne alerty bezpieczeństwa systemu
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-destructive" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-destructive" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${smsEnabled ? "bg-destructive" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-destructive" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Aktualizacje systemu</div>
                <div className="text-sm text-muted-foreground">
                  Powiadomienia o dostępnych aktualizacjach
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`size-2 rounded-full ${emailEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                  <div className={`size-2 rounded-full ${inAppEnabled ? "bg-brand-blue" : "bg-muted"}`}></div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Podsumowania i raporty */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Calendar className="size-5 text-brand-blue" />
          Podsumowania i raporty
        </h3>
        
        <div className="space-y-3 border p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Okresowe podsumowania</div>
              <div className="text-sm text-muted-foreground">
                Otrzymuj podsumowania aktywności w systemie
              </div>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
            <div className="text-sm font-medium">Częstotliwość:</div>
            <Select value={digestFrequency} onValueChange={setDigestFrequency}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Wybierz częstotliwość" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Codziennie</SelectItem>
                <SelectItem value="weekly">Tygodniowo</SelectItem>
                <SelectItem value="biweekly">Co dwa tygodnie</SelectItem>
                <SelectItem value="monthly">Miesięcznie</SelectItem>
              </SelectContent>
            </Select>
            
            {digestFrequency === "weekly" && (
              <Select defaultValue="monday">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Wybierz dzień" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Poniedziałek</SelectItem>
                  <SelectItem value="tuesday">Wtorek</SelectItem>
                  <SelectItem value="wednesday">Środa</SelectItem>
                  <SelectItem value="thursday">Czwartek</SelectItem>
                  <SelectItem value="friday">Piątek</SelectItem>
                  <SelectItem value="saturday">Sobota</SelectItem>
                  <SelectItem value="sunday">Niedziela</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm">Wyślij testowe podsumowanie</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
