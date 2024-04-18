# @companycam/vibe-check

## Hardware logging library for CompanyCam

Welcome to the CompanyCam Vibe Check repo.

This library is largely for exposing hardware information not readily available. Maintaining a high level of performance in our apps is a large priority. Sometimes we can compensate for these issues, and sometimes we cannot. This library aims to expose hardware information commonly related to performance issues.

This library exposes the following information, through the `getCurrentVibes` method:

```js
{
  battery: {
    batteryLevel: 0.70202270953611340,
    batteryState: 'charging',
    lowPowerMode: false,
  },
  connectivity: {
    connection: {
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
      details: {
        isConnectionExpensive: false,
        cellularGeneration: '4g',
      },
    },
  },
  memoryInUse: 83193856,
  thermalState: 'nominal',
};
```

## Installation

```sh
yarn install @companycam/vibe-check
```

```sh
yarn add @companycam/vibe-check
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
import { getCurrentVibes, FullVibeCheck } from '@companycam/vibe-check';

// ...elsewhere in your code

const vibes: FullVibeCheck = yield call(getCurrentVibes);
```

## API

### Methods

### getCurrentVibes()

Gets the device's current hardware information. This method is the main entry point for this library. Returns all of the results from the other functions this library exposes.

```tsx
import { getCurrentVibes, FullVibeCheck } from '@companycam/vibe-check';

const vibes: FullVibeCheck = yield call(getCurrentVibes);
```

This method will return an object very similar to the below JSON object:

```js
{
  battery: {
    batteryLevel: 0.70202270953611340,
    batteryState: 'charging',
    lowPowerMode: false,
  },
  connectivity: {
    connection: {
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
      details: {
        isConnectionExpensive: false,
        cellularGeneration: '4g',
      },
    },
  },
  memoryInUse: 83193856,
  thermalState: 'nominal',
};
```

### getBatteryVibe()

Gets the device's current Battery information.

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

### getConnectionInfo()

Gets the device's current Network Connection information.

```tsx
import { getConnectionInfo } from '@companycam/vibe-check';

const { connection } = await getConnectionInfo();
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

### getRamUsage()

Gets the device's current RAM usage, as a percentage.

```tsx
import { getRamUsage } from '@companycam/vibe-check';

const { ramUsage } = await getRamUsage();
```

This method will return an object very similar to the below JSON object:

```js
ramUsage: 0.8; // <-- percentage
```

### getThermalState()

Gets the device's current thermal state.

```tsx
import { getThermalState } from '@companycam/vibe-check';

const { thermalState } = await getThermalState();
```

This method will return an object very similar to the below JSON object:

```js
thermalState: 'fair';
```

📝 NOTE: Since `iOS` and `Android` expose different thermal states, we've normalized them. Currently we use `iOS` nomenclature for the different thermal states. Please refer to the table below.

| thermalState | iOS Value  | Android Value                                        |
| ------------ | ---------- | ---------------------------------------------------- |
| `nominal`    | `nominal`  | `THERMAL_STATUS_NONE / THERMAL_STATUS_LIGHT`         |
| `fair`       | `fair`     | `THERMAL_STATUS_MODERATE`                            |
| `serious`    | `serious`  | `THERMAL_STATUS_SEVERE`                              |
| `critical`   | `critical` | `THERMAL_STATUS_CRITICAL / THERMAL_STATUS_EMERGENCY` |
| `unknown`    | `unknown`  | `unknown`                                            |

## Return object potential values

#### Battery

| Property       | Type     | Description                                        |
| -------------- | -------- | -------------------------------------------------- |
| `batteryLevel` | `number` | `The battery level on the device, from 0.0 to 1.0` |
| `batteryState` | `string` | `unknown`, `unplugged`, `charging`, `full`         |
| `lowPowerMode` | `bool`   | `Whether or not the device is in low power mode`   |

#### Connectivity

| Property              | Type     | Description                                                                    |
| --------------------- | -------- | ------------------------------------------------------------------------------ |
| `isConnected`         | `bool`   | `Whether or not the device is connected to the internet`                       |
| `isInternetReachable` | `bool`   | `Whether or not the device is connected to the internet`                       |
| `type`                | `string` | `none`, `unknown`, `cellular`, `wifi`, `bluetooth`, `ethernet`, `wimax`, `vpn` |
| `details`             | `object` | `See below`                                                                    |

##### Connectivity Details

| Property                | Type     | Description                                  |
| ----------------------- | -------- | -------------------------------------------- |
| `isConnectionExpensive` | `bool`   | `Whether or not the connection is expensive` |
| `cellularGeneration`    | `string` | `2g`, `3g`, `4g`, `5g`, `unknown`            |

#### Thermal State

| Property       | Type     | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `thermalState` | `string` | `nominal`, `fair`, `serious`, `critical` |

#### RAM Usage

| Property   | Type     | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `ramUsage` | `number` | `RAM Usage on the device from 0.0 to 1.0` |

## Contributing

This project uses conventional commits and semantic-release to automate the release process. Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format when making commits.

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
