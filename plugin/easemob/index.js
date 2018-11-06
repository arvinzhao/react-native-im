import { Model, Constant } from '../../src';
import * as Util from './util';
import * as Constant from './constant';
import { isMobileText, convertMobileText } from './text/text-mobile';
import { isWebText, convertWebText } from './text/text-web';
import { isMobileImage, convertMobileImage } from './image/image-mobile';
import { isMobileLocation, convertMobileLocation } from './location/location-mobile';
import { isMobileVideo, convertMobileVideo } from './video/video-mobile';
import { isMobileVoice, convertMobileVoice } from './voice/voice-mobile';

export default function () {
    const parseActions = [
        [isMobileText, convertMobileText],
        [isWebText, convertWebText],
        [isMobileImage, convertMobileImage],
        [isMobileLocation, convertMobileLocation],
        [isMobileVideo, convertMobileVideo],
        [isMobileVoice, convertMobileVoice],
    ];
    parseActions.forEach(([specialFunc, handleFunc, priority]) => {
        Model.Action.register(
            Constant.Action.Parse,
            undefined,
            (message) => specialFunc(message),
            (message) => handleFunc(message),
            priority,
        );
    });
}

export {
    Constant,
    Util,
};