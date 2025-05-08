
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const SettingsPanel = () => {
  const [alerts, setAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [selectedFilters, setSelectedFilters] = useState({
    industry: true,
    marketCap: true,
    geography: false,
    volume: true
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter as keyof typeof prev]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Settings & Filters</CardTitle>
        <CardDescription>
          Customize your dashboard experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="font-medium">Alert Settings</div>
          <div className="flex items-center justify-between">
            <Label htmlFor="alerts" className="flex items-center gap-2 text-sm">
              Sentiment Spike Alerts
            </Label>
            <Switch id="alerts" checked={alerts} onCheckedChange={setAlerts} />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <Label htmlFor="autorefresh" className="flex items-center gap-2 text-sm">
              Auto-refresh Data
            </Label>
            <Switch id="autorefresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          
          {autoRefresh && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="refresh-interval" className="text-sm">Refresh Interval</Label>
                <span className="text-sm">{refreshInterval} minutes</span>
              </div>
              <Slider 
                id="refresh-interval"
                min={1} 
                max={30} 
                step={1} 
                defaultValue={[refreshInterval]}
                onValueChange={(value) => setRefreshInterval(value[0])}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="font-medium">Data Filters</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-industry" 
                checked={selectedFilters.industry}
                onCheckedChange={() => handleFilterChange('industry')}
              />
              <Label htmlFor="filter-industry" className="text-sm">Industry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-marketcap" 
                checked={selectedFilters.marketCap}
                onCheckedChange={() => handleFilterChange('marketCap')}
              />
              <Label htmlFor="filter-marketcap" className="text-sm">Market Cap</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-geography" 
                checked={selectedFilters.geography}
                onCheckedChange={() => handleFilterChange('geography')}
              />
              <Label htmlFor="filter-geography" className="text-sm">Geography</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-volume" 
                checked={selectedFilters.volume}
                onCheckedChange={() => handleFilterChange('volume')}
              />
              <Label htmlFor="filter-volume" className="text-sm">Volume</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">API & Export</div>
          <div className="text-sm text-muted-foreground">
            Export sentiment data or connect via our API
          </div>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Download size={16} />
            <span>Export Data</span>
          </Button>
          <div className="text-xs text-muted-foreground mt-1">
            API Documentation: <a href="#" className="text-primary underline">View Docs</a>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground w-full text-center">
          Sentiment analysis powered by NLP-SA Model v3.2
        </div>
      </CardFooter>
    </Card>
  );
};
