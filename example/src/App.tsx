import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
// es-lint disable-next-line
// @ts-ignore
import { getCurrentVibe, type FullVibeCheckType } from '@companycam/vibe-check';
// "@react-native-community/netinfo": "^11.1.1",
// "react-native-device-info": "^10.12.0"
export default function App() {
  const [info, setInfo] = React.useState<FullVibeCheckType>();

  React.useEffect(() => {
    const lookAtVibe = async () => {
      const vibe = await getCurrentVibe();
      setInfo(vibe);
    };

    lookAtVibe();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Device Info: {JSON.stringify(info)} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
