export const aDescribe = (skip: boolean): jest.Describe =>
  skip ? describe.skip : describe;

const skip = true;
const run = false;

export const skipSettings = {
  run_all_tests: skip,

  auth: skip,
  profile: run,
  post: skip,

  for(testName: e2eTestNamesEnum): boolean {
    if (!this.run_all_tests) return run;
    return this[testName] ?? skip;
  },

  enableTest(testName: e2eTestNamesEnum): void {
    this[testName] = run;
  },

  disableTest(testName: e2eTestNamesEnum): void {
    this[testName] = skip;
  },

  toggleRunAllTests(): void {
    this.run_all_tests = !this.run_all_tests;
  },
};

export enum e2eTestNamesEnum {
  AUTH = 'auth',
  Profile = 'profile',
}
