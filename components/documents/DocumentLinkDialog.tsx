import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search, Link, FileText, ClipboardList, Receipt } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ServiceOrder {
  id: string;
  number: string;
  client: string;
  date: string;
  status: string;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: string;
}

interface Protocol {
  id: string;
  number: string;
  client: string;
  date: string;
  type: string;
}

interface DocumentLinkDialogProps {
  open: boolean;
  onClose: () => void;
  documentNumber: string;
  onLink: (orderId: string) => void;
}

export function DocumentLinkDialog({
  open,
  onClose,
  documentNumber,
  onLink,
}: DocumentLinkDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("serviceOrder");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Mock service orders data
  const orders: ServiceOrder[] = [
    { id: "1", number: "ZL/2025/042", client: "Hotel Metropol", date: "08.05.2025", status: "W realizacji" },
    { id: "2", number: "ZL/2025/039", client: "Hotel Metropol", date: "05.05.2025", status: "Zamknięte" },
    { id: "3", number: "ZL/2025/036", client: "Biurowiec Gamma", date: "02.05.2025", status: "W realizacji" },
    { id: "4", number: "ZL/2025/032", client: "ABC Sp. z o.o.", date: "28.04.2025", status: "Zamknięte" },
  ];

  // Mock invoices data
  const invoices: Invoice[] = [
    { id: "1", number: "FV/2025/125", client: "Hotel Metropol", date: "09.05.2025", amount: "1,240.00 zł" },
    { id: "2", number: "FV/2025/120", client: "Biurowiec Gamma", date: "05.05.2025", amount: "2,750.00 zł" },
    { id: "3", number: "FV/2025/115", client: "Delta Office Park", date: "02.05.2025", amount: "3,600.00 zł" },
  ];

  // Mock protocols data
  const protocols: Protocol[] = [
    { id: "1", number: "PS/2025/080", client: "Hotel Metropol", date: "08.05.2025", type: "Serwisowy" },
    { id: "2", number: "PS/2025/075", client: "ABC Sp. z o.o.", date: "04.05.2025", type: "Serwisowy" },
    { id: "3", number: "PM/2025/025", client: "Delta Office Park", date: "01.05.2025", type: "Montażowy" },
  ];

  const filteredOrders = orders.filter(order => 
    order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProtocols = protocols.filter(protocol => 
    protocol.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedItemId) {
      onLink(selectedItemId);
      onClose();
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setSelectedItemId(null);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "serviceOrder":
        return <ClipboardList className="size-4" />;
      case "invoice":
        return <Receipt className="size-4" />;
      case "protocol":
        return <FileText className="size-4" />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "serviceOrder":
        return "Zlecenia";
      case "invoice":
        return "Faktury";
      case "protocol":
        return "Protokoły";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Powiąż dokument z elementem</DialogTitle>
          <DialogDescription>
            Powiąż dokument <span className="font-medium text-foreground">{documentNumber}</span> z innym elementem systemu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          
          <Tabs 
            defaultValue="serviceOrder" 
            value={selectedTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="serviceOrder" className="flex items-center gap-2">
                <ClipboardList className="size-4 text-brand-blue" />
                <span>Zlecenia</span>
              </TabsTrigger>
              <TabsTrigger value="invoice" className="flex items-center gap-2">
                <Receipt className="size-4 text-brand-blue" />
                <span>Faktury</span>
              </TabsTrigger>
              <TabsTrigger value="protocol" className="flex items-center gap-2">
                <FileText className="size-4 text-brand-orange" />
                <span>Protokoły</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative my-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder={`Szukaj ${getTabLabel(selectedTab).toLowerCase()}...`} 
                className="pl-9" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-[250px] overflow-y-auto">
              <TabsContent value="serviceOrder" className="m-0">
                {filteredOrders.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Brak pasujących zleceń
                  </div>
                ) : (
                  <RadioGroup value={selectedItemId || ""} onValueChange={setSelectedItemId}>
                    <div className="divide-y">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="flex items-center space-x-2 p-3">
                          <RadioGroupItem value={order.id} id={`order-${order.id}`} />
                          <Label htmlFor={`order-${order.id}`} className="flex-1 cursor-pointer">
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <p className="font-medium text-brand-blue">{order.number}</p>
                                <p className="text-sm text-muted-foreground">{order.client}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{order.date}</p>
                                <p className="text-sm text-muted-foreground">{order.status}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </TabsContent>
              
              <TabsContent value="invoice" className="m-0">
                {filteredInvoices.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Brak pasujących faktur
                  </div>
                ) : (
                  <RadioGroup value={selectedItemId || ""} onValueChange={setSelectedItemId}>
                    <div className="divide-y">
                      {filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center space-x-2 p-3">
                          <RadioGroupItem value={invoice.id} id={`invoice-${invoice.id}`} />
                          <Label htmlFor={`invoice-${invoice.id}`} className="flex-1 cursor-pointer">
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <p className="font-medium text-brand-blue">{invoice.number}</p>
                                <p className="text-sm text-muted-foreground">{invoice.client}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{invoice.date}</p>
                                <p className="text-sm font-medium">{invoice.amount}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </TabsContent>
              
              <TabsContent value="protocol" className="m-0">
                {filteredProtocols.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Brak pasujących protokołów
                  </div>
                ) : (
                  <RadioGroup value={selectedItemId || ""} onValueChange={setSelectedItemId}>
                    <div className="divide-y">
                      {filteredProtocols.map((protocol) => (
                        <div key={protocol.id} className="flex items-center space-x-2 p-3">
                          <RadioGroupItem value={protocol.id} id={`protocol-${protocol.id}`} />
                          <Label htmlFor={`protocol-${protocol.id}`} className="flex-1 cursor-pointer">
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <p className="font-medium text-brand-orange">{protocol.number}</p>
                                <p className="text-sm text-muted-foreground">{protocol.client}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{protocol.date}</p>
                                <p className="text-sm text-muted-foreground">{protocol.type}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button 
            disabled={!selectedItemId} 
            onClick={handleSubmit}
            className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
          >
            <Link className="size-4" />
            Powiąż
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}