import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import AppText from './AppText';

export default function AnimatedHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const y = useRef(new Animated.Value(8)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(y, { toValue: 0, duration: 420, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [o, y]);

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
      <Animated.View style={{ transform: [{ translateY: y }], opacity: o }}>
        <AppText style={{ fontSize: 24, fontWeight: '900' }}>{title}</AppText>
        {subtitle ? <AppText style={{ marginTop: 4, opacity: 0.3 }}>{subtitle}</AppText> : null}
      </Animated.View>
    </View>
  );
}