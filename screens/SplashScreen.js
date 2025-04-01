import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";

const SplashScreen = ({ onFinish }) => {
  const text = "amazonica project";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  const [fontsLoaded] = useFonts({
    MomTypewriter: require("../assets/fonts/MomTypewriter.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    let timer;
    if (!isErasing) {
      if (index <= text.length) {
        timer = setTimeout(() => {
          setDisplayedText(text.substring(0, index));
          setIndex((prev) => prev + 1);
        }, 50);
      } else {
        timer = setTimeout(() => setIsErasing(true), 1000);
      }
    } else {
      if (index >= 0) {
        timer = setTimeout(() => {
          setDisplayedText(text.substring(0, index));
          setIndex((prev) => prev - 1);
        }, 40);
      } else {
        setTimeout(onFinish, 300);
      }
    }
    return () => clearTimeout(timer);
  }, [index, isErasing, fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {displayedText}
        <Text style={styles.cursor}>|</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    fontFamily: "MomTypewriter",
    color: "#0a0a0a",
  },
  cursor: {
    opacity: 0.7,
  },
});

export default SplashScreen;
