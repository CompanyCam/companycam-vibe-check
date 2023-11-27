import { NativeModules, Platform } from 'react-native';

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

// export function multiply(a: number, b: number): Promise<number> {
//   return CompanycamVibeCheck.multiply(a, b);
// }

type FullVibeCheckType = {
  battery: BatteryVibeType;
  connectivity: ConnectionVibeType;
  cpuUsage: number;
  diskUsage: number;
  ramUsage: number;
  thermalState: string;
};

type BatteryVibeType = {
  battery: {
    batteryLevel: number;
    batteryState: string;
    lowPowerMode: boolean;
    isBatteryCharging: boolean;
  };
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

export const getCurrentVibes = (): FullVibeCheckType => {
  const battery = getBatteryVibe();
  const connectivity = getConnectionVibe();
  const cpuUsage = getCPUUsage();
  const diskUsage = getDiskUsage();
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

export const setVibeTimeout = (timeout: number) => {
  console.log(timeout);
};

export const getVibeTimeout = (): number => {
  return 120;
};

export const getBatteryVibe = (): BatteryVibeType => {
  console.log('getBatteryVibe');
  const batteryVibe = {
    battery: {
      batteryLevel: 0.5,
      batteryState: 'unplugged',
      lowPowerMode: false,
      isBatteryCharging: false,
    },
  };

  return batteryVibe;
};

export const getConnectionVibe = (): ConnectionVibeType => {
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

export const getDiskUsage = (): number => {
  return 20.0;
};

export const getRAMUsage = (): number => {
  return 20.0;
};

export const getThermalState = (): string => {
  return 'fair';
};
