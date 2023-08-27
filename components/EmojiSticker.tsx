import { View, Image } from "react-native"
import {
    PanGestureHandler,
    TapGestureHandler,
} from "react-native-gesture-handler"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
} from "react-native-reanimated"

const AnimatedImage = Animated.createAnimatedComponent(Image)
const AnimatedView = Animated.createAnimatedComponent(View)

export default function EmojiSticker({
    imageSize,
    stickerSource,
}: {
    imageSize: number
    stickerSource: any
}) {
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scaleImage = useSharedValue(imageSize)

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        }
    })

    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2
            } else {
                scaleImage.value = imageSize
            }
        },
    })

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        }
    })

    const onDrag = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.translateX = translateX.value
            ctx.translateY = translateY.value
        },
        onActive: (event, ctx: any) => {
            translateX.value = event.translationX + ctx.translateX
            translateY.value = event.translationY + ctx.translateY
        },
    })

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, { top: -350 }]}>
                <TapGestureHandler
                    onGestureEvent={onDoubleTap}
                    numberOfTaps={2}
                >
                    <AnimatedImage
                        source={stickerSource}
                        resizeMode="contain"
                        style={[
                            imageStyle,
                            { width: imageSize, height: imageSize },
                        ]}
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
    )
}
