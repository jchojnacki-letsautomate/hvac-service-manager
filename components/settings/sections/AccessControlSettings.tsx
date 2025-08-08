
import React from "react";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Switch } from "../../ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Button } from "../../ui/button";
import { 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  Wrench, 
  Building2, 
  Package, 
  FileText, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  UserPlus,
  Filter
} from "lucide-react";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
  avatar: string;
}

export function AccessControlSettings() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  
  const users: UserData[] = [
    {
      id: "1",
      name: "Jan Kowalski",
      email: "j.kowalski@acsystem.pl",
      role: "Administrator",
      department: "IT",
      status: "active",
      lastLogin: "14.05.2025, 08:15",
      avatar: ""
    },
    {
      id: "2",
      name: "Anna Wiśniewska",
      email: "a.wisniewska@acsystem.pl",
      role: "Manager",
      department: "Serwis",
      status: "active",
      lastLogin: "14.05.2025, 08:30",
      avatar: ""
    },
    {
      id: "3",
      name: "Piotr Nowak",
      email: "p.nowak@acsystem.pl",
      role: "Technik",
      department: "Serwis",
      status: "active",
      lastLogin: "13.05.2025, 17:45",
      avatar: ""
    },
    {
      id: "4",
      name: "Katarzyna Lis",
      email: "k.lis@acsystem.pl",
      role: "Księgowy",
      department: "Finanse",
      status: "active",
      lastLogin: "14.05.2025, 09:10",
      avatar: ""
    },
    {
      id: "5",
      name: "Marcin Dąbrowski",
      email: "m.dabrowski@acsystem.pl",
      role: "Technik",
      department: "Serwis",
      status: "inactive",
      lastLogin: "10.05.2025, 13:22",
      avatar: ""
    }
  ];
  
  const roles = [
    { id: "admin", name: "Administrator", permissions: 16 },
    { id: "manager", name: "Manager", permissions: 12 },
    { id: "technician", name: "Technik", permissions: 8 },
    { id: "accountant", name: "Księgowy", permissions: 6 },
    { id: "receptionist", name: "Recepcjonista", permissions: 4 },
    { id: "viewer", name: "Podgląd", permissions: 2 }
  ];
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <div className="space-y-6">
      {/* Podsumowanie uprawnień */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Shield className="size-5 text-brand-blue" />
          Podsumowanie uprawnień
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Users className="size-5 text-brand-blue" />
              </div>
              <div>
                <div className="text-2xl font-medium">{users.length}</div>
                <div className="text-sm text-muted-foreground">Aktywnych użytkowników</div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Lock className="size-5 text-brand-blue" />
              </div>
              <div>
                <div className="text-2xl font-medium">{roles.length}</div>
                <div className="text-sm text-muted-foreground">Zdefiniowanych ról</div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/20 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Eye className="size-5 text-brand-orange" />
              </div>
              <div>
                <div className="text-2xl font-medium">Pełny dostęp</div>
                <div className="text-sm text-muted-foreground">Twój poziom uprawnień</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Zarządzanie użytkownikami */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <Users className="size-5 text-brand-blue" />
            Zarządzanie użytkownikami
          </h3>
          
          <Button className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
            <UserPlus className="size-4" />
            <span>Dodaj użytkownika</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Szukaj użytkownika..." 
              className="pl-9" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select 
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtruj rolę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie role</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Użytkownik</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Dział</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ostatnie logowanie</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Brak użytkowników spełniających kryteria wyszukiwania
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.role === "Administrator" ? "bg-brand-blue text-white" : "bg-muted"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge className={
                        user.status === "active" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-amber-100 text-amber-700"
                      }>
                        {user.status === "active" ? "Aktywny" : "Nieaktywny"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Separator />
      
      {/* Zarządzanie rolami */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <Lock className="size-5 text-brand-blue" />
            Zarządzanie rolami
          </h3>
          
          <Button className="gap-2">
            <Plus className="size-4" />
            <span>Dodaj rolę</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Shield className="size-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">{role.permissions} uprawnień</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="size-4" />
                  </Button>
                  {role.id !== "admin" && (
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wrench className="size-4 text-muted-foreground" />
                    <span className="text-sm">Zlecenia serwisowe</span>
                  </div>
                  <Switch 
                    checked={role.id !== "viewer"} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="text-sm">Klienci</span>
                  </div>
                  <Switch 
                    checked={role.id !== "viewer" && role.id !== "technician"} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span className="text-sm">Magazyn</span>
                  </div>
                  <Switch 
                    checked={["admin", "manager", "accountant"].includes(role.id)} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm">Dokumenty</span>
                  </div>
                  <Switch 
                    checked={["admin", "manager", "accountant"].includes(role.id)} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4 text-muted-foreground" />
                    <span className="text-sm">Konwersacje</span>
                  </div>
                  <Switch 
                    checked={role.id !== "viewer"} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm">Administracja</span>
                  </div>
                  <Switch 
                    checked={["admin"].includes(role.id)} 
                    className="data-[state=checked]:bg-brand-blue"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Sesje aktywne */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2">
          <Eye className="size-5 text-brand-blue" />
          Aktywne sesje
        </h3>
        
        <div className="space-y-3">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Adres IP</TableHead>
                  <TableHead>Urządzenie</TableHead>
                  <TableHead>Czas logowania</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>Jan Kowalski</span>
                    </div>
                  </TableCell>
                  <TableCell>192.168.1.105</TableCell>
                  <TableCell>Windows 11 • Chrome</TableCell>
                  <TableCell>14.05.2025, 08:15</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs">
                      Zakończ sesję
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>Anna Wiśniewska</span>
                    </div>
                  </TableCell>
                  <TableCell>192.168.1.108</TableCell>
                  <TableCell>macOS • Safari</TableCell>
                  <TableCell>14.05.2025, 08:30</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs">
                      Zakończ sesję
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>Katarzyna Lis</span>
                    </div>
                  </TableCell>
                  <TableCell>192.168.1.112</TableCell>
                  <TableCell>Windows 10 • Edge</TableCell>
                  <TableCell>14.05.2025, 09:10</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs">
                      Zakończ sesję
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="text-destructive">
              Zakończ wszystkie sesje
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Ustawienia hasła */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <Lock className="size-5 text-brand-blue" />
          Polityka bezpieczeństwa
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-medium">Wymagania dotyczące hasła</h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="minLength">Minimalna długość</Label>
                <Input 
                  id="minLength" 
                  className="w-16 text-center" 
                  defaultValue="8" 
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
                <Label>Wielkie litery</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
                <Label>Cyfry</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
                <Label>Znaki specjalne</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Wygasanie hasła</div>
                <div className="text-sm text-muted-foreground">
                  Wymuś zmianę hasła co 90 dni
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Blokada konta</div>
                <div className="text-sm text-muted-foreground">
                  Blokuj konto po 5 nieudanych próbach logowania
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Weryfikacja dwuetapowa</div>
                <div className="text-sm text-muted-foreground">
                  Wymagaj weryfikacji dwuetapowej dla wszystkich użytkowników
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-brand-blue" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Logi bezpieczeństwa</div>
                <div className="text-sm text-muted-foreground">
                  Przechowuj szczegółowe logi bezpieczeństwa
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Powiadomienia o logowaniu</div>
                <div className="text-sm text-muted-foreground">
                  Wysyłaj powiadomienia email przy logowaniu z nowego urządzenia
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-brand-blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
