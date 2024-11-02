import { Slot, Stack } from "expo-router";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


export default function RootLayout() {
  return (
  

    
    <Provider store={store}>
       {/* <PersistGate loading={null} persistor={persistor}> */}
    <Stack>
        
      {/* <Stack.Screen name="auth/login" options={{ title: "Login" , headerShown: false}} /> */}
      {/* <Stack.Screen name="(tabs)" options={{headerShown: false}}></Stack.Screen> */}

      <Stack.Screen name="index" options={{ title: "Login" , headerShown: false}} />
      <Stack.Screen name="Ludo/index" options={{ title: "LudoScreen" , headerShown: true}} />
      <Stack.Screen name="splash/index" options={{ title: "LudoScreen" , headerShown: true}} />

    </Stack>
    {/* </PersistGate> */}
    </Provider>

  );
}