import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="space-y-2 mt-4">
      <Text className="text-xl text-main font-qmedium">{title}</Text>

      <View className="border-[1px] border-field w-full h-16 px-4 bg-field rounded-2xl focus:border-placeholder items-center flex-row">
        <TextInput
          className="flex-1 text-main font-qsemibold text-lg"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#6d6f78"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              className="w-8 h-8"
              resizeMode="contain"
              source={showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
