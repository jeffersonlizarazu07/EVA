import fondo from '../../assets/img/eva v8.png'
import fondoOscuro from '../../assets/img/eva v10.png'
import { createTheme } from '@mui/material/styles';

const commonDarkBackground = '#383636';
const commonTextWhite = '#ffffff';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    text: { primary: '#000000' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#000000',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: { primary: commonTextWhite },
    background: { default: commonDarkBackground },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${fondoOscuro})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: commonTextWhite,
        },
        '.modal-content': {
          backgroundColor: commonDarkBackground,
        },
        '.btn-light': {
          backgroundColor: '#353a3f',
        },
        '#nav-Claro': {
          backgroundColor: commonDarkBackground,
        },
        '.css-6hp17o-MuiList-root-MuiMenu-list': {
          backgroundColor: commonDarkBackground,
          color: commonTextWhite,
        },
        '.btn-group label': {
          backgroundColor: commonDarkBackground,
          color: commonTextWhite,
        },
        'button.btn.hola': {
          color: commonTextWhite,
        },
        '.btn-group label:hover': {
          color: commonTextWhite,
        },
        '.css-14908sq-MuiButtonBase-root-MuiButton-root': {
          color: commonTextWhite,
        },
        '.table-container, .table > :not(caption) > * > *': {
          backgroundColor: commonDarkBackground,
          color: commonTextWhite,
        },
        '.card': {
          backgroundColor: commonDarkBackground,
          color: commonTextWhite,
        },
        '.dropdown-menu': {
          backgroundColor: commonDarkBackground,
        },
        '.dropdown-item': {
          color: commonTextWhite,
        },
        '.input-new': {
          color: commonTextWhite,
        },
        '.opt-superadmin, .opt-viewer, .opt-admin, .opt-editor': {
          color: 'black !important',
        },
        '.input-new:focus + .labelName, .input-new:not(:placeholder-shown) + .labelName': {
          transform: 'translateY(-50%) scale(0.7)',
          backgroundColor: commonDarkBackground,
        },
        '.css-38raov-MuiButtonBase-root-MuiChip-root': {
          color: commonTextWhite,
        },
        '.css-152mnda-MuiInputBase-input-MuiOutlinedInput-input': {
          color: commonTextWhite,
        },
        '.css-i4bv87-MuiSvgIcon-root': {
          color: commonTextWhite,
        },
        '.css-1gywuxd-MuiInputBase-root-MuiOutlinedInput-root': {
          color: commonTextWhite,
        },
        '.css-1jy569b-MuiFormLabel-root-MuiInputLabel-root': {
          color: commonTextWhite,
        },
        '.swal2-popup.swal2-toast': {
          backgroundColor: '#797676',
          color: commonTextWhite,
        },
        '.text-secondary': {
          color: `${commonTextWhite} !important`,
        },
        '.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
          color: commonTextWhite,
        },
        '.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
          color: commonTextWhite,
          border: '2px solid rgb(199, 14, 143)',
        },
        '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
          color: commonTextWhite,
        },
        '.css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root': {
          border: '2px solid rgb(199, 14, 143)',
        },
        '.btn-close': {
          background: `transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E") center / 1em auto no-repeat`,
          opacity: 1,
          border: 0,
          borderRadius: '0.375rem',
        },
      },
    },
  },
});
