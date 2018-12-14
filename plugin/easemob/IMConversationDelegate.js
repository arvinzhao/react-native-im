import { ChatManager, IMConstant } from 'react-native-im-easemob';
import * as IMStandard from '../../src';

export default function () {
    // TODO loadList
    IMStandard.Delegate.im.conversation.loadItem = (imId, chatType, autoCreate) => {
        return ChatManager.getConversation(imId, chatType, autoCreate)
            .then(() => ({
                imId: imId,
                chatType: chatType,
            }));
    };
    // TODO addToList
    // TODO removeFromList
    IMStandard.Delegate.im.conversation.deleteOne = (imId) => {
        return ChatManager.deleteConversation(imId);
    };
    // TODO updateConfig
    IMStandard.Delegate.im.conversation.markAllRead = (imId, chatType) => {
        return ChatManager.markAllMessagesAsRead(imId, chatType);
    };
    // TODO markLatestUnread
    IMStandard.Delegate.im.conversation.loadMessage = (params) => {
        const {imId, chatType, lastMessageId, count} = params;
        return ChatManager.loadMessages(
            imId,
            chatType,
            lastMessageId,
            count,
            IMConstant.MessageSearchDirection.up
        );
    };
    IMStandard.Delegate.im.conversation.deleteMessage = (params) => {
        const {imId, chatType, message: {messageId}} = params;
        return ChatManager.deleteMessage(imId, chatType, messageId);
    };
    // TODO recallMessage
}