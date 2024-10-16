import { PostsTestManager } from '../managers/PostsTestManager';
import { ProfileTestManager } from '../managers/ProfileTestManager';
import { UsersTestManager } from '../managers/UsersTestManager';

/**
 * @param users - quantity of users to create
 * @param profiles - quantity of profiles to create
 * @param posts - quantity of posts to create
 */
export interface PrepareTestOptions {
  users?: { quantity?: number };
  profiles?: { quantity?: number } | boolean;
  posts?: { quantity?: number } | boolean;
}
const defaultOptions = {
  users: { quantity: 3 },
  posts: { prepare: false, quantity: 3 },
  profiles: { prepare: false, quantity: 0 },
};

const resolveOption = (
  option: { quantity?: number } | boolean,
  defaultOption: { prepare: boolean; quantity: number },
) => {
  if (typeof option === 'boolean') {
    return { ...defaultOption, prepare: option };
  }
  return {
    prepare: option?.quantity !== undefined,
    quantity: option?.quantity ?? defaultOption.quantity,
  };
};

const resolveEntitiesOptions = (options: PrepareTestOptions) => ({
  users: { ...defaultOptions.users, ...options.users },
  profiles: resolveOption(options.profiles, defaultOptions.profiles),
  posts: resolveOption(options.posts, defaultOptions.posts),
});
const testManagerExists = (manager: any) => {
  if (!manager) throw new Error('No test managers provided');
  return manager;
};

export const initializeTestData = async (
  testManagers: () => {
    usersTestManager: UsersTestManager;
    profilesTestManager?: ProfileTestManager;
    postsTestManager?: PostsTestManager;
  },
  options: PrepareTestOptions = {},
) => {
  if (typeof testManagers !== 'function')
    throw new Error('No test managers provided');

  const { users, profiles, posts } = resolveEntitiesOptions(options);

  const usersQuantity = profiles.prepare ? profiles.quantity : users.quantity;

  await createUsers(testManagers().usersTestManager, usersQuantity);

  if (posts.prepare) {
    const manager = testManagerExists(testManagers().postsTestManager);
    await createPosts(manager, posts.quantity);
  } else if (profiles.prepare) {
    const manager = testManagerExists(testManagers().profilesTestManager);
    await createProfiles(manager);
  }
};

const createUsers = async (manager: UsersTestManager, userQuantity: number) => {
  const users = await manager.createUsers(userQuantity);
  expect.setState(users);
};
const createProfiles = async (manager: ProfileTestManager) => {
  const { users } = expect.getState();
  const profiles = await manager.createProfiles(users);
  expect.setState({ profiles });
};
const createPosts = async (manager: PostsTestManager, postQuantity: number) => {
  const { users } = expect.getState();
  const posts = await manager.createPosts(users, postQuantity);
  expect.setState({ posts });
};
