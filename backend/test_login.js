const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { id: '1e8b56c0-cad6-4bcb-b764-fbdcc25bb21a', email: 'miguel@gmail.com', tipo: 'jogador' },
    'sua_chave_secreta_super_segura',
    { expiresIn: '7d' }
);

fetch('http://localhost:3000/api/auth/me', {
    headers: { 'Authorization': 'Bearer ' + token }
}).then(res => res.json()).then(data => console.log('Auth me:', data));
