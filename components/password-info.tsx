"use client";

import { Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function PasswordInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 flex items-center"
        >
          <Info size={16} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="text-xs space-y-1 w-60">
        <p>• At least 8 characters</p>
        <p>• At least one uppercase letter (A–Z)</p>
        <p>• At least one number (0–9)</p>
        <p>• At least one special character</p>
      </PopoverContent>
    </Popover>
  );
}