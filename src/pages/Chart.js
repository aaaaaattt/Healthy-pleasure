import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData("1/1", 79),
  createData("1/8", 81),
  createData("1/15", 76),
  createData("1/22", 77),
  createData("1/29", 75),
  createData("2/5", 77),
  createData("2/12", 79),
  createData("2/19", 80),
  createData("2/26", 81),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>1~2월</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              몸무게 (kg)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
