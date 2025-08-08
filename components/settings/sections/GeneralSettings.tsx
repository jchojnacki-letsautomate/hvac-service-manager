
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Upload, Plus, Trash2, ImageIcon } from "lucide-react";

export function GeneralSettings() {
  const [logoPreview, setLogoPreview] = React.useState<string | null>("/company-logo-placeholder.png");
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // W rzeczywistym scenariuszu, tutaj wysłalibyśmy plik na serwer
      // Na potrzeby demonstracji używamy lokalnego URL
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl);
    }
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nazwa firmy</Label>
            <Input id="companyName" defaultValue="AC-System Sp. z o.o." />
          </div>
          
          <div>
            <Label htmlFor="taxId">NIP</Label>
            <Input id="taxId" defaultValue="5270103391" />
          </div>
          
          <div>
            <Label htmlFor="regon">REGON</Label>
            <Input id="regon" defaultValue="010037784" />
          </div>
          
          <div>
            <Label htmlFor="krs">KRS</Label>
            <Input id="krs" defaultValue="0000012345" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Logo firmy</Label>
            <div className="mt-2 border rounded-lg p-4 space-y-4">
              <div className="flex justify-center">
                {logoPreview ? (
                  <div className="relative w-48 h-48 border rounded-md flex items-center justify-center bg-muted/30">
                    <img 
                      src={logoPreview} 
                      alt="Logo firmy" 
                      className="max-w-full max-h-full p-2 object-contain"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-48 h-48 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
                    <ImageIcon className="size-8 mb-2" />
                    <p className="text-sm">Brak logo</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                    <Upload className="size-4" />
                    <span>Wgraj logo</span>
                  </div>
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoChange}
                  />
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3>Dane adresowe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Ulica i numer</Label>
              <Input id="street" defaultValue="ul. Przemysłowa 45" />
            </div>
            
            <div>
              <Label htmlFor="postalCode">Kod pocztowy</Label>
              <Input id="postalCode" defaultValue="00-001" />
            </div>
            
            <div>
              <Label htmlFor="city">Miasto</Label>
              <Input id="city" defaultValue="Warszawa" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" defaultValue="+48 22 123 45 67" />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="biuro@acsystem.pl" />
            </div>
            
            <div>
              <Label htmlFor="website">Strona internetowa</Label>
              <Input id="website" defaultValue="https://www.acsystem.pl" />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3>Informacje o firmie</h3>
        <div>
          <Label htmlFor="description">Opis firmy</Label>
          <Textarea 
            id="description" 
            rows={4} 
            defaultValue="AC-System to firma specjalizująca się w kompleksowych usługach z zakresu instalacji, serwisu i konserwacji systemów klimatyzacji, wentylacji i ogrzewania. Działamy na rynku od 2005 roku, zapewniając profesjonalne usługi dla klientów indywidualnych oraz biznesowych."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="foundedYear">Rok założenia</Label>
            <Input id="foundedYear" defaultValue="2005" />
          </div>
          
          <div>
            <Label htmlFor="employees">Liczba pracowników</Label>
            <Input id="employees" defaultValue="45" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3>Dane bankowe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bankName">Nazwa banku</Label>
            <Input id="bankName" defaultValue="Bank Przykładowy S.A." />
          </div>
          
          <div>
            <Label htmlFor="accountNumber">Numer konta</Label>
            <Input id="accountNumber" defaultValue="PL 12 3456 7890 1234 5678 9012 3456" />
          </div>
        </div>
      </div>
    </div>
  );
}
