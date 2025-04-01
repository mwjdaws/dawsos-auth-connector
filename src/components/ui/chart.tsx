
"use client";

import * as React from "react";
import { ChartProps, LineProps, AreaProps, BarProps, PieProps, ChartData } from "recharts";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend as RechartsLegend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

// Base chart wrapper component
const BaseChart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-[350px]", className)}
    {...props}
  />
));
BaseChart.displayName = "BaseChart";

// Legend component
const Legend = React.forwardRef<
  SVGElement,
  React.ComponentProps<typeof RechartsLegend>
>(({ className, ...props }, ref) => (
  <RechartsLegend
    className={cn("", className)}
    {...props}
    ref={ref}
  />
));
Legend.displayName = "Legend";

// Line component
const LineComponent = React.forwardRef<
  SVGPathElement,
  LineProps & { className?: string }
>(({ className, ...props }, ref) => (
  <Line
    className={cn("", className)}
    type="monotone"
    strokeWidth={2}
    activeDot={{ r: 6, style: { fill: "var(--chart-color)" } }}
    {...props}
    ref={ref}
  />
));
LineComponent.displayName = "LineComponent";

// Area component
const AreaComponent = React.forwardRef<
  SVGPathElement,
  React.ComponentProps<typeof Area> & { className?: string; dataKey: string }
>(({ className, ...props }, ref) => (
  <Area
    className={cn("", className)}
    type="monotone"
    dataKey={props.dataKey}
    ref={ref}
  />
));
AreaComponent.displayName = "AreaComponent";

// Bar component
const BarComponent = React.forwardRef<
  SVGPathElement,
  React.ComponentProps<typeof Bar> & { className?: string; dataKey: string }
>(({ className, ...props }, ref) => (
  <Bar
    className={cn("", className)}
    dataKey={props.dataKey}
    fill="var(--chart-color)"
    radius={4}
    {...props}
    ref={ref}
  />
));
BarComponent.displayName = "BarComponent";

// Line chart
const LineChartComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof LineChart> & {
    data: ChartData[];
    className?: string;
    showTooltip?: boolean;
    showLegend?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showCartesianGrid?: boolean;
    children?: React.ReactNode;
  }
>(
  (
    {
      data,
      className,
      showTooltip = true,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showCartesianGrid = true,
      children,
      ...props
    },
    ref
  ) => (
    <BaseChart ref={ref} className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} {...props}>
          {showXAxis && <XAxis />}
          {showYAxis && <YAxis />}
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" />}
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {children}
        </LineChart>
      </ResponsiveContainer>
    </BaseChart>
  )
);
LineChartComponent.displayName = "LineChartComponent";

// Bar chart
const BarChartComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BarChart> & {
    data: ChartData[];
    className?: string;
    showTooltip?: boolean;
    showLegend?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showCartesianGrid?: boolean;
    children?: React.ReactNode;
  }
>(
  (
    {
      data,
      className,
      showTooltip = true,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showCartesianGrid = true,
      children,
      ...props
    },
    ref
  ) => (
    <BaseChart ref={ref} className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} {...props}>
          {showXAxis && <XAxis />}
          {showYAxis && <YAxis />}
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" />}
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {children}
        </BarChart>
      </ResponsiveContainer>
    </BaseChart>
  )
);
BarChartComponent.displayName = "BarChartComponent";

// Custom tooltip props
interface CustomTooltipProps {
  active: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Bar chart with custom tooltip
const BarChartWithTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BarChartComponent> & {
    series: Array<{
      dataKey: string;
      name: string;
      fill?: string;
      stroke?: string;
      stackId?: string;
    }>;
  }
>(({ data, series, ...props }, ref) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center truncate text-sm">
              <div className="mr-1 h-2 w-2" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name}: </span>
              <span className="ml-1 font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <BarChartComponent data={data} ref={ref} {...props}>
      {series.map((s, index) => (
        <Bar 
          key={index}
          dataKey={s.dataKey}
          name={s.name}
          fill={s.fill}
          stroke={s.stroke}
          stackId={s.stackId || undefined}
        />
      ))}
      <Tooltip content={<CustomTooltip active={false} />} />
    </BarChartComponent>
  );
});
BarChartWithTooltip.displayName = "BarChartWithTooltip";

// Area chart
const AreaChartComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof AreaChart> & {
    data: ChartData[];
    className?: string;
    showTooltip?: boolean;
    showLegend?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showCartesianGrid?: boolean;
    children?: React.ReactNode;
  }
>(
  (
    {
      data,
      className,
      showTooltip = true,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showCartesianGrid = true,
      children,
      ...props
    },
    ref
  ) => (
    <BaseChart ref={ref} className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} {...props}>
          {showXAxis && <XAxis />}
          {showYAxis && <YAxis />}
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" />}
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {children}
        </AreaChart>
      </ResponsiveContainer>
    </BaseChart>
  )
);
AreaChartComponent.displayName = "AreaChartComponent";

// Area chart with custom tooltip
const AreaChartWithTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof AreaChartComponent> & {
    series: Array<{
      dataKey: string;
      name?: string;
      fill?: string;
      stroke?: string;
      stackId?: string;
    }>;
  }
>(({ data, series, ...props }, ref) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center truncate text-sm">
              <div className="mr-1 h-2 w-2" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name || entry.dataKey}: </span>
              <span className="ml-1 font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AreaChartComponent data={data} ref={ref} {...props}>
      {series.map((s, index) => (
        <Area 
          key={s.dataKey}
          type="monotone"
          dataKey={s.dataKey}
          stroke={s.stroke}
          fill={s.fill}
          strokeWidth={2}
          activeDot={{ r: 6, style: { fill: "var(--chart-color)" } }}
          stackId={s.stackId || undefined}
        />
      ))}
      <Tooltip content={<CustomTooltip active={false} />} />
    </AreaChartComponent>
  );
});
AreaChartWithTooltip.displayName = "AreaChartWithTooltip";

export {
  BaseChart,
  Legend,
  LineComponent as Line,
  AreaComponent as Area,
  BarComponent as Bar,
  LineChartComponent as LineChart,
  BarChartComponent as BarChart,
  BarChartWithTooltip,
  AreaChartComponent as AreaChart,
  AreaChartWithTooltip,
};
