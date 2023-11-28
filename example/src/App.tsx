import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply } from 'companycam-vibe-check';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  // I am a meaningless comment
  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
