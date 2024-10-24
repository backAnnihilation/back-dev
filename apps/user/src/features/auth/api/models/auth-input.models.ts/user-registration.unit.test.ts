import { validate } from 'class-validator';
import { CreateUserDto } from './user-registration.model';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;
  const validRegistrationFormat = {
    userName: 'ValidUserName',
    password: 'ValidPassw0rd!',
    email: 'valid@example.com',
  };

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  it('should validate successfully with valid data', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = validRegistrationFormat.password;

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if userName is too short', async () => {
    createUserDto.userName = 'Usr';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userName');
  });

  it('should fail validation if userName is too long', async () => {
    createUserDto.userName = 'A'.repeat(31);
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userName');
  });

  it('should fail validation if password is too short', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'short';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation if password does not match required format', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'Invalidpassword';
    createUserDto.email = 'valid@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should validate successfully with a valid password', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'ValidPassw0rd!';
    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);
  });
  it('should fail validation if password is too long', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'A'.repeat(22);

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isLength');
  });

  it('should fail validation if password does not contain a digit', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'ValidPassword!';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail validation if password does not contain an uppercase letter', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'validpassw0rd!';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail validation if password does not contain a lowercase letter', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'VALIDPASSW0RD!';
    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });
  it('should fail validation if password does not contain a special character', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'ValidPassw0rd';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });
  it('should fail validation if password contains invalid characters', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'ValidPassw0rd!@#€';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('matches');
  });
  it('should fail validation with a password that contains exactly one of each required character, but too short', async () => {
    createUserDto.userName = validRegistrationFormat.userName;
    createUserDto.email = validRegistrationFormat.email;
    createUserDto.password = 'A1a!';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation if email is invalid', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'invalid-email';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation if email is too short', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'a@b';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation if email is too long', async () => {
    createUserDto.userName = 'ValidUserName';
    createUserDto.password = 'ValidPassw0rd!';
    createUserDto.email = 'a'.repeat(101) + '@example.com';

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });
});
