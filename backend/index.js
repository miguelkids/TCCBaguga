const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Tornar a pasta de uploads estática para que o frontend consiga exibir as imagens
app.use('/uploads', express.static('uploads'));

// Import das rotas
const authRoutes = require('./routes/auth');
const quadrasRoutes = require('./routes/quadras');
const reservasRoutes = require('./routes/reservas');
const chatRoutes = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');

// Uso das rotas
app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadrasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API SportCourt conectada ao MySQL!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
