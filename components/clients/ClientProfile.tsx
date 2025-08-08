
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, Building2, Mail, Phone, MapPin, ClipboardList, 
  FileText, Settings, Clock, CheckCircle2, AlertTriangle, 
  Plus, Pencil, Trash2, Check, X, Star, StarOff, Save
} from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom"; // Removed - using hash routing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  Dialog, DialogClose, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

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

interface ClientProfileProps {
  clientId?: string;
}

export function ClientProfile({ clientId }: ClientProfileProps) {
  // const { id } = useParams(); // Removed - using hash routing
  // const navigate = useNavigate(); // Removed - using hash routing
  const id = clientId;

  // State for inline edit mode
  const [isProfileEditMode, setIsProfileEditMode] = useState(false);

  // State for client information editing
  const [clientData, setClientData] = useState({
    name: "Hotel Metropol",
    type: "business",
    taxId: "7792433421",
    regon: "631257890",
    krs: "0000234567",
    foundationDate: "12.08.2010",
    vatStatus: "active",
    notes: "Klient wymaga kontaktu z działem technicznym przed wizytą"
  });

  // State for addresses and contacts management
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", name: "Siedziba główna", street: "ul. Marszałkowska 99a", postalCode: "00-693", city: "Warszawa", isPrimary: true },
    { id: "2", name: "Oddział", street: "ul. Złota 44", postalCode: "00-120", city: "Warszawa", isPrimary: false },
  ]);
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Jan Nowak", position: "Administrator budynku", phone: "601-234-567", email: "jan.nowak@metropol.pl", isPrimary: true },
    { id: "2", name: "Anna Kowalska", position: "Kierownik recepcji", phone: "602-345-678", email: "anna.kowalska@metropol.pl", isPrimary: false },
    { id: "3", name: "Piotr Wiśniewski", position: "Dyrektor techniczny", phone: "603-456-789", email: "p.wisniewski@metropol.pl", isPrimary: false },
  ]);
  
  // State for dialogs
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);

  // State for form values
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isPrimary'>>({
    name: "",
    street: "",
    postalCode: "",
    city: ""
  });
  
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'isPrimary'>>({
    name: "",
    position: "",
    phone: "",
    email: ""
  });
  
  // Client type options
  const clientTypes = [
    { value: "business", label: "Firma" },
    { value: "individual", label: "Osoba fizyczna" },
    { value: "government", label: "Instytucja publiczna" }
  ];
  
  // VAT status options
  const vatStatuses = [
    { value: "active", label: "Aktywny podatnik VAT" },
    { value: "exempt", label: "Zwolniony z VAT" },
    { value: "foreign", label: "Podatnik zagraniczny" },
    { value: "inactive", label: "Nieaktywny" }
  ];
  
  // Mock client data
  const client = {
    id: id || "2",
    equipments: [
      { id: "1", name: "Klimatyzator ścienny Daikin FTXM35R", serialNumber: "AB12345678", location: "Sala konferencyjna", lastService: "12.03.2025" },
      { id: "2", name: "Klimatyzator kasetonowy LG UT36R", serialNumber: "CD98765432", location: "Restauracja", lastService: "05.04.2025" },
      { id: "3", name: "Jednostka kanałowa Mitsubishi PEAD-M100JA", serialNumber: "EF23456789", location: "Korytarz 1 piętro", lastService: "15.02.2025" }
    ],
    serviceOrders: [
      { id: "1", number: "ZL/2025/041", date: "09.05.2025", type: "Naprawa", status: "inProgress" },
      { id: "2", number: "ZL/2025/039", date: "07.05.2025", type: "Diagnostyka", status: "completed" },
      { id: "3", number: "ZL/2025/035", date: "02.05.2025", type: "Przegląd", status: "completed" }
    ],
    documents: [
      { id: "1", number: "PS/2025/078", type: "protocol", date: "09.05.2025", status: "error" },
      { id: "2", number: "FV/2025/122", type: "invoice", date: "02.05.2025", status: "verified" },
      { id: "3", number: "PS/2025/064", type: "protocol", date: "02.05.2025", status: "verified" }
    ]
  };
  
  // Helper function to generate a random ID
  const generateId = () => Math.random().toString(36).substring(2, 10);
  
  // Reset form fields
  const resetAddressForm = () => {
    setNewAddress({
      name: "",
      street: "",
      postalCode: "",
      city: ""
    });
    setCurrentAddressId(null);
    setIsEditMode(false);
  };
  
  const resetContactForm = () => {
    setNewContact({
      name: "",
      position: "",
      phone: "",
      email: ""
    });
    setCurrentContactId(null);
    setIsEditMode(false);
  };
  
  // Handle canceling profile edit mode
  const handleCancelProfileEdit = () => {
    setClientData({
      name: "Hotel Metropol",
      type: "business",
      taxId: "7792433421",
      regon: "631257890",
      krs: "0000234567",
      foundationDate: "12.08.2010",
      vatStatus: "active",
      notes: "Klient wymaga kontaktu z działem technicznym przed wizytą"
    });
    setIsProfileEditMode(false);
  };
  
  // Handle saving profile changes
  const handleSaveProfileChanges = () => {
    toast.success("Zmiany zapisane", {
      description: "Informacje o kliencie zostały zaktualizowane."
    });
    setIsProfileEditMode(false);
  };
  
  // Handle address dialog open for edit
  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(a => a.id === addressId);
    if (addressToEdit) {
      setNewAddress({
        name: addressToEdit.name,
        street: addressToEdit.street,
        postalCode: addressToEdit.postalCode,
        city: addressToEdit.city
      });
      setCurrentAddressId(addressId);
      setIsEditMode(true);
      setIsAddressDialogOpen(true);
    }
  };
  
  // Handle contact dialog open for edit
  const handleEditContact = (contactId: string) => {
    const contactToEdit = contacts.find(c => c.id === contactId);
    if (contactToEdit) {
      setNewContact({
        name: contactToEdit.name,
        position: contactToEdit.position,
        phone: contactToEdit.phone,
        email: contactToEdit.email
      });
      setCurrentContactId(contactId);
      setIsEditMode(true);
      setIsContactDialogOpen(true);
    }
  };
  
  // Handle saving a new or edited address
  const handleSaveAddress = () => {
    if (isEditMode && currentAddressId) {
      // Update existing address
      setAddresses(prevAddresses => 
        prevAddresses.map(address => 
          address.id === currentAddressId ? 
          { ...address, ...newAddress } : 
          address
        )
      );
      toast.success("Adres zaktualizowany", {
        description: `Adres "${newAddress.name}" został zaktualizowany.`
      });
    } else {
      // Add new address
      const newAddressItem: Address = {
        id: generateId(),
        ...newAddress,
        isPrimary: addresses.length === 0 // First address is primary by default
      };
      setAddresses(prev => [...prev, newAddressItem]);
      toast.success("Adres dodany", {
        description: `Adres "${newAddress.name}" został dodany.`
      });
    }
    
    resetAddressForm();
    setIsAddressDialogOpen(false);
  };
  
  // Handle saving a new or edited contact
  const handleSaveContact = () => {
    if (isEditMode && currentContactId) {
      // Update existing contact
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === currentContactId ? 
          { ...contact, ...newContact } : 
          contact
        )
      );
      toast.success("Kontakt zaktualizowany", {
        description: `Kontakt "${newContact.name}" został zaktualizowany.`
      });
    } else {
      // Add new contact
      const newContactItem: Contact = {
        id: generateId(),
        ...newContact,
        isPrimary: contacts.length === 0 // First contact is primary by default
      };
      setContacts(prev => [...prev, newContactItem]);
      toast.success("Kontakt dodany", {
        description: `Kontakt "${newContact.name}" został dodany.`
      });
    }
    
    resetContactForm();
    setIsContactDialogOpen(false);
  };
  
  // Handle deleting an address
  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(a => a.id === addressId);
    if (addressToDelete) {
      // Check if it's the primary address
      if (addressToDelete.isPrimary && addresses.length > 1) {
        toast.error("Błąd usuwania", {
          description: "Nie można usunąć głównego adresu. Najpierw ustaw inny adres jako główny."
        });
        return;
      }
      
      setAddresses(prev => prev.filter(address => address.id !== addressId));
      toast.success("Adres usunięty", {
        description: `Adres "${addressToDelete.name}" został usunięty.`
      });
    }
  };
  
  // Handle deleting a contact
  const handleDeleteContact = (contactId: string) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    if (contactToDelete) {
      // Check if it's the primary contact
      if (contactToDelete.isPrimary && contacts.length > 1) {
        toast.error("Błąd usuwania", {
          description: "Nie można usunąć głównego kontaktu. Najpierw ustaw inny kontakt jako główny."
        });
        return;
      }
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast.success("Kontakt usunięty", {
        description: `Kontakt "${contactToDelete.name}" został usunięty.`
      });
    }
  };
  
  // Handle setting an address as primary
  const handleSetPrimaryAddress = (addressId: string) => {
    setAddresses(prev => 
      prev.map(address => ({
        ...address,
        isPrimary: address.id === addressId
      }))
    );
    
    const addressName = addresses.find(a => a.id === addressId)?.name;
    toast.success("Adres główny zmieniony", {
      description: `Adres "${addressName}" został ustawiony jako główny.`
    });
  };
  
  // Handle setting a contact as primary
  const handleSetPrimaryContact = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === contactId
      }))
    );
    
    const contactName = contacts.find(c => c.id === contactId)?.name;
    toast.success("Kontakt główny zmieniony", {
      description: `Kontakt "${contactName}" został ustawiony jako główny.`
    });
  };
  
  const getServiceOrderStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline" className="text-blue-600">Nowe</Badge>;
      case "planned":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Zaplanowane</Badge>;
      case "inProgress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">W realizacji</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Wykonane</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Anulowane</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case "error":
        return <AlertTriangle className="size-4 text-destructive" />;
      case "pending":
      default:
        return <Clock className="size-4 text-amber-500" />;
    }
  };
  
  const getClientTypeBadge = (type: string) => {
    switch (type) {
      case "business":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Firma</Badge>;
      case "individual":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Osoba fizyczna</Badge>;
      case "government":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Instytucja publiczna</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/klienci"}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1>
            {isProfileEditMode ? (
              <Input 
                value={clientData.name} 
                onChange={(e) => setClientData({...clientData, name: e.target.value})}
                className="max-w-md inline-block"
              />
            ) : (
              clientData.name
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isProfileEditMode && (
            <>
              {getClientTypeBadge(clientData.type)}
              <Badge variant="outline">Premium</Badge>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profil klienta</CardTitle>
                {isProfileEditMode ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={handleCancelProfileEdit}
                    >
                      <X className="size-4" />
                      <span>Anuluj</span>
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                      onClick={handleSaveProfileChanges}
                    >
                      <Save className="size-4" />
                      <span>Zapisz</span>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsProfileEditMode(true)}
                  >
                    <Pencil className="size-4" />
                    <span>Edytuj</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Building2 className="size-10 text-muted-foreground" />
                </div>
                <p className="font-medium text-lg">{clientData.name}</p>
                <p className="text-sm text-muted-foreground">ID klienta: {client.id}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2 text-muted-foreground text-sm">Informacje podstawowe</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Typ klienta</p>
                      {isProfileEditMode ? (
                        <Select 
                          value={clientData.type} 
                          onValueChange={(value) => setClientData({...clientData, type: value})}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz typ" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">
                          {clientTypes.find(t => t.value === clientData.type)?.label || "Firma"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status VAT</p>
                      {isProfileEditMode ? (
                        <Select 
                          value={clientData.vatStatus} 
                          onValueChange={(value) => setClientData({...clientData, vatStatus: value})}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz status" />
                          </SelectTrigger>
                          <SelectContent>
                            {vatStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">
                          {vatStatuses.find(s => s.value === clientData.vatStatus)?.label || "Aktywny podatnik VAT"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NIP</p>
                      {isProfileEditMode ? (
                        <Input 
                          value={clientData.taxId} 
                          onChange={(e) => setClientData({...clientData, taxId: e.target.value})}
                          placeholder="Numer NIP"
                        />
                      ) : (
                        <p className="font-medium">{clientData.taxId}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">REGON</p>
                      {isProfileEditMode ? (
                        <Input 
                          value={clientData.regon} 
                          onChange={(e) => setClientData({...clientData, regon: e.target.value})}
                          placeholder="Numer REGON"
                        />
                      ) : (
                        <p className="font-medium">{clientData.regon}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">KRS</p>
                      {isProfileEditMode ? (
                        <Input 
                          value={clientData.krs} 
                          onChange={(e) => setClientData({...clientData, krs: e.target.value})}
                          placeholder="Numer KRS"
                        />
                      ) : (
                        <p className="font-medium">{clientData.krs}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data założenia</p>
                      {isProfileEditMode ? (
                        <Input 
                          value={clientData.foundationDate} 
                          onChange={(e) => setClientData({...clientData, foundationDate: e.target.value})}
                          placeholder="dd.mm.rrrr"
                        />
                      ) : (
                        <p className="font-medium">{clientData.foundationDate}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-2 text-muted-foreground text-sm">Uwagi</h4>
                  {isProfileEditMode ? (
                    <Textarea 
                      value={clientData.notes} 
                      onChange={(e) => setClientData({...clientData, notes: e.target.value})}
                      placeholder="Uwagi do klienta"
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm">{clientData.notes}</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="default" 
                    className="gap-2 bg-brand-blue hover:bg-brand-blue/90 w-full"
                    onClick={() => window.location.hash = "#/zlecenia/nowe"}
                  >
                    <ClipboardList className="size-4" />
                    <span>Utwórz zlecenie</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Adresy</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  resetAddressForm();
                  setIsAddressDialogOpen(true);
                }}
              >
                <Plus className="size-4" />
                <span>Dodaj adres</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Brak dodanych adresów
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="flex items-start p-3 bg-muted/30 rounded-md relative group">
                      <div className="flex items-start gap-4 w-full">
                        <MapPin className="size-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{address.name}</p>
                            {address.isPrimary && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="size-3 fill-current" />
                                Adres główny
                              </Badge>
                            )}
                          </div>
                          <p>{address.street}</p>
                          <p>{address.postalCode} {address.city}</p>
                        </div>
                      </div>
                      
                      <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!address.isPrimary && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleSetPrimaryAddress(address.id)}
                            title="Ustaw jako główny"
                          >
                            <Star className="size-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditAddress(address.id)}
                          title="Edytuj adres"
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteAddress(address.id)}
                          title="Usuń adres"
                        >
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Osoby kontaktowe</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  resetContactForm();
                  setIsContactDialogOpen(true);
                }}
              >
                <Plus className="size-4" />
                <span>Dodaj kontakt</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Brak dodanych kontaktów
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start space-x-4 p-3 bg-muted/30 rounded-md relative group">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{contact.name}</p>
                          {contact.isPrimary && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Star className="size-3 fill-current" />
                              Kontakt główny
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.position}</p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="size-4 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!contact.isPrimary && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleSetPrimaryContact(contact.id)}
                            title="Ustaw jako główny"
                          >
                            <Star className="size-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditContact(contact.id)}
                          title="Edytuj kontakt"
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteContact(contact.id)}
                          title="Usuń kontakt"
                        >
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Urządzenia klienta</CardTitle>
              <Button 
                className="gap-2"
                onClick={() => window.location.hash = "#/urzadzenia/nowe"}
              >
                Dodaj urządzenie
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Urządzenie</TableHead>
                    <TableHead>Nr seryjny</TableHead>
                    <TableHead>Lokalizacja</TableHead>
                    <TableHead>Ostatni serwis</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.equipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>{equipment.serialNumber}</TableCell>
                      <TableCell>{equipment.location}</TableCell>
                      <TableCell>{equipment.lastService}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.hash = `#/urzadzenia/${equipment.id}`}
                        >
                          Szczegóły
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Zlecenia serwisowe</CardTitle>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.hash = "#/zlecenia/nowe"}
                >
                  Utwórz zlecenie
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numer</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.serviceOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.number}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{getServiceOrderStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.location.hash = `#/zlecenia/${order.id}`}
                          >
                            Szczegóły
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Dokumenty</CardTitle>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.hash = "#/dokumenty/dodaj"}
                >
                  Dodaj dokument
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Numer</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentStatusIcon(document.status)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{document.number}</TableCell>
                        <TableCell>{document.type === "invoice" ? "Faktura" : "Protokół"}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.location.hash = `#/dokumenty/${document.id}`}
                          >
                            Podgląd
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog for adding/editing address */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edytuj adres" : "Dodaj nowy adres"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Zmień dane wybranego adresu klienta."
                : "Wprowadź dane nowego adresu klienta."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="address-name">Nazwa adresu</Label>
              <Input 
                id="address-name" 
                placeholder="np. Siedziba główna, Oddział, Magazyn" 
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="street">Ulica i numer</Label>
              <Input 
                id="street" 
                placeholder="ul. Przykładowa 123" 
                value={newAddress.street}
                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postal-code">Kod pocztowy</Label>
                <Input 
                  id="postal-code" 
                  placeholder="00-000" 
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Miasto</Label>
                <Input 
                  id="city" 
                  placeholder="Warszawa" 
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Anuluj
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
              onClick={handleSaveAddress}
              disabled={!newAddress.name || !newAddress.street || !newAddress.postalCode || !newAddress.city}
            >
              {isEditMode ? <Check className="size-4" /> : <Plus className="size-4" />}
              {isEditMode ? "Zapisz zmiany" : "Dodaj adres"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding/editing contact */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edytuj kontakt" : "Dodaj nowy kontakt"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Zmień dane wybranej osoby kontaktowej."
                : "Wprowadź dane nowej osoby kontaktowej."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Imię i nazwisko</Label>
              <Input 
                id="contact-name" 
                placeholder="Jan Kowalski" 
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Stanowisko</Label>
              <Input 
                id="position" 
                placeholder="np. Administrator budynku" 
                value={newContact.position}
                onChange={(e) => setNewContact({...newContact, position: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input 
                id="phone" 
                placeholder="123-456-789" 
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="jan.kowalski@example.com" 
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Anuluj
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
              onClick={handleSaveContact}
              disabled={!newContact.name || !newContact.phone || !newContact.email}
            >
              {isEditMode ? <Check className="size-4" /> : <Plus className="size-4" />}
              {isEditMode ? "Zapisz zmiany" : "Dodaj kontakt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
