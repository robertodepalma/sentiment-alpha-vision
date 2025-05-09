
import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TickerSearch } from "./TickerSearch";

interface HeaderProps {
  currentTicker?: string;
  onTickerChange?: (ticker: string) => void;
}

export const Header = ({ currentTicker, onTickerChange }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-background py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d7eb8650-e751-464c-83d1-5a89c3dd3b8e.png" 
            alt="Hype Score Barometer Logo" 
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-semibold">Hype Score Barometer</h1>
        </div>
        {onTickerChange && (
          <TickerSearch onSearch={onTickerChange} initialValue={currentTicker} />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <Button variant="outline" size="sm" className="ml-2 gap-2">
          <User size={16} />
          <span>Account</span>
        </Button>
      </div>
    </header>
  );
};
