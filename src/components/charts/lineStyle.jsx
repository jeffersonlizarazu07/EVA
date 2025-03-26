import React, { useState, useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPieChart,
  faBarChart,
  faLineChart,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as MUITextTooltip } from "@mui/material";

Chart.register(
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
  ChartDataLabels,
  zoomPlugin,
  Filler
);

const LineStyleCharts = ({ label, dataChart, type, initialType }) => {
  const [chartType, setChartType] = useState(initialType);
  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100,
  });
  const chartRef = useRef(null);

  const applyFilters = (data) => {
    return data.map((value) =>
      value >= filters.minValue && value <= filters.maxValue ? value : null
    );
  };

  // Determinar la escala antes de mapear colores
  const scale =
    dataChart.length === 2 ? "0-1" : dataChart.length === 11 ? "0-10" : "1-5";

  const backgrounds =
    scale === "0-10"
      ? [
          "rgba(246, 0, 0, 0.6)", // 0: Rojo oscuro
          "rgba(246, 0, 0, 0.3)", // 1: Rojo claro
          "rgba(246, 0, 0, 0.3)", // 2: Rojo claro
          "rgba(246, 0, 0, 0.3)", // 3: Rojo claro
          "rgba(246, 0, 0, 0.3)", // 4: Rojo claro
          "rgba(246, 0, 0, 0.3)", // 5: Rojo claro
          "rgba(246, 0, 0, 0.3)", // 6: Rojo claro
          "rgba(229, 190, 1, 0.3)", // 7: Negro
          "rgba(229, 190, 1, 0.3)", // 8: Negro
          "rgba(57, 251, 137, 0.44)", // 9: Verde
          "rgba(57, 251, 137, 0.6)", // 10: Verde
        ]
      : scale === "1-5"
      ? [
          "rgba(246, 0, 0, 0.6)", // 1: Rojo oscuro
          "rgba(246, 0, 0, 0.3)", // 2: Rojo claro
          "rgba(229, 190, 1, 0.3)", // 3: Negro
          "rgba(57, 251, 137, 0.44)", // 4: Verde claro
          "rgba(57, 251, 137, 0.6)", // 5: Verde oscuro
        ]
      : [
          "rgba(246, 0, 0, 0.6)", // 0: Rojo oscuro
          "rgba(57, 251, 137, 0.6)", // 1: Verde oscuro
        ];

  const borders =
    scale === "0-10"
      ? [
          "rgba(246, 0, 0, 0.7)", // 0: Rojo oscuro
          "rgba(246, 0, 0, 0.5)", // 1: Rojo claro
          "rgba(246, 0, 0, 0.5)", // 2: Rojo claro
          "rgba(246, 0, 0, 0.5)", // 3: Rojo claro
          "rgba(246, 0, 0, 0.5)", // 4: Rojo claro
          "rgba(246, 0, 0, 0.5)", // 5: Rojo claro
          "rgba(246, 0, 0, 0.5)", // 6: Rojo claro
          "rgba(229, 190, 1, 0.7)", // 7: Negro
          "rgba(229, 190, 1, 0.7)", // 8: Negro
          "rgba(41, 168, 95, 1)", // 9: Verde
          "rgba(41, 168, 95, 1)", // 10: Verde
        ]
      : scale === "1-5"
      ? [
          "rgba(246, 0, 0, 0.7)", // 1: Rojo oscuro
          "rgba(246, 0, 0, 0.5)", // 2: Rojo claro
          "rgba(229, 190, 1, 0.7)", // 3: Negro
          "rgba(41, 168, 95, 1)", // 4: Verde claro
          "rgba(41, 168, 95, 1)", // 5: Verde oscuro
        ]
      : [
          "rgba(246, 0, 0, 0.7)", // 0: Rojo oscuro
          "rgba(41, 168, 95, 1)", // 1: Verde oscuro
        ];

  const labels =
    type === "range_zerototen"
      ? [
          "0: Nada probable",
          "1: Nada probable",
          "2: Nada probable",
          "3: Nada probable",
          "4: Nada probable",
          "5: Nada probable",
          "6: Nada probable",
          "7: Neutro",
          "8: Neutro",
          "9: Muy probable",
          "10: Muy probable",
        ]
      : type === "range_onetofive"
      ? [
          "Muy instisfecho",
          "Instisfecho",
          "Ni satisfecho / Ni insatisfecho",
          "Satisfecho",
          "Muy satisfecho",
        ]
      : type === "range_difficulty"
      ? [
          "Muy dificil",
          "Dificil",
          "Ni facil / Ni dificil",
          "Facil",
          "Muy facil",
        ]
      : ["No", "Si"];

  const filteredData = {
    labels: labels,
    datasets: [
      {
        label: "Data",
        data: applyFilters(dataChart),
        borderColor: borders,
        backgroundColor: backgrounds,
        tension: 0.2,
      },
    ],
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: Number(value),
    }));
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.chartInstance.resetZoom();
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    const chartInstance = new Chart(ctx, {
      type: chartType,
      data: filteredData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          title: {
            display: true,
            text: label,
            font: {
              size: 15, // Tamaño de la fuente en píxeles
              style: "italic", // Cursiva
              weight: "bold", // Negrita
            },
          },
          datalabels: {
            display: true,
            color: "white",
            align: "center",
            anchor: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 3,
            formatter: (value) =>
              value !== null ? `${value.toFixed(0)}%` : "",
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
          },
        },
        scales:
          chartType !== "pie"
            ? {
                x: {
                  title: {
                    display: true,
                    text: "Categorías",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Valores",
                  },
                },
              }
            : {},
        layout: {
          padding: 20,
        },
      },
    });

    chartRef.current.chartInstance = chartInstance;

    return () => {
      chartInstance.destroy();
    };
  }, [chartType, filteredData, label]);

  return (
    <div>
      <div className="row m-0 p-0 d-flex justify-content-around">
        <div className="col d-flex justify-content-center">
          <p className="fs-6 fw-bold fst-italic">Porcentaje mínimo</p>
        </div>
        <div className="col d-flex justify-content-center">
          <p className="fs-6 fw-bold fst-italic">Porcentaje máximo</p>
        </div>
      </div>
      <div className="row mb-3 d-flex justify-content-around">
        <input
          style={{ width: "30%", borderRadius: "8px", borderColor: "#c7c7c7" }}
          type="number"
          name="minValue"
          value={filters.minValue}
          onChange={handleFilterChange}
          placeholder="Min Value"
          min={0}
          max={100}
        />
        <input
          style={{ width: "30%", borderRadius: "8px", borderColor: "#c7c7c7" }}
          type="number"
          name="maxValue"
          value={filters.maxValue}
          onChange={handleFilterChange}
          placeholder="Max Value"
          min={0}
          max={100}
        />
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-10">
          <div
            className="btn-group mb-3 d-flex justify-content-center"
            role="group"
            aria-label="Basic example"
          >
            <MUITextTooltip title="PIE">
              <button
                type="button"
                className={`btn ${
                  chartType === "pie" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setChartType("pie")}
              >
                <FontAwesomeIcon icon={faPieChart} />
              </button>
            </MUITextTooltip>
            <MUITextTooltip title="BAR">
              <button
                type="button"
                className={`btn ${
                  chartType === "bar" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setChartType("bar")}
              >
                <FontAwesomeIcon icon={faBarChart} />
              </button>
            </MUITextTooltip>
            <MUITextTooltip title="LINE">
              <button
                type="button"
                className={`btn ${
                  chartType === "line" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setChartType("line")}
              >
                <FontAwesomeIcon icon={faLineChart} />
              </button>
            </MUITextTooltip>
          </div>
        </div>
        <div className="col">
          <MUITextTooltip title="Reset Zoom">
            <button type="button" className="btn btn-light" onClick={resetZoom}>
              <ZoomInMapIcon />
            </button>
          </MUITextTooltip>
        </div>
      </div>

      <canvas ref={chartRef} width="400" height="400" />
    </div>
  );
};

export default LineStyleCharts;
