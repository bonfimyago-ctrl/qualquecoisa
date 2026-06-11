const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

function pausar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarinfo(tema) {
    await pausar (800);
    return (
        `resultado sobre "${tema}" : ` +
        `acesse https://developer.mozilla.org/${tema}`
        `ou https://nodejs.org para mais detalhes`
        `contato: suporte@${tema.toLowerCase()}.com`
    )
}
app.get('API/buscar/:tema', async (req, res) => {
    try {
        const resultado = await buscarinfo(req.params.tema);
        res.json({ sucesso: true, texto: resultado });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/API/link', (req, res) => {
    const {texto} = req.body;
    if (!texto) { return res.status(400).json({ sucesso: false, erro: 'Envie um campo "texto"' }) };

    const regex = /https?:\/\/[^\s,]+/g;
    const links = texto.match(regex) || [];

    res.json({ total:  links.length, links   });
});

app.post('/API/emails', (req, res) => {
    const {texto} = req.body;
    if (!texto) { return res.status(400).json({ sucesso: false, erro: 'Envie um campo "texto"' }) };

    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = texto.match(regex) || [];

    for(const macht of texto.matchAll(regex)) {
        emails.push({
            completo: macht[0],
            usuario: macht[1],
            dominio: macht[2]
        });
    }

    res.json({ total: emails.length, emails });
});

app.get('/API/validar', (req, res) => {
    const {email} = req.query;
    if (!email) { return res.status(400).json({ sucesso: false, erro: 'Envie um parâmetro "email"' }) };

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valido = regex.test(email);

    res.json({ email, valido });
});

app.listen(3000, () => {
    console.log('\n Servidor rodando em: http://localhost:3000\n');
});


        