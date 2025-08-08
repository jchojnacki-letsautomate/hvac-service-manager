
import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { 
  Camera, 
  File, 
  Upload, 
  Scan, 
  Check, 
  X, 
  Edit, 
  Receipt, 
  ShoppingBag, 
  Plus, 
  Trash 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Define types for the component
interface PurchaseInvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface PurchaseInvoice {
  id: string;
  supplier: string;
  invoiceNumber: string;
  date: string;
  items: PurchaseInvoiceItem[];
  total: number;
  imageUrl?: string;
}

interface PurchaseInvoiceOCRDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (invoice: PurchaseInvoice) => void;
}

export function PurchaseInvoiceOCRDialog({
  open,
  onClose,
  onSave
}: PurchaseInvoiceOCRDialogProps) {
  // State for managing the upload and OCR process
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("upload");
  const [processingStage, setProcessingStage] = useState<"upload" | "processing" | "review">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Invoice data state
  const [invoiceData, setInvoiceData] = useState<PurchaseInvoice>({
    id: "",
    supplier: "",
    invoiceNumber: "",
    date: new Date().toISOString().split('T')[0],
    items: [],
    total: 0
  });
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProcessingStage("processing");
    
    // Simulate OCR processing
    setIsProcessing(true);
    
    // In a real app, this would make an API call to an OCR service
    // For this example, we'll simulate the result after 2 seconds
    setTimeout(() => {
      // Mock OCR result
      const mockInvoice: PurchaseInvoice = {
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        supplier: "Hurtownia HVAC Sp. z o.o.",
        invoiceNumber: `FV/${Math.floor(Math.random() * 10000)}/2025`,
        date: new Date().toISOString().split('T')[0],
        items: [
          {
            id: "1",
            name: "Filtr do klimatyzatora DAIKIN",
            quantity: 2,
            unit: "szt.",
            price: 45.00
          },
          {
            id: "2",
            name: "Czynnik chłodniczy R32",
            quantity: 0.5,
            unit: "kg",
            price: 180.00
          }
        ],
        total: (2 * 45.00) + (0.5 * 180.00),
        imageUrl: url
      };
      
      setInvoiceData(mockInvoice);
      setIsProcessing(false);
      setProcessingStage("review");
    }, 2000);
  };
  
  // Handle camera capture
  const handleCameraCapture = () => {
    // This would integrate with the device camera
    // Since we can't access the camera in this environment, we'll simulate it
    fileInputRef.current?.click();
  };
  
  // Handle adding a new item to the invoice
  const handleAddItem = () => {
    const newItem: PurchaseInvoiceItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "szt.",
      price: 0
    };
    
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };
  
  // Handle removing an item from the invoice
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== itemId);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      total: newTotal
    });
  };
  
  // Handle updating an item in the invoice
  const handleUpdateItem = (
    itemId: string, 
    field: keyof PurchaseInvoiceItem, 
    value: string | number
  ) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      total: newTotal
    });
  };
  
  // Handle updating invoice metadata
  const handleUpdateInvoiceData = (field: keyof PurchaseInvoice, value: string) => {
    setInvoiceData({
      ...invoiceData,
      [field]: value
    });
  };
  
  // Handle saving the invoice
  const handleSave = () => {
    onSave(invoiceData);
    resetState();
    onClose();
  };
  
  // Reset the component state
  const resetState = () => {
    setActiveTab("upload");
    setProcessingStage("upload");
    setPreviewUrl(null);
    setIsProcessing(false);
    setInvoiceData({
      id: "",
      supplier: "",
      invoiceNumber: "",
      date: new Date().toISOString().split('T')[0],
      items: [],
      total: 0
    });
  };
  
  // Cancel and close the dialog
  const handleCancel = () => {
    resetState();
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-orange" />
            Dodaj fakturę zakupową
          </DialogTitle>
          <DialogDescription>
            Zeskanuj lub wgraj fakturę zakupową, aby dodać części do zlecenia. System automatycznie rozpozna pozycje z faktury.
          </DialogDescription>
        </DialogHeader>
        
        {processingStage === "upload" && (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "camera" | "upload")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="camera" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Aparat</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span>Z pliku</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="camera" className="pt-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 space-y-4">
                  <Camera className="h-16 w-16 text-muted-foreground/50" />
                  <div className="text-center">
                    <h3 className="font-medium">Zrób zdjęcie faktury</h3>
                    <p className="text-sm text-muted-foreground">Upewnij się, że faktura jest dobrze oświetlona i widoczna</p>
                  </div>
                  <Button 
                    onClick={handleCameraCapture}
                    className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                  >
                    <Camera className="h-4 w-4" />
                    Zrób zdjęcie
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="pt-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 space-y-4">
                  <Upload className="h-16 w-16 text-muted-foreground/50" />
                  <div className="text-center">
                    <h3 className="font-medium">Wgraj fakturę</h3>
                    <p className="text-sm text-muted-foreground">Obsługiwane formaty: JPG, PNG, PDF</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                  >
                    <Upload className="h-4 w-4" />
                    Wybierz plik
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {processingStage === "processing" && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden shadow-sm border">
              {previewUrl && (
                <div className="aspect-[3/4] w-full bg-muted-foreground/5 relative">
                  <img 
                    src={previewUrl}
                    alt="Invoice preview"
                    className="object-contain w-full h-full"
                  />
                  
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Scan className="h-10 w-10 text-brand-orange animate-pulse mb-4" />
                      <h3 className="font-medium">Przetwarzanie dokumentu...</h3>
                      <p className="text-sm text-muted-foreground">Trwa rozpoznawanie pozycji z faktury</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {processingStage === "review" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Dostawca</Label>
                  <Input 
                    id="supplier"
                    value={invoiceData.supplier}
                    onChange={(e) => handleUpdateInvoiceData("supplier", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Numer faktury</Label>
                  <Input 
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => handleUpdateInvoiceData("invoiceNumber", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data faktury</Label>
                  <Input 
                    id="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => handleUpdateInvoiceData("date", e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Pozycje faktury</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Dodaj
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Nazwa</TableHead>
                      <TableHead className="text-center">Ilość</TableHead>
                      <TableHead className="text-center">Jm.</TableHead>
                      <TableHead className="text-right">Cena (zł)</TableHead>
                      <TableHead className="text-right w-[80px]">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-16 text-muted-foreground">
                          Brak pozycji na fakturze
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoiceData.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input 
                              value={item.name}
                              onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                              className="h-8 w-16 text-sm text-center mx-auto"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(item.id, "unit", e.target.value)}
                              className="h-8 w-14 text-sm text-center mx-auto"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input 
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                              className="h-8 w-20 text-sm text-right ml-auto"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-7 w-7 text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex justify-between items-center font-medium">
                <span>Razem:</span>
                <span>{invoiceData.total.toFixed(2)} zł</span>
              </div>
            </div>
            
            {previewUrl && (
              <div className="rounded-lg overflow-hidden border">
                <div className="flex justify-between items-center bg-muted/30 p-2">
                  <span className="text-sm font-medium">Podgląd dokumentu</span>
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    <Scan className="h-3.5 w-3.5" />
                    Skanuj ponownie
                  </Button>
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                  <img 
                    src={previewUrl}
                    alt="Invoice preview"
                    className="object-contain w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Anuluj
          </Button>
          
          {processingStage === "review" && (
            <Button 
              onClick={handleSave}
              className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
              disabled={invoiceData.items.length === 0}
            >
              <ShoppingBag className="h-4 w-4" />
              Dodaj do zlecenia
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
