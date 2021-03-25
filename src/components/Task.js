import React from 'react'
import {
	View, Text,
	StyleSheet, Image,
	TouchableWithoutFeedback,
	TouchableOpacity } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {
	const doneOrNotStyle = props.doneAt != null ?
	{ textDecorationLine: 'line-through' } : {}

	const date = props.doneAt ? props.doneAt : props.estimateAt

	const formattedDate = moment(date).locale('pt-br')
		.format('ddd, D [de] MMMM')

	const getRightContent = () => {
		return (
			<TouchableOpacity style={styles.right}
				onPress={() => props.onDelete && props.onDelete(props.id)}
				activeOpacity={0.7}>
				<Image source={{uri: ('https://res.cloudinary.com/sk84all/image/upload/v1613939979/tasks/trash_dvhf6k.png')}}
					style={styles.trash} />
			</TouchableOpacity>
		)
	}
	
	const getLeftContent = () => {
		return (
			<View style={styles.left}>
				<Image source={{uri: ('https://res.cloudinary.com/sk84all/image/upload/v1613939979/tasks/trash_dvhf6k.png')}}
					style={styles.excludeImage} />
					<Text style={styles.excludeText}>Excluir</Text>
			</View>
		)
	}

	return (
		<Swipeable
			renderRightActions={getRightContent}
			renderLeftActions={getLeftContent}
			onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
			<View style={styles.container}>
				<TouchableWithoutFeedback
					onPress={() => props.onToggleTask(props.id)}>
					<View style={styles.checkContainer}>
						{getCheckView(props.doneAt)}
					</View>
				</TouchableWithoutFeedback>
				<View>
					<Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
					<Text style={styles.date}>{formattedDate}</Text>
				</View>
			</View>
		</Swipeable>
	)
}

function getCheckView(doneAt) {
	if (doneAt != null) {
		return (
			<Image source={require('../../assets/imgs/check.png')}
				style={styles.done} />
		)
	} else {
		return (
			<View style={styles.pending}></View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#AAA',
		borderBottomWidth: 1,
		paddingVertical: 10,
		backgroundColor: '#FFF'
	},
	checkContainer: {
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pending: {
		height: 25,
		width: 25,
		borderRadius: 13,
		borderWidth: 1,
		borderColor: '#555'
	},
	done: {
		height: 25,
		width: 25
	},
	desc: {
		fontFamily: commonStyles.fontFamily,
		color: commonStyles.colors.mainText,
		fontSize: 15
	},
	date: {
		fontFamily: commonStyles.fontFamily,
		color: commonStyles.colors.subText,
		fontSize: 12
	},
	right: {
		backgroundColor: 'red',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: 20
	},
	trash: {
		width: 25,
		height: 25
	},
	excludeImage: {
		width: 25,
		height: 25,
		marginLeft: 10
	},
	left: {
		flex: 1,
		backgroundColor: 'red',
		flexDirection: 'row',
		alignItems: 'center'
	},
	excludeText: {
		fontFamily: commonStyles.fontFamily,
		color: '#FFF',
		fontSize: 20,
		margin: 10
	}
})