
import * as React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  AreaChart as RechartsAreaChart,
  Bar as RechartsBar,
  Line as RechartsLine,
  Area as RechartsArea,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  YAxis as RechartsYAxis,
  XAxis as RechartsXAxis,
  CartesianGrid as RechartsCartesianGrid,
  TooltipProps as RechartsTooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

/**
 * Simple chart components using Recharts
 * 
 * These components are designed to be easy to use while maintaining
 * the full flexibility of the Recharts library when needed.
 */

// Re-export common recharts components to make them available from this module
export {
  ResponsiveContainer,
  RechartsBarChart as BarChart,
  RechartsLineChart as LineChart,
  RechartsAreaChart as AreaChart,
  RechartsTooltip as Tooltip,
  RechartsLegend as Legend,
  RechartsYAxis as YAxis,
  RechartsXAxis as XAxis,
  RechartsCartesianGrid as CartesianGrid,
};

// Helper for making typesafe classname-enabled components
type ChartComponentProps<T> = T & {
  className?: string;
};

// Define our custom tooltip props
export interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => React.ReactNode;
  itemSorter?: (a: any, b: any) => number;
  labelFormatter?: (label: any) => React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Area component with forwarded ref
 */
export const Area = React.forwardRef<RechartsArea, ChartComponentProps<any>>(
  ({ className, ...props }, ref) => {
    return (
      <RechartsArea
        {...props}
        className={cn(className)}
        type="monotone"
        ref={ref as any}
      />
    );
  }
);
Area.displayName = "Area";

/**
 * Bar component with forwarded ref
 */
export const Bar = React.forwardRef<RechartsBar, ChartComponentProps<any>>(
  ({ className, ...props }, ref) => {
    return (
      <RechartsBar
        {...props}
        className={cn(className)}
        fill="var(--chart-color)"
        ref={ref as any}
      />
    );
  }
);
Bar.displayName = "Bar";

/**
 * Line component with forwarded ref
 */
export const Line = React.forwardRef<RechartsLine, ChartComponentProps<any>>(
  ({ className, ...props }, ref) => {
    return (
      <RechartsLine
        {...props}
        className={cn(className)}
        type="monotone"
        stroke="var(--chart-color)"
        activeDot={{ r: 8 }}
        ref={ref as any}
      />
    );
  }
);
Line.displayName = "Line";

/**
 * Custom tooltip component
 */
export const ChartTooltip = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
  ({ className, active, payload, label, labelFormatter, formatter, ...props }, ref) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    // Default label formatter
    const defaultLabelFormatter = (label: any) => {
      return <span className="font-medium">{label}</span>;
    };

    // Default value formatter
    const defaultFormatter = (value: any, name: string) => {
      return [value, name];
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background border rounded px-3 py-2 shadow-md text-sm",
          className
        )}
      >
        <div className="mb-1">
          {(labelFormatter || defaultLabelFormatter)(label)}
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => {
            const [formattedValue, formattedName] = (formatter || defaultFormatter)(
              entry.value,
              entry.name
            );
            
            return (
              <div 
                key={`item-${index}`} 
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{formattedName}:</span>
                <span className="font-medium">{formattedValue}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltip.displayName = "ChartTooltip";

/**
 * Legend component with forwarded ref
 */
export const Legend = React.forwardRef<RechartsLegend, ChartComponentProps<any>>(
  ({ className, ...props }, ref) => {
    return (
      <RechartsLegend
        {...props}
        className={cn(className)}
        verticalAlign="bottom"
        height={36}
        ref={ref as any}
      />
    );
  }
);
Legend.displayName = "Legend";

// Re-usable chart presets

/**
 * BarChart preset component
 */
export function SimpleBarChart({
  data,
  categories,
  index,
  colors = ["#2563eb"],
  height = 300,
  className,
  ...props
}: {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  height?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} {...props}>
          <RechartsCartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="var(--border)"
          />
          <RechartsXAxis 
            dataKey={index} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value}
          />
          <RechartsYAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <RechartsTooltip
            content={({ active, payload, label }) => (
              <ChartTooltip 
                active={active} 
                payload={payload} 
                label={label} 
              />
            )}
          />
          <RechartsLegend />
          {categories.map((category, index) => (
            <RechartsBar
              key={index}
              dataKey={category}
              name={category}
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
              stackId={props.stacked ? "stack" : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * LineChart preset component
 */
export function SimpleLineChart({
  data,
  categories,
  index,
  colors = ["#2563eb"],
  height = 300,
  className,
  ...props
}: {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  height?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} {...props}>
          <RechartsCartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="var(--border)"
          />
          <RechartsXAxis 
            dataKey={index} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value}
          />
          <RechartsYAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <RechartsTooltip
            content={({ active, payload, label }) => (
              <ChartTooltip 
                active={active} 
                payload={payload} 
                label={label} 
              />
            )}
          />
          <RechartsLegend />
          {categories.map((category, index) => (
            <RechartsLine
              key={index}
              type="monotone"
              dataKey={category}
              name={category}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 6, style: { fill: "var(--chart-color)" } }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * AreaChart preset component
 */
export function SimpleAreaChart({
  data,
  categories,
  index,
  colors = ["#2563eb"],
  height = 300,
  className,
  ...props
}: {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  height?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} {...props}>
          <RechartsCartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="var(--border)"
          />
          <RechartsXAxis 
            dataKey={index} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value}
          />
          <RechartsYAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <RechartsTooltip
            content={({ active, payload, label }) => (
              <ChartTooltip 
                active={active} 
                payload={payload} 
                label={label} 
              />
            )}
          />
          <RechartsLegend />
          {categories.map((category, index) => (
            <RechartsArea
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 6, style: { fill: "var(--chart-color)" } }}
              stackId={props.stacked ? "stack" : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
