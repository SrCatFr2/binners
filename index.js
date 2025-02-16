const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Endpoint para bins
app.get('/api/bins', async (req, res) => {
    try {
        const bins = [
            {
                "image": "/images/platforms/netflix.png",
                "bin": "41471814378082xx|04|2025",
                "platform": "Netflix",
                "location": "Estados Unidos",
                "tip": "Usar con VPN residencial",
                "isActive": true,
                "verifiedDate": new Date().toISOString()
            },
            {
                "image": "/images/platforms/disney.png",
                "bin": "51234567890123xx|05|2026",
                "platform": "Disney+",
                "location": "Argentina",
                "tip": "Funciona mejor con residential IP",
                "isActive": true,
                "verifiedDate": new Date().toISOString()
            }
        ];
        
        res.json({ bins });
    } catch (error) {
        console.error('Error serving bins:', error);
        res.status(500).json({ error: 'Error loading bins' });
    }
});

// Endpoint para tutoriales
app.get('/api/tutorials', async (req, res) => {
    try {
        const tutorials = [
            {
                "id": 1,
                "title": "Cómo usar bins en Netflix 2024",
                "description": "Tutorial completo del método más reciente",
                "category": "Netflix",
                "thumbnail": "/images/tutorials/netflix-1.jpg",
                "videoFile": "tutorial1.mp4",
                "duration": "10:30",
                "views": 15000,
                "date": new Date().toISOString(),
                "difficulty": "Intermedio"
            },
            {
                "id": 2,
                "title": "Método Disney+ Actualizado",
                "description": "Nuevo método que funciona al 100%",
                "category": "Disney+",
                "thumbnail": "/images/tutorials/disney-1.jpg",
                "videoFile": "tutorial2.mp4",
                "duration": "8:45",
                "views": 12000,
                "date": new Date().toISOString(),
                "difficulty": "Básico"
            }
        ];
        
        res.json({ tutorials });
    } catch (error) {
        console.error('Error serving tutorials:', error);
        res.status(500).json({ error: 'Error loading tutorials' });
    }
});

// Endpoint para estadísticas de la comunidad
app.get('/api/community/stats', async (req, res) => {
    try {
        const stats = {
            members: 2760,
            online: 639,
            completedGiveaways: 500,
            activeGiveaways: 5,
            nitroGiven: 250,
            robuxGiven: 100000,
            lastUpdated: new Date().toISOString()
        };
        res.json(stats);
    } catch (error) {
        console.error('Error serving community stats:', error);
        res.status(500).json({ error: 'Error loading stats' });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
