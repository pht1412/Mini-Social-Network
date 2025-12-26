import { 
  AppBar, Toolbar, Box, InputBase, 
  IconButton, Tooltip, Button, Avatar 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notification/NotificationBell';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px', 
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ 
      background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)', 
      boxShadow: '0 4px 20px 0px rgba(0, 0, 0, 0.1)' 
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        {/* ----- CỤM BÊN TRÁI ----- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            onClick={() => navigate('/')} 
            sx={{ 
                cursor: 'pointer', mr: 2, fontWeight: 'bold', fontSize: '1.2rem', 
                display: 'flex', alignItems: 'center', gap: 1 
            }}
          >
            MiniSocial
          </Box>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        {/* ----- CỤM Ở GIỮA ----- */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Trang chủ">
            <IconButton 
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}>
                <HomeIcon />
            </IconButton>
          </Tooltip>
        </Box>
        

        {/* ----- CỤM BÊN PHẢI ----- */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Nút Admin */}
              {user?.role === 'ADMIN' && (
                <Tooltip title="Trang quản trị (Dashboard)">
                  <IconButton 
                    component={RouterLink} 
                    to="/admin/dashboard" 
                    color="inherit"
                    sx={{ 
                      bgcolor: 'rgba(236, 72, 153, 0.2)', 
                      border: '1px solid rgba(236, 72, 153, 0.5)',
                      '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.4)' },
                      mr: 1
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ color: '#FBCFE8' }} />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Thông báo">
                  <Box> 
                     <NotificationBell />
                  </Box>
              </Tooltip>

              <Tooltip title={`Xin chào, ${user?.fullName || 'User'}`}>
                <IconButton component={RouterLink} to="/profile" sx={{ p: 0, border: '2px solid rgba(255,255,255,0.5)' }}>
                  <Avatar alt={user?.fullName} src={user?.avatarUrl || "/static/images/avatar/1.jpg"} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Đăng xuất">
                <IconButton onClick={handleLogout} color="inherit">
                    <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {/* Nút Đăng nhập/Đăng ký */}
              <Button 
                color="inherit" 
                variant="text" 
                component={RouterLink} 
                to="/login"
                sx={{ mr: 1, fontWeight: 600 }}
              >
                Đăng nhập
              </Button>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/register"
                sx={{ 
                    bgcolor: 'white', 
                    color: '#4F46E5', 
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#F3F4F6' }
                }}
              >
                Đăng ký
              </Button>
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}