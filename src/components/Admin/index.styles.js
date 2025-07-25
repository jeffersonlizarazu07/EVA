import fondo from '../../assets/img/eva v8.png'
import fondoOscuro from '../../assets/img/eva v10.png'
import { createTheme } from '@mui/material/styles';












const commonDarkBackground = '#383637';
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
        '.css-1ndauje-MuiPaper-root, .css-mjxahb-MuiTypography-root, .css-155bsob-MuiPaper-root':{
          backgroundColor: `#242424 !important`,
          color: '#ffffff !important',
        },
        //
        
        '.css-1d3z3hw-MuiOutlinedInput-notchedOutline':{
          border:'2px solid #ffffff !important',
          borderRadius: '0.375rem !important',
        },
        '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input, .css-1fgkew7-MuiTypography-root':{
          color: `${commonTextWhite} !important`,
        },
        '.btn-group label, .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input, .css-1fgkew7-MuiTypography-root':{
            color: `${commonDarkBackground} !important`,
        },
        '.css-1d3z3hw-MuiOutlinedInput-notchedOutline':{
          border:'2px solid #000000',
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
        '.css-1ndauje-MuiPaper-root, .css-mjxahb-MuiTypography-root':{
          backgroundColor: `#383637 !important`,
          color: '#ffffff !important',
        },
        '.modal-content': {
          backgroundColor: commonDarkBackground,
        },
        '.btn-light': {
          backgroundColor: commonDarkBackground,
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

        //
        '.css-1hqbmbt-MuiTableCell-root':{
          color: `${commonDarkBackground} !important`,
        },
        '.table-light.tr-table th':{
          color: `${commonDarkBackground} !important`,
        },
        '.h5, h5, .text-start, .fw-bold':{
          color: `${commonTextWhite} !important`,
        },
        '.labelName, .acces-tabla, .text-muted ':{
           color: `${commonTextWhite} !important`,
        },
        '.input-new ':{
          color: `${commonTextWhite} !important`,
          backgroundColor: `#383637 !important`,
        },
        '.row .form-control ':{
          color: `${commonTextWhite} !important`,
          backgroundColor: `#383637 !important`,
          border: '1px solid rgb(255, 255, 255)',
        },
        '.bg-light':{
          backgroundColor: `#383637 !important`,
        },
        // 
        '.fa-solid, .fas':{
          color: `${commonTextWhite} !important`,
        },
        
        '.btn-option-view:hover': {
            border: '2px solid rgb(199, 14, 143) !important',
            color: `${commonTextWhite} !important`,
            backgroundColor: 'transparent !important',
          
        },
        '.btn-option-view:focus': {
            border: '2px solid rgb(199, 14, 143) !important',
            color: `${commonTextWhite} !important`,
          
        },
        '.btn-option-view': {
            backgroundColor: 'transparent !important',
          
        },

        '.css-171xgwh-MuiPaper-root-MuiCard-root':{
          border: '2px solid rgb(199, 14, 143)',
        },
        //
        '.btn-check:checked+.btn, .btn.active, .btn.show, .btn:first-child:active, :not(.btn-check)+.btn:active':{
          border: '2px solid rgb(199, 14, 143)'
        },

        '.btn-rect button':{
          color: commonTextWhite
        },
        '.css-q7p9v4-MuiFormControl-root-MuiTextField-root, .css-veukw9-MuiInputBase-root-MuiOutlinedInput-root':{
          backgroundColor: `${commonDarkBackground} !important`,
          
        },
        
        //
        '.css-txvfyh-MuiButtonBase-root-MuiMenuItem-root, .css-j5rcqz-MuiButtonBase-root-MuiMenuItem-root':{
          color: '#ffffff !important' ,
        },
        ' .MuiButton-root, .css-16z1x8b-MuiTypography-root, .readOnlyField .MuiInputLabel-root, .readOnlyField label.Mui-focused, .text-area':{
          color: `${commonTextWhite} !important`,
          
        },
        '.css-12a0wne-MuiSvgIcon-root':{
          backgroundColor: `transparent !important`,
        },
        
        '.css-lb8oe6-MuiPaper-root-MuiCard-root, .css-1hy3n47-MuiPaper-root':{
          backgroundColor: `#383637 !important`,
        },
        '.css-1l8wjdb-MuiPaper-root-MuiAccordion-root.Mui-expanded:last-of-type, .css-1l8wjdb-MuiPaper-root-MuiAccordion-root':{
          border:'1px solid rgb(199, 14, 143) !important',
        },
        //
        '.btn-group label':{
          color: `${commonTextWhite} !important`,
        },
        '.css-9425fu-MuiOutlinedInput-notchedOutline':{
          border:'2px solid #ffffff !important',
          borderRadius: '0.375rem !important',
        },
        '.css-cy3cvs':{
          backgroundColor: 'transparent !important',
        },
        '.greenCorrect':{
          color: '#008000 !important',
        },
        '.redIncorrect':{
          color : 'rgb(201, 23, 23) !important',
        },



        '.swal2-popup.swal2-toast': {
          backgroundColor: '#444444ff',
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
