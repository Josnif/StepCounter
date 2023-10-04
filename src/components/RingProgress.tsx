import { View, Text } from 'react-native';
import SVG, { Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import Animated, {useSharedValue, useAnimatedProps, withTiming} from 'react-native-reanimated';
import { useEffect } from 'react';

type RingProgressProps = {
    radius?: number;
    strokeWidth?: number;
    progress?: number;
}

const color = "#EE0F55"; 

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const RingProgress = ({ radius = 100, strokeWidth = 30, progress=0.5}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 1500})
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]
  }))
  
  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <SVG style={{flex: 1}}>
        <Circle 
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        
        <AnimatedCircle
          animatedProps={animatedProps} 
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[circumference * progress, circumference]}

          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>
      <AntDesign 
        name='arrowright'
        color="black"
        size={strokeWidth * 0.8}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: strokeWidth * 0.1
        }}
      />
    </View>
  )
}

export default RingProgress;