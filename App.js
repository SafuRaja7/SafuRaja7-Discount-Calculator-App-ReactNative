import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Modal,
  Button,
  TouchableWithoutFeedback,
  ToastAndroid,
  Alert,
  StyleSheet,
  Platform,
  Text,
  View,
  TextInput,
  ScrollView,
  } from "react-native";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { TouchableHighlight } from "react-native-gesture-handler";


export default function App() {
  const [FinalPrice, setFinalPrice] = useState(null);
  const [OriginalPrice, setOriginalPrice] = useState(null);
  const [DiscountPercentage, setDiscountPercentage] = useState(null);
  const [isSaveButtonEnabled, setisSaveButtonEnabled] = useState(false);
  const [History, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const saveCalculations = () => {
    ToastAndroid.show("Saving in History", 1000);
    setHistory((prev) => [
      ...prev,
      {
        OriginalPrice: OriginalPrice,
        DiscountPercentage: DiscountPercentage,
        Saving: Math.round(OriginalPrice - FinalPrice),
        FinalPrice: Math.round(FinalPrice),
      },
    ]);
    setisSaveButtonEnabled(false);
  };

  const openModal = () => {
    if(History.length > 0) setModalVisible(true);
    else ToastAndroid.show("Nothing to show in History",1000)
  };
  
  const deleteItem = (index) => {
    const newHistroy = History.filter((_,i) => i!=index)
    setHistory(newHistroy)
  }

  const HistoryModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View
            style={
              (styles.modalView,
              {
                borderRadius: 20,
                height: 'auto',
                width:200,
                backgroundColor: "#DFDDDD",
              })
            }
          >
            <ScrollView>
              {History.length == 0 ? (
                <View style={{ padding: 10 }}>
                  <Text>No History to show</Text>
                </View>
              ) : (
                History.map((item, index) => (
                  <View key={index} style={{ padding: 10,flex:1 }}>
                    <View>
                        <Text style={{ fontSize: 16 }}>Item : {index + 1}</Text>
                        <Text>Original Price : {item.OriginalPrice}</Text>
                        <Text>Discount : {item.DiscountPercentage} %</Text>
                        <Text>You Saved : {item.Saving}</Text>
                        <Text>Final Price : {item.FinalPrice}</Text>
                    </View>
                    <View style={{justifyContent:"flex-end",alignItems:'flex-end'}}>
                        <TouchableWithoutFeedback onPress={() => deleteItem(index)}>
                            <Text style={{color:'red'}}>
                            Delete
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableWithoutFeedback
              style={{ ...styles.openButton }}
              onPress={() => {
                console.log("setting modal false");
                setModalVisible(false);
              }}
            >
              <Text
                style={
                  (styles.textStyle,
                  {
                    ...styles.openButton,
                    color: "white",
                    padding: 10,

                    textAlign: "center",
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",
                  })
                }
              >
                Close
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    if (OriginalPrice == "" || DiscountPercentage == "") {
      setFinalPrice(null);
      setisSaveButtonEnabled(false);
    } else if (OriginalPrice != null && DiscountPercentage != null) {
      if (
        DiscountPercentage >= 0 &&
        DiscountPercentage < 101 &&
        OriginalPrice >= 0
      ) {
        let finalprice =
          OriginalPrice - (DiscountPercentage / 100) * OriginalPrice;
        setFinalPrice(finalprice);
        setisSaveButtonEnabled(true);
      } else {
        ToastAndroid.show("Please Enter Valid Numbers", 1000);
        setisSaveButtonEnabled(false);
      }
    }
  }, [OriginalPrice, DiscountPercentage]);
  return (
    <View style={styles.container}>
      {<HistoryModal />}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30 }}>Discount Calculator</Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
          padding: 10,
        }}
      >
        <TouchableWithoutFeedback
          style={{ fontSize: 14, color: "black" }}
          onPress={openModal}
        >
          <Text style ={styles.viewhistory}> View History</Text>
          
        </TouchableWithoutFeedback>
       </View>
      {FinalPrice != null && (
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20 }}>
            You Saved{"    "}{" "}
            {Math.round(
              Math.max(OriginalPrice, FinalPrice) -
                Math.min(OriginalPrice, FinalPrice)
            )}
          </Text>
          <Text style={{ fontSize: 20 }}>
            Final Price {"    "}
            {Math.round((FinalPrice * 100) / 100)}
          </Text>
        </View>
      )}
      <View style={{ flex: 5, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          defaultValue={0}
          style={{ fontSize: 20, textAlign: "center", paddingBottom: 10 }}
          placeholder="Original Price:"
          keyboardType="numeric"
          onChangeText={(e) => setOriginalPrice(e)}
        />
        <TextInput
          defaultValue={0}
          style={{ fontSize: 20, textAlign: "center" }}
          placeholder="Discount Percentage:"
          keyboardType="numeric"
          maxLength={3}
          onChangeText={(e) => setDiscountPercentage(e)}
        />
      </View>

      <Button
        disabled={!isSaveButtonEnabled}
        title="Save"
        color="#841584"
        onPress={saveCalculations}
        accessibilityLabel="Learn more about this button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },

  // modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  viewhistory : {
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});