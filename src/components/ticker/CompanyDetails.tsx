
import React from "react";

interface CompanyDetailsProps {
  sector: string;
  ceo: string;
  headquarters: string;
}

export const CompanyDetails = ({ 
  sector, 
  ceo, 
  headquarters 
}: CompanyDetailsProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">Company Details</div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Sector</span>
          <span className="font-medium">{sector}</span>
        </div>
        <div className="flex justify-between">
          <span>CEO</span>
          <span className="font-medium">{ceo}</span>
        </div>
        <div className="flex justify-between">
          <span>Headquarters</span>
          <span className="font-medium">{headquarters}</span>
        </div>
      </div>
    </div>
  );
};
