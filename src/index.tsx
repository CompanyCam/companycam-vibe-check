import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NetInfo, {
  type NetInfoCellularGeneration,
  type NetInfoStateType,
} from '@react-native-community/netinfo';

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
  diskUsage: Awaited<number>;
  memoryInUse: Awaited<number>;
  thermalState: Awaited<string>;
};

export type BatteryVibeType = {
  batteryLevel: number | undefined;
  batteryState: BatteryState | undefined;
  lowPowerMode: boolean | undefined;
};

export type ConnectionVibeType = {
  connection: {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: NetInfoStateType;
  } & NetInfoStateType extends 'cellular'
    ? {
        details: {
          isConnectionExpensive: boolean;
          cellularGeneration: NetInfoCellularGeneration;
        };
      }
    : {};
};

export const multiply = (a: number, b: number): Promise<number> => {
  return CompanycamVibeCheck.multiply(a, b);
};

/**
 * Function to get device's current {@link https://github.com/CompanyCam/companycam-vibe-check/blob/main/README.md#getcurrentvibes | Vibes}.
 * @returns A FullVibeCheckType object that contains all current device vibes.
 */
export const getCurrentVibe = async (): Promise<FullVibeCheckType> => {
  const battery = await getBatteryInfo();
  const connectivity = await getConnectionInfo();
  const diskUsage = await getDiskUsage();
  const memoryInUse = await getMemoryInUse();
  const thermalState = await getThermalState();
  return {
    battery,
    connectivity,
    diskUsage,
    memoryInUse,
    thermalState,
  };
};

/**
 * Function to get device's current info without references to connectivity. This function is
 * intentionally undocumented and should not be used outside of CompanyCam.
 *
 * @returns A promise with a FullVibeCheckType object that does not include connectivity.
 */
export const getNonConnectivityInfo = async (): Promise<
  Omit<FullVibeCheckType, 'connectivity'>
> => {
  const battery = await getBatteryInfo();
  const diskUsage = await getDiskUsage();
  const memoryInUse = await getMemoryInUse();
  const thermalState = await getThermalState();

  return {
    battery,
    diskUsage,
    memoryInUse,
    thermalState,
  };
};

/**
 * Gets the current Battery info from the DeviceInfo library
 * @returns A BatteryVibeType object that contains all data related to Battery Info
 */
export const getBatteryInfo = async (): Promise<BatteryVibeType> => {
  // rather than make logs noisy, we silence them for this call
  const warn = console.warn;
  console.warn = () => {};

  const { batteryLevel, batteryState, lowPowerMode } =
    await DeviceInfo.getPowerState();

  // restore console.warn
  console.warn = warn;

  return {
    batteryLevel,
    batteryState,
    lowPowerMode,
  };
};

/**
 * Gets the current Connection info from the Reachability library
 * @returns A ConnectionVibeType object that contains all data related to Connection Info
 */
export const getConnectionInfo = async (): Promise<ConnectionVibeType> => {
  const connection = await NetInfo.fetch();
  const connectionVibe = {
    connection: {
      isConnected: connection.isConnected,
      isInternetReachable: connection.isInternetReachable,
      type: connection.type,
      ...(connection.type === 'cellular' && {
        details: {
          isConnectionExpensive: connection.details.isConnectionExpensive,
          cellularGeneration: connection.details.cellularGeneration,
        },
      }),
    },
  };

  return connectionVibe;
};

/**
 * Gets the total percentage of used disk space on the device from the DeviceInfo library.
 * @returns Current percentage of utilized disk space
 */
export const getDiskUsage = async () => {
  const freeDiskSpace = await DeviceInfo.getFreeDiskStorage();
  const totalDiskSpace = await DeviceInfo.getTotalDiskCapacity();
  const percentageOfDiskSpaceUsed = freeDiskSpace / totalDiskSpace;
  return percentageOfDiskSpaceUsed;
};

/**
 * Gets the total percentage of used RAM on the device.
 * @returns Current percentage of utilized RAM
 */
export const getMemoryInUse = async (): Promise<number> => {
  const memoryInUse = await CompanycamVibeCheck.getMemoryInfo();
  return memoryInUse;
};

/**
 * Gets the current ThermalState from the hardware
 * @returns Current ThermalState from the hardware.
 */
export const getThermalState = async (): Promise<string> => {
  const currentThermalState = await CompanycamVibeCheck.getThermalState();
  return currentThermalState;
};

export default {
  NetInfo,
  getBatteryInfo,
  getConnectionInfo,
  getCurrentVibe,
  getDiskUsage,
  getMemoryInUse,
  getNonConnectivityInfo,
  getThermalState,
};
