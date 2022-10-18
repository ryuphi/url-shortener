import { ShortUrl } from '../../../domain/short-url/short-url';
import { ShortUrlRepository } from '../../../domain/short-url/short-url-repository';
import { Collection, MongoClient } from 'mongodb';

interface ShortUrlDocument {
  _id: string;
  originalUrl: string;
  enabled: boolean;
}

export abstract class MongoRepository<T> {
  protected abstract collectionName(): string;

  constructor(protected client: Promise<MongoClient>) {}

  protected async collection(): Promise<Collection> {
    const db = (await this.client).db();
    return db.collection(this.collectionName());
  }

  protected async persist(id: string, entity: T): Promise<void> {
    const collection = await this.collection();

    const document = {
      ...entity,
      _id: id
    };

    await collection.updateOne(
      { _id: id },
      { $set: document },
      { upsert: true }
    );
  }
}

export class MongoShortUrlRepository
  extends MongoRepository<ShortUrl>
  implements ShortUrlRepository {
  async save(shortUrl: ShortUrl): Promise<void> {
    return this.persist(shortUrl.key, shortUrl);
  }

  protected collectionName(): string {
    return 'short_urls';
  }

  async findByKey(key: string): Promise<ShortUrl | null> {
    const collection = await this.collection();
    const shortUrlDocument = await collection.findOne<ShortUrlDocument>({
      _id: key
    });

    if (!shortUrlDocument) {
      return null;
    }

    return new ShortUrl(
      shortUrlDocument._id,
      shortUrlDocument.originalUrl,
      shortUrlDocument.enabled
    );
  }
}
