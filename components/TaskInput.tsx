import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor 
} from 'react-native-reanimated';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const scale = useSharedValue(1);
  const focusProgress = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      ['#E5E7EB', '#3B82F6']
    ),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      ['#E5E7EB', '#3B82F6']
    ),
    shadowOpacity: focusProgress.value * 0.15,
  }));

  const handleAddTask = () => {
    if (title.trim()) {
      scale.value = withSpring(0.9, { duration: 100 }, () => {
        scale.value = withSpring(1);
      });
      
      onAddTask(title.trim());
      setTitle('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    focusProgress.value = withSpring(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusProgress.value = withSpring(0, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleAddTask}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="done"
        maxLength={100}
      />
      
      <AnimatedTouchableOpacity
        style={[styles.addButton, animatedButtonStyle]}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={20} strokeWidth={2} />
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});