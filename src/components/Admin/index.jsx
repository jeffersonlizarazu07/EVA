import { useTranslation } from "react-i18next";
import "../../assets/css/index.css";
import HeaderLT2 from "../header/headerLT2.jsx"
import HeaderLT1 from "../header/headerLT1";
import i18n from "../../assets/js/i18n.jsx";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Link,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddchartIcon from "@mui/icons-material/Addchart";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { userType, languageUser } = useContext(UserContext);
  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, []);

  return (
    <Box>
      {userType === "2" ? <HeaderLT2 /> : <HeaderLT1 />}
      {/* id="body" */}
      <Box>
        <Box sx={{ marginTop: 12 }}>
          <Grid size={12}>
            {/* marginLeft: 27 */}
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Link href="/quality" underline="none">
                    <Card
                      id="card1"
                      sx={{
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 300, // Ajusta según tu necesidad
                        textAlign: "center",
                      }}
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
                  </Link>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Link href="/satisfaction" underline="none">
                    <Card
                      id="card2"
                      sx={{
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 300,
                        textAlign: "center",
                      }}
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
                  </Link>
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
