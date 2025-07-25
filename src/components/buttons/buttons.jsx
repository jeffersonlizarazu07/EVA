import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../../style/ThemeColors";

const bgColor = colors.light.acceptButtonBg;
const textColor = colors.light.acceptButtonText;

export const AcceptButton = ({ onClick, label, ...props }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: "5.940rem",
        backgroundColor: bgColor,
        color: textColor,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
      }}
      {...props}
    >
      {label || t("buttons.aceptar")}
    </Button>
  );
};

export const SaveButton = ({ onClick, label, ...props }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{
        backgroundColor: "#b62a8b",
        "&:hover": {
          backgroundColor: "#581244",
        },
      }}
      {...props}
    >
      {label || t("buttons.guardar")}
    </Button>
  );
};

export const CancelButton = ({ onClick, label, ...props }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        color: "#b62a8b",
        borderColor: "#b62a8b",
        "&:hover": {
          borderColor: "#b62a8b",
          backgroundColor: "rgba(156, 39, 176, 0.04)",
        },
      }}
      {...props}
    >
      {label || t("buttons.cancelar")}
    </Button>
  );
};

export const FeedbackButton = ({ onClick, label, ...props }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: "9rem",
        backgroundColor: bgColor,
        color: textColor,
        fontSize: 13,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
      }}
      {...props}
    >
      {`+ ${label || t("buttons.feedback")}`}
    </Button>
  );
};
