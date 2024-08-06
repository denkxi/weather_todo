import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="task-details" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#2b2d31" style="light" />
    </>
  );
};

export default ScreensLayout;
