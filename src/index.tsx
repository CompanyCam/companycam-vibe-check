import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type { BatteryState } from 'react-native-device-info/lib/typescript/internal/types';

const LINKING_ERROR =
  `The package 'companycam-vibe-check' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CompanycamVibeCheck = NativeModules.CompanycamVibeCheck
  ? NativeModules.CompanycamVibeCheck
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export type FullVibeCheckType = {
  battery: Awaited<BatteryVibeType>;
  connectivity: ConnectionVibeType;
  cpuUsage: number;
  diskUsage: Awaited<number>;
  ramUsage: number;
  thermalState: string;
};

type BatteryVibeType = {
  batteryLevel: number | undefined;
  batteryState: BatteryState | undefined;
  lowPowerMode: boolean | undefined;
  isBatteryCharging: boolean;
};

type ConnectionVibeType = {
  connection: {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: string;
    details: {
      isConnectionExpensive: boolean;
      cellularGeneration: string;
    };
  };
};

export const multiply = (a: number, b: number): Promise<number> => {
  return CompanycamVibeCheck.multiply(a, b);
};

export const getCurrentVibe = async (): Promise<FullVibeCheckType> => {
  const battery = await getBatteryInfo();
  const connectivity = getConnectionInfo();
  const cpuUsage = getCPUUsage();
  const diskUsage = await getDiskUsage();
  const ramUsage = getRAMUsage();
  const thermalState = getThermalState();

  return {
    battery,
    connectivity,
    cpuUsage,
    diskUsage,
    ramUsage,
    thermalState,
  };
};

///
// TODO: Add in threshold for battery level notifications
// EX: If the battery level is < X%, we should notify the user
///
export const getBatteryInfo = async (): Promise<BatteryVibeType> => {
  const isBatteryCharging = await DeviceInfo.isBatteryCharging();
  const { batteryLevel, batteryState, lowPowerMode } =
    await DeviceInfo.getPowerState();
  const batteryVibe = {
    batteryLevel,
    batteryState,
    lowPowerMode,
    isBatteryCharging,
  };
  console.log(batteryVibe);
  return batteryVibe;
};

export const getConnectionInfo = (): ConnectionVibeType => {
  console.log('getConnectionVibe');
  const connectionVibe = {
    connection: {
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
      details: {
        isConnectionExpensive: false,
        cellularGeneration: '4g',
      },
    },
  };

  return connectionVibe;
};

export const getCPUUsage = (): number => {
  return 20.0;
};

export const getDiskUsage = async () => {
  const freeDiskSpace = await DeviceInfo.getFreeDiskStorage();
  const totalDiskSpace = await DeviceInfo.getTotalDiskCapacity();
  const percentageOfDiskSpaceUsed = freeDiskSpace / totalDiskSpace;
  return percentageOfDiskSpaceUsed;
};

export const getRAMUsage = (): number => {
  return 20.0;
};

export const getThermalState = (): string => {
  return 'fair';
};
