import { LayerNoticeInterceptor } from '@app/shared';
import { Test } from '@nestjs/testing';
import { SubStatus } from '@prisma/client';
import { FollowCountOperation } from '../../../profile/api/models/input/follow-counts.model';
import { ProfilesRepository } from '../../../profile/infrastructure/profiles.repository';
import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs.repository';
import {
  SubscribeCommand,
  SubscribeUseCase,
} from './subscribe-to-user.use-case';

describe('SubscribeToUserUseCase', () => {
  let subscribeUseCase: SubscribeUseCase;
  let subsRepo: SubsRepository;
  let profilesRepo: ProfilesRepository;

  const mockSubsRepo = {
    findFollowerSubscription: jest.fn(),
    updateStatus: jest.fn(),
    create: jest.fn(),
  };

  const mockProfilesRepo = {
    updateFollowerAndFollowingCounts: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubscribeUseCase,
        { provide: SubsRepository, useValue: mockSubsRepo },
        { provide: ProfilesRepository, useValue: mockProfilesRepo },
      ],
    }).compile();

    subscribeUseCase = module.get<SubscribeUseCase>(SubscribeUseCase);
    subsRepo = module.get<SubsRepository>(SubsRepository);
    profilesRepo = module.get<ProfilesRepository>(ProfilesRepository);
  });

  it('should successfully subscribe a user', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '2',
    };
    const command = new SubscribeCommand(inputDto);

    mockSubsRepo.findFollowerSubscription.mockResolvedValue(null);
    mockSubsRepo.create.mockResolvedValue({ id: 'newSubscriptionId' });
    mockProfilesRepo.updateFollowerAndFollowingCounts.mockResolvedValue(
      undefined,
    );

    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.data).toEqual({ id: 'newSubscriptionId' });
    expect(subsRepo.findFollowerSubscription).toHaveBeenCalledWith(inputDto);
    expect(subsRepo.create).toHaveBeenCalledWith(inputDto);
    expect(profilesRepo.updateFollowerAndFollowingCounts).toHaveBeenCalledWith({
      followerId: inputDto.followerId,
      followingId: inputDto.followingId,
      operation: FollowCountOperation.INCREMENT,
    });
  });

  it('should not allow a user to subscribe to themselves', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '1',
    };
    const command = new SubscribeCommand(inputDto);
    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.extensions).toHaveLength(1);
    expect(result.extensions[0].message).toEqual(
      'You cannot subscribe to yourself',
    );
  });

  it('should reactivate an inactive subscription', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '2',
    };
    const command = new SubscribeCommand(inputDto);
    const existingSubscription = {
      id: 'existingSubscriptionId',
      status: SubStatus.inactive,
    };

    mockSubsRepo.findFollowerSubscription.mockResolvedValue(
      existingSubscription,
    );
    mockSubsRepo.updateStatus.mockResolvedValue(undefined);
    mockProfilesRepo.updateFollowerAndFollowingCounts.mockResolvedValue(
      undefined,
    );

    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.data).toEqual({ id: 'existingSubscriptionId' });
    expect(subsRepo.updateStatus).toHaveBeenCalledWith(
      existingSubscription.id,
      SubStatus.active,
    );
  });

  it('should handle already subscribed users', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '2',
    };
    const command = new SubscribeCommand(inputDto);
    const existingSubscription = {
      id: 'existingSubscriptionId',
      status: SubStatus.active,
    };

    mockSubsRepo.findFollowerSubscription.mockResolvedValue(
      existingSubscription,
    );

    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.extensions).toHaveLength(1);
    expect(result.extensions[0].message).toEqual('Already subscribed');
  });

  it('should handle errors correctly', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '2',
    };
    const command = new SubscribeCommand(inputDto);

    mockSubsRepo.findFollowerSubscription.mockRejectedValue(
      new Error('Database error'),
    );

    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.extensions).toHaveLength(1);
    expect(result.extensions[0].message).toEqual(
      'unexpected error during transaction',
    );
  });

  it('should rollback changes when an error occurs after creating a subscription', async () => {
    const inputDto: InputSubscriptionDto = {
      followerId: '1',
      followingId: '2',
    };
    const command = new SubscribeCommand(inputDto);

    mockSubsRepo.findFollowerSubscription.mockResolvedValue(null);
    mockSubsRepo.create.mockResolvedValue({ id: 'newSubscriptionId' });
    mockProfilesRepo.updateFollowerAndFollowingCounts.mockResolvedValue(
      undefined,
    );

    mockProfilesRepo.updateFollowerAndFollowingCounts.mockImplementationOnce(
      () => {
        throw new Error(
          'Simulated error during updating follower and following counts',
        );
      },
    );

    const result = await subscribeUseCase.onExecute(command);

    expect(result).toBeInstanceOf(LayerNoticeInterceptor);
    expect(result.data).toBeNull();

    expect(mockSubsRepo.create).toHaveBeenCalled();

    expect(
      mockProfilesRepo.updateFollowerAndFollowingCounts,
    ).toHaveBeenCalledWith({
      followerId: inputDto.followerId,
      followingId: inputDto.followingId,
      operation: FollowCountOperation.INCREMENT,
    });

    expect(mockSubsRepo.create).toHaveBeenCalledTimes(1);
  });
});
