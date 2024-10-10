export const RmqAdapterMocked = {
  sendMessage: jest.fn().mockImplementation(() => true),
};
