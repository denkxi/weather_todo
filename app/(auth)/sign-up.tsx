import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link } from "expo-router";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const SignUp = () => {
  const [form, setform] = useState({
    username: '',
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {};

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-4xl text-white text-semibold mt-10 font-qsemibold text-center">
            Log In
          </Text>

          <FormField
            title="Username"
            value={form.username}
            placeholder="JohnDoe"
            handleChangeText={(e: any) => setform({ ...form, username: e })}
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-6"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-main font-qregular">Have an account?</Text>
            <Link href="/sign-in" className="text-xl font-qsemibold text-secondary">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
