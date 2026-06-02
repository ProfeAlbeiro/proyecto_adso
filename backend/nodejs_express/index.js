const http = require('http');
const app = require('./server');
const cors = require('cors');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '172.25.192.1';

// Configuración CORS
app.use(cors({
  origin: [
    'http://172.25.192.1',
    'http://localhost', 
    'http://127.0.0.1'    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight CORS
app.options('*', cors());
app.set('port', port);

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});