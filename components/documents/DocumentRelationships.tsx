import React from "react";
import { Badge } from "../ui/badge";
import { FileText, ClipboardList, FileText, Link2 } from "lucide-react";
import { cn } from "../ui/utils";

export interface Relationship {
  id: string;
  type: "invoice" | "protocol" | "serviceOrder";
  number: string;
  client?: string;
  date?: string;
}

interface DocumentRelationshipsProps {
  relationships: Relationship[];
  onViewRelationship?: (type: string, id: string, number: string) => void;
  className?: string;
}

export function DocumentRelationships({ 
  relationships, 
  onViewRelationship,
  className 
}: DocumentRelationshipsProps) {

  if (relationships.length === 0) {
    return (
      <div className={cn("text-muted-foreground text-sm py-1", className)}>
        Brak powiązań
      </div>
    );
  }

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="size-3.5 text-brand-orange" />;
      case "protocol":
        return <FileText className="size-3.5 text-emerald-600" />;
      case "serviceOrder":
        return <ClipboardList className="size-3.5 text-brand-blue" />;
      default:
        return <Link2 className="size-3.5" />;
    }
  };

  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case "invoice":
        return "Faktura";
      case "protocol":
        return "Protokół";
      case "serviceOrder":
        return "Zlecenie";
      default:
        return "Dokument";
    }
  };

  const getRelationshipBadgeColor = (type: string) => {
    switch (type) {
      case "invoice":
        return "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/15 border-transparent";
      case "protocol":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent";
      case "serviceOrder":
        return "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/15 border-transparent";
      default:
        return "";
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {relationships.map((relation) => (
        <Badge
          key={`${relation.type}-${relation.id}`}
          variant="outline"
          className={cn(
            "flex items-center gap-1 cursor-pointer transition-colors",
            getRelationshipBadgeColor(relation.type)
          )}
          onClick={() => onViewRelationship && onViewRelationship(relation.type, relation.id, relation.number)}
        >
          {getRelationshipIcon(relation.type)}
          <span>
            {getRelationshipLabel(relation.type)}: {relation.number}
          </span>
        </Badge>
      ))}
    </div>
  );
}