
import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Search, Filter, Plus, 
  Building2, Phone, Mail, MapPin, FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Badge } from "../ui/badge";

interface Client {
  id: string;
  name: string;
  type: "business" | "individual" | "government";
  taxId: string;
  address: string;
  contactName: string;
  phone: string;
  email: string;
  equipmentCount: number;
  serviceOrdersCount: number;
}

export function ClientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  // const navigate = useNavigate(); // Removed - using hash routing
  
  // Przykładowe dane
  const clients: Client[] = [
    {
      id: "1",
      name: "Biurowiec Gamma",
      type: "business",
      taxId: "5272851631",
      address: "ul. Marszałkowska 142, 00-061 Warszawa",
      contactName: "Tomasz Wiśniewski",
      phone: "601-123-456",
      email: "t.wisniewski@gamma.pl",
      equipmentCount: 12,
      serviceOrdersCount: 24
    },
    {
      id: "2",
      name: "Hotel Metropol",
      type: "business",
      taxId: "7792433421",
      address: "ul. Marszałkowska 99a, 00-693 Warszawa",
      contactName: "Jan Nowak",
      phone: "602-234-567",
      email: "j.nowak@metropol.pl",
      equipmentCount: 18,
      serviceOrdersCount: 31
    },
    {
      id: "3",
      name: "ABC Sp. z o.o.",
      type: "business",
      taxId: "9542587430",
      address: "ul. Złota 59, 00-120 Warszawa",
      contactName: "Maria Kowalczyk",
      phone: "603-345-678",
      email: "m.kowalczyk@abc.pl",
      equipmentCount: 5,
      serviceOrdersCount: 10
    },
    {
      id: "4",
      name: "Delta Office Park",
      type: "business",
      taxId: "6310285479",
      address: "ul. Konstruktorska 13, 02-673 Warszawa",
      contactName: "Piotr Kowalski",
      phone: "604-456-789",
      email: "p.kowalski@deltaoffice.pl",
      equipmentCount: 22,
      serviceOrdersCount: 35
    },
    {
      id: "5",
      name: "Jan Kowalski",
      type: "individual",
      taxId: "",
      address: "ul. Piękna 24/3, 00-549 Warszawa",
      contactName: "Jan Kowalski",
      phone: "605-567-890",
      email: "jan.kowalski@example.com",
      equipmentCount: 1,
      serviceOrdersCount: 3
    },
    {
      id: "6",
      name: "Urząd Miasta Warszawa",
      type: "government",
      taxId: "5252248481",
      address: "pl. Bankowy 3/5, 00-950 Warszawa",
      contactName: "Anna Malinowska",
      phone: "606-678-901",
      email: "a.malinowska@um.warszawa.pl",
      equipmentCount: 32,
      serviceOrdersCount: 47
    }
  ];

  const exportClientsToCsv = (rows: Client[]) => {
    const header = ["Nazwa","Typ","Telefon","Email","Adres","Urządzenia","Zlecenia"]; 
    const body = rows.map(c => [c.name,c.type,c.phone,c.email,c.address,c.equipmentCount,c.serviceOrdersCount]);
    const csv = [header, ...body].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "klienci.csv";
    a.click();
    URL.revokeObjectURL(url);
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

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Klienci</h1>
        <Button 
          className="gap-2"
                      onClick={() => window.location.hash = "#/klienci/nowy"}
        >
          <Plus className="size-4" />
          <span>Dodaj klienta</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista klientów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Szukaj klienta..." 
                className="pl-9 rounded-full h-10" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px] h-10 rounded-full px-4">
                  <SelectValue placeholder="Typ klienta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  <SelectItem value="business">Firmy</SelectItem>
                  <SelectItem value="individual">Osoby fizyczne</SelectItem>
                  <SelectItem value="government">Instytucje publiczne</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => alert("Otworzono zaawansowane filtry klientów")}
                className="text-brand-blue border-brand-blue"
              >
                <Filter className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="text-brand-blue border-brand-blue"
                onClick={() => exportClientsToCsv(filteredClients)}
              >
                Eksport CSV
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Adres</TableHead>
                  <TableHead className="text-center">Urządzenia</TableHead>
                  <TableHead className="text-center">Zlecenia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Brak klientów spełniających kryteria wyszukiwania
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => window.location.hash = `#/klienci/${client.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-brand-blue hover:underline">{client.name}</p>
                            {client.taxId && (
                              <p className="text-xs text-muted-foreground">NIP: {client.taxId}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getClientTypeBadge(client.type)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="size-4 text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-muted-foreground" />
                          <span>{client.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{client.equipmentCount}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{client.serviceOrdersCount}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
