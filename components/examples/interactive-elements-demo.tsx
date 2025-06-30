'use client';

import { useState } from 'react';
import { cn, interactiveElement } from '@/lib/utils';
import { InteractiveButton } from '@/components/ui/interactive-button';

export function InteractiveElementsDemo() {
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Elements Demo</h2>
        <p className="text-muted-foreground">
          Demonstrating the custom interactive element styles with focus, hover, and validation states.
        </p>
      </div>

      {/* Method 1: Using CSS Class Directly */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Method 1: CSS Class (.interactive-element)</h3>
        <div className="space-y-2">
          <button className="interactive-element px-4 py-2 transition-all duration-200">
            Button with CSS Class
          </button>
          <input
            className="interactive-element px-3 py-2 w-full transition-all duration-200"
            placeholder="Input with CSS Class"
            aria-invalid={isInvalid}
          />
        </div>
      </div>

      {/* Method 2: Using Utility Function */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Method 2: Utility Function (interactiveElement)</h3>
        <div className="space-y-2">
          <button 
            className={interactiveElement('px-4 py-2 transition-all duration-200')}
          >
            Button with Utility Function
          </button>
          <input
            className={interactiveElement('px-3 py-2 w-full transition-all duration-200')}
            placeholder="Input with Utility Function"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-invalid={inputValue.length > 0 && inputValue.length < 3}
          />
        </div>
      </div>

      {/* Method 3: Using the InteractiveButton Component */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Method 3: InteractiveButton Component</h3>
        <div className="flex flex-wrap gap-2">
          <InteractiveButton size="sm">Small Button</InteractiveButton>
          <InteractiveButton size="md">Medium Button</InteractiveButton>
          <InteractiveButton size="lg">Large Button</InteractiveButton>
          <InteractiveButton variant="destructive" isInvalid>
            Invalid Button
          </InteractiveButton>
          <InteractiveButton variant="ghost">
            Ghost Button
          </InteractiveButton>
        </div>
      </div>

      {/* Method 4: Custom Implementation with cn() */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Method 4: Custom with cn() Function</h3>
        <div className="space-y-2">
          <div
            className={cn(
              'interactive-element',
              'p-4 cursor-pointer select-none transition-all duration-200',
              'flex items-center justify-center',
              isInvalid && 'ring-destructive/40 border-destructive'
            )}
            onClick={() => setIsInvalid(!isInvalid)}
            role="button"
            tabIndex={0}
            aria-invalid={isInvalid}
          >
            Click to toggle validation state: {isInvalid ? 'Invalid' : 'Valid'}
          </div>
        </div>
      </div>

      {/* Advanced Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Advanced Examples</h3>
        
        {/* Card with interactive element styles */}
        <div className={interactiveElement('p-6 cursor-pointer transition-all duration-200')}>
          <h4 className="font-medium">Interactive Card</h4>
          <p className="text-sm text-muted-foreground mt-1">
            This card uses the interactive element styles and responds to focus and hover.
          </p>
        </div>

        {/* Form field with validation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            className={interactiveElement('px-3 py-2 w-full transition-all duration-200')}
            placeholder="Enter your email"
            aria-invalid={false}
          />
          <p className="text-xs text-muted-foreground">
            Focus this input to see the focus ring effect
          </p>
        </div>

        {/* Select dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Option</label>
          <select className={interactiveElement('px-3 py-2 w-full transition-all duration-200')}>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <textarea
            className={interactiveElement('px-3 py-2 w-full min-h-[100px] transition-all duration-200')}
            placeholder="Enter your message"
            rows={4}
          />
        </div>
      </div>

      {/* State Controls */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold">Demo Controls</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isInvalid}
              onChange={(e) => setIsInvalid(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Toggle Invalid State</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Use Tab to navigate through elements and see the focus states.
          Enable invalid state to see validation styling.
        </p>
      </div>
    </div>
  );
}