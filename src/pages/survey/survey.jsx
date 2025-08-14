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

// Sistema de colores súper inteligente que garantiza contraste perfecto
const useIntelligentColorSystem = (color1, color2, isDarkMode) => {
  return useMemo(() => {
    // Función para convertir hex a RGB
    const hexToRgb = (hex) => {
      if (!hex || typeof hex !== 'string') return { r: 103, g: 80, b: 164 };
      const cleanHex = hex.replace('#', '');
      if (cleanHex.length !== 6) return { r: 103, g: 80, b: 164 };
      
      const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 103, g: 80, b: 164 };
    };

    // Función para convertir RGB a hex
    const rgbToHex = (r, g, b) => {
      const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
      return "#" + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
    };

    // Calcular luminancia relativa
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    // Calcular ratio de contraste
    const getContrastRatio = (hex1, hex2) => {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);
      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
      return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    };

    // Ajustar color para cumplir ratio mínimo de contraste
    const ensureContrast = (foregroundHex, backgroundHex, minRatio = 4.5) => {
      let currentRatio = getContrastRatio(foregroundHex, backgroundHex);
      if (currentRatio >= minRatio) return foregroundHex;

      const fgRgb = hexToRgb(foregroundHex);
      const bgRgb = hexToRgb(backgroundHex);
      const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
      
      // Determinar si necesitamos hacer el color más claro u oscuro
      const needLighter = bgLum < 0.5;
      
      let bestColor = foregroundHex;
      let bestRatio = currentRatio;
      
      // Probar diferentes niveles de ajuste
      for (let factor = 0.1; factor <= 2; factor += 0.1) {
        let adjustedRgb;
        
        if (needLighter) {
          // Hacer más claro
          const lightenFactor = 1 + factor;
          adjustedRgb = {
            r: Math.min(255, fgRgb.r * lightenFactor),
            g: Math.min(255, fgRgb.g * lightenFactor),
            b: Math.min(255, fgRgb.b * lightenFactor)
          };
        } else {
          // Hacer más oscuro
          const darkenFactor = 1 - (factor * 0.5);
          adjustedRgb = {
            r: fgRgb.r * darkenFactor,
            g: fgRgb.g * darkenFactor,
            b: fgRgb.b * darkenFactor
          };
        }
        
        const adjustedHex = rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
        const newRatio = getContrastRatio(adjustedHex, backgroundHex);
        
        if (newRatio >= minRatio && newRatio > bestRatio) {
          bestColor = adjustedHex;
          bestRatio = newRatio;
          break;
        } else if (newRatio > bestRatio) {
          bestColor = adjustedHex;
          bestRatio = newRatio;
        }
      }
      
      return bestColor;
    };

    // Hacer color más vibrante/intenso
    const enhanceVibrancy = (hex, factor = 1.2) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // Aumentar saturación
      hsl.s = Math.min(1, hsl.s * factor);
      
      const enhancedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      return rgbToHex(enhancedRgb.r, enhancedRgb.g, enhancedRgb.b);
    };

    // Convertir RGB a HSL
    const rgbToHsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h, s, l };
    };

    // Convertir HSL a RGB
    const hslToRgb = (h, s, l) => {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: r * 255, g: g * 255, b: b * 255 };
    };

    // Obtener color de fondo base según el modo
    const baseBackground = isDarkMode ? '#121212' : '#ffffff';
    const surfaceBackground = isDarkMode ? '#1e1e1e' : '#ffffff';
    const paperBackground = isDarkMode ? '#2d2d2d' : '#ffffff';
    
    // Colores base (fallbacks si no se proporcionan)
    const rawPrimary = color1 || '#6750a4';
    const rawSecondary = color2 || '#625b71';
    
    // Hacer colores más vibrantes
    const vibrantPrimary = enhanceVibrancy(rawPrimary, 1.3);
    const vibrantSecondary = enhanceVibrancy(rawSecondary, 1.3);
    
    // Asegurar contraste perfecto con los fondos
    const primary = ensureContrast(vibrantPrimary, paperBackground, 3.5);
    const secondary = ensureContrast(vibrantSecondary, paperBackground, 4.5);
    
    // Crear variaciones inteligentes
    const primaryRgb = hexToRgb(primary);
    const secondaryRgb = hexToRgb(secondary);
    
    // Variaciones oscuras y claras que mantienen contraste
    const primaryDark = ensureContrast(
      rgbToHex(primaryRgb.r * 0.7, primaryRgb.g * 0.7, primaryRgb.b * 0.7),
      paperBackground,
      4.5
    );
    
    const primaryLight = ensureContrast(
      rgbToHex(
        Math.min(255, primaryRgb.r * 1.4),
        Math.min(255, primaryRgb.g * 1.4),
        Math.min(255, primaryRgb.b * 1.4)
      ),
      paperBackground,
      3
    );

    const secondaryDark = ensureContrast(
      rgbToHex(secondaryRgb.r * 0.7, secondaryRgb.g * 0.7, secondaryRgb.b * 0.7),
      paperBackground,
      4.5
    );

    // Determinar colores de texto óptimos
    const textOnPrimary = getContrastRatio(primary, '#ffffff') > getContrastRatio(primary, '#000000') ? '#ffffff' : '#000000';
    const textOnSecondary = getContrastRatio(secondary, '#ffffff') > getContrastRatio(secondary, '#000000') ? '#ffffff' : '#000000';
    
    // Sistema de colores inteligente para modo oscuro
    const adaptedColors = {
      // Colores principales
      primary,
      secondary,
      primaryDark,
      primaryLight,
      secondaryDark,
      
      // Fondos adaptativos
      background: baseBackground,
      surface: surfaceBackground,
      paper: paperBackground,
      
      // Colores con alpha optimizados
      primaryAlpha5: alpha(primary, 0.05),
      primaryAlpha10: alpha(primary, 0.1),
      primaryAlpha15: alpha(primary, 0.15),
      primaryAlpha20: alpha(primary, 0.2),
      primaryAlpha30: alpha(primary, 0.3),
      primaryAlpha40: alpha(primary, 0.4),
      primaryAlpha60: alpha(primary, 0.6),
      
      secondaryAlpha10: alpha(secondary, 0.1),
      secondaryAlpha20: alpha(secondary, 0.2),
      secondaryAlpha60: alpha(secondary, 0.6),
      
      // Sombras adaptativas
      shadowLight: alpha(isDarkMode ? '#000000' : '#000000', isDarkMode ? 0.3 : 0.1),
      shadowMedium: alpha(isDarkMode ? '#000000' : '#000000', isDarkMode ? 0.4 : 0.15),
      shadowStrong: alpha(isDarkMode ? '#000000' : '#000000', isDarkMode ? 0.6 : 0.25),
      
      // Bordes adaptativos
      borderLight: alpha(primary, isDarkMode ? 0.3 : 0.08),
      borderMedium: alpha(primary, isDarkMode ? 0.4 : 0.12),
      borderStrong: alpha(primary, isDarkMode ? 0.6 : 0.2),
      
      // Texto sobre colores
      textOnPrimary,
      textOnSecondary,
      
      // Colores de texto adaptativos
      textPrimary: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
      
      // Overlays para glassmorphism
      glassOverlay: alpha(isDarkMode ? '#ffffff' : '#ffffff', isDarkMode ? 0.05 : 0.95),
      glassOverlayStrong: alpha(isDarkMode ? '#ffffff' : '#ffffff', isDarkMode ? 0.1 : 0.98),
    };

    return adaptedColors;
  }, [color1, color2, isDarkMode]);
};

// Switch personalizado ultra mejorado
const createIntelligentSwitch = (colors) => styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(24px)",
      "& .MuiSwitch-thumb": {
        backgroundColor: colors.secondary,
        boxShadow: `0 4px 12px ${colors.shadowMedium}`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: colors.secondaryAlpha60,
        border: `1px solid ${colors.borderMedium}`,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: colors.glassOverlayStrong,
    width: 26,
    height: 26,
    boxShadow: `0 2px 8px ${colors.shadowLight}`,
    border: `1px solid ${colors.borderLight}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: colors.primaryAlpha20,
    borderRadius: 17,
    border: `1px solid ${colors.borderLight}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

  // Sistema de colores súper inteligente
  const colors = useIntelligentColorSystem(survey.color_tag1, survey.color_tag2, theme === 'dark');
  const IntelligentSwitch = createIntelligentSwitch(colors);

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
          confirmButtonColor: colors.secondary, // Usando color2 aquí
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
      background: `linear-gradient(135deg, ${colors.primaryAlpha10} 0%, ${alpha('#ffffff', theme === 'dark' ? 0.05 : 0.95)} 100%)`, // TU FONDO GENIAL RESTAURADO
    }}>
      
      {/* Header flotante ultra mejorado */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1200,
          background: colors.glassOverlay,
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: { xs: 1.5, md: 2 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          boxShadow: `0 8px 32px ${colors.shadowLight}`,
          border: `1px solid ${colors.borderLight}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 40px ${colors.shadowMedium}`,
          }
        }}
      >
        <Tooltip title={t("cambiar_tema")} placement="bottom">
          <FormControlLabel
            control={
              <IntelligentSwitch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            }
            label=""
          />
        </Tooltip>
        
        <LanguageSelector />
      </Box>

      {/* TU FONDO DECORATIVO GENIAL ORIGINAL RESTAURADO CON COLORES INTELIGENTES */}
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
          {/* TUS PATHS ORIGINALES GENIALES */}
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
              background: colors.glassOverlayStrong,
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${colors.borderLight}`,
              boxShadow: `
                0 1px 3px ${colors.shadowLight},
                0 8px 32px ${colors.shadowMedium},
                inset 0 1px 0 ${alpha(colors.glassOverlay, 0.9)}
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
                
                {/* TÍTULO CON COLOR2 */}
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="600"
                  sx={{
                    color: colors.secondary, // Usando color2
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
                    background: colors.primaryAlpha5,
                    border: `1px solid ${colors.borderLight}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: colors.primaryAlpha10,
                      border: `1px solid ${colors.borderMedium}`,
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    sx={{ 
                      mb: 3, 
                      textAlign: 'center',
                      color: colors.textPrimary,
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
                            backgroundColor: colors.glassOverlay,
                            color: colors.textPrimary,
                            '& fieldset': {
                              borderColor: colors.borderLight,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.borderMedium,
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

            {/* BOTÓN CON COLOR2 */}
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
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`, // COLOR2
                  color: colors.textOnSecondary,
                  textTransform: 'none',
                  boxShadow: `0 4px 16px ${alpha(colors.secondary, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colors.secondaryDark} 0%, ${colors.secondary} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(colors.secondary, 0.4)}`,
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