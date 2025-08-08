import "../../assets/css/index.css";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import HeaderLT2 from "../../components/header/headerLT2";
import { Container, Grid, Box } from "@mui/material";
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
      <Box sx={{ marginTop: 12 }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={2}
          wrap="nowrap"
        >
          <Grid item xs={false} md={2} />

          {/* Cards */}
          <Grid item xs={12} md={9}>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={6}>
                  <QualityCard />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SatisfationCard />
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Index;
