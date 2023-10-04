import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Value, RingProgress } from './src/components';
import useHealthData from './src/hooks/useHealthData';

export default function App() {
  const {steps, flights, distance} = useHealthData();
  const goal = 10000;
  console.log(`Steps: ${steps} | Distance: ${distance}m | Flights: ${flights}`);

  return (
    <View style={styles.container}>
      <RingProgress progress={steps / goal} />
      
      <View style={styles.values}>
        <Value label='Steps' value={steps.toString()} />
        <Value label='Distance' value={`${(distance / 1000).toFixed()} km`} />
        <Value label='Flights Climbed' value={flights.toString()} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
  }
});

