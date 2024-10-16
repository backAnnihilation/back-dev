export const RmqAdapterMocked = {
  sendMessage: jest.fn().mockImplementation(() => true),
  sendMessageAndWaitResponse: jest
    .fn()
    .mockImplementation(() => Promise.resolve(true)),
};

const response = {
  imageMetaId: '21312',
  urls: {
    urlOriginal: 'https://aws.originalUrl.com',
    urlSmall: 'https://aws.urlSmall.com',
    urlLarge: 'https://aws.urlLarge.com',
  },
};
export const TcpAdapterMocked = {
  sendMessage: jest.fn().mockImplementation(),
  sendMessageAndWaitResponse: jest.fn().mockImplementation(
    () =>
      new Promise((res, rej) => {
        res(response);
      }),
  ),
};

module.exports = {
  RmqAdapterMocked,
  TcpAdapterMocked,
};
