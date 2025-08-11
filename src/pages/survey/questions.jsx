import "../../assets/css/questions.css";
import React from 'react';
import { 
  Box, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Tooltip,
  useTheme,
  TextField,
  FormGroup,
  Checkbox, 

} from '@mui/material';
import { useTranslations } from "../../components/hooks/useTranslations";


function Range_onetofive() {
    const { t } = useTranslations();
    const theme = useTheme();
    const [value, setValue] = React.useState('');  // Estados para manejar el valor seleccionado

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    // Configuración de las opciones con sus colores y tooltips
    const options = [
      { 
        value: '1', 
        tooltip: 'Muy insatisfecho', 
        color: theme.palette.error.main 
      },
      { 
        value: '2', 
        tooltip: 'Insatisfecho', 
        color: theme.palette.error.main 
      },
      { 
        value: '3', 
        tooltip: 'Ni satisfecho/ni insatisfecho', 
        color: theme.palette.primary.main 
      },
      { 
        value: '4', 
        tooltip: 'Satisfecho', 
        color: theme.palette.success.main 
      },
      { 
        value: '5', 
        tooltip: 'Muy satisfecho', 
        color: theme.palette.success.main 
      }
    ];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      mt: 4, 
      mb: 4,
      gap: 2 
    }}>
       {/* Etiqueta izquierda "Muy insatisfecho" */}
      <Typography 
        variant="body2" 
        fontWeight="bold" 
        fontSize={16}
        sx={{ color: theme.palette.error.main }}
      >
        {t("vistaEncuestas.muy_insatisfecho")}
      </Typography>

      {/* Grupo de bottones */}
      <RadioGroup
        row
        aria-label="satisfaccion"
        name="probability"
        value={value}
        onChange={handleChange}
        sx={{ gap: 1 }}
      >
        {options.map((option) => (
          <Tooltip key={option.value}  arrow>
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  sx={{
                    display: 'none',
                  }}
                />
              }
              label={option.value}
              sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': {                  
                  color: option.color,
                  border: `1px solid ${option.color}`,
                  borderRadius: 1,
                  padding: '4px 12px',
                  minWidth: '32px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: value === option.value ? `${option.color}20` : 'transparent',
                  '&:hover': {
                      backgroundColor: `${option.color}10`,
                      transform: 'scale(1.05)'
                    }
                }
              }}
            />
          </Tooltip>
        ))}
      </RadioGroup>
      
      {/* Etiqueta derecha "Muy satisfecho" */}
      <Typography 
        variant="body2" 
        fontWeight="bold" 
        fontSize={16}
        sx={{ color: theme.palette.success.main }}
      >
        {t("vistaEncuestas.muy_satisfecho")}
      </Typography>
  </Box>
  )
}

function Range_zerototen (){
  const { t } = useTranslation();
  const theme = useTheme();

  const [value, setValue] = React.useState('');  // Estado para manejar el valor seleccionado

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  // Configuración de las opciones (0-10) con sus colores y tooltips
  const options = [
    { value: '0', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '1', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '2', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '3', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '4', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '5', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '6', tooltip: 'Nada probable', color: theme.palette.error.main },
    { value: '7', tooltip: 'Neutro', color: theme.palette.primary.main },
    { value: '8', tooltip: 'Neutro', color: theme.palette.primary.main },
    { value: '9', tooltip: 'Muy probable', color: theme.palette.success.main },
    { value: '10', tooltip: 'Muy probable', color: theme.palette.success.main }
  ];

  return (
   <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        mt: 4, 
        mb: 4,
        gap: 2,
        flexWrap: 'wrap' // Permite que se ajuste en pantallas pequeñas
      }}
    >
      {/* Etiqueta izquierda - "Nada probable" */}
      <Typography 
        variant="body2" 
        fontWeight="bold" 
        fontSize={16}
        sx={{ 
          color: theme.palette.error.main,
          minWidth: 'fit-content' // Evita que se corte el texto
        }}
      >
        {t("vistaEncuestas.nada_probable")}
      </Typography>
      
      {/* Grupo de radio buttons del 0 al 10 */}
      <RadioGroup
        row
        aria-label="probability"
        name="probability"
        value={value}
        onChange={handleChange}
        sx={{ 
          gap: 0.5, // Espaciado más pequeño porque hay muchas opciones
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {options.map((option) => (
          <Tooltip key={option.value}arrow>
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  sx={{
                    display: 'none', 
                  }}
                />
                }
                label={option.value}
                sx={{
                  margin: '2px', // Espaciado mínimo entre botones
                  '& .MuiFormControlLabel-label': {
                    color: option.color,
                    border: `1px solid ${option.color}`,
                    borderRadius: 1,
                    padding: '6px 10px',                    
                    width: '42px',
                    textAlign: 'center',
                    display: 'flex',          
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: value === option.value ? `${option.color}20` : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${option.color}10`,
                      transform: 'scale(1.05)'
                    }
                  }
                }}
            />
          </Tooltip>
        ))}
      </RadioGroup>
      
      {/* Etiqueta derecha "Muy probable" */}
      <Typography 
        variant="body2" 
        fontWeight="bold" 
        fontSize={16}
        sx={{ 
          color: theme.palette.success.main,
          minWidth: 'fit-content' // Evita que se corte el texto
        }}
      >
        {t("vistaEncuestas.muy_probable")}
      </Typography>
    </Box>
  )
}

function Range_difficulty(){
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [value, setValue] = React.useState(''); // Estado para manejar el valor seleccionado

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Configuración de las opciones de dificultad con sus colores y textos
  const options = [
    { 
      value: 'Muy dificil', 
      label: t("vistaEncuestas.muy_dificil"), 
      color: theme.palette.error.main 
    },
    { 
      value: 'Dificil', 
      label: t("vistaEncuestas.dificil"), 
      color: theme.palette.error.main 
    },
    { 
      value: 'Neutro', 
      label: t("vistaEncuestas.facil_dificil"), 
      color: theme.palette.primary.main 
    },
    { 
      value: 'Facil', 
      label: t("vistaEncuestas.facil"), 
      color: theme.palette.success.main 
    },
    { 
      value: 'Muy facil', 
      label: t("vistaEncuestas.muy_facil"), 
      color: theme.palette.success.main 
    }
  ];

  return(
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 4, 
          mb: 4,
          gap: 1,
          flexWrap: 'wrap' // Permite que se ajuste en pantallas pequeñas
        }}
      >
      {/* Grupo de radio buttons para dificultad */}
      <RadioGroup
        row
        aria-label="dificultad"
        name="dificult"
        value={value}
        onChange={handleChange}
        sx={{ 
          gap: 0.8,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  display: 'none', 
                }}
              />
            }
            label={option.label}
            sx={{
              margin: '0',
              '& .MuiFormControlLabel-label': {
                color: option.color,
                border: `1px solid ${option.color}`,
                borderRadius: 1,
                padding: '8px 16px',
                minWidth: 'fit-content',
                textAlign: 'center',
                backgroundColor: value === option.value ? `${option.color}20` : 'transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap', 
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: `${option.color}10`,
                  transform: 'scale(1.05)',
                }
              }
            }}
          />
        ))}
      </RadioGroup>
    </Box>                      
    )
}
function Yes_no(){
  const { t } = useTranslations();
  const theme = useTheme();
  const [value, setValue] = React.useState('');  // Estados para manejar el valor seleccionado

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = [
    {
      value: 'NO',
      label: t("vistaEncuestas.NO"),
      color: theme.palette.error.main,
      tooltip: 'No'
    },
    {
      value: 'SI',
      color: theme.palette.success.main,
      label: t("vistaEncuestas.SI"),
      tooltip: 'Si'
    },
  ];


  return(
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        mt: 4, 
        mb: 4,
        gap: 2
      }}
    >
      {/* Grupo de radio buttons para Sí/No */}
      <RadioGroup
        row
        aria-label="si-no"
        name="yes_no"
        value={value}
        onChange={handleChange}
        sx={{ 
          gap: 0.8, 
          justifyContent: 'center'
        }}
      >
        {options.map((option) => (
          <Tooltip key={option.value} arrow>
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  sx={{
                    display: 'none',
                  }}
                />
              }
              label={option.label}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: option.color,
                  border: `1px solid ${option.color}`,
                  borderRadius: 2, 
                  padding: '10px 20px', 
                  width: '38px', 
                  textAlign: 'center',
                  display: 'flex',          
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: value === option.value ? `${option.color}20` : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem', // Texto más grande
                  '&:hover': {
                    backgroundColor: `${option.color}15`,
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${option.color}40`
                  }
                }
              }}
            />
          </Tooltip>
        ))}
      </RadioGroup>
    </Box>
  )
}

function Range_emoji(){
  const { t } = useTranslations();
  const theme = useTheme();
  const [value, setValue] = React.useState(''); // Estado para manejar el valor seleccionado

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = [
    {
      value : 'verybad',
      color : theme.palette.error.main,
      label : '🙁'
    },
    {
      value : 'bad',
      color : theme.palette.error.main,
      label : '😐'
    },
    {
      value : 'ok',
      color : theme.palette.primary.main,
      label : '🙂'
    }, 
    {
      value : 'good',
      color : theme.palette.success.main,
      label : '😄'
    },
    {
      value : 'awesome',
      color : theme.palette.success.main,
      label : '😊'
    }

  ]

  return(
  <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 4, 
          mb: 4,
          gap: 1,
          flexWrap: 'wrap' // Permite que se ajuste en pantallas pequeñas
        }}
      >
      {/* Grupo de radio buttons para dificultad */}
      <RadioGroup
        row
        aria-label="dificultad"
        name="dificult"
        value={value}
        onChange={handleChange}
        sx={{ 
          gap: 0.8,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  display: 'none', 
                }}
              />
            }
            label={option.label}
            sx={{
              margin: '0',
              '& .MuiFormControlLabel-label': {
                color: option.color,
                border: `1px solid ${option.color}`,
                borderRadius: 1,
                padding: '6px 10px',
                minWidth: 'fit-content',
                textAlign: 'center',
                backgroundColor: value === option.value ? `${option.color}20` : 'transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap', 
                fontSize: '1.25rem', 
                '&:hover': {
                  backgroundColor: `${option.color}10`,
                  transform: 'scale(1.05)',
                }
              }
            }}
          />
        ))}
      </RadioGroup>
    </Box>  
  )
}

function Textfield_s(){
  const { t } = useTranslations();
  const [value, setValue] = React.useState(''); // Estado para manejar el valor del textarea

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return(
   <Box sx={{ width: '100%' }}>
      <TextField
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        placeholder={t("vistaEncuestas.escriba_respuesta")}
        value={value}
        onChange={handleChange}
        sx={{
          backgroundColor: 'white',           
          '& .MuiOutlinedInput-root': {
            borderRadius: '18px',
            '& fieldset': {
              borderColor: '#b62a8b', // Color de borde por defecto
            },
            '&:hover fieldset': {
              borderColor: '#b62a8b', // Color de borde al hacer hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b62a8b', // Color de borde cuando está enfocado
            }
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 14px', // Padding interno del textarea
            fontSize: '1rem', // Tamaño de fuente
            lineHeight: '0.5', // Altura de línea para mejor legibilidad
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(0, 0, 0, 0.6)', // Color del placeholder
            opacity: 1
          }
        }}
      />
    </Box>)
}

function SingleChoiceView({options,correctOption}){
  const { t } = useTranslations();
  const theme = useTheme();
  
  const optionsArray = options.split(",");
  const correctOptionToInt = parseInt(correctOption);
  
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <RadioGroup
        aria-label="single-choice-options"
        name="single-choice"
        value={correctOptionToInt.toString()} // Valor seleccionado basado en correctOption
      >
        {optionsArray.map((option, index) => {
          const isSelected = correctOptionToInt === index;
          
          return (
            <Box 
              key={index}
            >
              <FormControlLabel
                value={index.toString()}
                control={
                  <Radio
                    readOnly
                    checked={isSelected}
                    sx={{
                      color: isSelected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                      '&.Mui-disabled': {
                        color: isSelected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.26)',
                      }
                    }}
                    disabled // Hacemos el radio de solo lectura
                  />
                }
                label={
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
                      fontWeight: isSelected ? 'medium' : 'normal',
                    }}
                  >
                    {option.trim()} {/* Eliminamos espacios extra */}
                  </Typography>
                }
              />
            </Box>
          );
        })}
      </RadioGroup>
    </Box>
  );
}
function MultipleChoiceView({ options, correctOption }) {
   const { t } = useTranslations();
   const theme = useTheme();

  // Asegurar que 'options' sea un array
  const optionsArray = Array.isArray(options)
    ? options
    : (options || "").split(",");

  // Asegurar que 'correctOption' también se maneje seguro
  const correctOptions = Array.isArray(correctOption)
    ? correctOption.map((opt) => parseInt(opt, 10))
    : (correctOption || "")
        .split(",")
        .map((opt) => parseInt(opt, 10));

  return (
   <Box sx={{ mt: 4, mb: 4}}>
      <FormGroup
      >
        {optionsArray.map((option, index) => {
          const isSelected = correctOptions.includes(index);
          
          return (
            <Box 
              key={index}
              sx={{ 
                width: '100%',
              }}
            >
              <FormControlLabel
                control={
                  <Radio
                    readOnly
                    checked={isSelected}
                    disabled // Hacemos el checkbox de solo lectura
                    sx={{
                      color: isSelected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                      '&.Mui-disabled': {
                        color: isSelected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.26)',
                      }
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
                      fontWeight: isSelected ? 'medium' : 'normal',
                    }}
                  >
                    {option.trim()} {/* Eliminamos espacios extra */}
                  </Typography>
                }
              />
            </Box>
          );
        })}
      </FormGroup>
    </Box>
  );
}


export  {Range_onetofive, Range_zerototen, Range_difficulty,Yes_no,Range_emoji,Textfield_s,SingleChoiceView,MultipleChoiceView}