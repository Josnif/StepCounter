import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { Value, RingProgress } from './src/components';
import useHealthData from './src/hooks/useHealthData';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons'

export default function App() {
  const goal = 10000;
  const [date , setDate] = useState(new Date());
  const {steps, flights, distance} = useHealthData(date);
  const [isDateGreater, setIsDateGreater] = useState(true);


  const changeDate = (numDays: any) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + numDays);
    setDate(currentDate);
  }

  const isGreaterThanToday = (date: Date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const currentDate = date.setHours(0, 0, 0, 0);    
    
    return currentDate >= today;
  }

  useEffect(() => {
    setIsDateGreater(isGreaterThanToday(date));    
  }, [date])


  // console.log(`Steps: ${steps} | Distance: ${distance}m | Flights: ${flights}`);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.datePicker}>
        <AntDesign 
          onPress={() => changeDate(-1)}
          name='left'
          size={20}
          color="#C3FF53"
        />
        <Text style={styles.date}>{date.toDateString()}</Text>
        <AntDesign 
          onPress={() => {
            if (!isDateGreater) {
              changeDate(1);
            }
          }}
          name='right'
          size={20}
          color={!isDateGreater ? "#C3FF53" : "gray"}
          disabled={isDateGreater}
        />
      </View>

      <RingProgress 
        radius={150}
        strokeWidth={50}
        progress={steps / goal} 
      />
      
      <View style={styles.values}>
        <Value label='Steps' value={steps.toString()} />
        <Value label='Distance' value={`${(distance / 1000).toFixed()} km`} />
        <Value label='Flights Climbed' value={flights.toString()} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    padding: 12
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent:'center',
  },
  date: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  }
});

