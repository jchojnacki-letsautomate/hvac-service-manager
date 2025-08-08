
import React from "react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Separator } from "../../ui/separator";
import { Slider } from "../../ui/slider";
import { Switch } from "../../ui/switch";
import { Moon, Sun, Monitor, Languages, Layout, Palette } from "lucide-react";
import { Button } from "../../ui/button";

export function AppearanceSettings() {
  const [theme, setTheme] = React.useState("system");
  const [fontSize, setFontSize] = React.useState(15);
  const [language, setLanguage] = React.useState("pl");
  const [compactMode, setCompactMode] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);

  return (
    <div className="space-y-6">
      {/* Motyw */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Palette className="size-5 text-brand-blue" />
          Motyw
        </h3>
        
        <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 hover:text-accent-foreground peer-data-[state=checked]:border-brand-orange [&:has([data-state=checked])]:border-brand-orange"
            >
              <Sun className="mb-3 size-6" />
              <span>Jasny</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 hover:text-accent-foreground peer-data-[state=checked]:border-brand-orange [&:has([data-state=checked])]:border-brand-orange"
            >
              <Moon className="mb-3 size-6" />
              <span>Ciemny</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 hover:text-accent-foreground peer-data-[state=checked]:border-brand-orange [&:has([data-state=checked])]:border-brand-orange"
            >
              <Monitor className="mb-3 size-6" />
              <span>Systemowy</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      {/* Język */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Languages className="size-5 text-brand-blue" />
          Język
        </h3>
        
        <div className="max-w-xs">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz język" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pl">Polski</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      {/* Rozmiar tekstu */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3>Rozmiar tekstu</h3>
          <span className="text-sm font-medium">{fontSize}px</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs">A</span>
          <Slider 
            value={[fontSize]} 
            onValueChange={(value) => setFontSize(value[0])} 
            min={12} 
            max={18} 
            step={1} 
            className="flex-1"
          />
          <span className="text-lg">A</span>
        </div>
        
        <div className="border rounded-md p-4 mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Podgląd tekstu:</p>
          <h3 style={{ fontSize: `${fontSize + 2}px` }}>Przykładowy nagłówek</h3>
          <p style={{ fontSize: `${fontSize}px` }}>
            To jest przykładowy tekst pokazujący, jak będzie wyglądał tekst w aplikacji. Rozmiar tekstu można dostosować za pomocą suwaka powyżej.
          </p>
          <div className="flex gap-2">
            <Button style={{ fontSize: `${fontSize - 1}px` }}>Przycisk</Button>
            <Button style={{ fontSize: `${fontSize - 1}px` }} variant="outline">Anuluj</Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Układ interfejsu */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Layout className="size-5 text-brand-blue" />
          Układ interfejsu
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Tryb kompaktowy</div>
              <div className="text-sm text-muted-foreground">
                Zmniejsza odstępy między elementami interfejsu
              </div>
            </div>
            <Switch 
              checked={compactMode} 
              onCheckedChange={setCompactMode} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Wysoki kontrast</div>
              <div className="text-sm text-muted-foreground">
                Zwiększa kontrast kolorów dla lepszej czytelności
              </div>
            </div>
            <Switch 
              checked={highContrast} 
              onCheckedChange={setHighContrast} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Animacje interfejsu</div>
              <div className="text-sm text-muted-foreground">
                Włącza animacje przejść między elementami
              </div>
            </div>
            <Switch 
              checked={animationsEnabled} 
              onCheckedChange={setAnimationsEnabled} 
              className="data-[state=checked]:bg-brand-blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
