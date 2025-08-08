
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Search, 
  Plus, 
  Shield, 
  Users, 
  Key, 
  Settings, 
  User, 
  Info, 
  FileText,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface UserPermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
  usersCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive?: Date;
  status: "active" | "inactive" | "invited";
}

export function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);

  // Przykładowe dane dla ról
  const roles: UserRole[] = [
    {
      id: "1",
      name: "Administrator",
      description: "Pełny dostęp do wszystkich funkcji systemu",
      usersCount: 2,
      permissions: [
        { module: "Zlecenia serwisowe", view: true, create: true, edit: true, delete: true },
        { module: "Klienci", view: true, create: true, edit: true, delete: true },
        { module: "Urządzenia", view: true, create: true, edit: true, delete: true },
        { module: "Dokumenty", view: true, create: true, edit: true, delete: true },
        { module: "Magazyn", view: true, create: true, edit: true, delete: true },
        { module: "Konwersacje", view: true, create: true, edit: true, delete: true },
        { module: "Raporty", view: true, create: true, edit: true, delete: true },
        { module: "Uprawnienia", view: true, create: true, edit: true, delete: true },
      ]
    },
    {
      id: "2",
      name: "Serwisant",
      description: "Zarządzanie zleceniami, ograniczony dostęp do magazynu",
      usersCount: 8,
      permissions: [
        { module: "Zlecenia serwisowe", view: true, create: true, edit: true, delete: false },
        { module: "Klienci", view: true, create: false, edit: true, delete: false },
        { module: "Urządzenia", view: true, create: true, edit: true, delete: false },
        { module: "Dokumenty", view: true, create: true, edit: false, delete: false },
        { module: "Magazyn", view: true, create: false, edit: false, delete: false },
        { module: "Konwersacje", view: true, create: true, edit: true, delete: false },
        { module: "Raporty", view: true, create: false, edit: false, delete: false },
        { module: "Uprawnienia", view: false, create: false, edit: false, delete: false },
      ]
    },
    {
      id: "3",
      name: "Obsługa biura",
      description: "Zarządzanie klientami, dokumentami, obsługa komunikacji",
      usersCount: 4,
      permissions: [
        { module: "Zlecenia serwisowe", view: true, create: true, edit: false, delete: false },
        { module: "Klienci", view: true, create: true, edit: true, delete: false },
        { module: "Urządzenia", view: true, create: false, edit: false, delete: false },
        { module: "Dokumenty", view: true, create: true, edit: true, delete: false },
        { module: "Magazyn", view: true, create: false, edit: false, delete: false },
        { module: "Konwersacje", view: true, create: true, edit: true, delete: false },
        { module: "Raporty", view: true, create: false, edit: false, delete: false },
        { module: "Uprawnienia", view: false, create: false, edit: false, delete: false },
      ]
    },
    {
      id: "4",
      name: "Magazynier",
      description: "Pełna kontrola nad magazynem",
      usersCount: 2,
      permissions: [
        { module: "Zlecenia serwisowe", view: true, create: false, edit: false, delete: false },
        { module: "Klienci", view: true, create: false, edit: false, delete: false },
        { module: "Urządzenia", view: true, create: false, edit: false, delete: false },
        { module: "Dokumenty", view: true, create: false, edit: false, delete: false },
        { module: "Magazyn", view: true, create: true, edit: true, delete: true },
        { module: "Konwersacje", view: true, create: true, edit: false, delete: false },
        { module: "Raporty", view: true, create: false, edit: false, delete: false },
        { module: "Uprawnienia", view: false, create: false, edit: false, delete: false },
      ]
    }
  ];

  // Przykładowi użytkownicy
  const users: User[] = [
    { id: "1", name: "Janusz Nowak", email: "j.nowak@acservice.pl", role: "Administrator", lastActive: new Date("2025-05-14T08:30:00"), status: "active" },
    { id: "2", name: "Anna Kowalska", email: "a.kowalska@acservice.pl", role: "Administrator", lastActive: new Date("2025-05-13T16:45:00"), status: "active" },
    { id: "3", name: "Piotr Wiśniewski", email: "p.wisniewski@acservice.pl", role: "Serwisant", lastActive: new Date("2025-05-14T09:15:00"), status: "active" },
    { id: "4", name: "Małgorzata Zielińska", email: "m.zielinska@acservice.pl", role: "Obsługa biura", lastActive: new Date("2025-05-14T08:50:00"), status: "active" },
    { id: "5", name: "Tomasz Szymański", email: "t.szymanski@acservice.pl", role: "Serwisant", lastActive: new Date("2025-05-12T14:20:00"), status: "active" },
    { id: "6", name: "Katarzyna Dąbrowska", email: "k.dabrowska@acservice.pl", role: "Magazynier", lastActive: new Date("2025-05-14T07:45:00"), status: "active" },
    { id: "7", name: "Marek Lewandowski", email: "m.lewandowski@acservice.pl", role: "Serwisant", status: "invited" },
  ];

  // Filtrowanie użytkowników według wyszukiwania
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renderowanie badge statusu użytkownika
  const renderStatusBadge = (status: User['status']) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">Aktywny</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">Nieaktywny</Badge>;
      case "invited":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Zaproszony</Badge>;
    }
  };

  // Formatowanie daty ostatniej aktywności
  const formatLastActive = (date?: Date) => {
    if (!date) return "Nigdy";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Dziś, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Wczoraj, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Uprawnienia użytkowników</h1>
          <p className="text-muted-foreground">Zarządzaj rolami i uprawnieniami użytkowników systemu</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => window.open('/dokumentacja/uprawnienia', '_blank')}
          >
            <FileText className="icon-balanced" />
            <span className="hidden sm:inline">Dokumentacja</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles" className="flex items-center gap-1.5">
            <Shield className="size-4" />
            <span>Role i uprawnienia</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1.5">
            <Users className="size-4" />
            <span>Użytkownicy</span>
          </TabsTrigger>
        </TabsList>

        {/* Zakładka Role i uprawnienia */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Lista ról */}
            <Card className="md:w-1/3">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Role</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5"
                    onClick={() => setIsAddRoleDialogOpen(true)}
                  >
                    <Plus className="size-3.5" />
                    <span>Nowa rola</span>
                  </Button>
                </CardTitle>
                <CardDescription>Zdefiniowane role w systemie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {roles.map(role => (
                    <div 
                      key={role.id}
                      className={`p-3 cursor-pointer transition-colors ${selectedRole?.id === role.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        <Badge variant="outline">{role.usersCount} {role.usersCount === 1 ? 'użytkownik' : role.usersCount < 5 ? 'użytkowników' : 'użytkowników'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Uprawnienia wybranej roli */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Uprawnienia {selectedRole ? `- ${selectedRole.name}` : ''}</span>
                  {selectedRole && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5"
                    >
                      <Edit className="size-3.5" />
                      <span>Edytuj</span>
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedRole 
                    ? selectedRole.description 
                    : 'Wybierz rolę, aby zobaczyć jej uprawnienia'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRole ? (
                  <ScrollArea className="h-[450px] pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[240px]">Moduł</TableHead>
                          <TableHead className="text-center">Podgląd</TableHead>
                          <TableHead className="text-center">Dodawanie</TableHead>
                          <TableHead className="text-center">Edycja</TableHead>
                          <TableHead className="text-center">Usuwanie</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRole.permissions.map((permission, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{permission.module}</TableCell>
                            <TableCell className="text-center">
                              {permission.view ? <CheckCircle className="size-5 text-emerald-500 mx-auto" /> : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {permission.create ? <CheckCircle className="size-5 text-emerald-500 mx-auto" /> : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {permission.edit ? <CheckCircle className="size-5 text-emerald-500 mx-auto" /> : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {permission.delete ? <CheckCircle className="size-5 text-emerald-500 mx-auto" /> : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium mb-3">Użytkownicy z rolą {selectedRole.name}</h4>
                      <div className="space-y-2">
                        {users
                          .filter(user => user.role === selectedRole.name)
                          .map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                              {renderStatusBadge(user.status)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Shield className="size-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Wybierz rolę</h3>
                    <p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-md">
                      Wybierz rolę z listy po lewej stronie, aby zobaczyć szczegóły uprawnień.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Zakładka Użytkownicy */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Użytkownicy systemu</span>
                <Button 
                  onClick={() => setIsAddUserDialogOpen(true)}
                  className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                >
                  <UserPlus className="size-4" />
                  <span>Dodaj użytkownika</span>
                </Button>
              </CardTitle>
              <CardDescription>Zarządzaj kontami użytkowników i przypisuj im role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 icon-balanced text-muted-foreground" />
                  <Input 
                    placeholder="Wyszukaj użytkownika..." 
                    className="pl-9 input-balanced" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Rola" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie role</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie statusy</SelectItem>
                      <SelectItem value="active">Aktywni</SelectItem>
                      <SelectItem value="inactive">Nieaktywni</SelectItem>
                      <SelectItem value="invited">Zaproszeni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">Użytkownik</TableHead>
                      <TableHead>Adres e-mail</TableHead>
                      <TableHead>Rola</TableHead>
                      <TableHead>Ostatnia aktywność</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p className="text-muted-foreground">Brak użytkowników spełniających kryteria wyszukiwania</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{formatLastActive(user.lastActive)}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Key className="icon-balanced" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="icon-balanced" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="icon-balanced" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog dodawania użytkownika */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="dialog-content sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
            <DialogDescription>
              Wprowadź dane użytkownika i przypisz mu odpowiednią rolę.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Imię</Label>
                <Input id="firstName" placeholder="Imię użytkownika" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nazwisko</Label>
                <Input id="lastName" placeholder="Nazwisko użytkownika" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input id="email" type="email" placeholder="uzytkownik@acservice.pl" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rola</Label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Wybierz rolę" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md">
              <Info className="size-5 text-muted-foreground" />
              <p className="text-sm">
                Po utworzeniu konta, użytkownik otrzyma e-mail z zaproszeniem i instrukcją ustawienia hasła.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Anuluj
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              Dodaj użytkownika
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog dodawania roli */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="dialog-content sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dodaj nową rolę</DialogTitle>
            <DialogDescription>
              Zdefiniuj nazwę, opis oraz uprawnienia dla nowej roli użytkowników.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="roleName">Nazwa roli</Label>
              <Input id="roleName" placeholder="Nazwa roli" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Opis</Label>
              <Input id="roleDescription" placeholder="Krótki opis uprawnień i zastosowania roli" />
            </div>
            
            <div className="space-y-2">
              <Label>Uprawnienia</Label>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">Moduł</TableHead>
                      <TableHead className="text-center">Podgląd</TableHead>
                      <TableHead className="text-center">Dodawanie</TableHead>
                      <TableHead className="text-center">Edycja</TableHead>
                      <TableHead className="text-center">Usuwanie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Zlecenia serwisowe", "Klienci", "Urządzenia", "Dokumenty", "Magazyn", "Konwersacje", "Raporty", "Uprawnienia"].map((module, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{module}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox id={`${module}-view`} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox id={`${module}-create`} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox id={`${module}-edit`} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox id={`${module}-delete`} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md">
              <Info className="size-5 text-muted-foreground" />
              <p className="text-sm">
                Uprawnienia pozwalają na precyzyjne określenie, co użytkownicy z daną rolą mogą zobaczyć i zmodyfikować w systemie.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Anuluj
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              Zapisz rolę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
