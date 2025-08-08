
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "../../ui/avatar";
import { 
  Upload, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Check, 
  AlertTriangle, 
  Key,
  Mail,
  Phone
} from "lucide-react";
import { Switch } from "../../ui/switch";

export function UserProfileSettings() {
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>("/user-avatar-placeholder.png");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = React.useState(true);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // W rzeczywistym scenariuszu, tutaj wysłalibyśmy plik na serwer
      // Na potrzeby demonstracji używamy lokalnego URL
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Dane osobowe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-40 h-40">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Zdjęcie profilowe" />
              ) : null}
              <AvatarFallback className="text-4xl">JK</AvatarFallback>
            </Avatar>
            
            <Label 
              htmlFor="avatar-upload" 
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
            >
              <Upload className="size-4" />
              <span>Zmień zdjęcie</span>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </Label>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Imię</Label>
              <Input id="firstName" defaultValue="Jan" />
            </div>
            
            <div>
              <Label htmlFor="lastName">Nazwisko</Label>
              <Input id="lastName" defaultValue="Kowalski" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Stanowisko</Label>
              <Input id="position" defaultValue="Administrator systemu" />
            </div>
            
            <div>
              <Label htmlFor="department">Dział</Label>
              <Input id="department" defaultValue="IT" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">j.kowalski@acsystem.pl</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">+48 500 600 700</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Zmiana hasła */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2">
          <Lock className="size-5 text-brand-blue" />
          Zmiana hasła
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="current-password">Aktualne hasło</Label>
            <div className="relative">
              <Input 
                id="current-password" 
                type={showCurrentPassword ? "text" : "password"} 
                placeholder="Wprowadź aktualne hasło" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="new-password">Nowe hasło</Label>
            <div className="relative">
              <Input 
                id="new-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Wprowadź nowe hasło" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500" />
                <p className="text-xs text-muted-foreground">Minimum 8 znaków</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500" />
                <p className="text-xs text-muted-foreground">Wielkie i małe litery</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <p className="text-xs text-muted-foreground">Minimum jedna cyfra</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <p className="text-xs text-muted-foreground">Minimum jeden znak specjalny</p>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Powtórz nowe hasło</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Powtórz nowe hasło" 
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2">
            <Key className="size-4" />
            <span>Zmień hasło</span>
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {/* Bezpieczeństwo konta */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2">
          <Shield className="size-5 text-brand-blue" />
          Bezpieczeństwo konta
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Weryfikacja dwuetapowa</div>
              <div className="text-sm text-muted-foreground">
                Zwiększ bezpieczeństwo konta poprzez dodatkowe potwierdzenie logowania
              </div>
            </div>
            <Switch 
              checked={twoFactorEnabled} 
              onCheckedChange={setTwoFactorEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          {twoFactorEnabled && (
            <div className="pl-6 space-y-2 border-l-2 border-brand-blue/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Mail className="size-4 text-brand-blue" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    Odbieraj kody weryfikacyjne na adres j.kowalski@acsystem.pl
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">Konfiguruj</Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">SMS</div>
                  <div className="text-sm text-muted-foreground">
                    Odbieraj kody weryfikacyjne przez SMS
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">Konfiguruj</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">Powiadomienia o logowaniu</div>
            <div className="text-sm text-muted-foreground">
              Otrzymuj powiadomienia email, gdy ktoś zaloguje się na Twoje konto
            </div>
          </div>
          <Switch 
            checked={emailNotificationsEnabled} 
            onCheckedChange={setEmailNotificationsEnabled} 
            className="data-[state=checked]:bg-brand-blue"
          />
        </div>
      </div>
      
      <Separator />
      
      {/* Sesje aktywne */}
      <div className="space-y-4">
        <h3>Aktywne sesje</h3>
        
        <div className="space-y-3">
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Lock className="size-5 text-brand-blue" />
                </div>
                <div>
                  <div className="font-medium">Warszawa, Polska</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                      Obecna sesja
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Windows 11 • Chrome • 14.05.2025 o 08:34
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">Szczegóły</Button>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">Kraków, Polska</div>
                  <div className="text-xs text-muted-foreground">
                    MacOS • Safari • 13.05.2025 o 15:12
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="text-destructive">Zamknij sesję</Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="text-destructive">
            Zamknij wszystkie inne sesje
          </Button>
        </div>
      </div>
    </div>
  );
}
