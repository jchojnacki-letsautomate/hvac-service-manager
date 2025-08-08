import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Package,
  Search,
  ShoppingCart,
  Trash2,
  X
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";

export interface InventoryReservationItem {
  id: string;
  productId: string;
  productName: string;
  partNumber: string;
  quantityAvailable: number;
  quantityReserved: number;
  unit: string;
  orderNumber?: string;
  orderType?: string;
  clientName?: string;
  reservationDate: string;
  plannedDate: string;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
  note?: string;
}

interface InventoryReservationProps {
  orderId?: string;
  clientId?: string;
  clientName?: string;
  onReservationsChange?: (reservations: InventoryReservationItem[]) => void;
  readOnly?: boolean;
}

export function InventoryReservation({
  orderId,
  clientId,
  clientName,
  onReservationsChange,
  readOnly = false
}: InventoryReservationProps) {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryReservationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Przykładowa lista rezerwacji dla bieżącego zlecenia
  const [reservations, setReservations] = useState<InventoryReservationItem[]>([
    {
      id: "1",
      productId: "1",
      productName: "Filtr do klimatyzatora",
      partNumber: "FLT-001",
      quantityAvailable: 35,
      quantityReserved: 2,
      unit: "szt.",
      orderNumber: orderId || "ZL/2025/042",
      orderType: "Przegląd",
      clientName: clientName || "Hotel Metropol",
      reservationDate: "12.05.2025",
      plannedDate: "15.05.2025",
      status: "confirmed"
    },
    {
      id: "2",
      productId: "2", 
      productName: "Czynnik chłodniczy R32",
      partNumber: "R32-100",
      quantityAvailable: 8,
      quantityReserved: 1.5,
      unit: "kg",
      orderNumber: orderId || "ZL/2025/042",
      orderType: "Przegląd",
      clientName: clientName || "Hotel Metropol",
      reservationDate: "12.05.2025",
      plannedDate: "15.05.2025",
      status: "pending"
    }
  ]);

  // Przykładowe dane produktów w magazynie
  const inventoryItems = [
    {
      id: "1",
      name: "Filtr do klimatyzatora",
      partNumber: "FLT-001",
      category: "Filtry",
      quantityAvailable: 35,
      unit: "szt.",
      price: 45.00
    },
    {
      id: "2",
      name: "Czynnik chłodniczy R32",
      partNumber: "R32-100",
      category: "Czynniki chłodnicze",
      quantityAvailable: 8,
      unit: "kg",
      price: 180.00
    },
    {
      id: "3",
      name: "Czujnik temperatury",
      partNumber: "TMP-002",
      category: "Elektronika",
      quantityAvailable: 15,
      unit: "szt.",
      price: 60.00
    },
    {
      id: "4",
      name: "Presostat LP",
      partNumber: "PRS-001",
      category: "Automatyka",
      quantityAvailable: 2,
      unit: "szt.",
      price: 120.00
    }
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveReservation = (id: string) => {
    const updatedReservations = reservations.filter(res => res.id !== id);
    setReservations(updatedReservations);
    if (onReservationsChange) {
      onReservationsChange(updatedReservations);
    }
  };

  const handleConfirmAllReservations = () => {
    const updatedReservations = reservations.map(res => ({
      ...res,
      status: "confirmed" as const
    }));
    setReservations(updatedReservations);
    if (onReservationsChange) {
      onReservationsChange(updatedReservations);
    }
  };

  const handleAddItem = (item: any, quantity: number) => {
    const newId = String(Date.now());
    const newReservation: InventoryReservationItem = {
      id: newId,
      productId: item.id,
      productName: item.name,
      partNumber: item.partNumber,
      quantityAvailable: item.quantityAvailable,
      quantityReserved: quantity,
      unit: item.unit,
      orderNumber: orderId || "ZL/2025/042",
      orderType: "Przegląd",
      clientName: clientName || "Hotel Metropol",
      reservationDate: new Date().toLocaleDateString('pl-PL'),
      plannedDate: selectedDate ? selectedDate.toLocaleDateString('pl-PL') : new Date().toLocaleDateString('pl-PL'),
      status: "pending"
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    
    if (onReservationsChange) {
      onReservationsChange(updatedReservations);
    }
    
    setShowAddDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-800 border-amber-500/40">Oczekująca</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500/15 text-blue-800 border-blue-500/40">Potwierdzona</Badge>;
      case "fulfilled":
        return <Badge className="bg-emerald-500/15 text-emerald-800 border-emerald-500/40">Zrealizowana</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-muted-foreground">Anulowana</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="card-balanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Rezerwacje magazynowe</CardTitle>
          {!readOnly && (
            <Button 
              className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => setShowAddDialog(true)}
            >
              <ShoppingCart className="icon-balanced" />
              <span>Dodaj produkt</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto size-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Brak zarezerwowanych produktów</p>
              {!readOnly && (
                <Button 
                  variant="outline" 
                  className="mt-4 gap-2"
                  onClick={() => setShowAddDialog(true)}
                >
                  <ShoppingCart className="icon-balanced" />
                  <span>Dodaj produkt</span>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead className="text-center">Ilość</TableHead>
                      <TableHead className="text-center">Planowana data</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      {!readOnly && <TableHead className="text-right">Akcje</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reservation.productName}</p>
                            <p className="text-xs text-muted-foreground">{reservation.partNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium">{reservation.quantityReserved} {reservation.unit}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Dostępne: {reservation.quantityAvailable} {reservation.unit}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Calendar className="icon-balanced text-muted-foreground" />
                            <span>{reservation.plannedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(reservation.status)}
                        </TableCell>
                        {!readOnly && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {reservation.status === "pending" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-blue-600"
                                  onClick={() => {
                                    const updatedReservations = reservations.map(res => 
                                      res.id === reservation.id ? {...res, status: "confirmed" as const} : res
                                    );
                                    setReservations(updatedReservations);
                                    if (onReservationsChange) {
                                      onReservationsChange(updatedReservations);
                                    }
                                  }}
                                >
                                  Potwierdź
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedItem(reservation);
                                  setShowConfirmDialog(true);
                                }}
                              >
                                <Trash2 className="icon-balanced" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {!readOnly && reservations.some(res => res.status === "pending") && (
                <div className="flex justify-end mt-4">
                  <Button 
                    className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
                    onClick={handleConfirmAllReservations}
                  >
                    <Check className="icon-balanced" />
                    <span>Potwierdź wszystkie rezerwacje</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog dodawania produktu */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="dialog-content max-w-3xl">
          <DialogHeader>
            <DialogTitle>Zarezerwuj produkt z magazynu</DialogTitle>
            <DialogDescription>
              Wybierz produkty, które chcesz zarezerwować na to zlecenie
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 icon-balanced text-muted-foreground" />
                <Input 
                  placeholder="Szukaj produktu..." 
                  className="pl-9 input-balanced" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:w-[240px]">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie kategorie</SelectItem>
                    <SelectItem value="filters">Filtry</SelectItem>
                    <SelectItem value="refrigerants">Czynniki chłodnicze</SelectItem>
                    <SelectItem value="electronics">Elektronika</SelectItem>
                    <SelectItem value="automation">Automatyka</SelectItem>
                    <SelectItem value="hydraulics">Hydraulika</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead className="text-center">Dostępne</TableHead>
                    <TableHead className="text-center">Ilość</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        <p className="text-muted-foreground">Nie znaleziono produktów</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => {
                      const [quantity, setQuantity] = useState(1);
                      const isReserved = reservations.some(res => res.productId === item.id);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.partNumber}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantityAvailable} {item.unit}
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number"
                              min="0.01"
                              step={item.unit === "kg" ? "0.1" : "1"}
                              value={quantity}
                              onChange={(e) => setQuantity(Number(e.target.value))}
                              className="w-[100px] mx-auto text-center"
                              disabled={isReserved}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {isReserved ? (
                              <Badge variant="outline" className="ml-auto">Już zarezerwowany</Badge>
                            ) : (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(item, quantity)}
                                disabled={quantity <= 0 || quantity > item.quantityAvailable}
                              >
                                Zarezerwuj
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <Label>Planowana data użycia</Label>
                <div className="mt-1 border rounded-md p-3">
                  <DatePicker 
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    mode="single"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Uwagi (opcjonalnie)</Label>
                <Input id="notes" placeholder="Dodatkowe informacje dot. rezerwacji" className="mt-1" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={() => setShowAddDialog(false)}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              Zakończ rezerwację
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog usuwania rezerwacji */}
      {selectedItem && (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>Usunięcie rezerwacji</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć rezerwację produktu <span className="font-medium">{selectedItem.productName}</span>?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedItem.productName}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.partNumber}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ilość: </span>
                    <span className="font-medium">{selectedItem.quantityReserved} {selectedItem.unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    <span className="font-medium">{selectedItem.status === "pending" ? "Oczekująca" : 
                      selectedItem.status === "confirmed" ? "Potwierdzona" : 
                      selectedItem.status === "fulfilled" ? "Zrealizowana" : "Anulowana"}</span>
                  </div>
                </div>
              </div>

              {selectedItem.status === "confirmed" && (
                <div className="flex items-center gap-2 p-2 mt-4 bg-amber-50 text-amber-700 rounded">
                  <AlertTriangle className="size-4" />
                  <p className="text-sm">
                    Uwaga! Ta rezerwacja jest już potwierdzona. Usunięcie jej może wpłynąć na planowane prace.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
              >
                Anuluj
              </Button>
              <Button 
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  handleRemoveReservation(selectedItem.id);
                  setShowConfirmDialog(false);
                }}
              >
                Usuń rezerwację
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// DatePicker component placeholder
// In a real implementation, you would import this from your UI components
function DatePicker({ selected, onSelect, mode, className }: any) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <input 
          type="date" 
          value={selected ? selected.toISOString().split('T')[0] : ''}
          onChange={(e) => onSelect(new Date(e.target.value))}
          className="flex-1 px-2 py-1.5 rounded-md border bg-transparent text-sm"
        />
      </div>
    </div>
  );
}