import { useState } from "react";
import { MessageSquare, Paperclip, Send, User, Image as ImageIcon, Wrench, Building2, File } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Message {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: "technician" | "office" | "customer";
  };
  content: string;
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    type: "image" | "document";
    url: string;
  }[];
}

export function ConversationExample() {
  const [newMessage, setNewMessage] = useState("");
  
  // Przykładowe dane konwersacji
  const conversation = {
    id: "CONV-123",
    title: "Awaria klimatyzacji w sali konferencyjnej",
    createdAt: "10.05.2025, 09:15",
    status: "active",
    relatedTo: {
      type: "equipment",
      id: "URZ-456",
      name: "Klimatyzator Daikin FTXS50G",
    },
    client: {
      id: "KL-789",
      name: "Softex S.A.",
    },
    serviceOrder: {
      id: "ZS-2023-00852",
      title: "Naprawa klimatyzacji"
    },
    participants: [
      { id: "USER-1", name: "Adam Nowak", role: "technician", avatar: "" },
      { id: "USER-2", name: "Anna Wiśniewska", role: "office", avatar: "" },
      { id: "USER-3", name: "Marek Kowalski", role: "customer", avatar: "" }
    ]
  };
  
  const messages: Message[] = [
    {
      id: "MSG-1",
      author: {
        id: "USER-3",
        name: "Marek Kowalski",
        role: "customer"
      },
      content: "Dzień dobry, klimatyzacja w sali konferencyjnej przestała działać. Wyświetla błąd E4. Czy mógłby ktoś przyjechać dziś i naprawić?",
      timestamp: "10.05.2025, 09:15"
    },
    {
      id: "MSG-2",
      author: {
        id: "USER-2",
        name: "Anna Wiśniewska",
        role: "office"
      },
      content: "Dzień dobry Panie Marku, dziękuję za zgłoszenie. Sprawdzam dostępność naszych techników i odezwę się z propozycją terminu.",
      timestamp: "10.05.2025, 09:22"
    },
    {
      id: "MSG-3",
      author: {
        id: "USER-3",
        name: "Marek Kowalski",
        role: "customer"
      },
      content: "Dodam jeszcze zdjęcie wyświetlacza z kodem błędu.",
      timestamp: "10.05.2025, 09:25"
    },
    {
      id: "MSG-4",
      author: {
        id: "USER-3",
        name: "Marek Kowalski",
        role: "customer"
      },
      content: "Oto zdjęcie panelu z błędem:",
      timestamp: "10.05.2025, 09:26",
      attachments: [
        {
          id: "ATT-1",
          name: "blad-klimatyzacji.jpg",
          type: "image",
          url: "https://images.unsplash.com/photo-1627916607164-7b20241db958?q=80&w=600&auto=format&fit=crop"
        }
      ]
    },
    {
      id: "MSG-5",
      author: {
        id: "USER-2",
        name: "Anna Wiśniewska",
        role: "office"
      },
      content: "Dziękuję za zdjęcie. Udało mi się znaleźć technika, który może przyjechać dziś o 14:30. Czy ten termin Panu odpowiada?",
      timestamp: "10.05.2025, 09:35"
    },
    {
      id: "MSG-6",
      author: {
        id: "USER-3",
        name: "Marek Kowalski",
        role: "customer"
      },
      content: "Tak, ten termin jest odpowiedni. Będę na miejscu.",
      timestamp: "10.05.2025, 09:40"
    },
    {
      id: "MSG-7",
      author: {
        id: "USER-2",
        name: "Anna Wiśniewska",
        role: "office"
      },
      content: "Świetnie, potwierdzam wizytę technika Adama Nowaka na godzinę 14:30. Przekazuję mu zgłoszenie i zdjęcie błędu do analizy.",
      timestamp: "10.05.2025, 09:42"
    },
    {
      id: "MSG-8",
      author: {
        id: "USER-1",
        name: "Adam Nowak",
        role: "technician"
      },
      content: "Dzień dobry. Potwierdzam wizytę o 14:30. Przeanalizowałem kod błędu E4 - to najprawdopodobniej problem z czujnikiem temperatury. Zabiorę ze sobą odpowiednie części zamienne.",
      timestamp: "10.05.2025, 10:15"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Tutaj byłaby logika wysyłania wiadomości do API
      setNewMessage("");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "technician": return "bg-brand-blue";
      case "office": return "bg-brand-orange";
      case "customer": return "bg-green-600";
      default: return "bg-gray-500";
    }
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case "technician": return "Technik";
      case "office": return "Biuro";
      case "customer": return "Klient";
      default: return role;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-2">
            <MessageSquare className="icon-balanced text-brand-blue" />
            Konwersacja
          </h1>
          <p className="text-muted-foreground">{conversation.title}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="button-balanced">
            Aktywna
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="md:col-span-7">
          <Card className="card-balanced overflow-hidden flex flex-col h-[600px]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Wiadomości</CardTitle>
                <Button variant="ghost" size="sm" className="button-balanced">
                  <Paperclip className="icon-balanced mr-2" />
                  Dodaj załącznik
                </Button>
              </div>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-3">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="mt-1">
                        <AvatarFallback className={getRoleColor(message.author.role)}>
                          {message.author.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.author.name}</span>
                          <Badge variant="outline" className="px-2 py-0 text-xs">
                            {getRoleName(message.author.role)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="rounded-md overflow-hidden">
                                {attachment.type === "image" ? (
                                  <div className="relative w-full max-w-sm rounded-md overflow-hidden border">
                                    <ImageWithFallback
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="w-full h-auto object-cover rounded-md"
                                      width={400}
                                      height={300}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex items-center">
                                      <ImageIcon className="icon-balanced mr-1" size={14} />
                                      {attachment.name}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 p-2 border rounded-md">
                                    <File className="icon-balanced text-muted-foreground" />
                                    <span className="text-sm">{attachment.name}</span>
                                    <Button variant="ghost" size="sm" className="ml-auto">
                                      Pobierz
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-3">
              <div className="flex items-center gap-2 w-full">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Wpisz wiadomość..."
                  className="min-h-10 flex-1"
                  rows={2}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="button-balanced h-10"
                >
                  <Send className="icon-balanced" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="card-balanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="icon-balanced text-brand-blue" />
                Uczestnicy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversation.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <Avatar className="size-larger">
                      <AvatarFallback className={getRoleColor(participant.role)}>
                        {participant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <Badge variant="outline" className="px-2 py-0 text-xs">
                        {getRoleName(participant.role)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-balanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="icon-balanced text-brand-blue" />
                Powiązane
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Zlecenie serwisowe</p>
                <p className="font-medium">{conversation.serviceOrder.id}</p>
                <p className="text-sm">{conversation.serviceOrder.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urządzenie</p>
                <p className="font-medium">{conversation.relatedTo.name}</p>
                <p className="text-sm">ID: {conversation.relatedTo.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Klient</p>
                <div className="flex items-center gap-2">
                  <Building2 className="icon-balanced text-muted-foreground" />
                  <p className="font-medium">{conversation.client.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}