import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Info, 
  Edit, 
  Building2, 
  Wrench, 
  FileText,
  User,
  Send,
  Image as ImageIcon,
  Paperclip,
  Settings,
  UserCircle,
  Calendar,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Bell,
  Eye,
  MessageSquare
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../ui/card";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ConversationMessage, MessageAttachment, MessageProps } from "./ConversationMessage";
import { ConversationReplyForm } from "./ConversationReplyForm";
import { ConversationEditDialog } from "./ConversationEditDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

// Typy dla konwersacji
type EntityType = "client" | "equipment" | "project" | "order";
type ConversationStatus = "active" | "pending" | "closed";

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
  status?: "online" | "offline" | "away";
  lastActive?: Date;
}

interface Conversation {
  id: string;
  title: string;
  relatedEntities: RelatedEntity[];
  participants: Participant[];
  messages: MessageProps[];
  status?: ConversationStatus;
  createdAt?: Date;
  lastActivity?: Date;
  priority?: "normal" | "high" | "urgent";
}

interface ConversationDetailsProps {
  conversationId?: string;
  isNew?: boolean;
}

export function ConversationDetails({ conversationId, isNew = false }: ConversationDetailsProps) {
  // Extract ID from hash if not provided as prop
  const getCurrentId = () => {
    if (conversationId) return conversationId;
    const hash = window.location.hash.substring(1);
    const parts = hash.split('/');
    if (parts[1] === 'nowa') return 'nowa';
    return parts[2] || '';
  };

  const id = getCurrentId();
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    entities: true,
    participants: true,
    details: true
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Przykładowe dane konwersacji z dodatkową metadatą
  const mockConversations: Record<string, Conversation> = {
    "1": {
      id: "1",
      title: "Awaria klimatyzacji w sali konferencyjnej",
      status: "active",
      priority: "high",
      createdAt: new Date("2025-05-12T09:55:00"),
      lastActivity: new Date("2025-05-12T10:23:00"),
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
      ],
      participants: [
        {
          id: "1",
          name: "Jan Kowalski",
          role: "technician",
          status: "online",
          lastActive: new Date("2025-05-14T09:35:00")
        },
        {
          id: "2",
          name: "Anna Nowak",
          role: "office",
          status: "online",
          lastActive: new Date("2025-05-14T09:42:00")
        }
      ],
      messages: [
        {
          id: "1",
          content: "Dzień dobry, zgłaszam awarię klimatyzatora w sali konferencyjnej. Urządzenie nie chłodzi, a temperatura w pomieszczeniu osiąga 30°C.",
          timestamp: new Date("2025-05-12T10:00:00"),
          sender: {
            id: "2",
            name: "Anna Nowak",
            role: "office"
          },
          attachments: []
        },
        {
          id: "2",
          content: "Dzień dobry, przyjąłem zgłoszenie. Czy mogą Państwo podać dokładny model urządzenia?",
          timestamp: new Date("2025-05-12T10:05:00"),
          sender: {
            id: "1",
            name: "Jan Kowalski",
            role: "technician"
          },
          attachments: []
        },
        {
          id: "3",
          content: "To Daikin FTXM35R, numer seryjny AB12345678. Załączam zdjęcie wyświetlacza, który pokazuje kod błędu E4.",
          timestamp: new Date("2025-05-12T10:10:00"),
          sender: {
            id: "2",
            name: "Anna Nowak",
            role: "office"
          },
          attachments: [
            {
              id: "1",
              name: "klimatyzator_blad.jpg",
              type: "image",
              url: "/images/error-code.jpg",
              thumbnailUrl: "/images/error-code.jpg"
            }
          ]
        },
        {
          id: "4",
          content: "Dziękuję za informacje. Kod E4 wskazuje na problem z czujnikiem temperatury. Wysyłamy serwisanta jeszcze dziś. Proszę o potwierdzenie dostępności w godzinach 14:00-16:00.",
          timestamp: new Date("2025-05-12T10:15:00"),
          sender: {
            id: "1",
            name: "Jan Kowalski",
            role: "technician"
          },
          attachments: []
        },
        {
          id: "5",
          content: "Potwierdzam dostępność w podanych godzinach. Proszę o kontakt z recepcją po przybyciu.",
          timestamp: new Date("2025-05-12T10:20:00"),
          sender: {
            id: "2",
            name: "Anna Nowak",
            role: "office"
          },
          attachments: []
        }
      ]
    },
    "2": {
      id: "2",
      title: "Przegląd okresowy - Biurowiec Gamma",
      status: "pending",
      priority: "normal",
      createdAt: new Date("2025-05-11T08:55:00"),
      lastActivity: new Date("2025-05-11T14:45:00"),
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
      ],
      participants: [
        {
          id: "1",
          name: "Jan Kowalski",
          role: "technician",
          status: "online",
          lastActive: new Date("2025-05-14T09:35:00")
        },
        {
          id: "3",
          name: "Marek Wiśniewski",
          role: "manager",
          status: "away",
          lastActive: new Date("2025-05-14T08:22:00")
        }
      ],
      messages: [
        {
          id: "1",
          content: "Dzień dobry, przypominam o zaplanowanym przeglądzie okresowym klimatyzacji w Biurowcu Gamma.",
          timestamp: new Date("2025-05-11T09:00:00"),
          sender: {
            id: "3",
            name: "Marek Wiśniewski",
            role: "manager"
          },
          attachments: []
        },
        {
          id: "2",
          content: "Dzień dobry, tak, przegląd jest zaplanowany na 15.05.2025. Czy jest możliwość przesunięcia na godzinę 9:00 zamiast 11:00?",
          timestamp: new Date("2025-05-11T09:10:00"),
          sender: {
            id: "1",
            name: "Jan Kowalski",
            role: "technician"
          },
          attachments: []
        },
        {
          id: "3",
          content: "Tak, godzina 9:00 jest odpowiednia. Przypominam, że w ramach przeglądu należy sprawdzić wszystkie jednostki na piętrach 3-5.",
          timestamp: new Date("2025-05-11T09:15:00"),
          sender: {
            id: "3",
            name: "Marek Wiśniewski",
            role: "manager"
          },
          attachments: [
            {
              id: "1",
              name: "lista_urzadzen.pdf",
              type: "pdf",
              url: "#",
              size: "235 KB"
            }
          ]
        },
        {
          id: "4",
          content: "Przyjąłem. Będę na miejscu o 9:00 i zrealizuję przegląd zgodnie z listą. Czy są jakieś szczególne uwagi dotyczące któregoś z urządzeń?",
          timestamp: new Date("2025-05-11T14:30:00"),
          sender: {
            id: "1",
            name: "Jan Kowalski",
            role: "technician"
          },
          attachments: []
        },
        {
          id: "5",
          content: "Na 4 piętrze w pokoju 405 użytkownicy zgłaszali, że jednostka może być głośniejsza niż zwykle. Proszę o szczególną uwagę przy tym urządzeniu.",
          timestamp: new Date("2025-05-11T14:45:00"),
          sender: {
            id: "3",
            name: "Marek Wiśniewski",
            role: "manager"
          },
          attachments: []
        }
      ]
    }
  };

  // Navigation function using hash
  const navigateToConversations = () => {
    window.location.hash = "konwersacje";
  };

  // Pobranie danych konwersacji
  useEffect(() => {
    if (id) {
      // W rzeczywistej aplikacji tutaj byłoby zapytanie do API
      const conversationData = mockConversations[id];
      if (conversationData) {
        setConversation(conversationData);
      } else if (id === "nowa" || isNew) {
        // Nowa konwersacja
        setEditDialogOpen(true);
      } else {
        // Konwersacja nie istnieje
        navigateToConversations();
      }
    }
  }, [id, isNew]);

  // Przewijanie na koniec listy wiadomości po załadowaniu i dodaniu nowej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  // Obsługa wysyłania wiadomości
  const handleSendMessage = (content: string, files: File[], audioBlob?: Blob) => {
    if (!conversation) return;
    
    setLoading(true);
    
    // Symulacja wysyłania wiadomości
    setTimeout(() => {
      let allAttachments: MessageAttachment[] = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : 
              file.type === "application/pdf" ? "pdf" : 
              file.type.includes("word") ? "doc" : "other",
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        size: formatFileSize(file.size)
      }));
      
      // Dodanie nagrania głosowego do załączników, jeśli istnieje
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        allAttachments.push({
          id: `audio-${Date.now()}`,
          name: "Nagranie głosowe.webm",
          type: "audio",
          url: audioUrl,
          size: formatFileSize(audioBlob.size)
        });
      }
      
      const newMessage: MessageProps = {
        id: `new-${Date.now()}`,
        content,
        timestamp: new Date(),
        sender: {
          id: "1", // Zakładamy, że to aktualny użytkownik (Jan Kowalski)
          name: "Jan Kowalski",
          role: "technician"
        },
        attachments: allAttachments,
        isCurrentUser: true
      };
      
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastActivity: new Date()
        };
      });
      
      setLoading(false);
    }, 1000);
  };

  // Formatowanie rozmiaru pliku
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Obsługa edycji konwersacji
  const handleSaveConversation = (data: {
    title: string;
    relatedEntities: RelatedEntity[];
    participants: Participant[];
  }) => {
    if (id === "nowa" || isNew) {
      // Utworzenie nowej konwersacji
      const newId = `new-${Date.now()}`;
      const newConversation: Conversation = {
        id: newId,
        title: data.title,
        relatedEntities: data.relatedEntities,
        participants: data.participants,
        status: "active",
        priority: "normal",
        createdAt: new Date(),
        lastActivity: new Date(),
        messages: [
          {
            id: `${newId}-system-1`,
            content: "Konwersacja została utworzona",
            timestamp: new Date(),
            sender: {
              id: "system",
              name: "System",
              role: "office"
            },
            attachments: []
          }
        ]
      };
      
      // W rzeczywistej aplikacji wysłalibyśmy nową konwersację do API
      // Tutaj symulujemy przekierowanie do nowej konwersacji
      mockConversations[newId] = newConversation;
      setConversation(newConversation);
      window.location.hash = `konwersacje/${newId}`;
    } else if (conversation) {
      // Aktualizacja istniejącej konwersacji
      setConversation({
        ...conversation,
        title: data.title,
        relatedEntities: data.relatedEntities,
        participants: data.participants,
        lastActivity: new Date()
      });
    }
    
    setEditDialogOpen(false);
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

  // Funkcja zwracająca klasę dla określenia statusu konwersacji
  const getStatusClasses = (status?: ConversationStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "closed":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // Etykieta statusu konwersacji
  const getStatusLabel = (status?: ConversationStatus) => {
    switch (status) {
      case "active":
        return "Aktywna";
      case "pending":
        return "Oczekująca";
      case "closed":
        return "Zakończona";
      default:
        return "Nieokreślony";
    }
  };

  // Funkcja zwracająca klasę dla określenia priorytetu konwersacji
  const getPriorityClasses = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-orange-100 text-orange-700";
      case "urgent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // Formatowanie daty w czytelny sposób
  const formatDate = (date?: Date) => {
    if (!date) return "Brak daty";
    return format(date, "dd MMM yyyy, HH:mm", { locale: pl });
  };

  // Obsługa zwijania/rozwijania sekcji
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Status uczestnika
  const renderParticipantStatus = (status?: string) => {
    switch (status) {
      case "online":
        return <span className="block w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 border border-white"></span>;
      case "away":
        return <span className="block w-2 h-2 rounded-full bg-amber-500 absolute bottom-0 right-0 border border-white"></span>;
      default:
        return <span className="block w-2 h-2 rounded-full bg-gray-400 absolute bottom-0 right-0 border border-white"></span>;
    }
  };

  const conversationStatusBadge = conversation?.status && (
    <Badge className={getStatusClasses(conversation.status)}>
      {getStatusLabel(conversation.status)}
    </Badge>
  );

  const conversationPriorityBadge = conversation?.priority && (
    <Badge className={getPriorityClasses(conversation.priority)}>
      {conversation.priority === "high" ? "Wysoki priorytet" : 
       conversation.priority === "urgent" ? "Pilne" : "Normalny"}
    </Badge>
  );

  if (!conversation && id !== "nowa" && !isNew) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Ładowanie konwersacji...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      {/* Nagłówek */}
      <div className="flex flex-col border-b">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 py-3 px-4">
          <Button variant="ghost" size="icon" onClick={navigateToConversations} className="flex-shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
          
          <div className="flex-grow min-w-0 order-1 md:order-none w-full md:w-auto">
            <h2 className="font-medium">{id === "nowa" || isNew ? "Nowa konwersacja" : conversation?.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
              <div className="flex flex-wrap items-center gap-2">
                {conversationStatusBadge}
                {conversationPriorityBadge}
              </div>
              {conversation?.lastActivity && (
                <span className="text-xs whitespace-nowrap mr-1">
                  Ostatnia aktywność: {formatDate(conversation.lastActivity)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 flex-shrink-0 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setInfoSidebarOpen(!infoSidebarOpen)}
            >
              <Info className="size-4" />
              <span className="hidden sm:inline">Informacje</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="size-4" />
              <span className="hidden sm:inline">Edytuj</span>
            </Button>
          </div>
        </div>
        
        {/* Pasek uczestników */}
        <div className="px-4 py-3 border-t border-border/50 w-full overflow-visible bg-muted/10">
          <div className="flex flex-wrap items-center gap-3 w-full scrollbar-thin">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0 whitespace-nowrap">
              <UserCircle className="size-4" />
              <span className="font-medium">Uczestnicy:</span>
            </div>
            <div className="flex flex-wrap gap-2.5 py-0.5">
              {conversation?.participants.map((participant, index) => (
                <TooltipProvider key={participant.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative cursor-pointer">
                        <Avatar className="size-8 border-2 border-background">
                          <AvatarFallback className={
                            participant.role === "technician" ? "bg-brand-blue text-white" : 
                            participant.role === "office" ? "bg-brand-orange text-white" : 
                            "bg-purple-700 text-white"
                          }>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {renderParticipantStatus(participant.status)}
                        <span className="sr-only">{participant.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {participant.role === "technician" ? "Serwisant" : 
                           participant.role === "office" ? "Obsługa biura" : "Manager"}
                        </p>
                        {participant.lastActive && (
                          <p className="text-xs text-muted-foreground">
                            {participant.status === "online" ? "Online" : 
                             `Ostatnio aktywny: ${formatDate(participant.lastActive)}`}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {conversation?.participants.length === 0 && (
                <span className="text-sm text-muted-foreground">Brak uczestników</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Główna zawartość */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden transition-all duration-200">
        {/* Lista wiadomości */}
        <div className="flex-grow flex flex-col overflow-hidden order-2 lg:order-1">
          <ScrollArea className="flex-grow p-4">
            {conversation?.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <MessageSquare className="size-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">Brak wiadomości</h3>
                <p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-md">
                  Ta konwersacja została utworzona, ale nie zawiera jeszcze żadnych wiadomości. 
                  Rozpocznij rozmowę, wysyłając pierwszą wiadomość poniżej.
                </p>
              </div>
            ) : (
              <>
                {conversation?.messages.map((message) => (
                  <ConversationMessage
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    sender={message.sender}
                    attachments={message.attachments || []}
                    isCurrentUser={message.sender.id === "1"} // Zakładamy, że bieżący użytkownik to Jan Kowalski
                  />
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Formularz odpowiedzi */}
          <div className="p-4 bg-card border-t">
            <ConversationReplyForm 
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          </div>
        </div>
        
        {/* Sidebar z informacjami */}
        {infoSidebarOpen && (
          <div className="w-full lg:w-[384px] border-l border-t lg:border-t-0 overflow-y-auto flex flex-col gap-4 bg-background transition-all duration-200 order-1 lg:order-2">
            <ScrollArea className="flex-grow p-4 px-5">
              {/* Sekcja szczegółów konwersacji */}
              <Collapsible 
                open={expandedSections.details} 
                className="mb-4 border rounded-md bg-card"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <MessageSquare className="size-4 text-brand-blue" />
                      <span>Szczegóły konwersacji</span>
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      {expandedSections.details ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <Separator />
                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>Data utworzenia:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(conversation?.createdAt)}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>Ostatnia aktywność:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(conversation?.lastActivity)}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CheckCircle className="size-3.5" />
                        <span>Status:</span>
                      </div>
                      <div>
                        {conversationStatusBadge}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Bell className="size-3.5" />
                        <span>Priorytet:</span>
                      </div>
                      <div>
                        {conversationPriorityBadge}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageSquare className="size-3.5" />
                        <span>Liczba wiadomości:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {conversation?.messages.length || 0}
                      </div>
                    </div>

                    <div className="pt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 w-full"
                        onClick={() => setEditDialogOpen(true)}
                      >
                        <Edit className="size-3.5" />
                        <span>Edytuj konwersację</span>
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Sekcja powiązanych elementów */}
              <Collapsible 
                open={expandedSections.entities} 
                className="mb-4 border rounded-md bg-card"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <Globe className="size-4 text-brand-blue" />
                      <span>Powiązane elementy</span>
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      {expandedSections.entities ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <Separator />
                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    {conversation?.relatedEntities && conversation.relatedEntities.length > 0 ? (
                      <div className="space-y-2">
                        {conversation.relatedEntities.map((entity, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-md border hover:bg-muted/30 cursor-pointer transition-colors">
                            {renderEntityIcon(entity.type)}
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium truncate">{entity.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {entity.type === "client" ? "Klient" :
                                 entity.type === "equipment" ? "Urządzenie" :
                                 entity.type === "project" ? "Projekt" : "Zlecenie"}
                              </p>
                            </div>
                            <Eye className="size-3.5 text-muted-foreground flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Brak powiązanych elementów</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Sekcja uczestników */}
              <Collapsible 
                open={expandedSections.participants} 
                className="mb-4 border rounded-md bg-card"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="size-4 text-brand-blue" />
                      <span>Uczestnicy ({conversation?.participants.length || 0})</span>
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      {expandedSections.participants ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <Separator />
                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    {conversation?.participants && conversation.participants.length > 0 ? (
                      <div className="space-y-3">
                        {conversation.participants.map((participant, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="size-8">
                                <AvatarFallback className={
                                  participant.role === "technician" ? "bg-brand-blue text-white" : 
                                  participant.role === "office" ? "bg-brand-orange text-white" : 
                                  "bg-purple-700 text-white"
                                }>
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {renderParticipantStatus(participant.status)}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium">{participant.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {participant.role === "technician" ? "Serwisant" : 
                                 participant.role === "office" ? "Obsługa biura" : "Manager"}
                              </p>
                              {participant.lastActive && participant.status !== "online" && (
                                <p className="text-xs text-muted-foreground">
                                  Ostatnio aktywny: {formatDate(participant.lastActive)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Brak uczestników</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </ScrollArea>
          </div>
        )}
      </div>
      
      {/* Dialog edycji konwersacji */}
      <ConversationEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        conversation={conversation}
        onSave={handleSaveConversation}
      />
    </div>
  );
}