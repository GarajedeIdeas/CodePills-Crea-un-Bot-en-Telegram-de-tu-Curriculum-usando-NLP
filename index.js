const express = require('express');
const { Telegraf } = require('telegraf');
const { dockStart } = require('@nlpjs/basic');

require('dotenv').config();

// Generar la app de express
const app = express();
// Genero la instancia de mi bot
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bot.webhookCallback('/url-telegram'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/url-telegram`);

app.post('/url-telegram', (req, res) => {
    res.send('Termina');
});


bot.on('text', async (ctx) => {

    const dock = await dockStart();
    const nlp = dock.get('nlp');

    const response = await nlp.process('es', ctx.message.text);

    if (response.answer) {
        ctx.reply(response.answer);
    } else {
        ctx.reply('No te entiendo');
    }

});

// Ponemos el server a escuchar en el puerto correspondiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);

    const dock = await dockStart();
    const nlp = dock.get('nlp');
    await nlp.train();
});