import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUserContext } from "@/hooks/UserContext";
import { BACKEND_URL } from '@/config.js';
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useUserContext();

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, form);
      const { token } = response.data;

      await AsyncStorage.setItem("token", token);
      refreshUser();
      
      Alert.alert("Success", "Logged in successfully");

      router.push("/tasks");
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-4xl text-white text-semibold mt-10 font-qsemibold text-center">
            Sign In
          </Text>

          <FormField
            title="Email"
            value={form.email}
            placeholder="john.doe@mail.com"
            handleChangeText={(e: any) => setform({ ...form, email: e })}
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="**********"
            handleChangeText={(e: any) => setform({ ...form, password: e })}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-6"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-main font-qregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-xl font-qsemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
