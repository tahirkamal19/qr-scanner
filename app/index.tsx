"use client";
import React from 'react'
import {  ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'

export default function index (){
    return (
        <View  style={styles.container}> 
        <View style={styles.imageContainer}>
            <Image source={require('../assets/images/qr-code.png')} style={{width: 200, height: 200, alignSelf:"center" }} />
        </View>
        <Text style={styles.text}>QR Code Scanner</Text>
        <ActivityIndicator size="large" color="#ffff"  style={{marginTop: 100}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer:{
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        width: 210,
        height: 200,

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       backgroundColor: '#6179F5',
        height: '100%',
    },
    text: {
        fontSize: 20,
        marginTop: 10,
        color: '#ffffff',
    },
})