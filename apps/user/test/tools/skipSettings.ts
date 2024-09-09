export const aDescribe = (skip: boolean): jest.Describe =>
  skip ? describe.skip : describe;

const skip = true;
const run = false;

export const skipSettings = {
  run_all_tests: run,

  auth: run,
  profile: skip,

  for(testName: e2eTestNamesEnum): boolean {
    if (!this.run_all_tests) return false;
    return this[testName] ?? skip;
  },

  enableTest(testName: e2eTestNamesEnum): void {
    this[testName] = true;
  },

  disableTest(testName: e2eTestNamesEnum): void {
    this[testName] = false;
  },

  toggleRunAllTests(): void {
    this.run_all_tests = !this.run_all_tests;
  },
};

export enum e2eTestNamesEnum {
  AUTH = 'auth',
  Profile = 'profile',
}
