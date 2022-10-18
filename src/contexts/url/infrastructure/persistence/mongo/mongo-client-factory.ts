import { MongoClient, ServerApiVersion } from 'mongodb';

interface MongoConfig {
  url: string;
}

export class MongoClientFactory {
  private static clients: Map<string, MongoClient> = new Map();

  static async createClient(
    contextName: string,
    config: MongoConfig
  ): Promise<MongoClient> {
    let client = MongoClientFactory.clients.get(contextName);

    if (!client) {
      client = new MongoClient(config.url, {
        ignoreUndefined: true,
        serverApi: ServerApiVersion.v1
      });
      await client.connect();
      MongoClientFactory.clients.set(contextName, client);
    }

    return client;
  }
}
