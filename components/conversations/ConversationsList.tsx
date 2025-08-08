import React, { useState } from "react";
import { Search, Plus, Filter, User, Building2, FileText, Wrench, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Typy dla konwersacji
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

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  participants: Participant[];
  relatedEntities: RelatedEntity[];
}

export function ConversationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterOptions, setFilterOptions] = useState({
    onlyUnread: false,
    withClient: false,
    withEquipment: false,
    withProject: false,
    withOrder: false,
  });

  // Przykładowe dane konwersacji
  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Awaria klimatyzacji w sali konferencyjnej",
      lastMessage: "Proszę o pilną interwencję, temperatura w sali osiąga 30°C",
      lastMessageDate: "12.05.2025 10:23",
      unreadCount: 3,
      participants: [
        {
          id: "1",
          name: "Jan Kowalski",
          role: "technician"
        },
        {
          id: "2",
          name: "Anna Nowak",
          role: "office"
        }
      ],
      relatedEntities: [
        {
          id: "1",
          name: "Klimatyzator ścienny Daikin FTXM35R",
          type: "equipment"
        },
        {
          id: "2",
          name: "Hotel Metropol",
          type: "client"
        }
      ]
    },
    {
      id: "2",
      title: "Przegląd okresowy - Biurowiec Gamma",
      lastMessage: "Potwierdzam wizytę na 15.05.2025 o godz. 9:00",
      lastMessageDate: "11.05.2025 14:45",
      unreadCount: 0,
      participants: [
        {
          id: "1",
          name: "Jan Kowalski",
          role: "technician"
        },
        {
          id: "3",
          name: "Marek Wiśniewski",
          role: "manager"
        }
      ],
      relatedEntities: [
        {
          id: "3",
          name: "Biurowiec Gamma",
          type: "client"
        },
        {
          id: "4",
          name: "ZL/2025/036",
          type: "order"
        }
      ]
    },
    {
      id: "3",
      title: "Modernizacja systemu wentylacji - Delta Office Park",
      lastMessage: "Przesyłam specyfikację techniczną urządzeń, które planujemy zamontować",
      lastMessageDate: "10.05.2025 09:12",
      unreadCount: 1,
      participants: [
        {
          id: "4",
          name: "Adam Zieliński",
          role: "technician"
        },
        {
          id: "2",
          name: "Anna Nowak",
          role: "office"
        }
      ],
      relatedEntities: [
        {
          id: "5",
          name: "Delta Office Park",
          type: "client"
        },
        {
          id: "6",
          name: "Modernizacja wentylacji - etap 1",
          type: "project"
        }
      ]
    }
  ];

  // Funkcje filtrowania i sortowania
  const filteredConversations = conversations
    .filter(conv => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = conv.title.toLowerCase().includes(query);
        const matchesEntity = conv.relatedEntities.some(entity => entity.name.toLowerCase().includes(query));
        const matchesParticipant = conv.participants.some(part => part.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesEntity && !matchesParticipant) return false;
      }

      if (filterOptions.onlyUnread && conv.unreadCount === 0) return false;
      
      if (
        (filterOptions.withClient && !conv.relatedEntities.some(e => e.type === "client")) ||
        (filterOptions.withEquipment && !conv.relatedEntities.some(e => e.type === "equipment")) ||
        (filterOptions.withProject && !conv.relatedEntities.some(e => e.type === "project")) ||
        (filterOptions.withOrder && !conv.relatedEntities.some(e => e.type === "order"))
      ) {
        // Jeśli filtry są aktywne i konwersacja nie ma wymaganych powiązań
        if (filterOptions.withClient || filterOptions.withEquipment || filterOptions.withProject || filterOptions.withOrder) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.lastMessageDate.split(' ')[0].split('.').reverse().join('-'));
      const dateB = new Date(b.lastMessageDate.split(' ')[0].split('.').reverse().join('-'));
      return sortOrder === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

  // Obsługa zmian filtrów
  const handleFilterChange = (key: keyof typeof filterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Obsługa sortowania
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  // Przekierowanie do widoku konwersacji - używamy hash navigation
  const navigateToConversation = (id: string) => {
    window.location.hash = `konwersacje/${id}`;
  };

  // Tworzenie nowej konwersacji - używamy hash navigation
  const createNewConversation = () => {
    window.location.hash = "konwersacje/nowa";
  };

  // Funkcja renderująca ikony dla powiązanych encji
  const renderEntityIcon = (type: EntityType) => {
    switch (type) {
      case "client":
        return <Building2 className="icon-md text-brand-blue" />;
      case "equipment":
        return <Wrench className="icon-md text-brand-orange" />;
      case "project":
        return <FileText className="icon-md text-brand-blue" />;
      case "order":
        return <FileText className="icon-md text-brand-orange" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <h1 className="text-2xl">Konwersacje</h1>
        <Button onClick={createNewConversation} className="gap-3 bg-brand-blue hover:bg-brand-blue/90 py-3 px-5">
          <Plus className="icon-md" />
          <span>Nowa konwersacja</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 icon-md text-muted-foreground" />
          <Input
            placeholder="Szukaj konwersacji, osób, urządzeń..."
            className="pl-12 py-3 text-base h-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-3 py-3 px-5">
                <Filter className="icon-md" />
                <span className="hidden sm:inline">Filtruj</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-5">
              <div className="space-y-5">
                <h4 className="font-medium text-lg">Filtry</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="onlyUnread" 
                      className="size-5"
                      checked={filterOptions.onlyUnread}
                      onCheckedChange={() => handleFilterChange("onlyUnread")}
                    />
                    <Label htmlFor="onlyUnread" className="text-base">Tylko nieprzeczytane</Label>
                  </div>
                  <h4 className="text-base font-medium pt-3 pb-1">Powiązane z:</h4>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="withClient" 
                      className="size-5"
                      checked={filterOptions.withClient}
                      onCheckedChange={() => handleFilterChange("withClient")}
                    />
                    <Label htmlFor="withClient" className="text-base">Klientem</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="withEquipment" 
                      className="size-5"
                      checked={filterOptions.withEquipment}
                      onCheckedChange={() => handleFilterChange("withEquipment")}
                    />
                    <Label htmlFor="withEquipment" className="text-base">Urządzeniem</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="withProject" 
                      className="size-5"
                      checked={filterOptions.withProject}
                      onCheckedChange={() => handleFilterChange("withProject")}
                    />
                    <Label htmlFor="withProject" className="text-base">Inwestycją</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="withOrder" 
                      className="size-5"
                      checked={filterOptions.withOrder}
                      onCheckedChange={() => handleFilterChange("withOrder")}
                    />
                    <Label htmlFor="withOrder" className="text-base">Zleceniem</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={toggleSortOrder} className="gap-3 py-3 px-5">
            {sortOrder === "newest" ? (
              <ArrowDown className="icon-md" />
            ) : (
              <ArrowUp className="icon-md" />
            )}
            <span className="hidden sm:inline">
              {sortOrder === "newest" ? "Najnowsze" : "Najstarsze"}
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-lg">
            Nie znaleziono konwersacji spełniających kryteria wyszukiwania
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className={`cursor-pointer hover:bg-muted/40 transition-colors ${conversation.unreadCount > 0 ? 'border-l-4 border-l-brand-orange' : ''}`}
              onClick={() => navigateToConversation(conversation.id)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{conversation.title}</h3>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-3">
                      {conversation.lastMessageDate}
                    </span>
                  </div>
                  
                  <p className="text-base line-clamp-1 text-muted-foreground">
                    {conversation.lastMessage}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {conversation.relatedEntities.map((entity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-2 px-3 py-1.5 text-base">
                        {renderEntityIcon(entity.type)}
                        <span>{entity.name}</span>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-1">
                    <div className="flex -space-x-3">
                      {conversation.participants.map((participant, index) => (
                        <Avatar key={index} className="size-8 border-2 border-background">
                          <AvatarFallback className={`
                            text-xs
                            ${participant.role === "technician" ? "bg-brand-blue text-white" : 
                              participant.role === "office" ? "bg-brand-orange text-white" : 
                              "bg-muted text-muted-foreground"}
                          `}>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-brand-orange px-3 py-1 text-base">{conversation.unreadCount}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}