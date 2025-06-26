import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Typography,
  Checkbox,
  IconButton,
  Grid
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';



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
  console.log("-------opiconsoss",options);
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

    onChange({ options: newOptions, correctAnswer: newCorrectAnswer !== -1 ? newCorrectAnswer : null, });
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
                  '& .MuiSvgIcon-root': {
                    fontSize: 20
                  }
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
            <BackspaceIcon sx={{ color: '#b62a8b' }} />
          </IconButton>
        </Grid>
      </Grid>
    ))}
    <Button
      onClick={moreOption}
      variant="text"
      sx={{
        color: 'white',
        backgroundColor: '#b62a8b',
        '&:hover': {
          backgroundColor: '#581244',
        }
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
  console.log("idToEdit", idToEdit);

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

  // useEffect(() => {
  //   const currentCorrectAnswers = localOptions
  //     .map((option, i) => (option.checked ? i : -1))
  //     .filter((index) => index !== -1);

  //   if (
  //     JSON.stringify(localCorrectAnswer) !==
  //     JSON.stringify(currentCorrectAnswers)
  //   ) {
  //     setLocalCorrectAnswer(currentCorrectAnswers);
  //     onChange({
  //       options: localOptions,
  //       correctAnswers: currentCorrectAnswers,
  //     });
  //   }
  // }, [localOptions, onChange]);

  return (
    <Box>
      {localOptions.map((option, index) => (
            <Grid container key={index} spacing={1} alignItems="stretch" sx={{ mb: 2, mx: 1 }}>
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={Boolean(option.checked)}
                    onChange={() => handleCheckboxChange(index)}  
                    inputProps={{ 'aria-label': `Opción ${index}` }}                   
                    sx={{ 
                      '& .MuiSvgIcon-root': { 
                        fontSize: 20 
                      } 
                    }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={10}>
            <Box sx={{ position: 'relative', mt: 1}}>
              <TextField
                className="readOnlyField"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                fullWidth
                variant="outlined"
                size="small"
                label={t("vistaEncuestas.opcion_respuesta")}
                sx={{ mb: 0.5 }}
              />            
            </Box>
          </Grid>
          
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <IconButton
                onClick={() => removeOption(index)}
                color="error"
                size="small"
              >
                <BackspaceIcon  sx={{color: '#b62a8b'}} />
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
          color: 'white',
          backgroundColor: '#b62a8b',
          '&:hover': {
            backgroundColor: '#581244',
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
    console.log("options (props):", options);
  console.log("correctAnswers (props):", correctAnswers);
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
        <Grid container key={index} spacing={1} alignItems="stretch" sx={{ mb: 2, mx: 1 }}>
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(option.checked)}
                    onChange={() => handleCheckboxChange(index)}  
                    inputProps={{ 'aria-label': `Opción ${index}` }}              
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={10}>
            <Box sx={{ position: 'relative', mt: 1 }}>
              <TextField
                className="readOnlyField"
                label={t("vistaEncuestas.opcion_respuesta")}
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 0.5 }}
              />
              
            </Box>
          </Grid>
          
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <IconButton
                onClick={() => removeOption(index)}
                color="error"
                size="small"
              >
                 <BackspaceIcon sx={{color: '#b62a8b'}}/>
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
          color: 'white',
          backgroundColor: '#b62a8b',
          '&:hover': {
            backgroundColor: '#581244',
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {t("vistaEncuestas.respuestas_correctas")}: {localCorrectAnswers.join(", ")}
        </Typography>
      </Box>
    </Box>
  );
}

function MultipleChoiceQuestionEditWrapper({
  options,
  correctAnswers,
  idToEdit,
  onChange,
}) {
    console.log('=== WRAPPER PROPS ===');
  console.log('options:', options);
  console.log('correctAnswers:', correctAnswers);
  const [localOptions, setLocalOptions] = useState([]);
  const [localCorrectAnswers, setLocalCorrectAnswers] = useState([]);

  // Inicializar una sola vez con los datos correctos
  useEffect(() => {
      console.log('=== PROCESSING OPTIONS ===');
    console.log('options recibidas:', options);
    if (options && options.length > 0) {
      // Si las opciones ya vienen con estructura {text, checked}
      if (typeof options[0] === 'object' && options[0].hasOwnProperty('text')) {
        console.log('Opciones son objetos:', options);
        setLocalOptions(options);
        const correctIndexes = options
          .map((opt, idx) => opt.checked ? idx : -1)
          .filter(idx => idx !== -1);
        setLocalCorrectAnswers(correctIndexes);
      } else {
        console.log('Opciones son strings:', options);
        // Si las opciones son strings simples, convertir
        const processedOptions = options.map((opt, idx) => ({
          text: typeof opt === 'string' ? opt : opt.text || '',
          checked: correctAnswers.includes(idx)
        }));
        console.log('Opciones procesadas:', processedOptions);
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
   console.log('=== RENDER ===');
  console.log('localOptions:', localOptions);

  return (
    <div>
      {localOptions.map((option, index) => (
        <div
          key={index}
          className="row mx-2 form-group align-items-stretch d-flex"
        >
          <div className="col-1 p-1 mb-7">
            <input
              type="checkbox"
              checked={option.checked || false}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "50%" }}
            />
          </div>
          <div className="col mt-2">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className="col-1 me-2">
            <button
              onClick={() => removeOption(index)}
              className="btn btn-rect"
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={addOption} className="btn btn-primary m-2">
        + opción
      </button>
      <div>Respuestas correctas: {localCorrectAnswers.join(", ")}</div>
    </div>
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
    console.log("MultipleChoice Option Change:", newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);
    console.log("MultipleChoice Checkbox Change:", newOptions);

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
        <Grid container key={index} spacing={1} alignItems="stretch" sx={{ mb: 2, mx: 1 }}>
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
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
            <Box sx={{ position: 'relative' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton
                onClick={() => removeOption(index)}
                size="small"
              >
                <BackspaceIcon sx={{color: '#b62a8b'}}/>
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}
      
      <Button 
        onClick={moreOption} 
        variant="text" 
        sx={{
          color: 'white',
          backgroundColor: '#b62a8b',
          '&:hover': {
            backgroundColor: '#581244',
          },
        }}
      >
        + {t("vistaEncuestas.opcion")}
      </Button>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {t("vistaEncuestas.respuestas_correctas")}: {localCorrectAnswers.join(", ")}
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
  const [responses, setResponses] = useState(
    options.map((opt) => (typeof opt === "string" ? opt : opt.text || ""))
  );
  const [currentSelection, setCurrentSelection] = useState(selectedOption || "");
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
      {!showForm ? (
        <button
          className="btn btn-link text-decoration-none p-0 mt-3"
          onClick={() => setShowForm(true)}
        >
          + Agregar opción personalizada
        </button>
      ) : (
        <div className="d-flex flex-column gap-2 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe la nueva respuesta"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <div className="d-flex justify-content-center gap-2 mb-4">
            <button
              className="btn btn-success"
              style={{
                backgroundColor: "rgba(175, 14, 110, 0.717)",
                color: "white",
              }}
              onClick={handleAddResponse}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setNewAnswer("");
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
          <select
            className="form-select"
            value={currentSelection}
            onChange={handleSelectChange}
          >
            <option value="">Seleccione una opción</option>
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

export default SelectorQuestionEdit;
export {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
  MultipleChoiceQuestionEditWrapper
};
