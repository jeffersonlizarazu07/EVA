import "../../assets/css/index.css";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import HeaderLT2 from "../../components/header/headerLT2";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import {
  SatisfationCard,
  QualityCard,
} from "../../components/cards/DashboardCards";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { languageUser } = useContext(UserContext);
  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, []);

  return (
    <Box>
      <HeaderLT2 />
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
                  <QualityCard />
                </Grid>

                <Grid item xs={12} md={6}>
                  <SatisfationCard />
                </Grid>
              </Grid>
            </Container>
          </Grid>
          {/* <SidebarLT2 /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
