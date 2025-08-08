import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Building2, Wrench, FileText, User, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Typy dla encji i uczestników
type EntityType = "client" | "equipment" | "project" | "order";

interface RelatedEntity {
  id: string;
  name: string;
  type: EntityType;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: "technician" | "office" | "manager";
}

interface ConversationEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    relatedEntities: RelatedEntity[];
    participants: Participant[];
  }) => void;
  conversation?: {
    id: string;
    title: string;
    relatedEntities: RelatedEntity[];
    participants: Participant[];
  };
}

export function ConversationEditDialog({
  open,
  onClose,
  onSave,
  conversation
}: ConversationEditDialogProps) {
  const [title, setTitle] = useState(conversation?.title || "");
  const [relatedEntities, setRelatedEntities] = useState<RelatedEntity[]>(
    conversation?.relatedEntities || []
  );
  const [participants, setParticipants] = useState<Participant[]>(
    conversation?.participants || []
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EntityType>("client");

  // Przykładowe dane dla wyszukiwania
  const sampleData = {
    clients: [
      { id: "1", name: "Hotel Metropol" },
      { id: "2", name: "Biurowiec Gamma" },
      { id: "3", name: "Delta Office Park" },
      { id: "4", name: "ABC Sp. z o.o." },
    ],
    equipment: [
      { id: "1", name: "Klimatyzator ścienny Daikin FTXM35R" },
      { id: "2", name: "Centrala wentylacyjna Klimor KCX" },
      { id: "3", name: "Agregat chłodniczy Carrier 30RB" },
    ],
    projects: [
      { id: "1", name: "Modernizacja wentylacji - etap 1" },
      { id: "2", name: "Wymiana klimatyzatorów - Hotel Metropol" },
    ],
    orders: [
      { id: "1", name: "ZL/2025/042" },
      { id: "2", name: "ZL/2025/036" },
      { id: "3", name: "ZL/2025/032" },
    ],
    users: [
      { id: "1", name: "Jan Kowalski", role: "technician" as const },
      { id: "2", name: "Anna Nowak", role: "office" as const },
      { id: "3", name: "Marek Wiśniewski", role: "manager" as const },
      { id: "4", name: "Adam Zieliński", role: "technician" as const },
    ]
  };

  // Dodawanie encji
  const addEntity = (entity: { id: string; name: string }) => {
    const newEntity: RelatedEntity = {
      id: entity.id,
      name: entity.name,
      type: activeTab
    };
    
    // Sprawdzenie, czy encja już istnieje
    if (!relatedEntities.some(e => e.id === entity.id && e.type === activeTab)) {
      setRelatedEntities(prev => [...prev, newEntity]);
    }
    
    setSearchOpen(false);
  };

  // Usuwanie encji
  const removeEntity = (id: string, type: EntityType) => {
    setRelatedEntities(prev => 
      prev.filter(entity => !(entity.id === id && entity.type === type))
    );
  };

  // Dodawanie uczestnika
  const addParticipant = (user: { id: string; name: string; role: Participant["role"] }) => {
    // Sprawdzenie, czy uczestnik już istnieje
    if (!participants.some(p => p.id === user.id)) {
      setParticipants(prev => [...prev, { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      }]);
    }
    
    setSearchOpen(false);
  };

  // Usuwanie uczestnika
  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(user => user.id !== id));
  };

  // Renderowanie ikony dla typu encji
  const renderEntityIcon = (type: EntityType) => {
    switch (type) {
      case "client":
        return <Building2 className="size-4 text-brand-blue" />;
      case "equipment":
        return <Wrench className="size-4 text-brand-orange" />;
      case "project":
        return <FileText className="size-4 text-brand-blue" />;
      case "order":
        return <FileText className="size-4 text-brand-orange" />;
    }
  };

  // Obsługa zapisu
  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title,
        relatedEntities,
        participants
      });
    }
  };

  // Wybór odpowiednich danych dla aktywnej zakładki
  const getTabData = () => {
    switch (activeTab) {
      case "client":
        return sampleData.clients;
      case "equipment":
        return sampleData.equipment;
      case "project":
        return sampleData.projects;
      case "order":
        return sampleData.orders;
    }
  };

  // Etykiety dla zakładek
  const getTabLabel = (type: EntityType) => {
    switch (type) {
      case "client":
        return "Klienci";
      case "equipment":
        return "Urządzenia";
      case "project":
        return "Inwestycje";
      case "order":
        return "Zlecenia";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {conversation ? "Edytuj konwersację" : "Nowa konwersacja"}
          </DialogTitle>
          <DialogDescription>
            {conversation 
              ? "Zmień szczegóły konwersacji, powiązania lub uczestników" 
              : "Utwórz nową konwersację, dodaj powiązania i uczestników"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Nazwa konwersacji</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Wprowadź nazwę konwersacji"
            />
          </div>

          <div className="space-y-2">
            <Label>Powiązane elementy</Label>
            <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
              {relatedEntities.map((entity) => (
                <Badge key={`${entity.type}-${entity.id}`} variant="outline" className="flex items-center gap-1 pr-1">
                  {renderEntityIcon(entity.type)}
                  <span>{entity.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 p-0 ml-1"
                    onClick={() => removeEntity(entity.id, entity.type)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
              
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 h-6">
                    <Plus className="size-3" />
                    <span>Dodaj</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Tabs defaultValue="client" value={activeTab} onValueChange={(value) => setActiveTab(value as EntityType)}>
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="client">Klienci</TabsTrigger>
                      <TabsTrigger value="equipment">Urządzenia</TabsTrigger>
                      <TabsTrigger value="project">Inwestycje</TabsTrigger>
                      <TabsTrigger value="order">Zlecenia</TabsTrigger>
                    </TabsList>
                    
                    <Command>
                      <CommandInput placeholder={`Wyszukaj ${getTabLabel(activeTab).toLowerCase()}...`} />
                      <CommandList>
                        <CommandEmpty>Nie znaleziono wyników</CommandEmpty>
                        <CommandGroup>
                          {getTabData().map((item) => (
                            <CommandItem 
                              key={item.id}
                              onSelect={() => addEntity(item)}
                              className="flex items-center gap-2"
                            >
                              {renderEntityIcon(activeTab)}
                              <span>{item.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </Tabs>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Uczestnicy</Label>
            <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
              {participants.map((user) => (
                <Badge 
                  key={user.id} 
                  variant="outline" 
                  className="flex items-center gap-1 pr-1"
                >
                  <Avatar className="size-4">
                    <AvatarFallback className={`text-[8px] ${
                      user.role === "technician" ? "bg-brand-blue text-white" : 
                      user.role === "office" ? "bg-brand-orange text-white" : 
                      "bg-purple-700 text-white"
                    }`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 p-0 ml-1"
                    onClick={() => removeParticipant(user.id)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 h-6">
                    <Plus className="size-3" />
                    <span>Dodaj</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Wyszukaj użytkownika..." />
                    <CommandList>
                      <CommandEmpty>Nie znaleziono użytkowników</CommandEmpty>
                      <CommandGroup>
                        {sampleData.users.map((user) => (
                          <CommandItem 
                            key={user.id}
                            onSelect={() => addParticipant(user)}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="size-6">
                              <AvatarFallback className={
                                user.role === "technician" ? "bg-brand-blue text-white" : 
                                user.role === "office" ? "bg-brand-orange text-white" : 
                                "bg-purple-700 text-white"
                              }>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.role === "technician" ? "Serwisant" : 
                                 user.role === "office" ? "Obsługa biura" : 
                                 "Manager"}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            {conversation ? "Zapisz zmiany" : "Utwórz konwersację"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}