import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Grid, Card, CardContent, CardMedia, Typography, Button, Container, Chip 
} from '@mui/material';
import { SportsEsports, VideogameAsset } from '@mui/icons-material';

// Dữ liệu giả lập các game (Sau này có thể lấy từ API)
const GAMES = [
    {
        id: 'snake',
        title: 'Rắn Săn Mồi',
        description: 'Trò chơi kinh điển. Điều khiển rắn ăn mồi và tránh va chạm!',
        image: 'https://images.unsplash.com/photo-1628277613967-6bc520d95e78?q=80&w=600&auto=format&fit=crop', // Ảnh minh họa
        path: '/games/snake',
        category: 'Arcade',
        status: 'Active'
    },
    {
        id: 'coming-soon',
        title: 'Game Mới Sắp Ra Mắt',
        description: 'Chúng tôi đang phát triển thêm nhiều trò chơi thú vị khác.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
        path: '#',
        category: 'Future',
        status: 'Coming Soon'
    }
];

const GameList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#16a34a', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <SportsEsports fontSize="large" /> Game Center
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Giải trí và đua top cùng bạn bè sau những giờ học căng thẳng
                </Typography>
            </Box>

            {/* Danh sách Game */}
            <Grid container spacing={4}>
                {GAMES.map((game) => (
                    <Grid item key={game.id} xs={12} sm={6} md={4}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={game.image}
                                alt={game.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                                        {game.title}
                                    </Typography>
                                    <Chip 
                                        label={game.category} 
                                        size="small" 
                                        color={game.status === 'Active' ? 'success' : 'default'} 
                                        variant="outlined" 
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {game.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    color={game.status === 'Active' ? 'success' : 'inherit'}
                                    disabled={game.status !== 'Active'}
                                    onClick={() => game.status === 'Active' && navigate(game.path)}
                                    startIcon={<VideogameAsset />}
                                >
                                    {game.status === 'Active' ? 'Chơi Ngay' : 'Sắp Ra Mắt'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default GameList;