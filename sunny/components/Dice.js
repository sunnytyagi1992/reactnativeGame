import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BackgroundImage } from "../helpers/GetIcons";
import { TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import DiceRoll from "../assets/animation/diceroll.json";
import Arrow from '../assets/images/arrow.png';
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
} from "../redux/reducers/gameSelectors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {updateDiceNo, enablePileSelection, enableCellSelection, enableTouch,unFreezeDice,undateFireworks,announceWinner,updatePlayerChance} from '../redux/reducers/gameSlice'
import { playSound } from "../helpers/SoundUtility";


const Dice = React.memo(({ color, rotate, data ,player}) => {
  const dispatch = useDispatch();
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo)
  const playerPieces = useSelector(state => state.game[`player${currentPlayerChance}`]);
  const pileIcon = BackgroundImage.getImage(color);
  const diceIcon = BackgroundImage.getImage(diceNo);
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const [diceRolling, setDiceRolling] = useState(false);
  console.log(currentPlayerChance)
  console.log(playerPieces)

  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(arrowAnim, {
            toValue: -10,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateArrow();
  }, []);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleDicePress = async() => {
    // const newDiceNo  = Math.floor(Math.random()*5)+1;
    const newDiceNo  = Math.floor(Math.random()*5)+1;
    

    playSound('dice_roll')
    setDiceRolling(true);
    await delay(1000)
    dispatch(updateDiceNo({diceNo: newDiceNo}))
    setDiceRolling(false)

    const isAnyPieceAlive = data?.findIndex(i=>i.pos !=0 && i.pos !=57)
    const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

    if(isAnyPieceAlive == -1){
      if(newDiceNo == 6){
        dispatch(enablePileSelection({playerNo: player}))

    }else{
      let chancePlayer = player+1;
      if(chancePlayer>4){
        chancePlayer = 1;
        }
        await delay (500);
        dispatch(updatePlayerChance({chancePlayer: chancePlayer}));
      }
   }
    
   else{
    const canMove = playerPieces.some(pile => pile.trevelCount + newDiceNo <= 57 && pile.pos !=0);
    
    if(
      (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1)
      || (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1)
      || (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
    )
      {
      let chancePlayer = player +1 ;
      if(chancePlayer > 4){
        chancePlayer = 1;
      }
    
    
    await delay(500)
    dispatch(updatePlayerChance({chancePlayer: chancePlayer}));
    return;
  }
    if(newDiceNo == 6){
      enablePileSelection({chancePlayer: player})
       }
    dispatch(enableCellSelection({playerNo: player}))
   
  }
 
 
  };
  


  return (

    
    <View
      style={[styles.flexRow, { transform: [{ scaleX: rotate ? -1 : 1 }] }]}
    >
      <View style={[styles.border1]}>
        <LinearGradient
          style={styles.LinearGradient}
          colors={["#0052be", "#5f9fcb", "#97c6c9"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.pileContainer}>
            <TouchableOpacity>
              <Image source={pileIcon} style={styles.pileIcon} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <View style={[styles.border2]}>
        <LinearGradient
          style={styles.diceGradient}
          colors={["#aac8ab", "#aac8ab", "#aac8ab"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.diceContainer}>
          {currentPlayerChance === player && !diceRolling &&(
          
           
            <TouchableOpacity
            disabled={isDiceRolled}
            activeOpacity={0.4}
            onPress={handleDicePress}
            >
                
              <Image source={diceIcon} style={styles.dice} />
              
            </TouchableOpacity>
          
          )}
          </View>
        </LinearGradient>
      </View>
      { currentPlayerChance === player && !isDiceRolled && (
       <Animated.View style = {{ transform: [{ translateX: arrowAnim}]}}>
          <Image source={Arrow} style={{width: 50, height: 30}} />
          </Animated.View> 
       
      )}
      {currentPlayerChance === player && diceRolling && (
        <LottieView
          source={DiceRoll}
          style={styles.rollingDice}
          loop={true}
          autoPlay
          cacheComposition={true}
          hardwareAccelerationAndroid
        />
         
      )}
    </View>


  );
});


const styles = StyleSheet.create({
  flexRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: "#f0ce2c",
  },
  border2: {
    borderWidth: 3,
    padding: 1,
    borderRadius: 10,
    backgroundColor: "#aac8ab",
    borderLeftWidth: 0,
    borderColor: "#aac8ab",
  },
  pileIcon: {
    width: 35,
    height: 35,
  },
  pileContainer: {
    paddingHorizontal: 3,
  },

  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#f0ce2c",
    justifyContent: "center",
    alignItems: "center",
  },
  diceContainer: {
    backgroundColor: "#e8c8c1",
    borderWidth: 1,
    borderRadius: 5,
    width: 55,
    height: 55,
    paddingHorizontal: 8,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  dice: {

    height: 45,
    width: 45,
  },
  rollingDice: {
    height: 90,
    width: 90,

    zIndex: 99,
    top: -25,
    position: "absolute",
  },
});

export default Dice;