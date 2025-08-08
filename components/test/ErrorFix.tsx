import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function ErrorFix() {
  const [inputValue, setInputValue] = useState("");
  
  return (
    <div className="space-y-6 p-6">
      <h1>Test Components</h1>
      
      <div className="space-y-4">
        <h2>Button with ref forwarding test</h2>
        <Button>Test Button</Button>
      </div>
      
      <div className="space-y-4">
        <h2>Input with controlled value</h2>
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here..."
        />
      </div>
      
      <div className="space-y-4">
        <h2>Input with defaultValue</h2>
        <Input 
          defaultValue="This is a default value"
          placeholder="This won't show because of defaultValue"
        />
      </div>
      
      <div className="space-y-4">
        <h2>Popover with forwarded ref</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Popover content</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}