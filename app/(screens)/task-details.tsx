import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useUserContext } from "@/hooks/UserContext";

const TaskDetails = () => {
  const { user } = useUserContext();

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    console.log("Save task", taskObj.id);
  };

  const handleDelete = () => {
    console.log("Delete task", taskObj.id);
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
