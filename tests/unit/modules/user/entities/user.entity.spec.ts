import { UserEntity } from '@modules/user/entities/user.entity';
import { randomUUID } from 'crypto';

describe('UserEntity', () => {
  describe('CreateNew', () => {
    it('should create a new user entity with provided name and email', () => {
      // Arrange
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      // Act
      const user = UserEntity.CreateNew(data);

      // Assert
      expect(user.getName()).toBe(data.name);
      expect(user.getEmail()).toBe(data.email);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
      expect(user.getDeletedAt()).toBeNull();
    });

    it('should create a new user entity with default id and timestamps', () => {
      // Arrange
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      // Act
      const user = UserEntity.CreateNew(data);

      // Assert
      expect(user.getId()).toBeDefined();
      expect(user.getCreatedAt()).toBeInstanceOf(Date);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
      expect(user.getDeletedAt()).toBeNull();
    });
  });

  describe('CreateFrom', () => {
    it('should create a user entity from existing data', () => {
      // Arrange
      const existingUserData = {
        id: randomUUID(),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-02'),
        deletedAt: null,
      };

      // Act
      const user = UserEntity.CreateFrom(existingUserData);

      // Assert
      expect(user.getName()).toBe(existingUserData.name);
      expect(user.getEmail()).toBe(existingUserData.email);
      expect(user.getUpdatedAt()).toEqual(existingUserData.updatedAt);
      expect(user.getDeletedAt()).toBeNull();
      expect(user.getId()).toBe(existingUserData.id);
      expect(user.getCreatedAt()).toEqual(existingUserData.createdAt);
    });
  });

  describe('serialize', () => {
    it('should serialize user entity data correctly', () => {
      // Arrange
      const user = UserEntity.CreateNew({
        name: 'John Smith',
        email: 'john.smith@example.com',
      });

      // Act
      const serialized = user.serialize();

      // Assert
      expect(serialized).toHaveProperty('id');
      expect(serialized).toHaveProperty('name', 'John Smith');
      expect(serialized).toHaveProperty('email', 'john.smith@example.com');
      expect(serialized).toHaveProperty('createdAt');
      expect(serialized).toHaveProperty('updatedAt');
      expect(serialized).toHaveProperty('deletedAt', null);
    });
  });

  describe('updateName', () => {
    it('should update user name and updatedAt timestamp', () => {
      // Arrange
      const user = UserEntity.CreateNew({
        name: 'Initial Name',
        email: 'initial.email@example.com',
      });
      const initialUpdatedAt = user.getUpdatedAt();

      // Act
      user.updateName('Updated Name');

      // Assert
      expect(user.getName()).toBe('Updated Name');
      expect(user.getUpdatedAt()).not.toBe(initialUpdatedAt);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    });
  });
});
