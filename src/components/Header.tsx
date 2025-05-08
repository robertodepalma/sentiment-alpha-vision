
import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TickerSearch } from "./TickerSearch";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-semibold">SentimentAlpha</h1>
        <TickerSearch />
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
