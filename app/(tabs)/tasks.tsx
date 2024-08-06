import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Switch,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

import Task from "@/components/Task";
import tasks from "../../constants/tasks";

const Tasks = () => {
  const [hideCompleted, setHideCompleted] = useState(true);
  const [taskList, setTaskList] = useState([...tasks]);

  const filteredTasks = hideCompleted
    ? taskList.filter((item) => !item.isComplete)
    : taskList;

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

  // Delete task
  const removeTask = (taskId: number) => {
    setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Mark task as completed or vice versa
  const markTask = (taskId: number) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

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
            <Task task={item} markTask={markTask} removeTask={removeTask} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Tasks;
