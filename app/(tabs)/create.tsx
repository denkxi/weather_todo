import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const Create = () => {
  const [form, setform] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {};

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

          <CustomButton
            title="Create"
            handlePress={handleCreate}
            containerStyles="mt-6 bg-[#b0c5a4] min-w-[150px]"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
