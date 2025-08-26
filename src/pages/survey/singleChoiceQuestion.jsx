import React, { useContext, useState, useEffect } from "react";
import { FormControlLabel, Radio, Checkbox, Grid } from "@mui/material";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";

//Funcion para recorrer options y marcarlas como seleccionadas o no seleccionadas al editar
function getCorrectOptions(optionsT, indexOption) {
  const numberArray = indexOption.map((str) => parseInt(str, 10));
  let i;
  let options = [];
  for (i = 0; i < optionsT.length; i++) {
    if (numberArray.includes(i)) {
      const x = { text: optionsT[i], checked: true };
      options.push(x);
    } else {
      const x = { text: optionsT[i], checked: false };
      options.push(x);
    }
  }
  return options;
}

function SingleChoiceQuestion({ options, correctAnswer, onChange }) {
  const { t } = useTranslation();

  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = localOptions.map((option, i) => ({
      ...option,
      checked: i === index ? !option.checked : false,
    }));
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions[index].checked ? index : null;
    setLocalCorrectAnswer(newCorrectAnswer);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions.findIndex((option) => option.checked);
    setLocalCorrectAnswer(newCorrectAnswer !== -1 ? newCorrectAnswer : null);

    onChange({
      options: newOptions,
      correctAnswer: newCorrectAnswer !== -1 ? newCorrectAnswer : null,
    });
  };

  return (
    <Box>
      {localOptions.map((option, index) => (
        <Grid
          key={index}
          container
          alignItems="center"
          spacing={1}
          sx={{ mb: 2 }}
        >
          {/* Radio */}
          <Grid item xs="auto">
            <FormControlLabel
              control={
                <Radio
                  checked={option.checked}
                  onChange={() => handleCheckboxChange(index)}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                  }}
                />
              }
              label=""
            />
          </Grid>

          <Grid item xs>
            <TextField
              className="readOnlyField"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              label={t("vistaEncuestas.opcion_respuesta")}
              placeholder=" "
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs="auto">
            <IconButton onClick={() => removeOption(index)} size="small">
              <BackspaceIcon sx={{ color: "#b62a8b" }} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        onClick={moreOption}
        variant="text"
        sx={{
          color: "white",
          backgroundColor: "#b62a8b",
          "&:hover": {
            backgroundColor: "#581244",
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>
    </Box>
  );
}

function SingleChoiceQuestionEdit({
  options,
  correctAnswer,
  idToEdit,
  onChange,
}) {
  const { t } = useTranslation();
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  useEffect(() => {
    if (options && correctAnswer) {
      const opciones = getCorrectOptions(options, correctAnswer);
      setLocalOptions(opciones);
    }
  }, [idToEdit]);

  useEffect(() => {
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = localOptions.map((option, i) => ({
      ...option,
      checked: i === index ? !option.checked : false,
    }));
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions[index].checked ? index : null;
    setLocalCorrectAnswer(newCorrectAnswer);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswer });
  };
  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswer(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  return (
    <Box>
      {localOptions.map((option, index) => (
        <Grid
          container
          key={index}
          spacing={1}
          alignItems="stretch"
          sx={{ mb: 2, mx: 1 }}
        >
          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Radio
                    checked={Boolean(option.checked)}
                    onChange={() => handleCheckboxChange(index)}
                    inputProps={{ "aria-label": `Opción ${index}` }}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                    }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>

          <Grid item xs={10}>
            <Box sx={{ position: "relative", mt: 1 }}>
              <TextField
                className="readOnlyField"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                fullWidth
                variant="outlined"
                size="small"
                label={t("vistaEncuestas.opcion_respuesta")}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#c70e8f",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c70e8f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#c70e8f",
                    },
                  },
                  "& .MuiInputLabel-root, & label.Mui-focused": {
                    color: "#c70e8f",
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={() => removeOption(index)}
                color="error"
                size="small"
              >
                <BackspaceIcon sx={{ color: "#b62a8b" }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}

      <Button
        onClick={moreOption}
        variant="contained"
        color="primary"
        sx={{
          color: "white",
          backgroundColor: "#b62a8b",
          "&:hover": {
            backgroundColor: "#581244",
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>
    </Box>
  );
}

function MultipleChoiceQuestionEdit({
  options,
  correctAnswers,
  idToEdit,
  onChange,
}) {
  const { t } = useTranslation();
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] =
    useState(correctAnswers);
  useEffect(() => {
    const opciones = getCorrectOptions(options, correctAnswers);
    setLocalOptions(opciones);
  }, [idToEdit]);

  useEffect(() => {
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);

  const addOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };
  useEffect(() => {
    const currentCorrectAnswers = localOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    if (
      JSON.stringify(localCorrectAnswers) !==
      JSON.stringify(currentCorrectAnswers)
    ) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({
        options: localOptions,
        correctAnswers: currentCorrectAnswers,
      });
    }
  }, [localOptions, onChange]);

  return (
    <Box>
      {localOptions.map((option, index) => (
        <Grid
          container
          key={index}
          spacing={1}
          alignItems="stretch"
          sx={{ mb: 2, mx: 1 }}
        >
          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(option.checked)}
                    onChange={() => handleCheckboxChange(index)}
                    inputProps={{ "aria-label": `Opción ${index}` }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>

          <Grid item xs={10}>
            <Box sx={{ position: "relative", mt: 1 }}>
              <TextField
                className="readOnlyField"
                label={t("vistaEncuestas.opcion_respuesta")}
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#c70e8f",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c70e8f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#c70e8f",
                    },
                  },
                  "& .MuiInputLabel-root, & label.Mui-focused": {
                    color: "#c70e8f",
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={() => removeOption(index)}
                color="error"
                size="small"
              >
                <BackspaceIcon sx={{ color: "#b62a8b" }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}

      <Button
        onClick={addOption}
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: "#b62a8b",
          "&:hover": {
            backgroundColor: "#581244",
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {t("vistaEncuestas.respuestas_correctas")}:{" "}
          {localCorrectAnswers.join(", ")}
        </Typography>
      </Box>
    </Box>
  );
}

function MultipleChoiceQuestion({ options, correctAnswers, onChange }) {
  const { t } = useTranslation();
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] =
    useState(correctAnswers);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  useEffect(() => {
    // Solo llama a onChange si las opciones o correctAnswers realmente cambian
    const currentCorrectAnswers = localOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    if (
      JSON.stringify(localCorrectAnswers) !==
      JSON.stringify(currentCorrectAnswers)
    ) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({
        options: localOptions,
        correctAnswers: currentCorrectAnswers,
      });
    }
  }, [localOptions, onChange]);

  return (
    <Box>
      {localOptions.map((option, index) => (
        <Grid
          container
          key={index}
          spacing={1}
          alignItems="stretch"
          sx={{ mb: 2, mx: 1 }}
        >
          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>

          <Grid item xs={10}>
            <Box sx={{ position: "relative" }}>
              <TextField
                className="readOnlyField"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                fullWidth
                variant="outlined"
                label={t("vistaEncuestas.opcion_respuesta")}
                size="small"
                sx={{ mb: 0.5 }}
              />
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={() => removeOption(index)} size="small">
                <BackspaceIcon sx={{ color: "#b62a8b" }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}

      <Button
        onClick={moreOption}
        variant="text"
        sx={{
          color: "white",
          backgroundColor: "#b62a8b",
          "&:hover": {
            backgroundColor: "#581244",
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {t("vistaEncuestas.respuestas_correctas")}:{" "}
          {localCorrectAnswers.join(", ")}
        </Typography>
      </Box>
    </Box>
  );
}

const SelectorQuestion = ({ options = [], correctAnswers = [], onChange }) => {
  // Inicializar desde props si están disponibles
  const [responses, setResponses] = useState(
    options.map((option) => option.text) || []
  );
  const [showFormMultiple, setShowFormMultiple] = useState(false);
  const [newMultipleAnswer, setNewMultipleAnswer] = useState("");

  // Función para añadir nueva respuesta
  const handleAddMultipleResponse = () => {
    if (newMultipleAnswer.trim() === "") return;

    const updatedResponses = [...responses, newMultipleAnswer.trim()];
    setResponses(updatedResponses);
    setNewMultipleAnswer("");
    setShowFormMultiple(false);

    if (onChange) {
      onChange({
        options: updatedResponses.map((r) => ({ text: r, checked: false })),
        correctAnswers: [],
      });
    }
  };

  // Función para eliminar una respuesta
  const handleRemoveResponse = (index) => {
    const updated = responses.filter((_, i) => i !== index);
    setResponses(updated);

    if (onChange) {
      onChange({
        options: updated.map((r) => ({ text: r, checked: false })),
        correctAnswers: [],
      });
    }
  };

  return (
    <div
      className="p-4 border rounded shadow-sm"
      style={{ width: "94%", margin: "auto" }}
    >
      {/* Lista de respuestas existentes */}
      <ul className="list-group">
        {responses.map((res, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {res}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleRemoveResponse(index)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Botón para agregar nueva opción */}
      {!showFormMultiple ? (
        <button
          className="btn btn-link text-decoration-none p-0 mt-3"
          onClick={() => setShowFormMultiple(true)}
        >
          + Agregar opción personalizada
        </button>
      ) : (
        <div className="d-flex flex-column gap-2 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe la nueva respuesta"
            value={newMultipleAnswer}
            onChange={(e) => setNewMultipleAnswer(e.target.value)}
          />
          <div className="d-flex justify-content-center gap-2 mb-4">
            <button
              className="btn btn-success"
              style={{
                backgroundColor: "rgba(175, 14, 110, 0.717)",
                color: "white",
              }}
              onClick={handleAddMultipleResponse}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowFormMultiple(false);
                setNewMultipleAnswer("");
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Select con respuestas creadas */}
      {responses.length > 0 && (
        <div className="mt-4">
          <label className="form-label">
            Selecciona una respuesta guardada:
          </label>
          <select className="form-select">
            {responses.map((res, idx) => (
              <option key={idx} value={res}>
                {res}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const SelectorQuestionEdit = ({
  options = [],
  selectedOption = "",
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const { languageUser } = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

  const [responses, setResponses] = useState(
    options.map((opt) => (typeof opt === "string" ? opt : opt.text || ""))
  );
  const [currentSelection, setCurrentSelection] = useState(
    selectedOption || ""
  );
  const [showForm, setShowForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    setResponses(
      options.map((opt) => (typeof opt === "string" ? opt : opt.text || ""))
    );
    setCurrentSelection(selectedOption || "");
  }, [options, selectedOption]);

  const handleAddResponse = () => {
    if (newAnswer.trim() === "") return;

    const updated = [...responses, newAnswer.trim()];
    setResponses(updated);
    setNewAnswer("");
    setShowForm(false);

    onChange?.({
      options: updated.map((r) => ({ text: r })),
      selectedOption: currentSelection,
    });
  };

  const handleRemoveResponse = (index) => {
    const updated = responses.filter((_, i) => i !== index);
    const newSelected =
      responses[index] === currentSelection ? "" : currentSelection;

    setResponses(updated);
    setCurrentSelection(newSelected);

    onChange?.({
      options: updated.map((r) => ({ text: r })),
      selectedOption: newSelected,
    });
  };

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setCurrentSelection(selected);

    onChange?.({
      options: responses.map((r) => ({ text: r })),
      selectedOption: selected,
    });
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, width: "94%", mx: "auto" }}>
      {/* Lista de respuestas existentes */}
      <List>
        {responses.map((res, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveResponse(index)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            }
            divider
          >
            <ListItemText primary={res} />
          </ListItem>
        ))}
      </List>

      {/* Botón para agregar nueva opción */}
      {!showForm ? (
        <Button
          variant="text"
          sx={{ p: 0, textTransform: "none" }}
          onClick={() => setShowForm(true)}
        >
          + Agregar opción personalizada
        </Button>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Escribe la nueva respuesta"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            size="small"
            className="readOnlyField"
          />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddResponse}
              sx={{
                backgroundColor: "#b62a8b",
                "&:hover": {
                  backgroundColor: "#581244",
                },
              }}
            >
              {t("UserModal.Save")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowForm(false);
                setNewAnswer("");
              }}
              sx={{
                color: "#b62a8b", // Texto morado
                borderColor: "#b62a8b", // Borde morado
                "&:hover": {
                  borderColor: "#b62a8b", // Borde morado oscuro al hover
                  backgroundColor: "rgba(156, 39, 176, 0.04)", // Fondo muy transparente al hover
                },
              }}
            >
              {t("clientModal.Close")}
            </Button>
          </Box>
        </Box>
      )}

      {/* Select con respuestas creadas */}
      {responses.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            component="label"
            variant="body1"
            sx={{ mb: 1, display: "block" }}
          >
            Selecciona una respuesta guardada:
          </Typography>
          <TextField
            select
            fullWidth
            label="Respuesta guardada"
            value={currentSelection}
            onChange={handleSelectChange}
            size="small"
            sx={{ mb: 2 }}
            className="readOnlyField"
          >
            {responses.map((res, idx) => (
              <MenuItem key={idx} value={res}>
                {res}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </Box>
  );
};

function MultipleChoiceQuestionEditWrapper({
  options,
  correctAnswers,
  idToEdit,
  onChange,
}) {
  const [localOptions, setLocalOptions] = useState([]);
  const [localCorrectAnswers, setLocalCorrectAnswers] = useState([]);

  // Inicializar una sola vez con los datos correctos
  useEffect(() => {
    if (options && options.length > 0) {
      // Si las opciones ya vienen con estructura {text, checked}
      if (typeof options[0] === "object" && options[0].hasOwnProperty("text")) {
        setLocalOptions(options);
        const correctIndexes = options
          .map((opt, idx) => (opt.checked ? idx : -1))
          .filter((idx) => idx !== -1);
        setLocalCorrectAnswers(correctIndexes);
      } else {
        // Si las opciones son strings simples, convertir
        const processedOptions = options.map((opt, idx) => ({
          text: typeof opt === "string" ? opt : opt.text || "",
          checked: correctAnswers.includes(idx),
        }));
        setLocalOptions(processedOptions);
        setLocalCorrectAnswers(correctAnswers || []);
      }
    }
  }, [options, correctAnswers]); // Solo cuando cambien las props iniciales

  const addOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1, width: "94%", mx: "auto" }}>
      {localOptions.map((option, index) => (
        <Box key={index} display="flex" alignItems="stretch" gap={1} mb={2}>
          {/* Checkbox */}
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={option.checked || false}
              onChange={() => handleCheckboxChange(index)}
              sx={{ p: 0 }}
            />
          </Box>

          {/* Input de texto */}
          <TextField
            fullWidth
            label="Opción de respuesta"
            value={option.text || ""}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            variant="outlined"
            size="small"
            className="readOnlyField"
          />

          {/* Botón eliminar */}
          <IconButton
            onClick={() => removeOption(index)}
            color="error"
            sx={{ alignSelf: "center" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Botón agregar opción */}
      <Button
        variant="text"
        sx={{ p: 0, textTransform: "none" }}
        onClick={addOption}
      >
        + Agregar opción personalizada
      </Button>
    </Box>
  );
}

export default SelectorQuestionEdit;
export {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
  MultipleChoiceQuestionEditWrapper,
};
