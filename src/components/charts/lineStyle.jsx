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
  console.log("Componente LineStyleCharts renderizado");
  console.log("Datos recibidos por LineStyleCharts:", dataChart);

  const [chartType, setChartType] = useState(initialType);
  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100,
  });
  const chartRef = useRef(null);

  const applyFilters = (data) => {
  return data.map((item) => {
    // Verificamos si el item tiene una propiedad 'value'
    const numericValue = item && item.value !== undefined ? Number(item.value) : NaN;

    // Comprobamos si el valor es un número
    if (isNaN(numericValue)) {
      console.log("Valor no numérico encontrado:", item); // Mostramos todo el objeto
      return null; // Filtramos los valores no numéricos
    }

    // Comprobamos si el valor está dentro del rango de filtros
    console.log("Comprobando:", numericValue, "Rango:", filters.minValue, filters.maxValue);
    if (numericValue >= filters.minValue && numericValue <= filters.maxValue) {
      return numericValue; // Valor dentro del rango
    } else {
      // Si está fuera del rango, lo convertimos a null
      return null;
    }
  });
};


  // Determinar la escala antes de mapear colores
  const scale =
    dataChart.length === 2 ? "0-1" : dataChart.length === 11 ? "0-10" : "1-5";

    const backgrounds =
    scale === "0-10"
      ? [
          "rgba(255, 0, 255, 0.6)", // 0: Fucsia oscuro
          "rgba(255, 0, 255, 0.3)", // 1: Fucsia claro
          "rgba(255, 0, 255, 0.3)", // 2: Fucsia claro
          "rgba(255, 0, 255, 0.3)", // 3: Fucsia claro
          "rgba(255, 0, 255, 0.3)", // 4: Fucsia claro
          "rgba(255, 0, 255, 0.3)", // 5: Fucsia claro
          "rgba(255, 0, 255, 0.3)", // 6: Fucsia claro
          "rgba(128, 0, 128, 0.3)", // 7: Morado
          "rgba(128, 0, 128, 0.3)", // 8: Morado
          "rgba(255, 105, 180, 0.44)", // 9: Rosa fuerte
          "rgba(255, 105, 180, 0.6)", // 10: Rosa fuerte
        ]
      : scale === "1-5"
      ? [
          "rgba(255, 0, 255, 0.6)", // 1: Fucsia oscuro
          "rgba(255, 0, 255, 0.3)", // 2: Fucsia claro
          "rgba(128, 0, 128, 0.3)", // 3: Morado
          "rgba(255, 105, 180, 0.44)", // 4: Rosa claro
          "rgba(255, 105, 180, 0.6)", // 5: Rosa fuerte
        ]
      : [
          "rgba(255, 0, 255, 0.6)", // 0: Fucsia oscuro
          "rgba(255, 105, 180, 0.6)", // 1: Rosa fuerte
        ];
  
  const borders =
    scale === "0-10"
      ? [
          "rgba(255, 0, 255, 0.7)", // 0: Fucsia oscuro
          "rgba(255, 0, 255, 0.5)", // 1: Fucsia claro
          "rgba(255, 0, 255, 0.5)", // 2: Fucsia claro
          "rgba(255, 0, 255, 0.5)", // 3: Fucsia claro
          "rgba(255, 0, 255, 0.5)", // 4: Fucsia claro
          "rgba(255, 0, 255, 0.5)", // 5: Fucsia claro
          "rgba(255, 0, 255, 0.5)", // 6: Fucsia claro
          "rgba(128, 0, 128, 0.7)", // 7: Morado
          "rgba(128, 0, 128, 0.7)", // 8: Morado
          "rgba(255, 105, 180, 1)", // 9: Rosa fuerte
          "rgba(255, 105, 180, 1)", // 10: Rosa fuerte
        ]
      : scale === "1-5"
      ? [
          "rgba(255, 0, 255, 0.7)", // 1: Fucsia oscuro
          "rgba(255, 0, 255, 0.5)", // 2: Fucsia claro
          "rgba(128, 0, 128, 0.7)", // 3: Morado
          "rgba(255, 105, 180, 1)", // 4: Rosa claro
          "rgba(255, 105, 180, 1)", // 5: Rosa fuerte
        ]
      : [
          "rgba(255, 0, 255, 0.7)", // 0: Fucsia oscuro
          "rgba(255, 105, 180, 1)", // 1: Rosa fuerte
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
  console.log("Datos filtrados para el gráfico:", filteredData);

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
