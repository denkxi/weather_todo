import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";

const App = () => {
  return (
    <SafeAreaView className="bg-primary-100 h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Text className="font-qbold text-4xl text-secondary-100">
            TaskCloud
          </Text>

          <Image
            source={images.onboarding}
            className="max-w-[400px] w-full h-[300px]"
            resizeMode="contain"
          />

          <Text className="font-qsemibold text-3xl text-center text-white">
            A ToDo application with weather integration
          </Text>

          <CustomButton
            title="Login"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#2b2d31" style="light" />
    </SafeAreaView>
  );
};

export default App;
