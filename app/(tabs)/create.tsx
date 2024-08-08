import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

import { useUserContext } from "@/hooks/UserContext";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { createTask } from "@/services/taskService";
import { Task } from "@/model/Task";


const Create = () => {
  const { user } = useUserContext();

  if (!user) {
    console.log("User is null, returning early");
    return null;
  }

  const [form, setform] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!form.name || !form.description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    } else if (form.name.length > 30) {
      Alert.alert("Error", "Task name should not be longer than 30 characters");
      return;
    } else if (form.description.length > 150) {
      Alert.alert("Error", "Task description should not be longer than 150 characters");
      return;
    }
  
    try {
      setIsSubmitting(true);
      const newTask: Task = {
        ...form,
        datetime: new Date().toISOString(),
        location: "Tallinn",
        isComplete: false,
      };
      await createTask(newTask);
      Alert.alert("Success", "Task created successfully", [
        { text: "OK", onPress: () => router.push('/tasks') },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-4xl text-main text-semibold mt-10 font-qsemibold text-center">
            Create Task
          </Text>

          <FormField
            title="Name"
            value={form.name}
            placeholder="Shopping"
            handleChangeText={(e: any) => setform({ ...form, name: e })}
          />
          <FormField
            title="Description"
            value={form.description}
            placeholder="Buy milk and eggs"
            handleChangeText={(e: any) => setform({ ...form, description: e })}
          />

          {user.role === "admin" ? (
            <CustomButton
              title="Create"
              handlePress={handleCreate}
              containerStyles="mt-6 bg-[#b0c5a4] min-w-[150px]"
              isLoading={isSubmitting}
            />
          ) : (
            <Text className="text-center text-[#d37676] font-qsemibold text-xl">
              Only users with admin role can create tasks!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
