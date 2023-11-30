import { getDiskUsage } from '../index';

jest.mock('react-native-device-info', () => ({
  getFreeDiskStorage: jest.fn().mockResolvedValue(1000),
  getTotalDiskCapacity: jest.fn().mockResolvedValue(100),
}));

describe('#getDiskUsage', () => {
  it('returns the disk usage', async () => {
    const result = await getDiskUsage();

    expect(result).toBe(10);
  });
});
