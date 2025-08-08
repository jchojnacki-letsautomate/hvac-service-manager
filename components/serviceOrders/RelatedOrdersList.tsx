
import React from "react";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { OrderStatus, OrderStatusBadge } from "../orders/OrderStatusBadge";

interface RelatedOrder {
  id: string;
  number: string;
  date: string;
  description: string;
  value: number;
  orderStatus: OrderStatus;
}

interface RelatedOrdersListProps {
  orders: RelatedOrder[];
  onOrderClick: (id: string) => void;
  onCreateOrder?: () => void;
}

export function RelatedOrdersList({ 
  orders, 
  onOrderClick, 
  onCreateOrder 
}: RelatedOrdersListProps) {
  return (
    <Card className="card-balanced">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-brand-blue" />
          <span>Powiązane zamówienia</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground">
            <p className="mb-2">Brak powiązanych zamówień</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="border rounded-md p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => onOrderClick(order.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-brand-blue">{order.number}</span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{order.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.value.toFixed(2)} zł</span>
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {onCreateOrder && (
          <Button 
            onClick={onCreateOrder} 
            variant="outline" 
            className="w-full gap-2"
          >
            <ShoppingBag className="size-4" />
            <span>Utwórz nowe zamówienie</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
