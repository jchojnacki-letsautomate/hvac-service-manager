
import React from "react";
import { Badge } from "../ui/badge";
import { 
  Send, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package 
} from "lucide-react";

export type OrderStatus = 
  | "inquiry" 
  | "waitingForOffers" 
  | "confirmed" 
  | "waitingForDelivery" 
  | "delivered";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  let label = "";
  let icon = null;
  let badgeStyle = "";
  
  switch (status) {
    case "inquiry":
      label = "Do wysłania zapytań";
      icon = <Send className="size-3.5 mr-1" />;
      badgeStyle = "bg-blue-100 text-blue-700 hover:bg-blue-100";
      break;
    case "waitingForOffers":
      label = "Oczekiwanie na oferty";
      icon = <Clock className="size-3.5 mr-1" />;
      badgeStyle = "bg-amber-100 text-amber-700 hover:bg-amber-100";
      break;
    case "confirmed":
      label = "Zamówienie potwierdzone";
      icon = <CheckCircle className="size-3.5 mr-1" />;
      badgeStyle = "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      break;
    case "waitingForDelivery":
      label = "Oczekiwanie na dostawę";
      icon = <Truck className="size-3.5 mr-1" />;
      badgeStyle = "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
      break;
    case "delivered":
      label = "Dostarczono";
      icon = <Package className="size-3.5 mr-1" />;
      badgeStyle = "bg-green-100 text-green-700 hover:bg-green-100";
      break;
    default:
      label = "Nieznany status";
      badgeStyle = "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
  
  return (
    <Badge className={`flex items-center ${badgeStyle} ${className}`}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
}
