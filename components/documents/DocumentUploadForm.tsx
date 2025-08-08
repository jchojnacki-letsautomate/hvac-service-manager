import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Upload, X, FileText, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// import { useNavigate } from "react-router-dom"; // Removed - using hash routing
import { Switch } from "../ui/switch";

export function DocumentUploadForm() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [useOcr, setUseOcr] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // const navigate = useNavigate(); // Removed - using hash routing

  // Mock clients data
  const clients = [
    { id: "1", name: "Biurowiec Gamma" },
    { id: "2", name: "Hotel Metropol" },
    { id: "3", name: "ABC Sp. z o.o." },
    { id: "4", name: "Delta Office Park" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      
      // Create preview for the first file
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs or other documents, use a generic preview
        setFilePreview("/docs/generic-document-preview.jpg");
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    if (newFiles.length === 0) {
      setFilePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert("Dokument został przesłany i jest przetwarzany.");
      window.location.hash = "#/dokumenty";
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => window.location.hash = "#/dokumenty"}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1>Dodaj nowy dokument</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dane dokumentu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Typ dokumentu</Label>
                <Select value={documentType} onValueChange={setDocumentType} required>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Wybierz typ dokumentu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Faktura</SelectItem>
                    <SelectItem value="protocol">Protokół serwisowy</SelectItem>
                    <SelectItem value="installation">Protokół montażowy</SelectItem>
                    <SelectItem value="other">Inny dokument</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Klient</Label>
                <Select value={clientId} onValueChange={setClientId} required>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Wybierz klienta" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Numer dokumentu</Label>
                <Input 
                  id="documentNumber" 
                  placeholder="np. FV/2025/123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentDate">Data dokumentu</Label>
                <Input 
                  id="documentDate" 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Uwagi</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Dodatkowe informacje o dokumencie"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="useOcr" checked={useOcr} onCheckedChange={setUseOcr} />
                <Label htmlFor="useOcr" className="text-sm cursor-pointer">
                  Automatycznie przetwarzaj dokument przez OCR
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pliki dokumentu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30">
                  <div className="space-y-2">
                    <FileText className="size-10 mx-auto text-muted-foreground" />
                    <div className="space-y-1">
                      <p>Przeciągnij plik lub</p>
                      <div>
                        <Label htmlFor="file-upload" className="inline-block">
                          <Button 
                            variant="outline" 
                            className="cursor-pointer" 
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Wybierz plik
                          </Button>
                          <Input 
                            id="file-upload" 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.png,.jpg,.jpeg" 
                            multiple
                            onChange={handleFileChange}
                          />
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Obsługiwane formaty: PDF, JPG, PNG (max 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <Label>Przesłane pliki</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-background rounded-md border p-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="size-4 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            type="button"
                            onClick={() => removeFile(index)}
                          >
                            <X className="size-4" />
                            <span className="sr-only">Usuń</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {filePreview && (
              <Card>
                <CardHeader>
                  <CardTitle>Podgląd</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <ImageWithFallback
                      src={filePreview}
                      alt="Podgląd dokumentu"
                      width={300}
                      height={400}
                      className="w-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button 
            variant="outline" 
            type="button" 
                          onClick={() => window.location.hash = "#/dokumenty"}
          >
            Anuluj
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || uploadedFiles.length === 0} 
            className="gap-2"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wysyłanie...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Wyślij dokument
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}