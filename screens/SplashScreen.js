import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useFonts } from "expo-font";

const phrases = ["purchase", "sell", "evolve", "amazonica\nproject"];

const SplashScreen = ({ onFinish }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  const [fontsLoaded] = useFonts({
    MomTypewriter: require("../assets/fonts/MomTypewriter.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    let timer;
    const currentPhrase = phrases[phraseIndex];

    if (!isErasing) {
      if (charIndex <= currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, charIndex));
          setCharIndex((prev) => prev + 1);
          if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 21); // Ускорено
      } else {
        timer = setTimeout(() => setIsErasing(true), 500);
      }
    } else {
      if (charIndex >= 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, charIndex));
          setCharIndex((prev) => prev - 1);
          if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 14); // Быстрее стирание
      } else {
        if (phraseIndex === phrases.length - 1) {
          setTimeout(onFinish, 300);
        } else {
          setIsErasing(false);
          setPhraseIndex((prev) => prev + 1);
          setCharIndex(0);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isErasing, phraseIndex, fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 32,
    fontFamily: "MomTypewriter",
    color: "#0a0a0a",
    textAlign: "center",
    lineHeight: 42,
  },
});

export default SplashScreen;
