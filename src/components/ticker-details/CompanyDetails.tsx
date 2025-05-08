
import React from "react";

interface CompanyDetailsProps {
  sector: string;
  industry: string;
  ceo: string;
  headquarters: string;
  employees: string | number;
}

export const CompanyDetails = ({ sector, industry, ceo, headquarters, employees }: CompanyDetailsProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">Company Details</div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Sector</span>
          <span className="font-medium">{sector}</span>
        </div>
        <div className="flex justify-between">
          <span>Industry</span>
          <span className="font-medium">{industry}</span>
        </div>
        <div className="flex justify-between">
          <span>CEO</span>
          <span className="font-medium">{ceo}</span>
        </div>
        <div className="flex justify-between">
          <span>Headquarters</span>
          <span className="font-medium">{headquarters}</span>
        </div>
        {employees !== 'N/A' && (
          <div className="flex justify-between">
            <span>Employees</span>
            <span className="font-medium">
              {typeof employees === 'number' 
                ? employees.toLocaleString() 
                : employees}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
