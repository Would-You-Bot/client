import express from "express";
import { Registry, Gauge } from "prom-client"
import WouldYou from "./wouldYou";

export default class prometheusClient {
  private registry: Registry;
  private serverGauge: Gauge;
  private userGauge: Gauge;
  private client: WouldYou;
  
  constructor(client: WouldYou) { 
    this.client = client;
   }

  initialize() {
    this.registry = new Registry();
    this.serverGauge = new Gauge({
      name: "server_count",
      help: "The amount of servers the bot is in.",
      registers: [this.registry],
    });
    this.userGauge = new Gauge({
      name: "user_count",
      help: "The amount of users the bot has.",
      registers: [this.registry],
    });

    const app = express();

    app.use(express.json());

    // Expose Prometheus metrics endpoint
    app.get("/metrics", async (req, res) => {
      this.serverGauge.set(this.client.guilds.cache.size);
      this.userGauge.set(this.client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0));
      res.end(await this.registry.metrics());
    });

    app.listen(3029, () => {
      console.log("Prometheus metrics listening on port 3029");
    });
  }


  getMetrics() {
    return this.registry.metrics();
  }
}
