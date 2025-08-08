
import React, { useState } from "react";
import { 
  Receipt, 
  Eye, 
  Download, 
  ShoppingBag, 
  Plus, 
  Store, 
  Calendar,
  Package
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { PurchaseInvoiceOCRDialog } from "./PurchaseInvoiceOCRDialog";

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

interface PurchaseInvoicesListProps {
  purchaseInvoices: PurchaseInvoice[];
  onAddInvoice: (invoice: PurchaseInvoice) => void;
}

export function PurchaseInvoicesList({ 
  purchaseInvoices, 
  onAddInvoice 
}: PurchaseInvoicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  
  // Toggle invoice details view
  const toggleInvoiceDetails = (invoice: PurchaseInvoice) => {
    if (selectedInvoice && selectedInvoice.id === invoice.id) {
      setSelectedInvoice(null);
    } else {
      setSelectedInvoice(invoice);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-brand-orange" />
          Faktury zakupowe
        </h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsDialogOpen(true)}
          className="gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Dodaj fakturę
        </Button>
      </div>
      
      {purchaseInvoices.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 flex flex-col items-center justify-center text-center space-y-2">
          <Receipt className="h-8 w-8 text-muted-foreground/50" />
          <div>
            <h4 className="font-medium">Brak faktur zakupowych</h4>
            <p className="text-sm text-muted-foreground">Dodaj faktury zakupowe, aby śledzić części i materiały wykorzystane w zleceniu</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
            className="mt-2 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Dodaj fakturę
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dostawca</TableHead>
                <TableHead>Numer</TableHead>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
                <TableHead className="text-right w-[100px]">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span>{invoice.supplier}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{invoice.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {invoice.total.toFixed(2)} zł
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleInvoiceDetails(invoice)}
                          className="h-7 w-7"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Invoice details - expanded view */}
                  {selectedInvoice && selectedInvoice.id === invoice.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0 bg-muted/30">
                        <div className="p-4">
                          <h5 className="font-medium mb-2 text-sm">Pozycje faktury:</h5>
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nazwa</TableHead>
                                  <TableHead className="text-center">Ilość</TableHead>
                                  <TableHead className="text-right">Cena jedn.</TableHead>
                                  <TableHead className="text-right">Wartość</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {invoice.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{item.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {item.price.toFixed(2)} zł
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {(item.price * item.quantity).toFixed(2)} zł
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          {/* Invoice preview if available */}
                          {invoice.imageUrl && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2 text-sm">Podgląd dokumentu:</h5>
                              <div className="rounded-md border overflow-hidden">
                                <img 
                                  src={invoice.imageUrl}
                                  alt="Invoice preview"
                                  className="object-contain w-full max-h-[200px]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* OCR Dialog */}
      <PurchaseInvoiceOCRDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onAddInvoice}
      />
    </div>
  );
}
