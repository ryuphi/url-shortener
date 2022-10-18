type ShortKey = string;

export class ShortUrl {
  constructor(
    public key: ShortKey,
    public originalUrl: string,
    public enabled: boolean
  ) {}

  changeOriginalUrl(originalUrl: string) {
    this.originalUrl = originalUrl;
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  static fromJSON(json: string) {
    const serialized = JSON.parse(json);
    return new ShortUrl(
      serialized.key,
      serialized.originalUrl,
      serialized.enabled
    );
  }
}
