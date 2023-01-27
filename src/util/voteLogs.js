const Topgg = require("@top-gg/sdk");
const {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  hyperlink,
  hideLinkEmbed,
} = require("discord.js");
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

const webhook = new Topgg.Webhook(process.env.WEBHOOKTOKEN);


