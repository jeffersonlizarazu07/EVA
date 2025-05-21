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

  // obtener etiquetas para cada tipo de gráfico
  const getLabelsForType = (type) => {
    switch (type) {
      case "range_zerototen":
        return [
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
        ];
      case "range_onetofive":
        return [
          "1: Muy insatisfecho",
          "2: Insatisfecho",
          "3: Ni satisfecho / Ni insatisfecho",
          "4: Satisfecho",
          "5: Muy satisfecho",
        ];
      case "range_difficulty":
        return [
          "1: Muy difícil",
          "2: Difícil",
          "3: Ni fácil / Ni difícil",
          "4: Fácil",
          "5: Muy fácil",
        ];
      case "range_emoji":
        return [
          "1: Muy triste",
          "2: Triste",
          "3: Ni triste / Ni feliz",
          "4: Feliz",
          "5: Muy feliz",
        ];
      case "yes_no":
        return ["No", "Sí"];
      default:
        return dataChart.map(item => item.name || "Sin etiqueta");
          //       return dataChart.map(item => {
  //   const name = item.name || "Sin etiqueta";
  //   const words = name.split(" ");
  //   const grouped = [];
  //   for (let i = 0; i < words.length; i += 6) {
  //     grouped.push(words.slice(i, i + 6).join(" "));
  //   }
  //   return grouped; // Chart.js mostrará esto como multilínea
  // });

    }
  };

  // aplicar filtros a los datos
  const applyFilters = (data) => {
    // crear un array vacío para almacenar los datos procesados
    const processedData = [];
    
    // obtener etiquetas para el tipo de gráfico
    const typeLabels = getLabelsForType(type);
    
    //for cada elemento en dataChart
    data.forEach(item => {
      let key = item.key;
      let value = parseFloat(item.value);
      
      // saltar si el valor no es un número
      if (isNaN(value)) {
        return;
      }
      
      // comprobar si el valor está dentro del rango de filtros
      if (value >= filters.minValue && value <= filters.maxValue) {
        // para los tipos de gráfico específicos, asignar el valor a la posición correspondiente
        if (["range_zerototen", "range_onetofive", "range_difficulty", "range_emoji", "yes_no"].includes(type)) {
          // para los tipos de gráfico específicos, asignar el valor a la posición correspondiente
          if (type === "yes_no") {
            const index = parseInt(key);
            processedData[index] = value;
          } else {
            // para los rangos, asignar el valor a la posición correspondiente
            const index = parseInt(key);
            // ajustar el índice para que coincida con el rango
            const adjustedIndex = type.includes("zero") ? index : index - 1;
            processedData[adjustedIndex] = value;
          }
        } else {
          // para otros tipos de gráficos, simplemente agregar el valor
          processedData.push(value);
        }
      }
    });
    
    return processedData;
  };

  // determinar el tipo de escala
  const scale = 
    type === "range_zerototen" ? "0-10" : 
    type === "yes_no" ? "0-1" : 
    "1-5";

  // definir los colores de fondo y borde según la escala
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

  // Función para filtrar labels y datos - solo mostrar los que tienen valores
  const filterLabelsAndData = () => {
    // Obtener todos los posibles labels
    const allLabels = getLabelsForType(type);
    // Procesar los datos
    const processedData = applyFilters(dataChart);
    
    // Crear arrays para los labels y datos filtrados
    const filteredLabels = [];
    const filteredData = [];
    const filteredBackgrounds = [];
    const filteredBorders = [];
    
    // Iterar por todos los datos y solo incluir los que tienen valores
    processedData.forEach((value, index) => {
      // Solo incluir si el valor existe y no es 0
      if (value !== undefined && value !== null && value !== 0) {
        filteredLabels.push(allLabels[index]);
        filteredData.push(value);
        filteredBackgrounds.push(backgrounds[index]);
        filteredBorders.push(borders[index]);
      }
    });
    
    return {
      labels: filteredLabels,
      data: filteredData,
      backgrounds: filteredBackgrounds,
      borders: filteredBorders
    };
  };

  // Obtener datos y labels filtrados
  const filteredElements = filterLabelsAndData();

  // crear el objeto de datos filtrados
  const filteredData = {
    labels: filteredElements.labels,
    datasets: [
      {
        label: "Datos",  // Cambiado a español
        data: filteredElements.data,
        borderColor: filteredElements.borders,
        backgroundColor: filteredElements.backgrounds,
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
    if (chartRef.current?.chartInstance) {
      chartRef.current.chartInstance.resetZoom();
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext("2d");
    
    // destruir el gráfico existente si existe
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

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
              size: 15,
              style: "italic",
              weight: "bold",
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
              value !== null && value !== undefined ? `${value.toFixed(0)}%` : "",
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
                    text: "Categorías",  // Ya en español
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Valores",  // Ya en español
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
            aria-label="Chart type selection"
          >
            <MUITextTooltip title="Circular">
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
            <MUITextTooltip title="Barras">
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
            <MUITextTooltip title="Línea">
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
          <MUITextTooltip title="Reiniciar Zoom">
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