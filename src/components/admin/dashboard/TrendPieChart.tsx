import ReactECharts from "echarts-for-react";

export interface TrendItem {
    label: string;
    total: number;
    percentage: number;
}

interface TrendPieChartProps {
    title: string;
    data: TrendItem[];
}

// Fixed categorical order — never cycled/reassigned by rank.
const CATEGORICAL_COLORS = [
    "#2a78d6", // blue
    "#008300", // green
    "#e87ba4", // magenta
    "#eda100", // yellow
    "#1baf7a", // aqua
    "#eb6834", // orange
    "#4a3aa7", // violet
    "#e34948"  // red
];
const OTHER_COLOR = "#a8a6a0";
const MAX_SLICES = 8;

function foldToOther(data: TrendItem[]): TrendItem[] {
    if (data.length <= MAX_SLICES) return data;

    const head = data.slice(0, MAX_SLICES - 1);
    const tail = data.slice(MAX_SLICES - 1);
    const other: TrendItem = {
        label: "Khác",
        total: tail.reduce((sum, item) => sum + item.total, 0),
        percentage: Number(tail.reduce((sum, item) => sum + item.percentage, 0).toFixed(2))
    };
    return [...head, other];
}

function TrendPieChart({ title, data }: TrendPieChartProps) {
    const slices = foldToOther(data);
    const colors = slices.map((item, index) =>
        item.label === "Khác" ? OTHER_COLOR : CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]
    );

    const option = {
        color: colors,
        tooltip: {
            trigger: "item",
            formatter: (params: any) =>
                `${params.marker} ${params.name}: <b>${params.value}</b> (${params.percent}%)`
        },
        legend: {
            bottom: 0,
            left: "center",
            type: "scroll",
            textStyle: { color: "#52514e", fontSize: 12 }
        },
        series: [
            {
                name: title,
                type: "pie",
                radius: ["40%", "68%"],
                center: ["50%", "44%"],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderColor: "#fcfcfb",
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: (params: any) => (params.percent >= 8 ? `${params.percent}%` : ""),
                    color: "#0b0b0b",
                    fontSize: 12
                },
                labelLine: { show: true },
                data: slices.map((item) => ({ name: item.label, value: item.total }))
            }
        ]
    };

    return (
        <div className="trend-pie-card">
            <div className="trend-pie-title">{title}</div>
            {slices.length === 0 ? (
                <div className="trend-pie-empty">Không có dữ liệu</div>
            ) : (
                <ReactECharts option={option} style={{ height: 320 }} notMerge />
            )}
        </div>
    );
}

export default TrendPieChart;
