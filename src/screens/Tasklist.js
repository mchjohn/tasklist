import React, {Component} from 'react'
import {
  View, Text, ImageBackground, Image,
  StyleSheet, FlatList, TouchableOpacity,
  Platform, Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import 'moment/locale/pt-br'

import Task from '../components/Task'
import AddTask from './AddTask'

import commonStyles from '../commonStyles'

import todayImage from '../../assets/imgs/today.png'

const initialState = {
  showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskLists extends Component {
  state = {
    ...initialState
  }

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('tasksState')
    const state = JSON.parse(stateString) || initialState
    this.setState(state, this.filterTasks)
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
  }

  filterTasks = () => {
    let visibleTasks = null
    if(this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks]
    } else {
      const pending = task => task.doneAt === null
      visibleTasks = this.state.tasks.filter(pending)
    }

    this.setState({ visibleTasks })

    AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
  }

  toggleTask = taskId => {
    const tasks = [...this.state.tasks]
    tasks.forEach(task => {
      if(task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date()
      }
    })

    this.setState({ tasks }, this.filterTasks)
  }

  addTask = newTask => {
    if(!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados inválidos', 'Insira a descrição da tarefa!')
      return
    }

    const tasks = [...this.state.tasks]
    tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null
    })

    this.setState({ tasks, showAddTask: false }, this.filterTasks)
  }

  deleteTask = id => {
    const tasks = this.state.tasks.filter(task => task.id !== id)
    this.setState({ tasks }, this.filterTasks)
  }

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
    const getImage = this.state.showDoneTasks ?
      'https://res.cloudinary.com/sk84all/image/upload/v1613925310/tasks/hide_cdmo2c.png' :
      'https://res.cloudinary.com/sk84all/image/upload/v1613925310/tasks/unhide_agwd9g.png'

    return (
      <View style={styles.constainer}>
        <AddTask isVisible={this.state.showAddTask}
          onCancel={() => this.setState({ showAddTask: false })}
          onSave={this.addTask} />
        <ImageBackground
          source={todayImage}
          style={styles.background}
        >
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Image source={{uri: (getImage)}}
                style={styles.hiddenImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask}
            onDelete={this.deleteTask} />}
          />
        </View>
        <TouchableOpacity style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => this.setState({ showAddTask: true })}>
          <Image source={{uri: ('https://res.cloudinary.com/sk84all/image/upload/v1613924966/tasks/add_ca8yds.png')}}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex:7
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
    textTransform: 'capitalize'
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 50 : 20
  },
  hiddenImage: {
    height: 32,
		width: 32,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 25,
    height: 25
  }
})