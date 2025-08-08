
import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";

export function DialogAccessibilityTest() {
  const [dialogWithDescriptionOpen, setDialogWithDescriptionOpen] = useState(false);
  const [dialogWithoutDescriptionOpen, setDialogWithoutDescriptionOpen] = useState(false);
  const [dialogWithHeaderNoDescriptionOpen, setDialogWithHeaderNoDescriptionOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <h1>Dialog Accessibility Tests</h1>
      
      <div className="space-y-4">
        <h2>DialogContent with explicit Description</h2>
        <Button onClick={() => setDialogWithDescriptionOpen(true)}>
          Open Dialog With Description
        </Button>
        
        <Dialog open={dialogWithDescriptionOpen} onOpenChange={setDialogWithDescriptionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog with Description</DialogTitle>
              <DialogDescription>
                This dialog has an explicit description, which makes it accessible.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">Dialog content goes here</div>
            <DialogFooter>
              <Button onClick={() => setDialogWithDescriptionOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        <h2>DialogContent without Description</h2>
        <Button onClick={() => setDialogWithoutDescriptionOpen(true)}>
          Open Dialog Without Description
        </Button>
        
        <Dialog open={dialogWithoutDescriptionOpen} onOpenChange={setDialogWithoutDescriptionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog without Description</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              This dialog has no description, but should still be accessible due to our fix.
              It should have an auto-generated screen-reader only description.
            </div>
            <DialogFooter>
              <Button onClick={() => setDialogWithoutDescriptionOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        <h2>DialogContent without Header or Description</h2>
        <Button onClick={() => setDialogWithHeaderNoDescriptionOpen(true)}>
          Open Minimal Dialog
        </Button>
        
        <Dialog open={dialogWithHeaderNoDescriptionOpen} onOpenChange={setDialogWithHeaderNoDescriptionOpen}>
          <DialogContent>
            <div className="py-4">
              This is a minimal dialog with no header or description.
              Our fix should still make it accessible.
            </div>
            <Button onClick={() => setDialogWithHeaderNoDescriptionOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
