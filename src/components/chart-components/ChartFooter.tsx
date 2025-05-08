
import React from "react";

export const ChartFooter = () => {
  return (
    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
      <div>
        Note: This chart shows simulated data for demonstration purposes.
      </div>
      <div>
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};
