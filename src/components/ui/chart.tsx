
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define chart component props
export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, any>>;
  type?: "line" | "bar" | "area" | "pie";
  xAxisKey?: string;
  yAxisKeys?: string[];
  height?: number;
  colors?: string[];
  stackKeys?: string[];
  hideTooltip?: boolean;
  hideGrid?: boolean;
  hideLegend?: boolean;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
}

const defaultColors = [
  "var(--chart-color)",
  "var(--chart-color-2)",
  "var(--chart-color-3)",
  "var(--chart-color-4)",
];

/**
 * Chart Component
 * 
 * A responsive charting component that supports line, bar, area, and pie charts
 */
export const Chart = React.forwardRef<
  HTMLDivElement,
  ChartProps
>(({
  className,
  data,
  type = "line",
  xAxisKey = "name",
  yAxisKeys = ["value"],
  height = 300,
  colors = defaultColors,
  stackKeys,
  hideTooltip = false,
  hideGrid = false,
  hideLegend = false,
  hideXAxis = false,
  hideYAxis = false,
  ...props
}, ref) => {
  const chartKey = React.useId();
  
  if (!data || data.length === 0) {
    return (
      <div
        ref={ref}
        className={cn("w-full flex items-center justify-center", className)}
        style={{ height: height || 300 }}
        {...props}
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Configure chart components
  const LegendComponent = !hideLegend ? (
    <Legend 
      iconType="circle" 
      verticalAlign="top" 
      align="right" 
      iconSize={8}
      wrapperStyle={{ paddingBottom: 10 }}
    />
  ) : null;
  
  const GridComponent = !hideGrid ? <CartesianGrid strokeDasharray="3 3" /> : null;
  
  const TooltipComponent = !hideTooltip ? <Tooltip /> : null;
  
  const XAxisComponent = !hideXAxis ? (
    <XAxis 
      dataKey={xAxisKey} 
      axisLine={false} 
      tickLine={false} 
      fontSize={12}
      tick={{ fill: "var(--muted-foreground)" }}
    />
  ) : null;
  
  const YAxisComponent = !hideYAxis ? (
    <YAxis 
      axisLine={false} 
      tickLine={false} 
      fontSize={12}
      tick={{ fill: "var(--muted-foreground)" }}
    />
  ) : null;

  // Render appropriate chart based on type
  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{ height: height || 300 }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" && (
          <LineChart data={data}>
            {GridComponent}
            {XAxisComponent}
            {YAxisComponent}
            {TooltipComponent}
            {LegendComponent}
            {yAxisKeys.map((key, index) => (
              <Line
                key={`${chartKey}-line-${key}`}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, style: { fill: "var(--chart-color)" } }}
                isAnimationActive={true}
                animationDuration={500}
              />
            ))}
          </LineChart>
        )}

        {type === "bar" && (
          <BarChart data={data}>
            {GridComponent}
            {XAxisComponent}
            {YAxisComponent}
            {TooltipComponent}
            {LegendComponent}
            {yAxisKeys.map((key, index) => (
              <Bar
                key={index}
                dataKey={key}
                name={key}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                stackId={stackKeys?.[index] || undefined}
              />
            ))}
          </BarChart>
        )}

        {type === "area" && (
          <AreaChart data={data}>
            {GridComponent}
            {XAxisComponent}
            {YAxisComponent}
            {TooltipComponent}
            {LegendComponent}
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                strokeWidth={2}
                activeDot={{ r: 5, style: { fill: "var(--chart-color)" } }}
                stackId={stackKeys?.[index] || undefined}
              />
            ))}
          </AreaChart>
        )}

        {type === "pie" && (
          <PieChart>
            {TooltipComponent}
            {LegendComponent}
            <Pie
              data={data}
              nameKey={xAxisKey}
              dataKey={yAxisKeys[0] || "value"}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              isAnimationActive={true}
              animationDuration={500}
              label
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
});

Chart.displayName = "Chart";
