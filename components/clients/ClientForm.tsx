import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, Plus, Trash2, MapPin, User, Building, FileText, Phone, Mail, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

interface Contact {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface Address {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  isPrimary: boolean;
}

export function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientType, setClientType] = useState("business");
  const [vatStatus, setVatStatus] = useState("active");
  const [companyName, setCompanyName] = useState(id ? "Hotel Metropol" : "");
  const [contacts, setContacts] = useState<Contact[]>(id ? [
    { id: "1", name: "Jan Nowak", position: "Administrator budynku", phone: "601-234-567", email: "jan.nowak@metropol.pl", isPrimary: true },
    { id: "2", name: "Anna Kowalska", position: "Kierownik recepcji", phone: "602-345-678", email: "anna.kowalska@metropol.pl", isPrimary: false }
  ] : []);
  const [addresses, setAddresses] = useState<Address[]>(id ? [
    { id: "1", name: "Siedziba główna", street: "ul. Marszałkowska 99a", postalCode: "00-693", city: "Warszawa", isPrimary: true }
  ] : []);
  
  const [newContact, setNewContact] = useState<Contact>({
    id: "", name: "", position: "", phone: "", email: "", isPrimary: false
  });
  
  const [newAddress, setNewAddress] = useState<Address>({
    id: "", name: "", street: "", postalCode: "", city: "", isPrimary: false
  });
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contactToAdd = {
        ...newContact,
        id: `new-${Date.now()}`
      };
      
      if (contactToAdd.isPrimary) {
        // If new contact is primary, make all others non-primary
        setContacts(contacts.map(c => ({ ...c, isPrimary: false })).concat(contactToAdd));
      } else {
        // If no contacts exist yet, make this one primary
        if (contacts.length === 0) {
          contactToAdd.isPrimary = true;
        }
        setContacts([...contacts, contactToAdd]);
      }
      
      // Reset form
      setNewContact({
        id: "", name: "", position: "", phone: "", email: "", isPrimary: false
      });
      setShowContactForm(false);
    }
  };
  
  const addAddress = () => {
    if (newAddress.street && newAddress.city) {
      const addressToAdd = {
        ...newAddress,
        id: `new-${Date.now()}`
      };
      
      if (addressToAdd.isPrimary) {
        // If new address is primary, make all others non-primary
        setAddresses(addresses.map(a => ({ ...a, isPrimary: false })).concat(addressToAdd));
      } else {
        // If no addresses exist yet, make this one primary
        if (addresses.length === 0) {
          addressToAdd.isPrimary = true;
        }
        setAddresses([...addresses, addressToAdd]);
      }
      
      // Reset form
      setNewAddress({
        id: "", name: "", street: "", postalCode: "", city: "", isPrimary: false
      });
      setShowAddressForm(false);
    }
  };
  
  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };
  
  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };
  
  const setPrimaryContact = (id: string) => {
    setContacts(contacts.map(c => ({
      ...c,
      isPrimary: c.id === id
    })));
  };
  
  const setPrimaryAddress = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isPrimary: a.id === id
    })));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      alert(`Klient "${companyName}" został zaktualizowany`);
    } else {
      alert(`Nowy klient "${companyName}" został utworzony`);
    }
    navigate("/klienci");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/klienci")}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1>{id ? "Edytuj klienta" : "Nowy klient"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Dane podstawowe */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Building className="size-5 text-brand-blue" />
                Dane podstawowe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientType">Typ klienta</Label>
                  <Select value={clientType} onValueChange={setClientType}>
                    <SelectTrigger id="clientType">
                      <SelectValue placeholder="Wybierz typ klienta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Firma</SelectItem>
                      <SelectItem value="individual">Osoba fizyczna</SelectItem>
                      <SelectItem value="government">Instytucja publiczna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vatStatus">Status VAT</Label>
                  <Select value={vatStatus} onValueChange={setVatStatus}>
                    <SelectTrigger id="vatStatus">
                      <SelectValue placeholder="Wybierz status VAT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktywny podatnik VAT</SelectItem>
                      <SelectItem value="exempt">Zwolniony z VAT</SelectItem>
                      <SelectItem value="foreign">Zagraniczny podatnik VAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nazwa firmy / klienta</Label>
                  <Input 
                    id="companyName" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">NIP</Label>
                  <Input 
                    id="taxId" 
                    placeholder="np. 5272851631"
                    defaultValue={id ? "7792433421" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regon">REGON</Label>
                  <Input 
                    id="regon" 
                    placeholder="np. 368293212"
                    defaultValue={id ? "631257890" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="krs">KRS</Label>
                  <Input 
                    id="krs" 
                    placeholder="np. 0000123456"
                    defaultValue={id ? "0000234567" : ""}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Uwagi</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Dodatkowe informacje o kliencie..."
                    rows={3}
                    defaultValue={id ? "Klient wymaga kontaktu z działem technicznym przed wizytą" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          {/* Osoby kontaktowe */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2">
                <User className="size-5 text-brand-blue" />
                Osoby kontaktowe
              </h2>
              {!showContactForm && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowContactForm(true)}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Dodaj kontakt
                </Button>
              )}
            </div>
            
            {contacts.length > 0 ? (
              <div className="rounded-md border overflow-x-auto mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imię i nazwisko</TableHead>
                      <TableHead>Stanowisko</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Główny</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.position}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>
                          <input 
                            type="radio" 
                            checked={contact.isPrimary} 
                            onChange={() => setPrimaryContact(contact.id)}
                            className="accent-brand-orange"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeContact(contact.id)}
                            type="button"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-muted/40 text-muted-foreground p-4 rounded-md mb-4 flex items-center gap-2">
                <Info className="size-4" />
                <span>Brak osób kontaktowych. Dodaj co najmniej jedną osobę kontaktową.</span>
              </div>
            )}
            
            {showContactForm && (
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="size-4 text-brand-blue" />
                    Nowy kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Imię i nazwisko</Label>
                      <Input 
                        id="contactName" 
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPosition">Stanowisko</Label>
                      <Input 
                        id="contactPosition" 
                        value={newContact.position}
                        onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telefon</Label>
                      <Input 
                        id="contactPhone" 
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <input 
                        type="checkbox" 
                        id="isPrimaryContact"
                        checked={newContact.isPrimary}
                        onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                        className="accent-brand-orange"
                      />
                      <Label htmlFor="isPrimaryContact">Ustaw jako główny kontakt</Label>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowContactForm(false)}
                    >
                      Anuluj
                    </Button>
                    <Button 
                      type="button" 
                      onClick={addContact}
                      disabled={!newContact.name || !newContact.phone}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      Dodaj kontakt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Separator />
          
          {/* Adresy */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2">
                <MapPin className="size-5 text-brand-blue" />
                Adresy
              </h2>
              {!showAddressForm && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddressForm(true)}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Dodaj adres
                </Button>
              )}
            </div>
            
            {addresses.length > 0 ? (
              <div className="rounded-md border overflow-x-auto mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa</TableHead>
                      <TableHead>Adres</TableHead>
                      <TableHead>Kod pocztowy</TableHead>
                      <TableHead>Miasto</TableHead>
                      <TableHead>Główny</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addresses.map((address) => (
                      <TableRow key={address.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground" />
                            {address.name}
                          </div>
                        </TableCell>
                        <TableCell>{address.street}</TableCell>
                        <TableCell>{address.postalCode}</TableCell>
                        <TableCell>{address.city}</TableCell>
                        <TableCell>
                          <input 
                            type="radio" 
                            checked={address.isPrimary} 
                            onChange={() => setPrimaryAddress(address.id)}
                            className="accent-brand-orange"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAddress(address.id)}
                            type="button"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-muted/40 text-muted-foreground p-4 rounded-md mb-4 flex items-center gap-2">
                <Info className="size-4" />
                <span>Brak adresów. Dodaj co najmniej jeden adres.</span>
              </div>
            )}
            
            {showAddressForm && (
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="size-4 text-brand-blue" />
                    Nowy adres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="addressName">Nazwa adresu</Label>
                      <Input 
                        id="addressName" 
                        placeholder="np. Siedziba główna, Magazyn, itp."
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Ulica i numer</Label>
                      <Input 
                        id="street" 
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Kod pocztowy</Label>
                      <Input 
                        id="postalCode" 
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">Miasto</Label>
                      <Input 
                        id="city" 
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <input 
                        type="checkbox" 
                        id="isPrimaryAddress"
                        checked={newAddress.isPrimary}
                        onChange={(e) => setNewAddress({...newAddress, isPrimary: e.target.checked})}
                        className="accent-brand-orange"
                      />
                      <Label htmlFor="isPrimaryAddress">Ustaw jako adres główny</Label>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Anuluj
                    </Button>
                    <Button 
                      type="button" 
                      onClick={addAddress}
                      disabled={!newAddress.street || !newAddress.city}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      Dodaj adres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate("/klienci")}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              disabled={!companyName}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              {id ? "Zapisz zmiany" : "Utwórz klienta"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}