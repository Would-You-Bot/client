// import { Channel, EmbedBuilder, bold } from "discord.js";
// import WouldYou from "./wouldYou";
// import { Error } from "mongoose";
// import amqplib from "amqplib";
// import { IQueueMessage } from "../global";

// /* TO DO

//   [] Create thread IEEEEEEEEESQMDFDKSQMLDKLQSDMLQS
//   [x] listen to queue
//   [x] convert queue message to right type
//   [] handle null values
//   [] Decrypt webhook (this can be done on a seperate thread for some added bonus performance right?)
//   [] send to webhook (create fallback where it updates the data in the database and sends it the new)

// */
// export default class DailyMessage {
//   private client: WouldYou;
//   constructor(client: WouldYou) {
//     this.client = client;
//   }
//   /**
//    * Start the daily message Schedule
//    */
//   async listen() {
//     const QUEUE = process.env.QUEUE || "fallback";
//     const URL = process.env.RABBITMQ_URL || "fallback";
//     const connection = await amqplib.connect(URL);
//     if (connection) {
//       const channel = await connection.createChannel();
//       if (channel) {
//         channel.prefetch(1);
//         await channel.assertQueue(QUEUE, { durable: false });
//         channel.consume(QUEUE, async (message) => {
//           if (message) {
//             console.log(message.content.toString());
//             setTimeout(() => {
//               // add create embed and send to webhook
//               this.sendDaily(<IQueueMessage>(<unknown>message))
//                 .then(() => {
//                   channel.ack(message as amqplib.Message);
//                 })
//                 .catch((error: string) => {
//                   console.log(error);
//                   channel.reject(message, true);
//                   throw error;
//                 });
//             }, 1000); // (NOTE) Update this to increase wait time
//           }
//         });
//       }
//     }
//   }
//   /**
//    * @name sendDaily
//    * @description handle the daily message and sent it to the webhookhandler.
//    * @param message
//    * @returns Promise<void>
//    * @author Nidrux
//    */
//   private async sendDaily(message: IQueueMessage): Promise<void | Error> {
//     if (!message.channelId) {
//       return new Error("No channel id provided by the queue message!");
//     }
//     let channel = await this.getDailyMessageChannel(message.channelId);
//     let embed = this.buildEmbed(
//       message.message[0],
//       message.message[1],
//       message.type,
//     );
//     if (!embed) {
//       return new Error(
//         `Failed to build daily message embed for guild ${message.guildId}`,
//       );
//     }
//     if (!channel) {
//       return new Error(
//         `No channel has been fetched to post a daily message to! ${message.guildId}`,
//       );
//     }
//     return this.sendWebhook(channel, embed, message);
//   }
//   /**
//    * @name getDailyMessageChannel
//    * @param guild
//    * @returns
//    * @author Nidrux
//    */
//   private async getDailyMessageChannel(
//     channelId: string,
//   ): Promise<Channel | null> {
//     return await this.client.channels.fetch(channelId);
//   }
//   /**
//    * @description Send the embed to the webhookhandler
//    * @param channel
//    * @param embed
//    * @param guild
//    * @returns Promise<void>
//    * @author Nidrux
//    */
//   private async sendWebhook(
//     // (TODO) Rework this to get webhook token and id from message
//     channel: Channel,
//     embed: EmbedBuilder,
//     message: IQueueMessage,
//   ): Promise<void> {
//     try {
//       await this.client.webhookHandler.handleWebhook(
//         channel,
//         {
//           embeds: [embed],
//           content: message.role ? `<@&${message.role}>` : null,
//         },
//         message,
//         message.thread,
//       );
//     } catch (error) {
//       new Error(error as string);
//     } finally {
//       return;
//     }
//   }
//   /**
//    *
//    * @param question
//    * @param id
//    * @param type
//    * @returns EmbedBuilder
//    * @author Nidrux
//    */
//   private buildEmbed(question: string, id: number, type: string): EmbedBuilder {
//     return new EmbedBuilder()
//       .setColor("#0598F6")
//       .setFooter({
//         text: `Daily Message | Type: ${type.replace(/^\w/, (c) =>
//           c.toUpperCase(),
//         )} | ID: ${id}`,
//       })
//       .setDescription(bold(question) as string);
//   }
// }
