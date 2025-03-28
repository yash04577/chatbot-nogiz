import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function TabLayout() {
  return (
    <GestureHandlerRootView>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
