import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library"
import { useState, useRef } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { captureRef } from "react-native-view-shot"

import ImageViewer from "./components/ImageViewer"
import Button from "./components/Button"
import IconButton from "./components/IconButton"
import CircleButton from "./components/CircleButton"
import EmojiPicker from "./components/EmojiPicker"
import EmojiList from "./components/EmojiList"
import EmojiSticker from "./components/EmojiSticker"

const PlaceholderImage = require("./assets/images/background-image.png")

export default function App() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
    const [pickedEmoji, setPickedEmoji] = useState<null>(null)
    const [_, requestPermission] = MediaLibrary.usePermissions()
    const imageRef = useRef(null)

    const onReset = () => {
        setShowAppOptions(false)
    }

    const onAddSticker = () => {
        setIsModalVisible(true)
    }

    const onModalClose = () => {
        setIsModalVisible(false)
    }

    const onSaveImageAsync = async () => {
        try {
            await requestPermission()
            const localUri = await captureRef(imageRef, {
                height: 440,
                quality: 1,
            })

            await MediaLibrary.saveToLibraryAsync(localUri)
            if (localUri) {
                alert("Foto berhasil disimpan.")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        })

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
            setShowAppOptions(true)
        } else {
            alert("Anda tidak memilih foto.")
        }
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer
                        placeholderImageSource={PlaceholderImage}
                        selectedImage={selectedImage}
                    />
                    {pickedEmoji !== null ? (
                        <EmojiSticker
                            imageSize={40}
                            stickerSource={pickedEmoji}
                        />
                    ) : null}
                </View>
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton
                            icon="refresh"
                            label="Kembali"
                            onPress={onReset}
                        />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton
                            icon="save-alt"
                            label="Simpan"
                            onPress={onSaveImageAsync}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button
                        theme="primary"
                        onPress={pickImageAsync}
                        label="Pilih foto"
                    />
                    <Button
                        label="Gunakan foto ini"
                        onPress={() => setShowAppOptions(true)}
                    />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList
                    onSelect={setPickedEmoji}
                    onCloseModal={onModalClose}
                />
            </EmojiPicker>
            <StatusBar style="light" />
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        flex: 1,
        paddingTop: 50,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
    optionsContainer: {
        position: "absolute",
        bottom: 40,
    },
    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
})
