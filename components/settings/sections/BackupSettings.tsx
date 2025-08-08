
import React from "react";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { 
  Database, 
  Download, 
  Upload, 
  DownloadCloud, 
  Clock, 
  UploadCloud, 
  Check, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Trash2,
  RotateCcw,
  HardDrive,
  FileX,
  FileCheck
} from "lucide-react";
import { Progress } from "../../ui/progress";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  status: "success" | "error" | "pending";
}

export function BackupSettings() {
  const [autoBackupEnabled, setAutoBackupEnabled] = React.useState(true);
  const [cloudBackupEnabled, setCloudBackupEnabled] = React.useState(true);
  const [backupHistory, setBackupHistory] = React.useState<BackupItem[]>([
    { 
      id: "1", 
      name: "backup_20250514_083000.zip", 
      date: "14.05.2025, 08:30", 
      size: "145 MB", 
      type: "Auto", 
      status: "success" 
    },
    { 
      id: "2", 
      name: "backup_20250513_200000.zip", 
      date: "13.05.2025, 20:00", 
      size: "144 MB", 
      type: "Auto", 
      status: "success" 
    },
    { 
      id: "3", 
      name: "backup_20250512_183000.zip", 
      date: "12.05.2025, 18:30", 
      size: "142 MB", 
      type: "Ręczna", 
      status: "success" 
    },
    { 
      id: "4", 
      name: "backup_20250511_200000.zip", 
      date: "11.05.2025, 20:00", 
      size: "140 MB", 
      type: "Auto", 
      status: "error" 
    },
    { 
      id: "5", 
      name: "backup_20250510_200000.zip", 
      date: "10.05.2025, 20:00", 
      size: "141 MB", 
      type: "Auto", 
      status: "success" 
    }
  ]);
  
  const startBackup = () => {
    // Symulacja rozpoczęcia kopii zapasowej
    alert("Rozpoczęto tworzenie kopii zapasowej");
  };
  
  const restoreBackup = (backupId: string) => {
    // Symulacja przywracania kopii zapasowej
    alert(`Rozpoczęto przywracanie kopii zapasowej ID: ${backupId}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Ustawienia automatycznej kopii zapasowej */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Database className="size-5 text-brand-blue" />
          Automatyczna kopia zapasowa
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Automatyczne kopie zapasowe</div>
              <div className="text-sm text-muted-foreground">
                Automatycznie twórz kopie zapasowe danych
              </div>
            </div>
            <Switch 
              checked={autoBackupEnabled} 
              onCheckedChange={setAutoBackupEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          {autoBackupEnabled && (
            <div className="space-y-4 border-l-2 border-brand-blue pl-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Częstotliwość kopii zapasowych</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backupFrequency">
                      <SelectValue placeholder="Wybierz częstotliwość" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Co godzinę</SelectItem>
                      <SelectItem value="daily">Codziennie</SelectItem>
                      <SelectItem value="weekly">Co tydzień</SelectItem>
                      <SelectItem value="monthly">Co miesiąc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupTime">Godzina wykonania</Label>
                  <Select defaultValue="20:00">
                    <SelectTrigger id="backupTime">
                      <SelectValue placeholder="Wybierz godzinę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="00:00">00:00</SelectItem>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="22:00">22:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retentionPeriod">Okres przechowywania kopii</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="retentionPeriod">
                    <SelectValue placeholder="Wybierz okres przechowywania" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dni</SelectItem>
                    <SelectItem value="14">14 dni</SelectItem>
                    <SelectItem value="30">30 dni</SelectItem>
                    <SelectItem value="90">90 dni</SelectItem>
                    <SelectItem value="365">1 rok</SelectItem>
                    <SelectItem value="unlimited">Bez limitu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Kompresja kopii zapasowych</div>
                  <div className="text-sm text-muted-foreground">
                    Kompresuj kopie zapasowe aby zaoszczędzić miejsce
                  </div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Szyfrowanie kopii zapasowych</div>
                  <div className="text-sm text-muted-foreground">
                    Szyfruj kopie zapasowe dla zwiększenia bezpieczeństwa
                  </div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Kopia zapasowa w chmurze */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <DownloadCloud className="size-5 text-brand-blue" />
          Kopia zapasowa w chmurze
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Kopia zapasowa w chmurze</div>
              <div className="text-sm text-muted-foreground">
                Przechowuj kopie zapasowe w bezpiecznej chmurze
              </div>
            </div>
            <Switch 
              checked={cloudBackupEnabled} 
              onCheckedChange={setCloudBackupEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          {cloudBackupEnabled && (
            <div className="space-y-4 border-l-2 border-brand-blue pl-4">
              <div className="space-y-2">
                <Label htmlFor="cloudProvider">Dostawca usługi chmurowej</Label>
                <Select defaultValue="azure">
                  <SelectTrigger id="cloudProvider">
                    <SelectValue placeholder="Wybierz dostawcę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                    <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    <SelectItem value="owned">Własny serwer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 border rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Stan kopii w chmurze</p>
                  <Badge className="bg-emerald-100 text-emerald-700">Synchronizacja aktywna</Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Wykorzystanie przestrzeni</span>
                    <span>6.8 GB / 10 GB</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Ostatnia synchronizacja</p>
                    <p className="font-medium">14.05.2025, 08:30</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Następna synchronizacja</p>
                    <p className="font-medium">14.05.2025, 20:00</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Kopii w chmurze</p>
                    <p className="font-medium">45</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium flex items-center gap-1">
                      <Check className="size-3.5 text-emerald-500" />
                      <span>Aktywny</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <UploadCloud className="size-4" />
                    <span>Synchronizuj teraz</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <HardDrive className="size-4" />
                    <span>Zarządzaj chmurą</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Ręczna kopia zapasowa */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Download className="size-5 text-brand-blue" />
          Ręczna kopia zapasowa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4 space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Database className="size-4 text-brand-blue" />
              Tworzenie kopii zapasowej
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="backupName">Nazwa kopii zapasowej</Label>
              <Input 
                id="backupName" 
                placeholder="np. Kopia_przed_aktualizacją" 
                defaultValue={`backup_manual_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Elementy do uwzględnienia</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeClients" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="includeClients">Klienci i kontakty</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeServiceOrders" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="includeServiceOrders">Zlecenia serwisowe</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeDocuments" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="includeDocuments">Dokumenty</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeInventory" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="includeInventory">Magazyn</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeSettings" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="includeSettings">Ustawienia systemu</Label>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startBackup}
              className="w-full gap-2 bg-brand-blue hover:bg-brand-blue/90"
            >
              <Download className="size-4" />
              <span>Utwórz kopię zapasową</span>
            </Button>
          </div>
          
          <div className="border rounded-md p-4 space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Upload className="size-4 text-brand-blue" />
              Przywracanie kopii zapasowej
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="backupFile">Plik kopii zapasowej</Label>
              <div className="flex gap-2">
                <Input 
                  id="backupFile" 
                  placeholder="Wybierz plik kopii zapasowej..." 
                  readOnly
                />
                <Button variant="outline" className="shrink-0">
                  Przeglądaj...
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Elementy do przywrócenia</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="restoreClients" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="restoreClients">Klienci i kontakty</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="restoreServiceOrders" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="restoreServiceOrders">Zlecenia serwisowe</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="restoreDocuments" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="restoreDocuments">Dokumenty</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="restoreInventory" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="restoreInventory">Magazyn</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="restoreSettings" defaultChecked className="accent-brand-orange" />
                  <Label htmlFor="restoreSettings">Ustawienia systemu</Label>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 border-destructive/30 text-destructive"
            >
              <RotateCcw className="size-4" />
              <span>Przywróć z kopii</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Historia kopii zapasowych */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Clock className="size-5 text-brand-blue" />
          Historia kopii zapasowych
        </h3>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Ostatnie 5 kopii zapasowych</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filtruj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="auto">Automatyczne</SelectItem>
                  <SelectItem value="manual">Ręczne</SelectItem>
                  <SelectItem value="cloud">W chmurze</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="size-4" />
                <span>Wg daty</span>
              </Button>
            </div>
          </div>
          
          {backupHistory.map((backup) => (
            <div 
              key={backup.id} 
              className="border rounded-md p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                  {backup.status === "success" ? (
                    <FileCheck className="size-6 text-emerald-500" />
                  ) : backup.status === "error" ? (
                    <FileX className="size-6 text-destructive" />
                  ) : (
                    <Database className="size-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{backup.name}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground" /> 
                      <span>{backup.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="size-3.5 text-muted-foreground" /> 
                      <span>{backup.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{backup.type}</span>
                    </div>
                    {backup.status === "success" ? (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="size-3" /> 
                        <span>Sukces</span>
                      </div>
                    ) : backup.status === "error" ? (
                      <div className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="size-3" /> 
                        <span>Błąd</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Clock className="size-3" /> 
                        <span>W toku</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => restoreBackup(backup.id)}
                  disabled={backup.status !== "success"}
                >
                  <RotateCcw className="size-3.5" />
                  <span>Przywróć</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1"
                >
                  <Download className="size-3.5" />
                  <span>Pobierz</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-2">
            Pokaż wszystkie kopie zapasowe
          </Button>
        </div>
      </div>
    </div>
  );
}
