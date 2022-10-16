export class ShortUrl {
  constructor(
    public readonly key: string,
    public readonly originalUrl: string,
    public readonly enabled: boolean
  ) {}
}
