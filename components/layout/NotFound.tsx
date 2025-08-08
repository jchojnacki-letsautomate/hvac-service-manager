import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto bg-muted rounded-full p-3 w-fit">
          <AlertTriangle className="size-8 text-amber-500" />
        </div>
        <h1>Strona nie została znaleziona</h1>
        <p className="text-muted-foreground">
          Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="size-4" />
            <span>Wróć do strony głównej</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}