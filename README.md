# companycam-vibe-check

## Hardware logging library for CompanyCam

Welcome to the CompanyCam Vibe Check repo. This library is largely for exposing hardware information in some key areas that an app may be known to slow down in. As we all know, the largest issues app developers are faced with stem from performance issues. Sometimes we can mitigate for these issues, and sometimes we cannot. This library aims to expose pertinent information related to areas in the hardware that can cause performance issues.

As of right now, this library exposes the following information, through the `getCurrentVibes` method:

```js
{
  battery: {
    batteryLevel: 0.5,
    batteryState: 'unplugged',
    lowPowerMode: false,
    isBatteryCharging: false,
  },
  connectivity: {
    isConnected: true,
    isInternetReachable: true,
    type: 'cellular',
    details: {
      isConnectionExpensive: false,
      cellularGeneration: '4g',
    },
  },
  thermalState: 'fair',
  cpuUsage: 20, // <-- percentage
  ramUsage: 20, // <-- percentage
  diskUsage: 80 // <-- percentage
}
```

## Installation

```sh
yarn install @companycam/companycam-vibe-check
```

```sh
yarn add companycam-vibe-check
```

## System Requirements

### iOS
```
iOS Version: 15.0
```

### Android

```
minSdkVersion: 24 
```

## Usage

```js
import { getCurrentVibes } from 'companycam-vibe-check';

// ...elsewhere in your code
const { vibes } = await NativeModules.VibeChecker.getCurrentVibes();

```

## API

### Methods
### getCurrentVibes()

Gets the device's current hardware information. This function / method is the main entry point for this library. You SHOULDN'T need to use the other exposed functions. We have provided the more detail focused methods just to be thorough. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx

import { VibeChecker } from '@companycam/companycam-vibe-check';

const { currentVibe } = await NativeModules.VibeChecker.getCurrentVibes();

```

This method will return an object very similar to the below JSON object:

```js
{
  battery: {
    batteryLevel: 0.5,
    batteryState: 'unplugged',
    lowPowerMode: false,
    isBatteryCharging: false,
  },
  connectivity: {
    isConnected: true,
    isInternetReachable: true,
    type: 'cellular',
    details: {
      isConnectionExpensive: false,
      cellularGeneration: '4g',
    },
  },
  thermalState: 'fair',
  cpuUsage: 20, // <-- percentage
  ramUsage: 20, // <-- percentage
  diskUsage: 80 // <-- percentage
}
```

### setVibeTimeout() / getVibeTimeout()

This method allows you to customize how long the library caches the hardware information. Currently the default for the timeout is X seconds. Setting this value to 0 will query the hardware, in real time, instead of relying on the cached values.

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

await NativeModules.VibeChecker.setVibeTimeout(120);

const { vibeTimeout } = NativeModules.VibeChecker.getVibeTimeout();

```

The parameter for `setVibeTimeout()` is a `number` in `seconds`. The return value for `getVibeTimeout()` is a `number` in `seconds`.

📝 NOTE: In the future we may allow configuration on the time measurements (seconds vs. minutes, etc.)

### getBatteryVibe()

Gets the device's current Battery information. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { battery } = await NativeModules.VibeChecker.getBatteryVibe();

```

This method will return an object very similar to the below JSON object:

```js
  battery: {
    batteryLevel: 0.5,
    batteryState: 'unplugged',
    lowPowerMode: false,
    isBatteryCharging: false,
  }
```


### getConnectionVibe()

Gets the device's current Network Connection information. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { connection } = await NativeModules.VibeChecker.getConnectionVibe();

```

This method will return an object very similar to the below JSON object:

```js
  connection: {
    isConnected: true,
    isInternetReachable: true,
    type: 'cellular',
    details: {
      isConnectionExpensive: false,
      cellularGeneration: '4g',
    },
  }
```


### getDiskUsage()

Gets the device's current Disk usage, as a percentage. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { diskUsage } = await NativeModules.VibeChecker.getDiskUsage();

```

This method will return an object very similar to the below JSON object:

```js
  diskUsage: 80 // <-- percentage
```

### getRamUsage()

Gets the device's current RAM usage, as a percentage. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { ramUsage } = await NativeModules.VibeChecker.getRamUsage();

```

This method will return an object very similar to the below JSON object:

```js
  ramUsage: 80 // <-- percentage
```

### getCPUUsage()

Gets the device's current CPU usage, as a percentage. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { cpuUsage } = await NativeModules.VibeChecker.getCPUUsage();

```

This method will return an object very similar to the below JSON object:

```js
  cpuUsage: 80 // <-- percentage
```

### getThermalState()

Gets the device's current CPU usage, as a percentage. This information will be cached, and refreshed on a timer. (We haven't set this timer yet).

```tsx
import { VibeChecker } from '@companycam/companycam-vibe-check';

const { thermalState } = await NativeModules.VibeChecker.getThermalState();

```

This method will return an object very similar to the below JSON object:

```js
  thermalState: 'fair'
```

📝 NOTE: Since `iOS` and `Android` expose different thermal states, we've normalized them. Currently we use `iOS` nomenclature for the different thermal states. Please refer to the table below.

| thermalState | iOS Value  | Android Value                 |
| ------------ | ---------- | ---------------------------------------------------- |
| `nominal`    | `nominal`  | `THERMAL_STATUS_NONE / THERMAL_STATUS_LIGHT` |
| `fair`       | `fair`     | `THERMAL_STATUS_MODERATE` |
| `serious`    | `serious`  | `THERMAL_STATUS_SEVERE` |
| `critical`   | `critical` | `THERMAL_STATUS_CRITICAL / THERMAL_STATUS_EMERGENCY` |


## Return object potential values

#### Battery

| Property     | Type   | Description                                      |
| ------------ | ------ | ------------------------------------------------ |
| batteryLevel | number | The battery level on the device, from 0.0 to 1.0 |
| batteryState | string | 'unknown', 'unplugged, 'charging'                |
| lowPowerMode | bool   | Whether or not the device is in low power mode   |
| isCharging   | bool   | Whether or not the device is charging            |

#### Connectivity

| Property            | Type   | Description                                                                    |
| ------------------- | ------ | ------------------------------------------------------------------------------ |
| isConnected         | bool   | Whether or not the device is connected to the internet                         |
| isInternetReachable | bool   | Whether or not the device is connected to the internet                         |
| type                | string | 'none', 'unknown', 'cellular', 'wifi', 'bluetooth', 'ethernet', 'wimax', 'vpn' |
| details             | object | See below                                                                      |

##### Connectivity Details

| Property              | Type   | Description                                |
| --------------------- | ------ | ------------------------------------------ |
| isConnectionExpensive | bool   | Whether or not the connection is expensive |
| cellularGeneration    | string | '2g', '3g', '4g', '5g', 'unknown'          |

#### Thermal State

| Property     | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| thermalState | string | 'nominal', 'fair', 'serious', 'critical' |

#### CPU Usage

| Property     | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| cpuUsage | number | CPU Usage on the device from 0.0 to 1.0 |

#### RAM Usage

| Property     | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| ramUsage | number | RAM Usage on the device from 0.0 to 1.0 |

## Contributing

This project uses conventional commits and semantic-release to automate the release process. Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format when making commits.

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
