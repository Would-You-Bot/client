import express, { Request, Response } from 'express';
import type { WebSocketShard, Guild, Shard } from 'discord.js';
import type WouldYou from '../util/wouldYou';

interface ShardStats {
  id: number;
  status: string;
  ping: number;
  guilds: number;
  members: number;
}

export default class ExpressServer {
  private client: WouldYou;
  private port: number;
  private app: express.Application;

  constructor(client: WouldYou, port: number = 3000) {
    this.client = client;
    this.port = process.env.PORT ? parseInt(process.env.PORT) : port;
    this.app = express();
    this.initializeRoutes();
  }

  private async getRequestStats(): Promise<ShardStats[]> {
    const results = await this.client?.cluster.broadcastEval((client) => {
      const statsPerShard = client.ws.shards.map((shard: WebSocketShard) => {
        return {
          id: shard.id,
          status: shard.status,
          ping: Math.floor(shard.ping),
          guilds: client.guilds.cache.filter((g: Guild) => g.shardId === shard.id).size,
          members: client.guilds.cache
            .filter((g: Guild) => g.shardId === shard.id)
            .reduce((a: number, b: Guild) => a + b.memberCount, 0),
        };
      });
      return statsPerShard;
    });
    return results as unknown as ShardStats[];
  }

  private initializeRoutes(): void {
    this.app.get('/api/status', async (req: Request, res: Response) => {
      if(req.headers.authorization !== process.env.AUTH) return res.status(401).json({ error: 'Unauthorized' });
      try {
        const stats = await this.getRequestStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
      }
    });
  }

  public startServer(): void {
    this.app.listen(this.port);
  }
}
