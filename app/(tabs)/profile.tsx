import { SafeAreaView, Text, View } from "react-native";
import React from "react";

import { useUserContext } from "@/hooks/UserContext";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
  const { user, logOut } = useUserContext();

  if (!user) {
    console.log('User is null, returning early');
    return null;
  }

  return (
    <SafeAreaView className="bg-primary h-full items-center">
      <Text className="text-4xl text-main text-semibold mt-10 font-qsemibold text-center">
        Profile
      </Text>
      <View className="my-10">
        <Text className="text-main font-qmedium text-2xl">
          Username:{" "}
          <Text className="text-secondary-100 font-qsemibold">
            {user.username}
          </Text>
        </Text>
        <Text className="text-main font-qmedium text-2xl">
          Email:{" "}
          <Text className="text-secondary-100 font-qsemibold">
            {user.email}
          </Text>
        </Text>
        <Text className="text-main font-qmedium text-2xl">
          Role:{" "}
          <Text className="text-secondary-100 font-qsemibold">{user.role}</Text>
        </Text>
      </View>
      <CustomButton title="Log Out" handlePress={logOut} containerStyles="bg-[#d37676] w-[60%]" />
    </SafeAreaView>
  );
};

export default Profile;
