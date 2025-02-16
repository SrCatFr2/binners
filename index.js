const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Función helper para leer archivos JSON
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/bins', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'bins.html'));
});

app.get('/tutorials', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'tutorials.html'));
});

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'community.html'));
});

// API Endpoints
app.get('/api/bins', async (req, res) => {
    try {
        const bins = await readJsonFile(path.join(__dirname, 'bins', 'bins.json'));
        if (!bins) {
            return res.status(500).json({ error: 'Error loading bins data' });
        }

        // Procesar y enriquecer los datos de bins
        const processedBins = bins.map(bin => ({
            ...bin,
            isActive: true, // Aquí puedes añadir lógica para verificar si el bin está activo
            verifiedDate: new Date().toISOString(),
            success_rate: Math.floor(Math.random() * 30) + 70 // Ejemplo: tasa de éxito 70-100%
        }));

        res.json({ bins: processedBins });
    } catch (error) {
        console.error('Error in /api/bins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/tutorials', async (req, res) => {
    try {
        const tutorials = await readJsonFile(path.join(__dirname, 'bins', 'tutorials.json'));
        if (!tutorials) {
            return res.status(500).json({ error: 'Error loading tutorials data' });
        }

        // Procesar y enriquecer los datos de tutoriales
        const processedTutorials = tutorials.map(tutorial => ({
            ...tutorial,
            thumbnail: `/images/tutorials/${tutorial.id}.jpg`,
            duration: '10:30', // Ejemplo de duración
            views: Math.floor(Math.random() * 1000) + 500,
            difficulty: ['Básico', 'Intermedio', 'Avanzado'][Math.floor(Math.random() * 3)]
        }));

        res.json({ tutorials: processedTutorials });
    } catch (error) {
        console.error('Error in /api/tutorials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API para estadísticas de la comunidad
app.get('/api/community/stats', async (req, res) => {
    try {
        // Ejemplo de estadísticas dinámicas
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
        console.error('Error in /api/community/stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware para manejar errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal! Por favor, intenta de nuevo más tarde.');
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║                                            ║
    ║  🚀 Servidor iniciado correctamente        ║
    ║  📡 Puerto: ${PORT}                          ║
    ║  🌐 URL: http://localhost:${PORT}            ║
    ║  ⚡ Modo: ${process.env.NODE_ENV || 'development'}                    ║
    ║                                            ║
    ╚════════════════════════════════════════════╝
    `);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});
