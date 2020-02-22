export class OutOfStock extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OutOfStock';
  }
}
