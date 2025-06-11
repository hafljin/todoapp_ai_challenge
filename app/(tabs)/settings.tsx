import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2, Info, Heart } from 'lucide-react-native';

const STORAGE_KEY = '@SimpleTodo:tasks';

export default function SettingsScreen() {
  const handleClearAllTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              Alert.alert('Success', 'All tasks have been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear tasks. Please try again.');
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About SimpleTodo',
      'A minimalist task management app built with React Native and Expo. All your tasks are stored locally on your device.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearAllTasks}
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <Trash2 color="#EF4444" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear All Tasks</Text>
              <Text style={styles.settingSubtitle}>
                Delete all tasks permanently
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={showAbout}
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <Info color="#3B82F6" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>About SimpleTodo</Text>
              <Text style={styles.settingSubtitle}>
                Version 1.0.0
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Heart color="#EF4444" size={16} />
            <Text style={styles.footerText}>
              Made with love for productivity
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
});