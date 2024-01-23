import { Channel, EmbedBuilder, bold } from "discord.js";
import WouldYou from "./wouldYou";
import amqplib from "amqplib";
import { IQueueMessage, Result } from "../global";
import QueueError from "./Error/QueueError";
export default class DailyMessage {
  private client: WouldYou;
  constructor(client: WouldYou) {
    this.client = client;
  }
  /**
   * Start the daily message Schedule
   */
  async listen() {
    const QUEUE = process.env.QUEUE || "fallback";
    const URL = process.env.RABBITMQ_URL || "fallback";
    const connection = await amqplib.connect(URL);
    if (connection) {
      const channel = await connection.createChannel();
      if (channel) {
        channel.prefetch(1);
        await channel.assertQueue(QUEUE, { durable: false });
        channel.consume(QUEUE, async (message) => {
          if (message) {
            setTimeout(async () => {
              const result = await this.sendDaily(
                <IQueueMessage>JSON.parse(message.content.toString()),
              );
              try {
                if (!result.success) {
                  channel.reject(message, true);
                  throw new QueueError(`Could not acknowledge queue message`, {
                    error: result.error,
                    id: message.properties.messageId,
                    context: message.properties.deliveryMode,
                  });
                } else {
                  channel.ack(message);
                }
              } catch (error) {
                console.log(error);
              }
            }, 1000); // (NOTE) Update this to increase wait time
          }
        });
      }
    }
  }
  /**
   * @name sendDaily
   * @description handle the daily message and sent it to the webhookhandler.
   * @param message
   * @returns Promise<void>
   * @author Nidrux
   */
  private async sendDaily(message: IQueueMessage): Promise<Result<string>> {
    if (message.channelId == null) {
      return {
        success: false,
        error: new Error("No channel id provided by the queue message!"),
      };
    }
    let channel = await this.getDailyMessageChannel(message.channelId);
    let embed = this.buildEmbed(
      message.message[0],
      message.message[1],
      message.type,
    );
    if (!embed) {
      return {
        success: false,
        error: new Error(
          `Failed to build daily message embed for guild ${message.guildId}`,
        ),
      };
    }
    if (!channel.success) {
      return {
        success: false,
        error: new Error(
          `No channel has been fetched to post a daily message to! ${message.guildId}`,
        ),
      };
    }
    const result = await this.sendWebhook(channel.result, embed, message);
    if (result.success) {
      return { success: true, result: "I have send the webhook" };
    } else {
      return { success: false, error: result.error };
    }
  }
  /**
   * @name getDailyMessageChannel
   * @param guild
   * @returns
   * @author Nidrux
   */
  private async getDailyMessageChannel(
    channelId: string,
  ): Promise<Result<Channel>> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (channel) return { success: true, result: channel };
      else
        return { success: false, error: new Error("fetched channel is null") };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  /**
   * @description Send the embed to the webhookhandler
   * @param channel
   * @param embed
   * @param guild
   * @returns Promise<void>
   * @author Nidrux
   */
  private async sendWebhook(
    channel: Channel,
    embed: EmbedBuilder,
    message: IQueueMessage,
  ): Promise<Result<string>> {
    try {
      const result = await this.client.webhookHandler.handleWebhook(
        channel,
        {
          embeds: [embed],
          content: message.role ? `<@&${message.role}>` : null,
        },
        message,
        message.thread,
      );
      return result;
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }
  /**
   *
   * @param question
   * @param id
   * @param type
   * @returns EmbedBuilder
   * @author Nidrux
   */
  private buildEmbed(question: string, id: number, type: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Daily Message | Type: ${type.replace(/^\w/, (content) =>
          content.toUpperCase(),
        )} | ID: ${id}`,
      })
      .setDescription(bold(question) as string);
  }
}
