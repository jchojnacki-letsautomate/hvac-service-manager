import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Package, Calendar, Building2, AlertTriangle } from "lucide-react";
import { Separator } from "../ui/separator";

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productId: string;
  partNumber: string;
  quantityAvailable: number;
  unit: string;
  onConfirm: (data: ReservationData) => void;
}

export interface ReservationData {
  productId: string;
  quantity: number;
  orderId?: string;
  clientId: string;
  plannedDate: string;
  notes?: string;
}

export function ReservationDialog({
  open,
  onOpenChange,
  productName,
  productId,
  partNumber,
  quantityAvailable,
  unit,
  onConfirm
}: ReservationDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [client, setClient] = useState("");
  const [order, setOrder] = useState("");
  const [notes, setNotes] = useState("");
  const [plannedDate, setPlannedDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Przykładowi klienci
  const clients = [
    { id: "1", name: "Biurowiec Gamma" },
    { id: "2", name: "Hotel Metropol" },
    { id: "3", name: "ABC Sp. z o.o." },
    { id: "4", name: "Delta Office Park" },
  ];
  
  // Przykładowe zlecenia
  const orders = [
    { id: "ZL/2025/092", client: "Hotel Metropol" },
    { id: "ZL/2025/087", client: "Biurowiec Delta" },
    { id: "ZL/2025/081", client: "ABC Sp. z o.o." },
    { id: "ZL/2025/078", client: "Biurowiec Gamma" }
  ];

  const handleConfirm = () => {
    onConfirm({
      productId,
      quantity,
      clientId: client,
      orderId: order !== "none" ? order : undefined,
      plannedDate,
      notes: notes || undefined
    });
    
    onOpenChange(false);
    reset();
  };
  
  const reset = () => {
    setQuantity(1);
    setClient("");
    setOrder("");
    setNotes("");
    setPlannedDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-content">
        <DialogHeader>
          <DialogTitle>Zarezerwuj produkt</DialogTitle>
          <DialogDescription>
            Rezerwacja produktu dla zlecenia serwisowego lub klienta, z określeniem planowanej daty użycia.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex items-center gap-2">
              <Package className="icon-md text-muted-foreground" />
              <div>
                <p className="font-medium">{productName}</p>
                <p className="text-sm text-muted-foreground">{partNumber}</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Dostępna ilość: </span>
                <span className="font-medium">{quantityAvailable} {unit}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Ilość do zarezerwowania ({unit})</Label>
            <Input 
              id="quantity" 
              type="number"
              min="0.01"
              step={unit === "kg" ? "0.1" : "1"}
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="input-balanced"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Klient</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Wybierz klienta" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Zlecenie (opcjonalnie)</Label>
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger id="order">
                <SelectValue placeholder="Wybierz zlecenie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Brak powiązanego zlecenia</SelectItem>
                {orders.map(o => (
                  <SelectItem key={o.id} value={o.id}>{o.id} - {o.client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plannedDate">Planowana data użycia</Label>
            <div className="flex items-center">
              <Calendar className="icon-balanced text-muted-foreground mr-2" />
              <Input 
                id="plannedDate" 
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="input-balanced"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Uwagi (opcjonalnie)</Label>
            <Input 
              id="notes" 
              placeholder="Dodatkowe informacje..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-balanced" 
            />
          </div>
          
          {quantity > quantityAvailable && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded">
              <AlertTriangle className="icon-balanced" />
              <p className="text-sm">
                Uwaga! Próba zarezerwowania większej ilości niż dostępna na stanie magazynowym.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!client || quantity <= 0 || quantity > quantityAvailable}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            Zarezerwuj produkt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}