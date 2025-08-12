import { styled, alpha } from '@mui/material/styles';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/css/encuesta.css';
import { Range_zerototen_survey, Range_onetofive_survey, Yes_no_survey, Range_difficulty_survey, Range_emoji_survey, Single_choice_survey, Multiple_choice_survey } from './questionsSurvey';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../../components/idiomaSurvey/LanguageSelector';
import { smallAlertDelete, Toast, Toast2 } from "../../assets/js/alertConfig";
import Tooltip from '@mui/material/Tooltip';
import { ThemeContext } from '../../assets/js/ThemeContext';
import Switch from "@mui/material/Switch";
import FormControlLabel from '@mui/material/FormControlLabel';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button, 
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material';
import placeholderImg from '../../assets/img/placeholder-image.png';

// Sistema de colores inteligente que garantiza contraste y diseño
const useColorSystem = (color1, color2) => {
  return useMemo(() => {
    const hexToRgb = (hex) => {
      if (!hex) return { r: 103, g: 80, b: 164 }; // fallback
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 103, g: 80, b: 164 };
    };

    const rgbToHex = (r, g, b) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const getContrastRatio = (hex1, hex2) => {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);
      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
      return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    };

    const adjustBrightness = (hex, factor) => {
      const rgb = hexToRgb(hex);
      const adjusted = {
        r: Math.max(0, Math.min(255, Math.round(rgb.r * factor))),
        g: Math.max(0, Math.min(255, Math.round(rgb.g * factor))),
        b: Math.max(0, Math.min(255, Math.round(rgb.b * factor)))
      };
      return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
    };

    const primary = color1 || '#6750a4';
    const secondary = color2 || '#625b71';
    
    // Generar colores seguros
    const primaryDark = adjustBrightness(primary, 0.7);
    const primaryLight = adjustBrightness(primary, 1.3);
    
    return {
      primary,
      secondary,
      primaryDark,
      primaryLight,
      // Colores con alpha para overlays
      primaryAlpha10: alpha(primary, 0.1),
      primaryAlpha20: alpha(primary, 0.2),
      primaryAlpha60: alpha(primary, 0.6),
      // Sombras
      shadowLight: alpha('#000000', 0.1),
      shadowMedium: alpha('#000000', 0.15),
      shadowStrong: alpha('#000000', 0.25),
      // Texto sobre colores
      textOnPrimary: getContrastRatio(primary, '#ffffff') > 4.5 ? '#ffffff' : '#000000',
      textOnSecondary: getContrastRatio(secondary, '#ffffff') > 4.5 ? '#ffffff' : '#000000',
    };
  }, [color1, color2]);
};

// Switch personalizado mejorado
const createMaterialUISwitch = (colors) => styled(Switch)(({ theme }) => ({
  width: 58,
  height: 32,
  padding: 4,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb": {
        backgroundColor: colors.primary,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: colors.primaryAlpha60,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === 'dark' ? colors.primaryDark : '#fff',
    width: 24,
    height: 24,
    boxShadow: `0 2px 4px ${colors.shadowLight}`,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#39393D' : '#E9E9EA',
    borderRadius: 16,
  },
}));

export default function Survey() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'light', toggleTheme: () => {} };
  const { t } = useTranslation();
  
  // Estados existentes
  const fullUrl = window.location.href;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState("");
  const [survey, setSurvey] = useState({});
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const nav = useNavigate();
  const accessToken = Cookies.get('accessToken');

  // Sistema de colores inteligente
  const colors = useColorSystem(survey.color_tag1, survey.color_tag2);
  const MaterialUISwitch = createMaterialUISwitch(colors);

  // Effects existentes
  useEffect(() => {
    const completedSurveys = JSON.parse(localStorage.getItem("surveyCompleted") || "[]");
    if (completedSurveys.includes(survey.id)) {
      nav("/gratitude");
    } else {
      getSurvey(fullUrl);
    }
  }, [fullUrl, survey.id, nav]);

  useEffect(() => {
    const updatedVisibleQuestions = questions.filter(shouldRenderQuestion);
    setVisibleQuestions(updatedVisibleQuestions);
  }, [answers, questions]); 

  // Funciones existentes
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (answers.length === 0) {
      Toast2.fire({
        icon: "error",
        title: t("alerts.no_hay_respuestas"),
      });
      return;
    }

    const allAnswered = visibleQuestions.every(question =>
      answers.some(answer => answer.question_id === question.id && answer.answer !== "")
    );

    if (!allAnswered) {
      Toast2.fire({
        icon: "error",
        title: t("alerts.todas_preguntas"),
      });
      return;
    }

    const answersWithSurveyId = answers.map(answer => ({
      ...answer,
      survey_id: survey.id 
    }));

    try {
      const response = await axios.post("http://localhost:3000/api/answers", answersWithSurveyId);
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: t("alerts.exito"),
          text: t("alerts.exito_enviar_respuestas"),
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: colors.primary,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const completedSurveys = JSON.parse(localStorage.getItem("surveyCompleted") || "[]");
            if (!completedSurveys.includes(survey.id)) {
              completedSurveys.push(survey.id);
              localStorage.setItem("surveyCompleted", JSON.stringify(completedSurveys));
            }
            nav("/gratitude");
          }
        });
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
      Toast2.fire({
        icon: "error",
        title: `${t("alerts.error_enviar_respuestas")}`,
      });
    }
  };
  
  const getSurvey = async (link) => {
    const fullLink = encodeURIComponent(link); 
    
    try {
      const response = await axios.get(`http://localhost:3000/api/surveyByLink?link=${fullLink}`);
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        
        const survey = {
          id: data.survey_set.id,  
          logo: data.survey_set.logo,
          color_tag1: data.survey_set.color_tag1,
          color_tag2: data.survey_set.color_tag2
        };
        
        setSurvey(survey);  
        setTitle(data.survey_set.title); 
        setQuestions(data.question);  
      }
    } catch (error) {
      console.error("Error al cargar encuesta:", error);
    }
  };

  const handleChange = (event, id) => {
    const newAnswer = { answer: event.target.value, question_id: id };
    const newAnswers = answers.map(answer =>
      answer.question_id === id ? { ...answer, answer: event.target.value } : answer
    );
    if (!answers.some(answer => answer.question_id === id)) {
      newAnswers.push(newAnswer);
    }
    setAnswers(newAnswers);
  };

  const handleChangeMultiple = (event, selectedString, id) => {
    const newAnswer = { question_id: id, answer: selectedString };
    const newAnswers = answers.map(answer =>
      answer.question_id === id ? { ...answer, answer: selectedString } : answer
    );
    if (!answers.some(answer => answer.question_id === id)) {
      newAnswers.push(newAnswer);
    }
    setAnswers(newAnswers);
  };

  const shouldRenderQuestion = (question) => {
    if (question.id_conditional) {
      const conditionalAnswerObj = answers.find(answer => answer.question_id === question.id_conditional);
      if (conditionalAnswerObj) {
        const validAnswers = question.conditional_answer.split(',');
        return validAnswers.includes(conditionalAnswerObj.answer);
      }
      return false;
    }
    return true;
  };
  
  const CLIENTS_BASE_URL = 'http://localhost:3000/clientes';

  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImg;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      position: 'relative',
      background: `linear-gradient(135deg, ${colors.primaryAlpha10} 0%, ${alpha('#ffffff', 0.95)} 100%)`,
    }}>
      
      {/* Header flotante mejorado */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1200,
          background: alpha('#ffffff', 0.95),
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: { xs: 1.5, md: 2 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          boxShadow: `0 8px 32px ${colors.shadowLight}`,
          border: `1px solid ${alpha(colors.primary, 0.1)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 40px ${colors.shadowMedium}`,
          }
        }}
      >
        <Tooltip title={t("cambiar_tema")} placement="bottom">
          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            }
            label=""
          />
        </Tooltip>
        
        <LanguageSelector />
      </Box>

      {/* Fondo decorativo mejorado */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primaryAlpha10} />
              <stop offset="50%" stopColor={colors.primaryAlpha20} />
              <stop offset="100%" stopColor={colors.primaryAlpha10} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1920,0 L1920,400 C1800,350 1600,300 1400,350 C1200,400 1000,450 800,400 C600,350 400,300 200,350 C100,375 50,387 0,400 Z"
            fill="url(#bgGradient)"
            opacity="0.6"
          />
          <path
            d="M0,1080 L1920,1080 L1920,680 C1800,730 1600,780 1400,730 C1200,680 1000,630 800,680 C600,730 400,780 200,730 C100,705 50,693 0,680 Z"
            fill="url(#bgGradient)"
            opacity="0.4"
          />
        </svg>
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 8, md: 10 },
          pb: 4,
          px: { xs: 2, md: 3 }
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              width: '100%',
              maxWidth: 900,
              background: alpha('#ffffff', 0.98),
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${alpha(colors.primary, 0.08)}`,
              boxShadow: `
                0 1px 3px ${colors.shadowLight},
                0 8px 32px ${colors.shadowLight},
                inset 0 1px 0 ${alpha('#ffffff', 0.9)}
              `,
            }}
          >
            
            {/* Header del formulario */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, md: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  mb: 2,
                }}
              >
                {survey.logo && (
                  <Box
                    component="img"
                    src={`${CLIENTS_BASE_URL}/${survey.logo}`}
                    alt="Logo"
                    onError={handleLogoError}
                    sx={{ 
                      maxHeight: { xs: 50, md: 70 },
                      maxWidth: { xs: 120, md: 200 },
                      objectFit: 'contain'
                    }}
                  />
                )}
                
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="600"
                  sx={{
                    color: colors.primary,
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
              </Box>
              

            </Box>

            {/* Preguntas */}
            <Box sx={{ mb: 4 }}>
              {visibleQuestions.map((question, index) => (
                <Box 
                  key={question.id}
                  sx={{ 
                    mb: 4,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background: alpha(colors.primary, 0.02),
                    border: `1px solid ${alpha(colors.primary, 0.06)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(colors.primary, 0.04),
                      border: `1px solid ${alpha(colors.primary, 0.12)}`,
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    sx={{ 
                      mb: 3, 
                      textAlign: 'center',
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.4,
                    }}
                  >
                    {question.question}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {question.type === 'range_onetofive' ? (
                      <Range_onetofive_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_zerototen' ? (
                      <Range_zerototen_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_difficulty' ? (
                      <Range_difficulty_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'yes_no' ? (
                      <Yes_no_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_emoji' ? (
                      <Range_emoji_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'radio_opt' ? (
                      <Single_choice_survey
                        answers={question.select_option}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'check_opt' ? (
                      <Multiple_choice_survey
                        answers={question.select_option}
                        id={question.id}
                        change={handleChangeMultiple}
                      />
                    ) : question.type === 'textfield_s' ? (
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={
                          answers.find((a) => a.question_id === question.id)?.answer || ''
                        }
                        onChange={(e) => handleChange(e, question.id)}
                        sx={{
                          maxWidth: 600,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: alpha('#ffffff', 0.8),
                            '& fieldset': {
                              borderColor: alpha(colors.primary, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha(colors.primary, 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Botón de envío */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: '600',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  color: colors.textOnPrimary,
                  textTransform: 'none',
                  boxShadow: `0 4px 16px ${alpha(colors.primary, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(colors.primary, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {t('buttons.enviar')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}