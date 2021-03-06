import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DisplayProps, TextMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(TextMessage);

    componentDidMount() {
        this.props.enableBubble && this.props.enableBubble(true);
    }
    
    render() {
        const {message: {data: {text}}} = this.props;
        // TODO 表情和URL、电话支持，居中对齐
        return (
            <View style={styles.view}>
                <Text style={styles.text}>
                    {text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        backgroundColor: 'transparent',
    },
});