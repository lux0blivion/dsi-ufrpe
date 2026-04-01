import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    StatusBar,

} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { registerCommonUser, parseFirebaseAuthError } from "@/services/auth/register.ts";
import {
    validateName,
    validateEmail, 
    validateCity,
    validatePassword,
    validateConfirmPassword,
} from "@/utils/validators.ts";
import { pernambucoCities } from "@/utils/pernambucoCities.ts";
