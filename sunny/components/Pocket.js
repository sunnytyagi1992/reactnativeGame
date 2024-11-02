import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";

import Pile from "../components/Pile";
import { useDispatch } from "react-redux";
import {
  unFreezeDice,
  updatePlayerPieceValue,
} from "../redux/reducers/gameSlice";
import { startingPoints } from "../helpers/PlotData";

const Pocket = React.memo(({ color, player, data }) => {
  const dispatch = useDispatch();
  const handlePress = async (value) => {
    let playerNo = value?.id[0];
    switch (playerNo) {
      case "A":
        playerNo = "player1";
        break;
      case "B":
        playerNo = "player2";
        break;
      case "C":
        playerNo = "player3";
        break;
      case "D":
        playerNo = "player4";
        break;
    }
    dispatch(
      updatePlayerPieceValue({
        playerNo: playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      })
    );
    dispatch(unFreezeDice());
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={0}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          ></Plot>
          <Plot
            pieceNo={1}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          ></Plot>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <Plot
            pieceNo={2}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          ></Plot>
          <Plot
            pieceNo={3}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          ></Plot>
        </View>
      </View>
    </View>
  );
});

const Plot = ({ pieceNo, player, color, data, onPress }) => {
  return (
    <View style={[styles.plot, { backgroundColor: color }]}>
      {data && data[pieceNo]?.pos === 0 && (
        <Pile
          color={color}
          player={player}
          onPress={() => onPress(data[pieceNo])}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    alignItems: "center", // Add this line
    justifyContent: "center",
    width: "40%",
    height: "100%",
    borderRadius: 30,
  },
  childFrame: {
    backgroundColor: "white",

    width: "70%",
    height: "70%",
    borderColor: Colors.borderColor,
    borderWidth: 0.4,
    padding: 10,
    borderRadius: 30,
  },
  flexRow: {
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
    height: "40%",
    flexDirection: "row",
    overflow: "visible",
  },
  plot: {
    height: "90%",
    width: "40%",
    borderRadius: 120,
  },
});
export default Pocket;
