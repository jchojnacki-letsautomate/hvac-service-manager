import React, { useState, useRef } from "react";
import { Send, Paperclip, Mic, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent } from "../ui/card";
import { MessageAttachment } from "./ConversationMessage";
import { VoiceRecorder } from "./VoiceRecorder";

interface ConversationReplyFormProps {
  onSendMessage: (content: string, attachments: File[], audioBlob?: Blob) => void;
  loading?: boolean;
}

export function ConversationReplyForm({ onSendMessage, loading = false }: ConversationReplyFormProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obsługa wysyłania formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() || attachments.length > 0 || audioBlob) {
      onSendMessage(message, attachments, audioBlob || undefined);
      setMessage("");
      setAttachments([]);
      setPreviews([]);
      setAudioBlob(null);
      setShowVoiceRecorder(false);
    }
  };

  // Obsługa zmiany przycisku załącznika
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Tworzenie URL dla podglądu obrazów
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Usuwanie załącznika
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    
    // Zwalnianie URL dla podglądu
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Określanie typu pliku
  const getFileType = (file: File): MessageAttachment["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.includes("word") || file.type.includes("document")) return "doc";
    if (file.type.includes("audio/")) return "audio";
    return "other";
  };

  // Formatowanie rozmiaru pliku
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Obsługa zakończenia nagrywania głosowego
  const handleVoiceRecordingComplete = (audioBlob: Blob, transcription: string) => {
    setAudioBlob(audioBlob);
    setMessage(prev => (prev ? `${prev} ${transcription}` : transcription));
    setShowVoiceRecorder(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
      {/* Komponet nagrywania głosu */}
      {showVoiceRecorder && (
        <div className="mb-4">
          <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
        </div>
      )}
      
      {/* Podgląd załączników */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {attachments.map((file, index) => (
            <Card key={index} className="relative overflow-hidden">
              <Button 
                type="button"
                variant="destructive" 
                size="icon" 
                className="absolute top-1 right-1 size-5 z-10 rounded-full p-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="size-3" />
              </Button>
              
              <CardContent className="p-0">
                {getFileType(file) === "image" ? (
                  <div className="relative w-[100px] h-[80px]">
                    <ImageWithFallback 
                      src={previews[index]} 
                      alt={file.name}
                      width={100}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="p-2 w-[120px]">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Podgląd nagrania głosowego */}
      {audioBlob && (
        <div className="mb-4">
          <Card className="relative p-2">
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 size-5 z-10 rounded-full p-0"
              onClick={() => setAudioBlob(null)}
            >
              <X className="size-3" />
            </Button>
            
            <div className="pl-2 pr-6">
              <p className="text-sm font-medium">Nagranie głosowe</p>
              <audio controls className="w-full mt-1 h-8">
                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                Twoja przeglądarka nie obsługuje elementu audio.
              </audio>
            </div>
          </Card>
        </div>
      )}
      
      <div className="flex gap-2">
        <Textarea
          placeholder="Napisz wiadomość..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
          rows={2}
        />
        
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.mp3,.wav,.ogg"
          />
          
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-4" />
          </Button>
          
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={() => setShowVoiceRecorder(prev => !prev)}
            className={showVoiceRecorder ? "bg-muted" : ""}
          >
            <Mic className="size-4" />
          </Button>
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || (!message.trim() && attachments.length === 0 && !audioBlob)}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}