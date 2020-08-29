import { useCallback, useMemo } from "react";
import { Chart } from "react-charts";
import styled from "../utils/theme";
import { IStat } from "../api/getStats";
import { CardContainer } from "./Card";
import { css } from "@emotion/core";

const Card = styled(CardContainer)`
  padding: 0px;
  border: none;
  height: auto !important;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 100px;
  width: 100%;
`;

const TextContent = styled.div`
  padding: 20px 20px 20px;
  h2 {
    margin: 0;
    font-size: 24px;
  }

  h3 {
    margin: 5px 0 0;
    font-size: 16px;
    font-weight: 400;
    color: ${(x) => x.theme.textFade};
  }
`;

const CustomTooltip = (datum) => (
  <div
    css={css`
      padding: 10px 20px;
    `}
  >
    <h2
      css={css`
        font-size: 18px;
        margin: 0;
      `}
    >
      {datum?.datum?.primary.toISOString().slice(0, 10)}
    </h2>
    <h3
      css={css`
        font-size: 16px;
        margin: 0;
      `}
    >
      {datum?.datum?.secondary} views
    </h3>
  </div>
);

const StatsChart = ({ data }: { data: IStat[] }) => {
  const chartData = useMemo(
    () => [
      {
        label: "Test",
        data: data.map((e) => [new Date(e.Period), e.Value]),
      },
    ],
    [data]
  );

  const series = useMemo(
    () => ({
      type: "area",
    }),
    []
  );

  const getSeriesStyle = useCallback((series) => {
    return {
      area: {
        fill: "#32708077",
      },
      line: {
        stroke: "#00ff00ff",
      },
    };
  }, []);

  const axes = useMemo(
    () => [
      { primary: true, position: "bottom", type: "utc", show: false },
      { position: "left", type: "linear", stacked: true, show: false },
    ],
    []
  );

  const tooltip = useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }) => {
        return <CustomTooltip datum={datum} />;
      },
    }),
    []
  );

  const totalViews = useMemo(
    () => data.map((e) => e.Value).reduce((a, b) => a + b, 0),
    [data]
  );

  return (
    <Card>
      <TextContent>
        <h2>Daily views</h2>
        <h3>{totalViews} views in the last week</h3>
      </TextContent>
      {totalViews > 0 && (
        <ChartContainer>
          <Chart
            data={chartData}
            series={series}
            axes={axes}
            tooltip={tooltip}
            getSeriesStyle={getSeriesStyle}
            css={css`
              z-index: 69;
              svg {
                border-radius: 0 0 8px 8px;
              }
              .tooltip-wrap > div > div > div {
                background: #111 !important;
                border-radius: 8px !important;
                > div {
                  border-right-color: #111 !important;
                }
              }
            `}
          />
        </ChartContainer>
      )}
    </Card>
  );
};

export default StatsChart;
