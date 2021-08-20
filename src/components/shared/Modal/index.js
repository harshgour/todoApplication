import React, {useRef} from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Animated,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import {globalStyles} from '../../../assets/styles/globalStyles';

export default function AddModal({
  modalVisible,
  setModalVisible,
  setData,
  count,
}) {
  const {width} = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeBorder = useRef(new Animated.Value(30)).current;
  const [text, setText] = React.useState('');

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: parseInt(width),
      duration: 600,
      useNativeDriver: false,
    }).start();

    Animated.timing(fadeBorder, {
      toValue: 0,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 60,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(fadeBorder, {
      toValue: 30,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const handleSubmit = () => {
    if (text !== '') {
      setData(data => {
        return [
          ...data,
          {text, date: new Date().toISOString(), key: count, status: 'Pending'},
        ];
      });
    }
    setText('');
    setModalVisible(!modalVisible);
  };

  React.useEffect(() => {
    console.log(width);
    if (modalVisible) fadeIn();
    else fadeOut();
  }, [modalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
        fadeOut();
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => {
                fadeOut();
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              multiline={true}
              autoFocus={true}
              keyboardType="ascii-capable"
              style={styles.addInput}
              onChangeText={setText}
              placeholder="What would you like to add ?"
            />
          </View>

          <TouchableWithoutFeedback onPress={handleSubmit}>
            <View style={styles.buttonContainer}>
              <Animated.View
                style={[
                  styles.fadingContainer,
                  globalStyles.bgPrimary,
                  {
                    // Bind opacity to animated value
                    width: fadeAnim,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderRadius: fadeBorder,
                    position: 'absolute',
                    bottom: 0,
                  },
                ]}>
                <Text style={styles.fadingText}>+</Text>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  buttonClose: {
    margin: 20,
    height: 30,
    width: 30,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 20,
    width: '100%',
  },
  addInput: {
    fontSize: 24,
    width: '100%',
    color: 'black',
  },
  addButton: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{translateX: -30}],
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fadingContainer: {
    padding: 20,
  },
  fadingText: {
    fontSize: 32,
    color: 'white',
  },
});
