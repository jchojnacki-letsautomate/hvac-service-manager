import React from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { FileText, Image, Paperclip, Download, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface MessageAttachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "doc" | "audio" | "other";
  url: string;
  thumbnailUrl?: string;
  size?: string;
}

export interface MessageProps {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: "technician" | "office" | "manager" | "system";
  };
  attachments?: MessageAttachment[];
  isCurrentUser?: boolean;
}

export function ConversationMessage({
  content,
  timestamp,
  sender,
  attachments = [],
  isCurrentUser = false,
}: MessageProps) {
  
  // Formatowanie daty
  const messageDate = format(timestamp, "dd MMM yyyy, HH:mm", { locale: pl });
  
  // Określanie koloru tła na podstawie roli
  const getRoleColor = () => {
    switch (sender.role) {
      case "technician":
        return "bg-brand-blue text-white";
      case "office":
        return "bg-brand-orange text-white";
      case "manager":
        return "bg-purple-700 text-white";
      case "system":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Wybór ikony na podstawie typu załącznika
  const getAttachmentIcon = (type: MessageAttachment["type"]) => {
    switch (type) {
      case "image":
        return <Image className="size-4" />;
      case "pdf":
        return <FileText className="size-4" />;
      case "doc":
        return <FileText className="size-4" />;
      case "audio":
        return <Mic className="size-4" />;
      default:
        return <Paperclip className="size-4" />;
    }
  };

  // Renderowanie zawartości załącznika na podstawie jego typu
  const renderAttachmentContent = (attachment: MessageAttachment) => {
    if (attachment.type === "image") {
      return (
        <div className="relative">
          <ImageWithFallback 
            src={attachment.thumbnailUrl || attachment.url} 
            alt={attachment.name}
            width={200}
            height={150}
            className="object-cover max-h-[150px] w-auto"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <Button variant="ghost" size="icon" className="text-white" asChild>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                <Download className="size-5" />
              </a>
            </Button>
          </div>
        </div>
      );
    } else if (attachment.type === "audio") {
      return (
        <div className="p-2 w-full">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-brand-orange bg-opacity-20 rounded-md p-2">
              <Mic className="size-4 text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Nagranie głosowe</p>
              {attachment.size && (
                <p className="text-xs text-muted-foreground">{attachment.size}</p>
              )}
            </div>
          </div>
          <audio controls className="w-full mt-1 h-8">
            <source src={attachment.url} type="audio/webm" />
            Twoja przeglądarka nie obsługuje elementu audio.
          </audio>
        </div>
      );
    } else {
      return (
        <div className="flex items-center p-2 gap-2">
          <div className="bg-muted rounded-md p-2">
            {getAttachmentIcon(attachment.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.name}</p>
            {attachment.size && (
              <p className="text-xs text-muted-foreground">{attachment.size}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
              <Download className="size-4" />
            </a>
          </Button>
        </div>
      );
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} max-w-[85%] gap-3`}>
        <Avatar className="size-8 mt-1">
          {sender.avatar ? (
            <AvatarImage src={sender.avatar} alt={sender.name} />
          ) : (
            <AvatarFallback className={getRoleColor()}>
              {sender.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{sender.name}</span>
            <span className="text-xs text-muted-foreground">{messageDate}</span>
          </div>
          
          <div className={`
            rounded-lg px-4 py-2 max-w-full break-words
            ${isCurrentUser 
              ? "bg-brand-blue text-white rounded-tr-none" 
              : "bg-muted rounded-tl-none"}
          `}>
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
          
          {/* Rendering attachments */}
          {attachments.length > 0 && (
            <div className={`mt-2 flex flex-wrap gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {attachments.map((attachment) => (
                <Card key={attachment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {renderAttachmentContent(attachment)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}