import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInputTitle, setTextInputTitle] = React.useState('');
  const [textInputDesc, setTextInputDesc] = React.useState('');

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInputTitle == '') {
      Alert.alert('Error', 'Please input title');
    }else if(textInputDesc == ''){
      Alert.alert('Error', 'Please input description');
    } else {
      const newTodo = {
        id: Math.random(),
        title: textInputTitle,
        desc: textInputDesc,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInputTitle('');
      setTextInputDesc('');
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: 'black',
              letterSpacing: 1,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.title}, {todo?.desc}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'transparent'}]}>
              <Icon name="done" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            color: 'white',
          }}>
          TODO APP
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View>
        <View>
        <TextInput
            value={textInputTitle}
            style={{
              backgroundColor: 'grey',
              marginBottom: 10,
              padding: 10,
              borderRadius: 4,
              marginLeft: 20,
              marginRight: 20,
              color: 'black',
              letterSpacing: 1,
            }}
            placeholder="Add Todo Title..."
            onChangeText={text => setTextInputTitle(text)}
          />
          <TextInput
            value={textInputDesc}
            style={{
              backgroundColor: 'grey',
              marginBottom: 10,
              padding: 10,
              borderRadius: 4,
              marginLeft: 20,
              marginRight: 20,
              color: 'black',
              letterSpacing: 1,
            }}
            placeholder="Add Todo Description..."
            onChangeText={text => setTextInputDesc(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="black" size={30} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  inputContainer1: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: 'grey',
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: 'yellow',
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '45%'
  },

  listItem: {
    padding: 20,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;
