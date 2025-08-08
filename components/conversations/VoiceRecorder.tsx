import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcription: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Czyszczenie timeoutów i zasobów po odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  // Rozpoczęcie nagrywania
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Uruchomienie timera do śledzenia czasu nagrywania
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Po 2 minutach automatycznie zatrzymaj nagrywanie
          if (newTime >= 120) {
            stopRecording();
          }
          // Aktualizuj postęp (maksymalnie 120 sekund)
          setRecordingProgress(Math.min((newTime / 120) * 100, 100));
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Błąd podczas uruchamiania nagrywania:", error);
      alert("Nie udało się uzyskać dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki.");
    }
  };

  // Zatrzymanie nagrywania
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Zatrzymanie wszystkich ścieżek audio w strumieniu
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    }
  };

  // Obsługa zatrzymania nagrywania i przetwarzanie pliku audio
  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    if (audioBlob.size > 0) {
      setIsTranscribing(true);
      
      // W rzeczywistej aplikacji tutaj byłoby wysłanie pliku do API transkrypcji
      // Symulacja procesu transkrypcji
      setTimeout(() => {
        // Przykładowa transkrypcja - w rzeczywistej aplikacji pochodziłaby z API
        const mockTranscription = "To jest przykładowa transkrypcja nagranej wiadomości głosowej. W rzeczywistej aplikacji tekst byłby wynikiem przetworzenia nagrania przez API rozpoznawania mowy.";
        
        onRecordingComplete(audioBlob, mockTranscription);
        setIsTranscribing(false);
        setRecordingProgress(0);
      }, 2000);
    }
  };

  // Formatowanie czasu nagrywania
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-3 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        {!isRecording && !isTranscribing && (
          <Button 
            onClick={startRecording} 
            className="bg-brand-orange hover:bg-brand-orange/90 w-full flex gap-2"
          >
            <Mic className="size-4" />
            Nagraj wiadomość głosową
          </Button>
        )}
        
        {isRecording && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-500">Nagrywanie...</p>
              <p className="text-sm">{formatTime(recordingTime)}</p>
            </div>
            
            <Progress value={recordingProgress} className="h-2" />
            
            <Button 
              onClick={stopRecording} 
              variant="destructive" 
              className="w-full flex gap-2"
            >
              <Square className="size-4" />
              Zatrzymaj nagrywanie
            </Button>
          </div>
        )}
        
        {isTranscribing && (
          <div className="w-full text-center py-2">
            <Loader2 className="size-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Przetwarzanie nagrania...</p>
          </div>
        )}
      </div>
    </Card>
  );
}