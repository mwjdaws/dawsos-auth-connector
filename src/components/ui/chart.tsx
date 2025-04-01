
import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Import recharts components directly
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Define chart variant styles
const chartVariants = cva("", {
  variants: {
    variant: {
      default: "",
      stacked: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Define chart wrapper styles
const ChartWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full overflow-hidden", className)}
    {...props}
  />
));
ChartWrapper.displayName = "ChartWrapper";

// Define chart tooltip styles
const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background p-2 shadow-md",
      className
    )}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

// Chart area component
const ChartArea = ({ className, ...props }: React.ComponentProps<typeof Area>) => (
  <Area className={cn("fill-primary/20 stroke-primary", className)} {...props} />
);
ChartArea.displayName = "ChartArea";

// Chart bar component
const ChartBar = ({ className, ...props }: React.ComponentProps<typeof Bar>) => (
  <Bar className={cn("fill-primary", className)} {...props} />
);
ChartBar.displayName = "ChartBar";

// Chart line component
const ChartLine = ({ className, ...props }: React.ComponentProps<typeof Line>) => (
  <Line
    className={cn("stroke-primary", className)}
    strokeWidth={2}
    activeDot={{ r: 4 }}
    {...props}
  />
);
ChartLine.displayName = "ChartLine";

// Cart grid component
const ChartGrid = ({ className, ...props }: React.ComponentProps<typeof CartesianGrid>) => (
  <CartesianGrid
    className={cn("stroke-border opacity-25", className)}
    strokeDasharray="3 3"
    {...props}
  />
);
ChartGrid.displayName = "ChartGrid";

// Chart X-axis component
interface ChartXAxisProps extends React.ComponentProps<typeof XAxis> {
  dataKey: string;
}

const ChartXAxis = ({ className, ...props }: ChartXAxisProps) => (
  <XAxis
    className={cn("text-muted-foreground text-xs", className)}
    {...props}
  />
);
ChartXAxis.displayName = "ChartXAxis";

// Chart Y-axis component
interface ChartYAxisProps extends React.ComponentProps<typeof YAxis> {
  dataKey?: string;
}

const ChartYAxis = ({ className, ...props }: ChartYAxisProps) => (
  <YAxis
    className={cn("text-muted-foreground text-xs", className)}
    {...props}
  />
);
ChartYAxis.displayName = "ChartYAxis";

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: any;
    payload: any;
  }>;
  label?: string;
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (value: any) => React.ReactNode;
  itemSorter?: (a: any, b: any) => number;
}

const CustomTooltip = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
  ({ active, payload, label, formatter, labelFormatter, itemSorter }, ref) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const getFormattedValue = (item: any) => {
      return formatter ? formatter(item.value, item.name, item) : item.value;
    };

    const getFormattedLabel = () => {
      return labelFormatter ? labelFormatter(label) : label;
    };

    // Sort items if a sorter is provided
    const sortedPayload = itemSorter
      ? [...payload].sort(itemSorter)
      : payload;

    return (
      <ChartTooltip ref={ref}>
        <div className="text-sm font-medium">{getFormattedLabel()}</div>
        <div className="mt-1 grid gap-0.5">
          {sortedPayload.map((item, index) => {
            if (!item) return null;
            return (
              <div key={`tooltip-item-${index}`} className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs text-muted-foreground">{item.name}</div>
                <div className="ml-auto text-xs font-medium">
                  {getFormattedValue(item)}
                </div>
              </div>
            );
          })}
        </div>
      </ChartTooltip>
    );
  }
);
CustomTooltip.displayName = "CustomTooltip";

// Chart tooltip component
const ChartCustomTooltip = ({ formatter, labelFormatter, itemSorter }: CustomTooltipProps) => (
  <Tooltip
    content={
      <CustomTooltip
        formatter={formatter}
        labelFormatter={labelFormatter}
        itemSorter={itemSorter}
      />
    }
  />
);
ChartCustomTooltip.displayName = "ChartCustomTooltip";

// Chart legend component
const ChartLegend = ({ className, ...props }: React.ComponentProps<typeof Legend>) => (
  <Legend
    className={cn("text-xs text-muted-foreground", className)}
    verticalAlign="bottom"
    height={36}
    {...props}
  />
);
ChartLegend.displayName = "ChartLegend";

// Main chart component
interface ChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartVariants> {
  width?: number;
  height?: number;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, variant, width = 800, height = 400, ...props }, ref) => (
    <ChartWrapper
      ref={ref}
      className={cn(chartVariants({ variant }), className)}
      {...props}
    />
  )
);
Chart.displayName = "Chart";

// Export variants component
const ChartContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart {...props} />
  </ResponsiveContainer>
));
ChartContent.displayName = "ChartContent";

// Define data keys
type DataKey = string | number;

// Chart bars component
interface ChartBarsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    key: DataKey;
    name: string;
    color?: string;
    activeDot?: boolean | { r: number } | React.ReactNode;
  }>;
  grid?: boolean;
  stackId?: string;
  horizontal?: boolean;
  tooltipLabel?: string;
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (value: any) => React.ReactNode;
  itemSorter?: (a: any, b: any) => number;
}

const ChartBars = ({
  data,
  dataKeys,
  grid = true,
  stackId,
  horizontal = false,
  tooltipLabel,
  formatter,
  labelFormatter,
  itemSorter,
}: ChartBarsProps) => {
  if (!data || !dataKeys || dataKeys.length === 0) {
    return null;
  }

  const categoryKey = tooltipLabel || Object.keys(data[0] || {}).find((key) => key !== "name") || "";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        {grid && <ChartGrid />}
        {horizontal ? (
          <XAxis type="number" />
        ) : (
          <XAxis dataKey="name" />
        )}
        {horizontal ? (
          <YAxis dataKey="name" type="category" />
        ) : (
          <YAxis />
        )}
        <ChartCustomTooltip 
          formatter={formatter} 
          labelFormatter={labelFormatter} 
          itemSorter={itemSorter}
        />
        <ChartLegend />
        {dataKeys.map((item, index) => (
          <Bar
            key={index}
            dataKey={item.key}
            name={item.name}
            fill={item.color}
            stroke={item.color}
            stackId={stackId}
            activeDot={item.activeDot ? { r: 4 } : undefined}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
ChartBars.displayName = "ChartBars";

// Chart lines component
interface ChartLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    key: DataKey;
    name: string;
    color?: string;
    activeDot?: boolean | { r: number } | React.ReactNode;
  }>;
  grid?: boolean;
  lineType?: "linear" | "stepAfter" | "stepBefore" | "natural" | "monotone" | "monotoneX" | "monotoneY" | "basis" | "cardinal";
  tooltipLabel?: string;
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (value: any) => React.ReactNode;
  itemSorter?: (a: any, b: any) => number;
}

const ChartLines = ({
  data,
  dataKeys,
  grid = true,
  lineType = "monotone",
  tooltipLabel,
  formatter,
  labelFormatter,
  itemSorter,
}: ChartLinesProps) => {
  if (!data || !dataKeys || dataKeys.length === 0) {
    return null;
  }

  const categoryKey = tooltipLabel || Object.keys(data[0] || {}).find((key) => key !== "name") || "";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        {grid && <ChartGrid />}
        <XAxis dataKey="name" />
        <YAxis />
        <ChartCustomTooltip
          formatter={formatter}
          labelFormatter={labelFormatter}
          itemSorter={itemSorter}
        />
        <ChartLegend />
        {dataKeys.map((item, index) => (
          <Line
            key={index}
            type={lineType}
            dataKey={item.key}
            name={item.name}
            stroke={item.color}
            activeDot={item.activeDot ? { r: 4 } : undefined}
            strokeWidth={2}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
ChartLines.displayName = "ChartLines";

export {
  Chart,
  ChartArea,
  ChartBar,
  ChartBars,
  ChartContent,
  ChartCustomTooltip,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartLines,
  ChartTooltip,
  ChartWrapper,
  ChartXAxis,
  ChartYAxis,
};
