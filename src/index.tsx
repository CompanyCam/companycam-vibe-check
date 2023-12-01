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
  cpuUsage: number;
  diskUsage: Awaited<number>;
  ramUsage: number;
  thermalState: Awaited<string>;
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
  const cpuUsage = getCPUUsage();
  const diskUsage = await getDiskUsage();
  const ramUsage = getRAMUsage();
  const thermalState = await getThermalState();
  return {
    battery,
    connectivity,
    cpuUsage,
    diskUsage,
    ramUsage,
    thermalState,
  };
};

/**
 * Gets the current Battery info from the DeviceInfo library
 * @returns A BatteryVibeType object that contains all data related to Battery Info
 */
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
  return batteryVibe;
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
 * Gets the percentage of the CPU currently being used.
 * @returns Current CPU usage percentage
 */
export const getCPUUsage = (): number => {
  return 20.0;
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
export const getRAMUsage = (): number => {
  return 20.0;
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
  getCurrentVibe,
  getBatteryInfo,
  getConnectionInfo,
  getCPUUsage,
  getDiskUsage,
  getRAMUsage,
  getThermalState,
};
