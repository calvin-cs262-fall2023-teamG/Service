import React, { useState } from 'react';
import { Image } from 'react-native';

const GetImageUrl = () => {

    return (
        <View> 
            <Image source = {{uri:'https://calvinchaptercache.blob.core.windows.net/image/image_m.jpg'}}/>
        </View>
    );
};


GetImageUrl();