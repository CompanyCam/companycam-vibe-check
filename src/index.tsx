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
  ramUsage: Awaited<number>;
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

/**
 * Function to get device's current {@link https://github.com/CompanyCam/companycam-vibe-check/blob/main/README.md#getcurrentvibes | Vibes}.
 * @returns A FullVibeCheckType object that contains all current device vibes.
 */
export const getCurrentVibe = async (): Promise<FullVibeCheckType> => {
  const battery = await getBatteryInfo();
  const connectivity = getConnectionInfo();
  const cpuUsage = getCPUUsage();
  const diskUsage = await getDiskUsage();
  const ramUsage = await getRAMUsage();
  const thermalState = await getThermalState();
  console.log(thermalState);
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
export const getRAMUsage = async (): Promise<number> => {
  console.log('lol');
  const ramUsage = await CompanycamVibeCheck.getMemoryInfo();
  console.log(ramUsage);
  return ramUsage;
};

/**
 * Normalizes the Android thermal states to iOS values.
 * @param thermalState
 * @returns A normalised string for the device's current thermal state.
 */
const normalizeAndroidThermalState = (thermalState: number): string => {
  switch (thermalState) {
    case 0:
    case 1:
      return 'nominal';
    case 2:
      return 'fair';
    case 3:
      return 'serious';
    case 4:
    case 5:
    case 6:
      return 'critical';
    default:
      return 'nominal';
  }
};

/**
 * Gets the current ThermalState from the hardware
 * @returns Current ThermalState from the hardware.
 */
export const getThermalState = async (): Promise<string> => {
  const currentThermalState = await CompanycamVibeCheck.getThermalState();
  if (Platform.OS === 'android') {
    return normalizeAndroidThermalState(currentThermalState);
  } else {
    return currentThermalState;
  }
};
