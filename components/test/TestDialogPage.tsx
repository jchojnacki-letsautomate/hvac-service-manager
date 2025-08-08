
import React from "react";
import { DialogAccessibilityTest } from "./DialogAccessibilityTest";

export function TestDialogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dialog Accessibility Testing</h1>
      <p className="mb-6">
        This page tests accessibility features of our Dialog components to ensure they work correctly
        with screen readers and meet accessibility standards.
      </p>
      
      <div className="border p-6 rounded-lg bg-card">
        <DialogAccessibilityTest />
      </div>
    </div>
  );
}
