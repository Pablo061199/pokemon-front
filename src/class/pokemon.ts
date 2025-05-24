export default class Pokemon {
  name: string
  url: string

  constructor(name: string, url: string) {
    this.name = name
    this.url = url
  }

  getInfo(): string {
    return `Pokemon: ${this.name}, URL: ${this.url}`
  }
}
