import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { UserContext } from "../../context/UserContext";
import LineStyleCharts from "../../components/charts/lineStyle";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import SidebarLT1 from "../../components/aside/sidebarLT1";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import dayjs from "dayjs";
import { Box, ButtonGroup, Grid, IconButton, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Reports = () => {
  const { accessToken, userType, clients } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [surveyId, setSurveyId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clientIds, setClientIds] = useState([2, 3]);
  const [loading, setLoading] = useState(false);

  const chartRefs = useRef([]);

  useEffect(() => {
    getSurveys();
  }, []);

  const handleChange = (event) => {
    setSurveyId(Number(event.target.value) || "");
  };

  const config = {
    withCredentials: true,
  };

  const getPercentages = async () => {
    if (!surveyId) {
      alert("Please select a Survey ID");
      return;
    }
    setLoading(true);
    try {
      const formattedStartDate = startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : "";
      const formattedEndDate = endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : "";

      const response = await axios.get(
        `http://localhost:3000/api/answers/survey/${surveyId}/percentage?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        config
      );
      setLoading(false);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const getSurveys = async () => {
    try {
      console.log(clients)
      const response = await axios.get(
        `http://localhost:3000/api/clients/surveys?clientIds=${clients}`,
        config
      );
      setSurveys(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (endDate && newValue && dayjs(endDate).isBefore(dayjs(newValue))) {
      setEndDate(newValue);
    }
  };

  const handleEndDateChange = (newValue) => {
    const today = dayjs().startOf("day");
    const newEndDate = dayjs(newValue);

    if (!startDate) {
      alert("Please set the start date first.");
      return;
    }

    if (newValue && newEndDate.isAfter(today)) {
      alert("End date cannot be later than today.");
      setEndDate(today);
      return;
    }

    if (startDate && newEndDate.isBefore(dayjs(startDate))) {
      alert("End date cannot be earlier than start date.");
      setEndDate(dayjs(startDate));
      return;
    }

    setEndDate(newValue);
  };

  const exportCharts = async () => {
    const pdf = new jsPDF("portrait", "px", "a4");
    const canvasPromises = chartRefs.current.map(async (chartRef, index) => {
      if (chartRef) {
        const canvas = await html2canvas(chartRef);
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        if (index > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }
    });

    await Promise.all(canvasPromises);
    pdf.save("charts.pdf");
  };

  return (
    <div className="App">
      <div id="body">
        {userType === "1" || userType === "2" ? <HeaderLT1 /> : <HeaderLT2 />}

        <div className="m-0 p-0">
          <div className="row m-0">
            <div className="col" style={{ paddingLeft: 0 }}>
              {userType === "1" || userType === "2" ? (
                <SidebarLT1 />
              ) : (
                <SidebarLT2 />
              )}
            </div>
            <div className="col-sm-12 col-md-11 col-lg-11">
              <div className="row d-flex justify-content-center">
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body" style={{borderRadius: "50px"}}>
                      <div className="input-group d-flex">
                        <FormControl required sx={{ minWidth: "45%"}}>
                          <InputLabel>Encuesta</InputLabel>
                          <Select
                            className="me-2"
                            labelId="survey-select-label"
                            id="survey-select"
                            value={surveyId}
                            onChange={(e) => {
                              handleChange(e);
                              console.log(e.target.value);
                            }}
                            input={<OutlinedInput label="Encuesta" />}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {surveys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            sx={{ width: "23%" }}
                            className="me-2"
                            label="Fecha de inicio"
                            value={startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => (
                              <OutlinedInput {...params} />
                            )}
                          />
                          <DatePicker
                            sx={{ width: "23%" }}
                            className="me-2"
                            label="Fecha de fin"
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => (
                              <OutlinedInput {...params} />
                            )}
                          />
                        </LocalizationProvider>
                        <ButtonGroup variant="text">
                          <IconButton
                            variant="contained"
                            color="secondary"
                            onClick={getPercentages}
                            sx={{ minWidth: "auto" }}
                            disabled={!(surveyId && startDate && endDate)}
                          >
                            <SearchIcon />
                          </IconButton>
                          <IconButton
                            disabled={data.length == 0}
                            variant="contained"
                            color="secondary"
                            onClick={exportCharts}
                            sx={{ minWidth: "auto" }}
                          >
                            <FileDownloadIcon />
                          </IconButton>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <div
                      className="col-md-6 col-lg-4 p-2"
                      key={i}
                      ref={(el) => (chartRefs.current[i] = el)}
                    >
                      <div className="card shadowbox5">
                        <div className="card-body">
                          <LineStyleCharts
                            label={item.label}
                            dataChart={item.data}
                            type={item.type}
                            initialType="pie"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : !loading ? (
                  <div className="col text-center">
                    <div className="alert alert-info" role="alert">
                      Llena los datos de la consulta
                    </div>
                  </div>
                ) : (
                  <Grid container spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Skeleton
                          variant="text"
                          width="100%"
                          sx={{ marginBottom: "8px" }}
                        />
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width="100%"
                          height={200}
                          sx={{ borderRadius: "10px", marginBottom: "8px" }}
                        />
                        <Box className="d-flex">
                          <Skeleton
                            variant="text"
                            width="50%"
                            sx={{ marginRight: 5 }}
                          />
                          <Skeleton variant="text" width="50%" />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
