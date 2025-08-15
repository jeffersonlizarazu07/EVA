import { useTranslation } from "react-i18next";
import "../../assets/css/index.css";
import HeaderLT2 from "../header/headerLT2.jsx"
import HeaderLT1 from "../header/headerLT1";
import i18n from "../../assets/js/i18n.jsx";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddchartIcon from "@mui/icons-material/Addchart";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { userType, languageUser, userId } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, []);

  // ✅ Handlers para navegación - USANDO == en lugar de ===
  const handleQualityClick = () => {
    console.log("Este es el user", userType);
    console.log("Este es el userId", userId);
    
    if (userType == 4) {  // ✅ CAMBIADO A ==
      const targetUrl = `/monitoring_view/${userId}`;
      console.log("Navegando a:", targetUrl);
      navigate(targetUrl);
    } else {
      console.log("Navegando a: /quality");
      navigate("/quality");
    }
  };

  const handleSatisfactionClick = () => {
    console.log("Este es el user", userType);
    console.log("Este es el userId", userId);
    
    if (userType == 4) {  // ✅ CAMBIADO A ==
      console.log("Navegando a: /survey_list");
      navigate("/survey_list");
    } else {
      console.log("Navegando a: /satisfaction");
      navigate("/satisfaction");
    }
  };

  return (
    <Box>
      {userType == 2 || userType == 4 ? <HeaderLT2 /> : <HeaderLT1 />} {/* ✅ CAMBIADO A == */}
      <Box>
        <Box sx={{ marginTop: 12 }}>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid container spacing={6} justifyContent="center">
                <Grid item xs={12} md={6} display="flex" justifyContent="center">
                  <Card
                    id="card1"
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 300,
                      textAlign: "center",
                      width: { xs: '90vw', md: 600 },
                      cursor: "pointer",
                    }}
                    onClick={handleQualityClick}
                  >
                    <CardContent>
                      <AccountCircleIcon style={{ fontSize: "100px" }} />
                      <br />
                      <Typography variant="h5">
                        {t("quality.title")}
                      </Typography>
                      <Typography variant="body1">
                        {t("quality.description")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} display="flex" justifyContent="center">
                  <Card
                    id="card2"
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 300,
                      textAlign: "center",
                      width: { xs: '90vw', md: 600 },
                      cursor: "pointer",
                    }}
                    onClick={handleSatisfactionClick}
                  >
                    <CardContent>
                      <AddchartIcon style={{ fontSize: "100px" }} />
                      <br />
                      <Typography variant="h5">
                        {t("satisfaction.title")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: "center", mt: 2 }}
                      >
                        {t("satisfaction.description")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Index;