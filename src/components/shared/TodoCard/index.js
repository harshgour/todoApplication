import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import moment from 'moment';
import CheckMarkIcon from '../../../assets/icons/checkmark-circle-outline.svg';

export default function TodoCard({todo, data, setData, index}) {
  const changeStatus = () => {
    const onIndex = data[index];
    onIndex.status = 'Completed';
    data[index] = onIndex;
    setData(data);
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {todo.status === 'Completed' && (
          <View
            style={{
              backgroundColor: '#29D33D',
              width: 50,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>✔️</Text>
          </View>
        )}
        <View style={{width: '100%', padding: 20, flex: 4}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.todoText}>{todo.text}</Text>
            <Text>{todo.status === 'Pending' && '🕧'}</Text>
          </View>
          <View>
            <Text style={styles.dueDate}>
              Due {moment(todo.date).format('ddd MMM D')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#000',
    width: '100%',
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 10,
    shadowOffset: {
      width: 0.2,
      height: 0.2,
    },
    backgroundColor: 'white',
    marginVertical: 8,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
  },
  todoText: {
    fontWeight: '600',
    fontSize: 16,
  },
  dueDate: {
    color: '#aaa',
    fontWeight: '500',
  },
});
