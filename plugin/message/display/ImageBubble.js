import React from 'react';
import { Image, StyleSheet, View, Platform, InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import { DisplayProps, ImageMessage } from '../proptype';

export default class extends React.PureComponent {
    static propTypes = DisplayProps(ImageMessage);

    constructor(props) {
        super(props);
        const {message: {data: {localPath, thumbnailPath}}} = this.props;
        let source = null;
        if (thumbnailPath) {
            source = {uri: thumbnailPath};
        } else if (Platform.OS === 'android') {
            source = {uri: localPath};
        }
        this.state = {
            source: source,
        };
    }

    componentDidMount() {
        const {message: {data: {localPath}}} = this.props;
        if (!this.state.source) {
            RNFS.readFile(localPath, 'base64')
                .then(content => {
                    this.setState({
                        source: {uri: 'data:image/png;base64,' + content}
                    });
                });
        }
    }

    render() {
        const {message: {data: {size}}, maxWidth, style} = this.props;
        const imgWidth = size && size.width || maxWidth;
        const imgHeight = size && size.height || maxWidth;
        const ratio = Math.max(imgWidth / maxWidth, imgHeight / maxWidth);
        return this.state.source ? (
            <View style={[styles.view, style]}>
                <Image
                    resizeMode={'contain'}
                    source={this.state.source}
                    style={[styles.image, {
                        width: imgWidth / ratio,
                        height: imgHeight / ratio,
                    }]}
                />
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'transparent',
    },
    image: {
        borderRadius: 5,
    },
});
