import { colors } from "../../style/ThemeColors";
import { Button } from "@mui/material";

const ConfirmButton = ({ onClick, label = "Confirmar", ...props }) => {
  const bgColor = colors.light.confirmButtonBg;
  const textColor = colors.light.confirmButtonText;
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        width: "6.25rem",
        p: 1,
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

export default ConfirmButton;
