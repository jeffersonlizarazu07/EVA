import { useTranslations } from "../hooks/useTranslations";
import { Card, CardContent, Typography, Link, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddchartIcon from "@mui/icons-material/Addchart";
import "../../assets/css/index.css";

export const QualityCard = () => {
  const { t } = useTranslations();

  return (
    <Box>
      <Box>
        <Link href="/quality" underline="none">
          <Card
            id="card1"
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
              <AccountCircleIcon style={{ fontSize: "100px" }} />
              <br />
              <Typography variant="h5">{t("quality.title")}</Typography>
              <Typography variant="body1">
                {t("quality.description")}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Box>
    </Box>
  );
};

export const SatisfationCard = () => {
  const { t } = useTranslations();

  return (
    <Box>
      <Box>
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
              <Typography variant="h5">{t("satisfaction.title")}</Typography>
              <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                {t("satisfaction.description")}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Box>
    </Box>
  );
};
