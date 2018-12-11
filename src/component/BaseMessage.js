import React from 'react';
import { Image, StyleSheet, Text, View, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Listener from 'react-native-general-listener';
import Toast from 'react-native-root-toast';
import * as Types from '../proptype';
import * as Constant from '../constant';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        ...Types.BasicConversation,
        position: PropTypes.number.isRequired,
        message: PropTypes.shape(Types.BasicMessage).isRequired,
        onShowMenu: PropTypes.func,
        onResend: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.updateEvent = [Constant.BaseEvent, Constant.ConversationUpdateEvent, props.imId];
        this.state = {
            showMembersName: this._showMembersName(),
        };
    }

    componentDidMount() {
        this.listenUpdate = Listener.register(this.updateEvent, this._onUpdate);
    }

    componentWillUnmount() {
        this.listenUpdate && Listener.unregister(this.updateEvent, this.listenUpdate);
    }

    render() {
        const {position} = this.props;
        let msgContent;
        if (position < 0) {
            msgContent = this._renderLeft();
        } else if (position > 0) {
            msgContent = this._renderRight();
        } else {
            msgContent = this._renderCenter();
        }
        return (
            <View style={styles.message}>
                {msgContent}
            </View>
        );
    }

    _renderLeft = () => {
        const {message, onShowMenu} = this.props;
        const user = delegate.user.getUser(message.from);
        const username = user.name;
        const leftAvatarStyle = {
            marginLeft: 10,
            marginRight: 3,
        };
        return (
            <View style={styles.rowLeft}>
                {this._renderAvatar(leftAvatarStyle)}
                <View>
                    {this.state.showMembersName && (
                        <Text style={styles.userName}>
                            {username}
                        </Text>
                    )}
                    <delegate.component.MessageBubble
                        isSender={false}
                        message={message}
                        onShowMenu={onShowMenu}
                    />
                </View>
            </View>
        );
    };

    _renderRight = () => {
        const {message, onShowMenu} = this.props;
        const status = message.status;
        let leftItem = null;
        if (status === Constant.Status.Delivering ||
            status === Constant.Status.Pending) {
            leftItem = (
                <ActivityIndicator
                    size='small'
                    color='#999999'
                />
            );
        } else if (status === Constant.Status.Failed) {
            leftItem = (
                <TouchableWithoutFeedback onPress={this._resend}>
                    <Image
                        source={require('./image/send_fail.png')}
                        style={styles.messageStatusImage}
                    />
                </TouchableWithoutFeedback>
            );
        }
        const rightAvatarStyle = {
            marginRight: 10,
            marginLeft: 3,
        };
        return (
            <View style={styles.rowRight}>
                {leftItem}
                <delegate.component.MessageBubble
                    isSender={true}
                    message={message}
                    onShowMenu={onShowMenu}
                />
                {this._renderAvatar(rightAvatarStyle)}
            </View>
        );
    };

    _renderCenter = () => {
        const {message: {data: {text}}} = this.props;
        return (
            <Text style={styles.center}>
                {text}
            </Text>
        );
    };

    _renderAvatar = (style) => {
        const {position, message} = this.props;
        const user = position < 0 ?
            delegate.user.getUser(message.from) :
            delegate.user.getMine();
        const {userId, avatar} = user;
        const defaultImage = delegate.func.getDefaultUserHeadImage(userId);
        const size = 36;
        const innerStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
        };
        const image = avatar
            ? {uri: delegate.func.fitUrlForAvatarSize(avatar, size)}
            : defaultImage;
        return (
            <Image
                style={[styles.userImage, innerStyle, style]}
                source={image}
                defaultSource={defaultImage}
            />
        );
    };

    _resend = () => {
        if (this.props.onResend) {
            this.props.onResend(this.props.message)
                .then(() => {
                    Toast.show('发送成功');
                });
        };
    };

    _showMembersName = () => {
        const config = delegate.model.Conversation.getConfig(this.props.imId);
        return config.showMembersName;
    };

    _onUpdate = () => {
        this.setState({
            showMembersName: this._showMembersName(),
        });
    };
}

const styles = StyleSheet.create({
    message: {
        marginTop: 10,
        marginBottom: 10,
    },
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowLeft: {
        flex: 1,
        flexDirection: 'row',
    },
    userImage: {
        marginTop: 2,
        overflow: 'hidden',
    },
    userName: {
        color: 'gray',
        marginLeft: 10,
        marginTop: 2,
        marginBottom: 5,
    },
    center: {
        alignSelf: 'center',
        backgroundColor: '#D4D4D4',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        overflow: 'hidden',
        color: '#FFFFFF',
        marginBottom: 10,
        fontSize: 11,
    },
    messageStatusImage: {
        width: 20,
        height: 20,
    },
});