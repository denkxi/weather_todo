import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  placeholder?: string;
  containerStyles?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  containerStyles,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = title === "Password";
  const isDescription = title === "Description";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={50}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="space-y-2 mt-4">
          <Text className="text-xl text-main font-qmedium">{title}</Text>
          <View
            className={`border-[1px] border-field w-full px-4 bg-field rounded-2xl focus:border-placeholder items-center flex-row ${containerStyles}`}
          >
            <TextInput
              className="flex-1 text-main font-qsemibold text-lg"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#6d6f78"
              onChangeText={handleChangeText}
              secureTextEntry={isPassword && !showPassword}
              multiline={isDescription}
              numberOfLines={isDescription ? 4 : 1}
              style={{ height: isDescription ? 100 : 50 }}
            />
            {isPassword && (
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormField;
