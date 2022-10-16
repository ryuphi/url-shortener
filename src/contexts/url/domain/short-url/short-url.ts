type ShortKey = string;

export class ShortUrl {
  constructor(
    public readonly key: ShortKey,
    public readonly originalUrl: string,
    public readonly enabled: boolean
  ) {}
}
