const Topgg = require('@top-gg/sdk');
const {
  WebhookClient, ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const webhook = new Topgg.Webhook(process.env.WEBHOOKTOKEN);

app.post('/dblwebhook', webhook.listener(async (vote) => {
  let emojis = [
    '<a:jammiesyou:1009965703484424282>', '<a:nyancatyou:1009965705808056350>', '<a:partyparrotyou:1009965704621080678>', '<a:shootyou:1009965706978267136>', '<a:catjamyou:1009965950101110806>', '<a:patyou:1009964589678612581>', '<a:patyoufast:1009964759216574586>',
  ];

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Vote!')
      .setStyle(5)
      .setEmoji('💻')
      .setURL('https://top.gg/bot/981649513427111957/vote'),
  );

  let emojisrandom = emojis[Math.floor(Math.random() * emojis.length)];
  let userdata = null;
  await axios({
    method: 'get',
    url: `https://japi.rest/discord/v1/user/${vote.user}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then((res) => {
    userdata = res.data;
  }).catch((err) => {});

  const webhookClient = new WebhookClient({ url: process.env.WEBHOOKVOTE });

  webhookClient.send({
    content: `${emojisrandom} Voted for me on \`https://top.gg/bot/981649513427111957/vote\``,
    components: [button],
    username: `${userdata.data.tag}`,
    avatarURL: userdata.data.avatarURL,
  }).catch((err) => console.log(err));
}));

app.listen(8090);
