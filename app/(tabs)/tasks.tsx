import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

import { getTasks, deleteTask, checkTask } from "@/services/taskService";
import TaskCard from "@/components/TaskCard";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const filteredTasks = hideCompleted
    ? tasks.filter((item) => !item.isComplete)
    : tasks;

  // Load user preference from local storage
  useEffect(() => {
    const loadHideCompleted = async () => {
      try {
        const value = await AsyncStorage.getItem("hideCompleted");
        if (value !== null) {
          setHideCompleted(JSON.parse(value));
        }
      } catch (error) {
        console.error("Failed to load user preference", error);
      }
    };
    loadHideCompleted();
  }, []);

  // Save user preference to local storage
  useEffect(() => {
    const saveHideCompleted = async () => {
      try {
        await AsyncStorage.setItem(
          "hideCompleted",
          JSON.stringify(hideCompleted)
        );
      } catch (error) {
        console.error("Failed to save user preference", error);
      }
    };
    saveHideCompleted();
  }, [hideCompleted]);

  // Mark task as completed or vice versa
  const markTask = async (taskId: number) => {
    try {
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        const updatedTask = await checkTask(taskId, task);
        setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to mark task");
    }
  };

  // Show message on pressing delete button
  const pressDelete = (taskId: number) => {
    setSelectedTask(tasks.find((task) => task.id === taskId));
    setModalVisible(true);
  };

  // Delete task
  const removeTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id)
        .then(() => {
          setTasks(tasks.filter((task) => task.id !== selectedTask.id));
          setModalVisible(false);
          setSelectedTask(null);
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to delete task");
        });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <Text className="text-secondary-100 text-4xl font-qsemibold text-center">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="mt-8 flex-row justify-between mx-2 mb-4 pb-2 border-b-2 border-b-field">
        <Text className="text-secondary-100 text-4xl font-qsemibold ">
          To-Do
        </Text>
        <View className="flex-col">
          <Text className="text-main text-xl font-qsemibold ">
            Current Date:
          </Text>
          <Text className="text-main text-xl font-qsemibold ">
            {dayjs().format("DD-MM-YYYY")}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mx-2 mb-4">
        <Text className="text-secondary-100 text-xl font-qsemibold">
          Hide completed
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#a9f1df" }}
          thumbColor={"#f0f1f3"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setHideCompleted(!hideCompleted)}
          value={hideCompleted}
        />
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/task-details",
                params: {
                  task: JSON.stringify(item), // Parse object into string and pass as url param
                },
              })
            }
          >
            <TaskCard task={item} markTask={markTask} pressDelete={pressDelete} />
          </TouchableOpacity>
        )}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-4 rounded-lg shadow-lg">
            <Text className="text-lg font-qsemibold">
              Are you sure you want to delete this task?
            </Text>
            <View className="flex-row justify-around mt-4">
              <Button
                title="Yes"
                onPress={() => removeTask()}
              />
              <Button
                title="No"
                onPress={() => {
                  setModalVisible(false);
                  setSelectedTask(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Tasks;
