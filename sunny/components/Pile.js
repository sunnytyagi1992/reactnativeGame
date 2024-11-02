import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BackgroundImage } from "../helpers/GetIcons";
import { Svg, Circle } from "react-native-svg";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import {
  selectcellSelection,
  selectDiceNo,
  selectPocketPileSelection,
} from "../redux/reducers/gameSelectors";

const Pile = ({ color, player, cell, onPress, pieceId }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
  const currentPlayerCellSelection = useSelector(selectcellSelection);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector((state) => state.game[`player${player}`]);
  const isPileEnabled = useMemo(
    () => player === currentPlayerPileSelection,
    [player, currentPlayerPileSelection],
  );

  const isCellEnabled = useMemo(
    () => player === currentPlayerCellSelection,
    [player, currentPlayerCellSelection]
  );

  console.log(isPileEnabled);

  const isForwordable = useCallback(() => {
    const piece = playerPieces?.find((item) => item.id === pieceId);
    return piece && piece.travelCount + diceNo <= 57;
  }, [playerPieces, pieceId, diceNo]);

  const pileImage = BackgroundImage.getImage(color);
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, [rotation]);
  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      }),
    [rotation]
  );
  console.log(pieceId, isPileEnabled, player, currentPlayerPileSelection);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          Styles.container,
          { flexDirection: "column", backgroundColor: "transparent" },
        ]}
      >
        <TouchableOpacity
          style={Styles.container}
          activeOpacity={0.5}
          disabled={!(cell ? isCellEnabled && isForwordable() : isPileEnabled)}
          onPress={onPress}
        >
          <View style={Styles.hollowCircle}>
            {cell
              ? isCellEnabled && isForwordable()
              : isPileEnabled && (
                  <View style={Styles.dashedCircleContainer}>
                    <Animated.View
                      style={[
                        Styles.dashedCircle,
                        {
                          transform: [{ rotate: rotateInterpolate }],
                          alignItems: "center",
                        },
                      ]}
                    >
                      <Svg height={"18"} width={"18"}>
                        <Circle
                          cx="9"
                          cy="9"
                          r="8"
                          stroke="white"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          strokeDashoffset="0"
                          fill="transparent"
                        ></Circle>
                      </Svg>
                    </Animated.View>
                  </View>
                )}
          </View>
          <Image
            source={pileImage}
            style={{ width: 32, height: 32, position: "static", top: -120 }}
          ></Image>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
    overflow: "visible",
  },
  hollowCircle: {
    width: 15,
    height: 15,
    position: "absolute",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignContent: "center",
  },
  dashedCircleContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
});

export default Pile;
