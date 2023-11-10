const express = require("express");
const promClient = require("prom-client");

const { client } = require("./wouldYou");

class prometheusClient {
  private registry;
  private counter;
  constructor() {
    this.registry = new promClient.Registry();
    this.counter = new promClient.Counter({
      name: "example_counter",
      help: "A simple example counter metric",
      registers: [this.registry],
    });

    const app = express();

    app.use(express.json());

    // Expose Prometheus metrics endpoint
    app.get("/metrics", async (req, res) => {
      res.set("Content-Type", this.registry.contentType());
      res.end(await this.registry.metrics());
    });
  }

  increment(counter: string) {
    switch (this.counter) {
      case "wouldYou":
        this.counter = wouldYou;
        break;
      case "neverHaveIEver":
        this.counter = neverHaveIEver;
        break;
      case "mostLikely":
        this.counter = mostLikely;
        break;
      case "truthOrDare":
        this.counter = truthOrDare;
        break;
      default:
        this.counter = wouldYou;
    }
    this.counter.inc();
  }

  getMetrics() {
    return this.registry.metrics();
  }
}

module.exports = prometheusClient;
