export class EmailManagerMock {
  sendEmailConfirmationMessage = jest.fn();
  sendEmailRecoveryMessage = jest.fn();
  sendEmailMembershipSuccess = jest.fn();
}

export class EmailAdapterMock {
  sendEmail = jest.fn().mockResolvedValue({});
}
