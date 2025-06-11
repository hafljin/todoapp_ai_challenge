import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import TaskInput from '@/components/TaskInput';
import TaskItem, { Task } from '@/components/TaskItem';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const STORAGE_KEY = '@SimpleTodo:tasks';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from storage on app start
  useEffect(() => {
    loadTasks();
  }, []);

  // Reload tasks when screen comes into focus (e.g., after clearing tasks in settings)
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasks();
    }
  }, [tasks, isLoading]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const completedTasksCount = tasks.filter(task => task.isCompleted).length;
  const totalTasksCount = tasks.length;

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggleComplete={toggleTaskComplete}
      onDelete={deleteTask}
    />
  );

  const renderEmptyState = () => (
    <Animated.View 
      entering={FadeIn.delay(300).duration(500)}
      style={styles.emptyState}
    >
      <CheckCircle color="#9CA3AF" size={64} strokeWidth={1} />
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first task above to get started
      </Text>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SimpleTodo</Text>
        {totalTasksCount > 0 && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.statsContainer}
          >
            <Text style={styles.stats}>
              {completedTasksCount} of {totalTasksCount} completed
            </Text>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%` 
                  }
                ]} 
              />
            </View>
          </Animated.View>
        )}
      </View>

      <TaskInput onAddTask={addTask} />

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          tasks.length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statsContainer: {
    marginTop: 8,
  },
  stats: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});