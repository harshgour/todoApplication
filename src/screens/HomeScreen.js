import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {DragSortableView} from 'react-native-drag-sort';
import {globalStyles} from '../assets/styles/globalStyles';
import AddModal from '../components/shared/Modal';
import TodoCard from '../components/shared/TodoCard';

const {width, height} = Dimensions.get('window');

export default function HomeScreen() {
  const parentWidth = width;
  const deleteHeight = 100;
  const [deleteStatus, setDeleteStatus] = useState(0);
  const [activeItem, setActiveItem] = useState({});
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [data, setData] = React.useState([
    {
      text: 'Complete ten push-ups',
      date: '2021-08-08T03:29:46.171Z',
      status: 'Pending',
      key: 1,
    },
    {
      text: 'Interview scheduled for Mike',
      date: '2021-08-10T03:29:46.171Z',
      status: 'Pending',
      key: 2,
    },
    {
      text: 'Meeting',
      date: '2021-08-10T03:29:46.171Z',
      status: 'Completed',
      key: 3,
    },
  ]);
  const [count, setCount] = React.useState(data.length);

  const onDragStart = item => {
    // console.log('ITEM', item);
    setScrollEnabled(false);
    setActiveItem(data[item]);
    setDeleteStatus(1);
  };

  const onDragging = (gestureState, left, top) => {
    if (
      gestureState.moveY + (StatusBar.currentHeight | 0) + deleteHeight >=
        height &&
      gestureState.moveY < height - 1
    ) {
      setDeleteStatus(2);
    } else if (deleteStatus !== 1) {
      setDeleteStatus(1);
      scaleOut();
    }
  };

  const onDragEnd = (startIndex, endIndex) => {
    setScrollEnabled(true);
    // console.log('START', startIndex, 'end', endIndex);
    if (deleteStatus === 2) {
      if (startIndex === endIndex) {
        const newData = [...data];
        newData.splice(startIndex, 1);
        setData(newData);
        setCount(count - 1);
        setDeleteStatus(0);
      } else {
        setDeleteIndex(startIndex);
        setDeleteStatus(0);
        scaleOut();
      }
    } else {
      setDeleteStatus(0);
      scaleOut();
    }
  };

  const scaleIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const scaleOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (deleteStatus === 2) {
      scaleIn();
    }
  }, [deleteStatus]);

  React.useEffect(() => {
    setCount(data.length);
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <AddModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setData={setData}
        count={count + 1}
      />
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello Floyd Mullins</Text>
          <Text style={styles.taskText}>You have {count} tasks</Text>
        </View>
        <Image
          source={{uri: 'https://randomuser.me/api/portraits/lego/8.jpg'}}
          style={styles.imageStyle}
        />
      </View>
      <View style={{...styles.listContainer}}>
        <DragSortableView
          dataSource={data}
          parentWidth={parentWidth}
          isDragFreely={true}
          childrenWidth={parentWidth - 40}
          childrenHeight={90}
          onDragging={onDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDataChange={item => {
            // console.log(data);
            setData(item);
            if (deleteIndex != null) {
              const deleteIndexbkp = deleteIndex;
              //deleteIndex = null;
              setDeleteIndex(null);
              let newData = [...data];
              newData = newData.filter(item => item.key != activeItem.key);
              //  newData.splice(deleteIndexbkp,1)
              setData(newData);
            } else if (item.length != data.length) {
              setData(item);
            }
          }}
          keyExtractor={(item, index) => item.key.toString()}
          renderItem={(item, index) => (
            <View style={{width: parentWidth - 40}}>
              <TodoCard
                todo={item}
                data={data}
                setData={setData}
                index={index}
              />
            </View>
          )}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Animated.View
            style={[
              styles.button,
              deleteStatus === 0
                ? globalStyles.bgPrimary
                : globalStyles.bgDelete,
              {transform: [{scale: scaleAnim}]},
              {zIndex: 0},
            ]}>
            <Text style={styles.textStyle}>
              {deleteStatus === 0 ? '+' : 'D'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '500',
  },
  taskText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#aaa',
  },
  imageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});
