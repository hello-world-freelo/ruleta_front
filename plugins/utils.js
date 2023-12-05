class EmptyResponse extends Error {
  constructor (message = 'Response is null or undefined') {
    super(message)
    this.name = 'EmptyResponse'
  }
}

export {
  EmptyResponse
}
