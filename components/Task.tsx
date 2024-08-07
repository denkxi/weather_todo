import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import dayjs from "dayjs";

import { icons } from "@/constants";
import { useUserContext } from "@/hooks/UserContext";

interface TaskProps {
  task: {
    id: number;
    name: string;
    isComplete: boolean;
    datetime: string;
  };
  markTask: (id: number) => void;
  removeTask: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, markTask, removeTask }) => {
  const { user } = useUserContext();

  if (!user) {
    console.log("User is null, returning early");
    return null;
  }

  const { id, name, isComplete, datetime } = task;

  return (
    <View className="bg-field mx-4 my-2 p-4 rounded-2xl flex-row justify-between items-center">
      {isComplete && user.role === "admin" ? (
        <TouchableOpacity onPress={() => markTask(id)}>
          <Image
            className="w-8 h-8"
            resizeMode="contain"
            source={icons.checked}
            tintColor="#b0c5a4"
          />
        </TouchableOpacity>
      ) : user.role === "admin" ? (
        <TouchableOpacity onPress={() => markTask(id)}>
          <Image
            className="w-8 h-8"
            resizeMode="contain"
            source={icons.unchecked}
            tintColor="#f0f1f3"
          />
        </TouchableOpacity>
      ) : (
        ""
      )}
      <View className="flex-1 mx-2 flex-col justify-center items-center">
        <Text className="text-main text-xl font-qmedium">{name}</Text>
        <Text className="text-main text-lg font-qregular">
          {dayjs(datetime).format("DD-MM-YYYY")}
        </Text>
      </View>
      {user.role === "admin" && (
        <TouchableOpacity onPress={() => removeTask(id)}>
          <Image
            className="w-6 h-6"
            resizeMode="contain"
            source={icons.trash}
            tintColor="#d37676"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Task;
