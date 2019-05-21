import React, { Component } from 'react';
import { Text, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager } from 'react-native';
import { Icon } from 'react-native-elements'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SWIPE_THRESHOLD = 0.13 * SCREEN_HEIGHT


class SwipeScreen extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 100 })
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                if (this.state.page === 2 && gesture.dy > 35) {
                    this.position.setValue({ x: 0, y: gesture.dy - 35 })
                }
                else if (this.state.page === 1) {

                    this.position.setValue({ x: 0, y: SCREEN_HEIGHT - 100 + gesture.dy })
                }
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dy < -SWIPE_THRESHOLD) {
                    this.position.setValue({ x: 0, y: 0.3 })
                    this.setState({ rotate: '-180deg' })
                    this.setState({ page: 2 })

                }
                else if (gesture.dy > SWIPE_THRESHOLD) {
                    this.position.setValue({ x: 0, y: SCREEN_HEIGHT - 100 })
                    this.setState({ rotate: '0deg' })
                    this.setState({ page: 1 })
                }
                else {
                    if (this.state.page === 1) {
                        this.position.setValue({ x: 0, y: SCREEN_HEIGHT - 100 })
                    }
                    if (this.state.page === 2) {

                        this.position.setValue({ x: 0, y: 0.3 })
                    }
                }
            },
        });
        this.state = {
            rotate: '0deg',
            page: 1
        };
    }
    renderIcon() {
        if (this.state.page === 2) {
            return (
                <Icon
                    reverse
                    name='arrow-up'
                    type='font-awesome'
                />
            )
        }
        else {
            return (
                <Icon
                    name='arrow-up'
                    type='font-awesome'
                />
            )
        }
    }


    getCardStyle() {
        const color = this.position.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 100,],
            outputRange: ['#000', '#FFF']
        })
        return {
            ...this.position.getLayout(),
            backgroundColor: color,
        }
    }
    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
        LayoutAnimation.spring();
    }


    secondScreen() {
        return (
            <Animated.View style={[styles.second, { top: this.state.posY, }, this.getCardStyle(), this.position.getLayout()]} {...this.PanResponder.panHandlers}>
                <Animated.View style={[{ transform: [{ rotate: this.state.rotate }] }, styles.test]}>
                    {this.renderIcon()}
                </Animated.View>
                <Text style={{ color: '#FFF', fontSize: 24, }}> Second Page </Text>

            </Animated.View>
        )
    }
    render() {
        return (
            <Animated.View style={styles.main}  >
                <Text style={{ fontSize: 24 }}> First Page </Text>
                {this.secondScreen()}
            </Animated.View>
        );
    }
}

const styles = {
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    second: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    test: {
        position: 'absolute',
        flex: 1,
        top: 40,
    }
}

export default SwipeScreen;
