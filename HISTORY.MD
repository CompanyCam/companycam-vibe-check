# CompanyCam VibeCheck

​
A ReactNative library that exposes simple primitive values about the device for logging and "react"ing.
​

## Installation

​
_Dan says things in office hours or perhaps in study hall_
​

## Supporting Libraries

​

## API

​
Here's things we think belong in the API.
​

### Battery

​
We're confident that this is exposed because it's available in the [React Native Device Info](https://github.com/react-native-device-info/react-native-device-info) library. This library exposes a lot of stuff we don't really need.
​
Below is the list of properties we will be consuming from this library (should we choose to move in this direction).
​
| Property | Type | Description |
| ----------------- | ------- | --------------------------------------------------------------------------- |
| `batteryLevel` | `float` | The battery level of the device. 0.0 - 1.0 |
| `batteryState` | `string` | The battery state of the device. `unknown`, `unplugged`, `charging`, `full` |
| `lowPowerMode` | `boolean` | Whether or not the device is in low power mode. |
| `isBatteryCharging` | `boolean` | Whether or not the device is charging. |
​

### Connectivity

​
The existing package [React Native NetInfo](https://github.com/react-native-netinfo/react-native-netinfo) seems to cover our needs.
​
We could wrap the package and then expose a similar API or hot potato the entire package. Potentially, we could just leave out the entire problem of connectivity and deal with 2 apis. This probably isn't a bad idea.
​
SMC: We could also just skip including this in the logging library, and just do logging from the main application, since we heavily use this library to listen to changes in connectivity anyways.
​

### Thermal State

Android and IOS expose thermal state in slightly different ways. We normalize them so that our ReactNative app gets a consistent API.
​
| thermalState | ios value | android value |
| ------------ | ---------- | ---------------------------------------------------- |
| `nominal` | `nominal` | `THERMAL_STATUS_NONE / THERMAL_STATUS_LIGHT` |
| `fair` | `fair` | `THERMAL_STATUS_MODERATE` |
| `serious` | `serious` | `THERMAL_STATUS_SEVERE` |
| `critical` | `critical` | `THERMAL_STATUS_CRITICAL / THERMAL_STATUS_EMERGENCY` |
​

#### iOS:

- We can ping the Operating System for the current thermal state by doing something like `ProcessInfo.processInfo.thermalState`
- We can listen to thermal state changes by implementing notification listeners, so we can react to the thermal state changes, if we need to.
  ​

#### Android:

- We can ping the Operating System for the current thermal state by doing something like `PowerManager.getCurrentThermalStatus()`.
- We can listen to thermal state changes by implementing event listeners, so we can react to thermal state changes, if we need to.
  ​

### CPU and RAM

​
Android and Apple don't seem to "want" us to track these values. But, we think we can! Perhaps... we shouldn't. Nonetheless, here's what is potentially possible.
​
On Android [CPU Info](https://github.com/kamgurgul/cpu-info/) seems to expose these similar values. You can see [here](https://github.com/kamgurgul/cpu-info/blob/master/app/src/main/java/com/kgurgul/cpuinfo/domain/observable/RamDataObservable.kt) that they're presenting the RAM value. There's a similar file for CPU. So potentially, we can return those values as a percentage of the total.
​
On iOS we can perhaps do something similar. Steven found [this answer](https://stackoverflow.com/questions/8223348/get-cpu-usage-from-application-on-ios/44134397#44134397) which seems promising.
​
I'm currently skeptical that this is "good". Tracking battery and reacting makes sense. If Android is trying to not let you track memory.
​
SMC: I think it'd be valuable to capture this information, however, I feel like we can iterate to this point, as accessing these values will take a decent amount of native work.
​

## DataDog / Logging Values

### Logging Context

We think of this as all the data we need to get insights

```json
{
    // appSessionTimeStart: 521695168416514, // <-- Store in redux on `onForeground` and `onAppOpened`
    appSessionDurationInSeconds: APP_SESSION_TIME_START - NOW, // derived
    // cameraSessionTimeStart: 654985136543521 || null, // how is we make it null on `onCamerSessionEnd` and we make it `DATETIME` onCameraSessionStart (need it don't need to log it)
    cameraSessionDurationInSeconds: null || CAMERA_SESSION_TIME_START - NOW,
    // I was told there would be no math
    batteryLevelChangePerMinute: 0.01754 || null, // do not chop any decimals
    batteryLevelChangePer10Minute: 0.1 || null, // do not chop any decimals
    thermalState: 'nominal' | 'fair' | 'serious' | 'critical',
    routerStack: ['Home', 'project', 'camera'], // <-- We think this would be kinda important wrt to whats happening in the background *not sure we can
    screenBehind: 'project' || null, // <-- We think this would be kinda important wrt to whats happening in the background *can

    connectionType: 'wifi' | 'cellular',
    cellularLevel: null || '5g', '4g', '3g',
    isBatteryCharging: true || false,
    isLowPowerMode: true || false,

    // potentially useful
    // batteryLevel: 0.5, // do not chop any decimals -- Needs to be in redux if we're going to react to it OR Maybe we have an event listenter or piggyback something else?
    // thermalStateAMinuteAgo: 'nominal' | 'fair' | 'serious' | 'critical',
    // thermalState10MinutesAgo: 'nominal' | 'fair' | 'serious' | 'critical',

    OS: 'ios' | 'android',
    CoCamBuid: "3.4.5",
    OSVersion: '14.4.2',
    deviceModel: 'iPhone 12 Pro Max' | 'Pixel 4a',
    deviceManufacturer: 'Apple' | 'Google' | 'Samsung',
    screensVisited: ['Home', 'Camera', 'Settings'],
}​
```

### Automatic Session

​
It would be useful to know the total session time. Meaning the time since the app was last backgrounded. We could then do something like
​

```json
{
    otherSessionStuff: {
        appSessionTimeStart: 521695168416514,
        cameraSessionTimeStart: 654985136543521 || null,
        appSessionTimeEnd: 521695168416514,
        cameraSessionTimeEnd: 654985136543521 || null,
        // Coupled Values that we need
        session: 123abc,
        batterLevel: 0.5,

        // Derived Values
        sessionTime: 50000,
        batteryLevelStart: 0.5, <-- event
        batteryLevelEnd: 0.4, <--- event
        batteryLevelChangeInLongTimeUnit: 0.1, (we can do this as a logging context value, say 10 min)
        batteryLevelChangeInShortTimeUnit: 0.01, (we can do this as a logging context value, say 1 min)
        OS: 'ios' | 'android',
        CoCamBuid: "3.4.5",
        OSVersion: '14.4.2',
        deviceModel: 'iPhone 12 Pro Max' | 'Pixel 4a',
        deviceManufacturer: 'Apple' | 'Google' | 'Samsung',
        screensVisited: ['Home', 'Camera', 'Settings'],
        routerStack: ['Home', 'project', 'camera'],
        thermalStateStart: 'nominal' | 'fair' | 'serious' | 'critical',
        thermalStateEnd: 'nominal' | 'fair' | 'serious' | 'critical',
    }
}
```

​

### Function Triggered Logging

​
It would be useful to be able to perform some logging when specific functions within the application are triggered.
​
For example: We take the session information from above, but log it when the camera session starts, and when the camera session ends. This would give us information about how the details of the session changed over time.
​

### Manufacturer

​
What I'd like is a general sense at a manufacturer level, some averages. This would let us know if battery is draining or the battery is generally hot by manufacturer.
​
SMC: I think this needs some more detailing.
​

```
{
    apple: {
        deviceModel: 'iPhone 12 Pro Max',
        batteryUseBySessionTime: .1,
        averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
        averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
    }
}
```

​

### Device

​
This is an at a glance view of devices, we could/should filter by manufacture
​
SMC: I think this needs some more detailing.
​

```
{
    pixel6: {
        manufacturer: 'Google',
        batteryUseBySessionTime: .1,
        averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
        averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
    }
    pixel7pro: { }
    samsungNote15: {}
    iphone14Pro: {}
}
```

​

### DeviceOS

​
This is an at a glance view of devices, we could/should filter by manufacture
​
SMC: I think this needs some more detailing. I'm not sure if this is the direction you want to go Devin, but this would give us way more detail, and grouped by os / version
​

```
{
    android: {
        17: [{
            CoCamBuid: "3.4.5",
            batteryUseBySessionTime: .1,
            averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
            averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
        }],
        13: [{
            CoCamBuid: "3.4.5",
            batteryUseBySessionTime: .1,
            averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
            averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
        }]
    },
    ios: {
        // either this
        17: [
            {
                osDetailVersion: "17.0.1",
                CoCamBuid: "3.4.5",
                batteryLevelChangeInLongTimeUnit: 0.1, (we can do this as a logging context value, say 10 min)
                batteryLevelChangeInShortTimeUnit: 0.01, (we can do this as a logging context value, say 1 min)
                averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
                averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
            },
            {
                osDetailVersion: "17.0.2",
                CoCamBuid: "3.4.5",
                batteryLevelChangeInLongTimeUnit: 0.1, (we can do this as a logging context value, say 10 min)
                batteryLevelChangeInShortTimeUnit: 0.01, (we can do this as a logging context value, say 1 min)
                averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
                averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
            },
            {
                osDetailVersion: "17.0.3",
                CoCamBuid: "3.4.5",
                batteryLevelChangeInLongTimeUnit: 0.1, (we can do this as a logging context value, say 10 min)
                batteryLevelChangeInShortTimeUnit: 0.01, (we can do this as a logging context value, say 1 min)
                averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
                averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
            }
        ]
        // or this
        1701: [{
            CoCamBuid: "3.4.5",
            batteryUseBySessionTime: .1,
            averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
            averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
        }],
        1702: [{
            CoCamBuid: "3.4.5",
            batteryUseBySessionTime: .1,
            averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
            averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
        }],
        1703: [{
            CoCamBuid: "3.4.5",
            batteryUseBySessionTime: .1,
            averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
            averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
        }]
    }
}
```

​
​

```
{
    pixel6: {
        OS: 'Android 17',
        manufacturer: 'Google',
        CoCamBuid: "3.4.5",
        batteryUseBySessionTime: .1,
        averageThermalStart: 'nominal' | 'fair' | 'serious' | 'critical',
        averageThermalEnd: 'nominal' | 'fair' | 'serious' | 'critical',
    }
    pixel7pro: { }
    samsungNote15: {}
    iphone14Pro: {}
}
```

​

### Possible Solutions in Pseudo Code

​
The I want what I want when I want it version
​

```ts
// creation
const useVibes = () => {
  const vibes = useContext(VibeContext);
  const vibesRef = React.useRef(null);
​
  React.useEffect(() => {
    if (vibesRef.current.thermalState !== vibes.thermalState) {
      // send to datadog
    }
    vibesRef.current = vibes;
  }, [vibes.thermalState]);
​
  // potential retun
  return {
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
    // possible
    // cpu: 0.5,
    // ram: 0.5,
  };
};
​
// somewhere
const VibesProvider = () => {
  return (
    <VibeContext.Provider value={{ vibes }}>{children}</VibeContext.Provider>
  );
};
​
// usage
const CoolComponent = ({ doImportantThing }) => {
    const vibes = useVibes();
​
    const handleClick = () =>{
        const currentVibe = vibes.getCurrentVibe();
​
        Logger.log(currentVibe)
        doImportantThing();
    }
​
    return (
        <div>
              <button onClick={handleClick}>
        </div>
    )
}
```

​
The always on listening version
​

```tsx
// usage
const CoolComponent = ({ doExpensiveTiringThing }) => {
​
    const handleClick = () =>{
        doExpensiveTiringThing();
    }
​
    return (
        <div>
              <button onClick={handleClick}>
        </div>
    )
}
​
const App = () => {
    return (
        <VibeProvider>
            <CoolComponent doExpensiveTiringThing={doExpensiveTiringThing} />
        </VibeProvider>
    )
}
​
const VibesProvider = () => {
    const [vibes, setVibes] = useState({
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
    });
​
    React.useEffect(() => {
        ReactNative.addEventListener('thermalStateDidChange', (event) => {
            setVibes({
                ...vibes,
                thermalState: event.thermalState,
            })
        })
​
        return () =>{
            ReactNative.removeEventListener('thermalStateDidChange')
        }
    }, [])
​
    useEffect(() => {
        if(vibes.thermalState !== vibes.thermalState) {
            // send to datadog
            Logger.log(vibes)
        }
    }, [vibes.thermalState])
​
    useEffect(() => {
        if(vibes.connectivity !== vibes.connectivity) {
            // send to datadog
            Logger.log(vibes)
        }
    }, [vibes.connectivity])
​
    return (
        <VibeContext.Provider value={{vibes, useVibes}}>
            {children}
        </VibeContext.Provider>
    )
}
```

​
** Note: **
Probably long term there's some combintation of these two ideas here. For now we need to figure out what's deliverable soon.

## The world as Devin envisions it

```tsx
const CoCam = () => {
  return (
    <VibeProvider>
      <OfflineProvider>
        <OtherProviders>
          <LoggingContext>
            <App />
          </LoggingContext>
        </OtherProviders>
      </OfflineProvider>
    </VibeProvider>
  );
};

const SomeComponentSomewhereInApp = ({ someAction }) => {
  const doTheThing = () => {
    Logger.log('did the thing', {data: "some data"}});
    someAction();
  };
  return <Button onPress={doTheThing} />;
};
```

DataDog gets

```json
{
    log: 'did the thing',
    data?: "some data",
    loggingContext: {
        company
        group
        adminLevel
        permsision
        "Session" <--- we don't have this but need this somehow
        hardwareInfo: {
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
            deviceType: iOS,
            deviceModel: iPhone 12 Pro Max,
        }
    }
}
```

```ts
const getDeviceVibes = async () => {
  const ThatPacakgeWeFound = NativeModules.ThatPacakgeWeFound;
  const VibeChecker = NativeModules.VibeChecker;
  const { packageData } = await ThatPacakgeWeFound.getVibes();
  const { vibes } = await VibeChecker.getVibes();

  return { ...vibes, ...packageData };
};
```
