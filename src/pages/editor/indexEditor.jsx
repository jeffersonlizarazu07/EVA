import "../../assets/css/index.css";
import HeaderLT2 from "../../components/header/headerLT2";
import { UserContext } from "../../context/UserContext";
import { useEffect, useContext } from "react";
import { Container, Grid, Box } from "@mui/material";
import {
  SatisfationCard,
  QualityCard,
} from "../../components/cards/DashboardCards";
import { useTranslations } from "../../components/hooks/useTranslations";

const IndexEditor = () => {
  const { t } = useTranslations();
  const { languageUser } = useContext(UserContext);
  useEffect(() => {
    t;
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
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              alignSelf: "center",
              display: "flex",
              justifyContent: "flex-start",
            }}
          ></Grid>
          {/* Cards*/}
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

export default IndexEditor;
