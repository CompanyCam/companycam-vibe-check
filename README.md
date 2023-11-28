# companycam-vibe-check

Hardware logging library for CompanyCam

## Installation

```sh
yarn install @companycam/companycam-vibe-check
```

## Usage

```ts
import VibeChecker from ' @companycam/companycam-vibe-check';

// ...elsewhere in your code
const { vibes } = await NativeModules.VibeChecker.getVibes();

console.log(vibes);
/*
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
*/
```

### API

#### getVibes()

Returns a promise that resolves to an object with the following properties:

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

## Contributing

This project uses conventional commits and semantic-release to automate the release process. Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format when making commits.

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
