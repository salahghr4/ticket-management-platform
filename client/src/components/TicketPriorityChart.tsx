import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

export function TicketPriorityChart({
  highestPriority,
  mediumPriority,
  lowPriority,
}: {
  highestPriority: number;
  mediumPriority: number;
  lowPriority: number;
}) {
  const chartData = useMemo(() => {
    return [
      {
        priority: "high",
        tickets: highestPriority,
        fill: "var(--color-chart-5)",
      },
      {
        priority: "medium",
        tickets: mediumPriority,
        fill: "var(--color-chart-4)",
      },
      { priority: "low", tickets: lowPriority, fill: "var(--color-chart-1)" },
    ];
  }, [highestPriority, mediumPriority, lowPriority]);

  const [activeIndex, setActiveIndex] = useState(
    chartData.findIndex(
      (priority) =>
        priority.tickets ===
        Math.max(...chartData.map((priority) => priority.tickets))
    )
  );

  useEffect(() => {
    setActiveIndex(
      chartData.findIndex(
        (priority) =>
          priority.tickets ===
          Math.max(...chartData.map((priority) => priority.tickets))
      )
    );
  }, [chartData]);

  const chartConfig = {
    tickets: {
      label: "Tickets",
    },
    high: {
      label: "High",
    },
    medium: {
      label: "Medium",
    },
    low: {
      label: "Low",
    },
  } satisfies ChartConfig;

  const totalTickets = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.tickets, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col w-full lg:w-[390px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Ticket Priority</CardTitle>
        <CardDescription>Total tickets by priority</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="tickets"
              nameKey="priority"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector
                  {...props}
                  outerRadius={outerRadius + 10}
                />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTickets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tickets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing total tickets by priority
        </div>
        <div className="leading-none text-muted-foreground">
          the {chartData[activeIndex].priority} priority has the most tickets
        </div>
      </CardFooter>
    </Card>
  );
}
