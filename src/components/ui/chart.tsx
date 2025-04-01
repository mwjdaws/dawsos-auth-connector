
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";

// Recharts component types
type AreaChartComponentType = typeof AreaChart;
type LineChartComponentType = typeof LineChart;
type BarChartComponentType = typeof BarChart;
type PieChartComponentType = typeof PieChart;

const chartComponents = {
  area: AreaChart,
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
};

type ChartComponentsType = typeof chartComponents;
type ChartType = keyof ChartComponentsType;
type ChartComponent<T extends ChartType> = ChartComponentsType[T];

type ChartProps<T extends ChartType> = React.ComponentPropsWithoutRef<ChartComponent<T>> & {
  type: T;
};

// Type for custom tooltip
interface CustomTooltipProps extends TooltipProps<any, any> {
  formatter: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter: (value: any) => React.ReactNode;
  itemSorter: (a: any, b: any) => number;
}

export function Chart<T extends ChartType>({
  type,
  className,
  children,
  ...props
}: ChartProps<T>) {
  const ChartComp = chartComponents[type] as React.ComponentType<any>;

  return (
    <div className="aspect-auto w-full h-full overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComp
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          className={cn("", className)}
          {...props}
        >
          {children}
        </ChartComp>
      </ResponsiveContainer>
    </div>
  );
}

type ChartAreaProps = React.ComponentPropsWithoutRef<typeof Area>;

export const ChartArea = React.forwardRef<
  React.ElementRef<typeof Area>,
  ChartAreaProps
>(({ className, ...props }, ref) => (
  <Area 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartArea.displayName = "ChartArea";

type ChartBarProps = React.ComponentPropsWithoutRef<typeof Bar>;

export const ChartBar = React.forwardRef<
  React.ElementRef<typeof Bar>,
  ChartBarProps
>(({ className, ...props }, ref) => (
  <Bar 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartBar.displayName = "ChartBar";

type ChartLineProps = React.ComponentPropsWithoutRef<typeof Line>;

export const ChartLine = React.forwardRef<
  React.ElementRef<typeof Line>,
  ChartLineProps
>(({ className, ...props }, ref) => (
  <Line 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartLine.displayName = "ChartLine";

type ChartAxisProps = React.ComponentPropsWithoutRef<typeof XAxis>;

export const ChartXAxis = React.forwardRef<
  React.ElementRef<typeof XAxis>,
  ChartAxisProps
>(({ className, ...props }, ref) => (
  <XAxis 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartXAxis.displayName = "ChartXAxis";

export const ChartYAxis = React.forwardRef<
  React.ElementRef<typeof YAxis>,
  ChartAxisProps
>(({ className, ...props }, ref) => (
  <YAxis 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartYAxis.displayName = "ChartYAxis";

type ChartGridProps = React.ComponentPropsWithoutRef<typeof CartesianGrid>;

export const ChartGrid = React.forwardRef<
  React.ElementRef<typeof CartesianGrid>,
  ChartGridProps
>(({ className, ...props }, ref) => (
  <CartesianGrid 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartGrid.displayName = "ChartGrid";

export const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  formatter, 
  labelFormatter, 
  itemSorter
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md text-sm animate-in fade-in-50 zoom-in-95">
        <div className="font-medium mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
        <div className="space-y-1">
          {payload
            .sort((a: any, b: any) => (itemSorter ? itemSorter(a, b) : 0))
            .map((item: any, index: number) => (
              <div
                key={`item-${index}`}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color || item.fill }}
                />
                <span className="text-muted-foreground">
                  {item.name}:
                </span>{" "}
                <span className="font-medium">
                  {formatter ? formatter(item.value, item.name, item.payload) : item.value}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ChartTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  Partial<CustomTooltipProps>
>(({ className, formatter, labelFormatter, itemSorter, ...props }, ref) => (
  <Tooltip
    ref={ref}
    content={<CustomTooltip formatter={formatter} labelFormatter={labelFormatter} itemSorter={itemSorter} />}
    cursor={{ fill: "hsl(var(--muted)/0.2)" }}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

type ChartLegendProps = React.ComponentPropsWithoutRef<typeof Legend>;

export const ChartLegend = React.forwardRef<
  React.ElementRef<typeof Legend>,
  ChartLegendProps
>(({ className, ...props }, ref) => (
  <Legend 
    ref={ref}
    className={cn("", className)} 
    {...props} 
  />
));
ChartLegend.displayName = "ChartLegend";

export function SimpleAreaChart({ 
  data, 
  categories,
  index,
  colors,
  valueFormatter,
  startEndOnly = false,
  showLegend = true,
  stack = false,
  showYAxis = false,
  showXAxis = false,
  yAxisWidth,
  showValues = false,
  showGridLines = true,
  ...props 
}: React.ComponentProps<typeof Chart<"area">> & {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showLegend?: boolean;
  stack?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  yAxisWidth?: number;
  showValues?: boolean;
  showGridLines?: boolean;
}) {
  return (
    <Chart type="area" data={data} {...props}>
      {showGridLines && <ChartGrid strokeDasharray="3 3" vertical={false} />}
      {showXAxis && (
        <ChartXAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          tickFormatter={(value: any) => {
            // Format the tick value
            return value;
          }}
        />
      )}
      {showYAxis && (
        <ChartYAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: any) => {
            // Format the tick value based on valueFormatter from props
            if (valueFormatter) {
              return valueFormatter(value);
            }
            return value;
          }}
        />
      )}
      <ChartTooltip
        formatter={(value: any, name: string) => [
          valueFormatter ? valueFormatter(value) : value,
          name,
        ]}
      />
      {showLegend && (
        <ChartLegend
          verticalAlign="top"
          height={40}
          content={({ payload }: any) => {
            if (payload && payload.length) {
              return (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
      )}
      {categories.map((category, index) => (
        <ChartArea
          key={category}
          type="monotone"
          dataKey={category}
          stroke={colors?.[index] || `hsl(var(--chart-${index + 1}))`}
          fill={colors?.[index] || `hsl(var(--chart-${index + 1}) / 0.5)`}
          strokeWidth={2}
          activeDot={{ r: 6, style: { fill: "var(--chart-color)" } }}
          stackId={stack ? "a" : undefined}
        />
      ))}
    </Chart>
  );
}

export function SimpleBarChart({ 
  data, 
  categories,
  index,
  colors,
  valueFormatter,
  startEndOnly = false,
  showLegend = true,
  stack = false,
  showYAxis = false,
  showXAxis = false,
  yAxisWidth,
  ...props 
}: React.ComponentProps<typeof Chart<"bar">> & {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showLegend?: boolean;
  stack?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  yAxisWidth?: number;
}) {
  return (
    <Chart type="bar" data={data} {...props}>
      <ChartGrid strokeDasharray="3 3" vertical={false} />
      {showXAxis && (
        <ChartXAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          tickFormatter={(value: any) => {
            // Format the tick value
            return value;
          }}
        />
      )}
      {showYAxis && (
        <ChartYAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: any) => {
            // Format the tick value based on valueFormatter from props
            if (valueFormatter) {
              return valueFormatter(value);
            }
            return value;
          }}
        />
      )}
      <ChartTooltip
        formatter={(value: any, name: string) => [
          valueFormatter ? valueFormatter(value) : value,
          name,
        ]}
      />
      {showLegend && (
        <ChartLegend
          verticalAlign="top"
          height={40}
          content={({ payload }: any) => {
            if (payload && payload.length) {
              return (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
      )}
      {categories.map((category, index) => (
        <Bar
          key={index}
          dataKey={category}
          name={category}
          fill={colors?.[index] || `hsl(var(--chart-${index + 1}))`}
          stroke={colors?.[index] || `hsl(var(--chart-${index + 1}))`}
          stackId={stack ? "a" : undefined}
        />
      ))}
    </Chart>
  );
}

export function SimpleLineChart({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  startEndOnly = false,
  showLegend = true,
  showYAxis = false,
  showXAxis = false,
  yAxisWidth,
  showCurve = false,
  showPoint = true,
  ...props
}: React.ComponentProps<typeof Chart<"line">> & {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showLegend?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  yAxisWidth?: number;
  showCurve?: boolean;
  showPoint?: boolean;
}) {
  return (
    <Chart type="line" data={data} {...props}>
      <ChartGrid strokeDasharray="3 3" vertical={false} />
      {showXAxis && (
        <ChartXAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          tickFormatter={(value: any) => {
            // Format the tick value
            return value;
          }}
        />
      )}
      {showYAxis && (
        <ChartYAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: any) => {
            // Format the tick value based on valueFormatter from props
            if (valueFormatter) {
              return valueFormatter(value);
            }
            return value;
          }}
        />
      )}
      <ChartTooltip
        formatter={(value: any, name: string) => [
          valueFormatter ? valueFormatter(value) : value,
          name,
        ]}
      />
      {showLegend && (
        <ChartLegend
          verticalAlign="top"
          height={40}
          content={({ payload }: any) => {
            if (payload && payload.length) {
              return (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
      )}
      {categories.map((category, index) => (
        <Line
          key={index}
          type={showCurve ? "monotone" : "linear"}
          dataKey={category}
          stroke={colors?.[index] || `hsl(var(--chart-${index + 1}))`}
          strokeWidth={2}
          dot={
            showPoint ? { r: 3, fill: colors?.[index] || `hsl(var(--chart-${index + 1}))` } : false
          }
          activeDot={{
            r: 6,
            style: { fill: colors?.[index] || `hsl(var(--chart-${index + 1}))` },
          }}
        />
      ))}
    </Chart>
  );
}
