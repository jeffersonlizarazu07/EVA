import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Button as MUIButton, 
  Menu, 
  MenuItem, 
  Tooltip,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const languages = [
    { code: 'es', name: 'Español', flag: 'es' },
    { code: 'en', name: 'English', flag: 'us' },
    { code: 'pt', name: 'Português', flag: 'pt' },
    { code: 'it', name: 'Italiano', flag: 'it' }
  ];

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageSelect = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('surveyLanguage', languageCode);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  return (
    <div style={{ position: 'fixed', top: '2%', left: '94%', zIndex: 1000 }}>
      <Tooltip placement="bottom">
        <MUIButton
          aria-controls="language-menu"
          aria-haspopup="true"
          onClick={handleLanguageClick}
          disableRipple
          sx={{
            minWidth: 'auto',
            color: 'inherit',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <LanguageIcon sx={{
            fontSize: '1.5rem',
            fill: 'url(#gradient-text)',
          }} />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient-text" x1="0" y1="0" x2="1" y2="1">
                <stop offset="37%" stopColor="rgba(199,14,143,1)" />
                <stop offset="69%" stopColor="rgba(95,9,121,1)" />
              </linearGradient>
            </defs>
          </svg>
        </MUIButton>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            selected={i18n.language === language.code}
            sx={{
              minWidth: '160px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(199,14,143,0.1)',
              }
            }}
          >
            <ListItemIcon>
              <span className={`flag-icon flag-icon-${language.flag}`}  />
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageSelector;