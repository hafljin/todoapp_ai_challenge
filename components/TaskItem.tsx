import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const scale = useSharedValue(1);
  const checkboxScale = useSharedValue(task.isCompleted ? 1 : 0.8);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCheckboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
    backgroundColor: task.isCompleted ? '#3B82F6' : '#F3F4F6',
    borderColor: task.isCompleted ? '#3B82F6' : '#D1D5DB',
  }));

  const handleToggleComplete = () => {
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    
    checkboxScale.value = withSpring(task.isCompleted ? 0.8 : 1.1, { duration: 200 }, () => {
      checkboxScale.value = withSpring(task.isCompleted ? 0.8 : 1);
    });
    
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    scale.value = withSpring(0.8, { duration: 150 });
    onDelete(task.id);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[styles.container, animatedContainerStyle]}
    >
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={handleToggleComplete}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
          {task.isCompleted && (
            <Check color="#FFFFFF" size={16} strokeWidth={3} />
          )}
        </Animated.View>
        
        <Text style={[
          styles.title,
          task.isCompleted && styles.completedTitle
        ]}>
          {task.title}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.6}
      >
        <Trash2 color="#EF4444" size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  touchableArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});