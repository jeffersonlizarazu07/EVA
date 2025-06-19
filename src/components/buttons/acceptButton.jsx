import { colors } from "../../style/ThemeColors";
import { Button } from "@mui/material";

const AcceptButton = ({ onClick, label = "Aceptar", ...props }) => {
  const bgColor = colors.light.acceptButtonBg;
  const textColor = colors.light.acceptButtonText;
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: "95px",
        backgroundColor: bgColor,
        color: textColor,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default AcceptButton;
