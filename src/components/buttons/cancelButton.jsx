import { colors } from "../../style/ThemeColors";
import { Button } from "@mui/material";

const CancelButton = ({ onClick, label = "Cancelar", ...props }) => {
  const bgColor = colors.light.cancelButtonBg;
  const textColor = colors.light.cancelButtonText;
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        width: "5.940rem",
        backgroundColor: bgColor,
        color: textColor,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.85,
        },
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default CancelButton;
