// src/styles/theme.ts
import { createTheme, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
// 1. ĐỊNH NGHĨA BIẾN MÀU CHUẨN FACEBOOK
// ----------------------------------------------------------------------
const PRIMARY_COLOR = '#1877F2';      // Xanh Facebook chuẩn
const SECONDARY_COLOR = '#42b72a';    // Xanh lá (cho nút Tạo tài khoản/Đăng ký)
const SUCCESS_COLOR = '#2e7d32';   
const ERROR_COLOR = '#d32f2f';     
const WARNING_COLOR = '#ed6c02';   
const INFO_COLOR = '#0288d1';      

const BACKGROUND_DEFAULT = '#F0F2F5'; // Màu nền xám nhạt đặc trưng của FB
const BACKGROUND_PAPER = '#FFFFFF';   // Trắng tinh cho các Card bài viết

const FONT_FAMILY = 'Segoe UI, Helvetica, Arial, sans-serif'; // Font hệ thống Facebook
const BORDER_RADIUS_DEFAULT = 8; // Bo góc chuẩn cho các Card bài viết

// ----------------------------------------------------------------------
// 🚀 TẠO THEME CHI TIẾT
// ----------------------------------------------------------------------

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    success: {
      main: SUCCESS_COLOR,
    },
    error: {
      main: ERROR_COLOR,
    },
    warning: {
      main: WARNING_COLOR,
    },
    info: {
      main: INFO_COLOR,
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: '#050505',   // Màu chữ đen FB
      secondary: '#65676B', // Màu chữ xám cho thông tin phụ
      disabled: '#BDBDBD',
    },
  },

  typography: {
    fontFamily: FONT_FAMILY,
    htmlFontSize: 16,
    fontSize: 14,
    h1: { fontSize: '2.5rem', fontWeight: 700 }, // Giữ nguyên thông số của bạn
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem' }, 
    body2: { fontSize: '0.875rem' }, 
    button: {
      fontWeight: 600,
      textTransform: 'none', // Bỏ viết hoa theo style hiện đại
    },
  },

  shape: {
    borderRadius: BORDER_RADIUS_DEFAULT,
  },

  components: {
    // Tùy chỉnh Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Facebook dùng bo góc nút hơi vuông hơn Card một chút
          padding: '8px 16px',
          boxShadow: 'none', // FB ít dùng shadow cho nút
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: alpha(PRIMARY_COLOR, 0.9),
          }
        },
        containedPrimary: {
          color: 'white',
        },
        containedSecondary: {
          color: 'white',
          backgroundColor: SECONDARY_COLOR,
          '&:hover': {
            backgroundColor: '#36a420',
          }
        }
      },
    },

    // Tùy chỉnh Card (Trái tim của News Feed)
    MuiCard: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Shadow cực nhẹ chuẩn FB
          borderRadius: BORDER_RADIUS_DEFAULT,
        },
      },
    },

    // Tùy chỉnh Input (Giữ lại cấu trúc tỉ mỉ của bạn)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F2F5', // Input FB thường có nền xám nhẹ
          borderRadius: 20, // Bo góc tròn cho các ô Search/Comment
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D0D0D0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderColor: PRIMARY_COLOR,
          },
        },
      },
    },
    
    // Tùy chỉnh Header (AppBar)
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_PAPER,
          color: '#050505',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          borderBottom: `1px solid ${alpha('#000', 0.1)}`, // Tinh chỉnh lại borderBottom của bạn
        }
      }
    }
  },
});

export default theme;