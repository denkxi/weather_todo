import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { deleteTask, updateTask } from "@/services/taskService";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useUserContext } from "@/hooks/UserContext";
import { Task } from "@/model/Task";
import { Weather } from "@/model/Weather";
import { getWeather } from "@/services/weatherService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskDetails = () => {
  const { user } = useUserContext();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    console.log("User is null, returning early");
    return null;
  }

  const { task } = useLocalSearchParams();

  // Parse json back into object
  const taskString = Array.isArray(task) ? task[0] : task;
  const taskObj = JSON.parse(taskString);

  const [form, setForm] = useState({
    name: taskObj.name,
    description: taskObj.description,
    isComplete: taskObj.isComplete,
    datetime: taskObj.datetime,
    location: taskObj.location,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData: Weather = await getWeather(form.location);
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch weather data", error);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [form.location]);

  useEffect(() => {
    const loadUnitPreference = async () => {
      try {
        const value = await AsyncStorage.getItem("temperatureUnit");
        if (value) {
          setUnit(value as "metric" | "imperial");
        }
      } catch (error) {
        console.error("Failed to load temperature unit preference", error);
      }
    };

    loadUnitPreference();
  }, []);

  const handleUnitChange = async (newUnit: "metric" | "imperial") => {
    setUnit(newUnit);
    await AsyncStorage.setItem("temperatureUnit", newUnit);
  };

  const displayTemperature = (temp: number) => {
    return unit === "metric"
      ? `${Math.round(temp)}°C`
      : `${Math.round(temp * 1.8 + 32)}°F`;
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const updatedTask: Task = {
        ...form,
        id: taskObj.id,
      };
      await updateTask(taskObj.id, updatedTask);
      Alert.alert("Success", "Task updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteTask(taskObj.id);
      Alert.alert("Success", "Task deleted successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-row items-center ml-2 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6 mr-2"
              tintColor={"#f0f1f3"}
            />
            <Text className="text-main text-xl font-qsemibold">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-4xl text-white text-semibold mt-10 font-qsemibold text-center">
            Task Details
          </Text>
          <Text className="text-base text-main font-qmedium text-center">
            Tap fields to edit
          </Text>

          {loadingWeather ? (
            <Text className="text-center text-main font-qmedium text-xl">
              Loading weather...
            </Text>
          ) : weather ? (
            <View>
              <Text className="text-xl text-main font-qmedium text-center my-2">
                Weather for this task location:
              </Text>
              <View className="flex-row justify-center items-center my-2">
                <Text className="text-xl text-main font-qmedium mr-2">
                  {displayTemperature(weather.temperature)}
                </Text>
                <Image
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}.png`,
                  }}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-xl text-main font-qmedium ml-2">
                  {form.location}
                </Text>
              </View>
              <View className="flex-row justify-center items-center">
                <Text className="text-xl text-main font-qmedium mr-2">
                  Unit: °C
                </Text>
                <Switch
                  value={unit === "imperial"}
                  onValueChange={(value) =>
                    handleUnitChange(value ? "imperial" : "metric")
                  }
                />
                <Text className="text-xl text-main font-qmedium ml-2">
                  °F
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-center text-main font-qmedium text-xl">
              Failed to load weather data
            </Text>
          )}

          <FormField
            title="Name"
            value={form.name}
            placeholder="Shopping"
            handleChangeText={(e: any) => setForm({ ...form, name: e })}
          />
          <FormField
            title="Description"
            value={form.description}
            placeholder="Buy milk and eggs"
            handleChangeText={(e: any) => setForm({ ...form, description: e })}
          />

          <View className="flex-row justify-between items-center">
            <Text className="text-xl text-main font-qmedium">
              Completion status:
            </Text>
            {form.isComplete ? (
              <TouchableOpacity
                onPress={(e: any) => setForm({ ...form, isComplete: false })}
              >
                <Image
                  className="w-8 h-8"
                  resizeMode="contain"
                  source={icons.checked}
                  tintColor="#b0c5a4"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={(e: any) => setForm({ ...form, isComplete: true })}
              >
                <Image
                  className="w-8 h-8"
                  resizeMode="contain"
                  source={icons.unchecked}
                  tintColor="#f0f1f3"
                />
              </TouchableOpacity>
            )}
          </View>

          {user.role === "admin" ? (
            <View className="flex-row justify-evenly gap-2">
              <CustomButton
                title="Delete"
                handlePress={handleDelete}
                containerStyles="mt-6 bg-[#d37676] min-w-[150px]"
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Save"
                handlePress={handleSave}
                containerStyles="mt-6 bg-[#b0c5a4] min-w-[150px]"
                isLoading={isSubmitting}
              />
            </View>
          ) : (
            <Text className="text-center mt-6 text-[#d37676] font-qsemibold text-xl">
              Only users with admin role can edit tasks!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetails;
