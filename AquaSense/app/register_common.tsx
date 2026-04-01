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
    Image,

} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { registerCommonUser, parseFirebaseAuthError } from "@/services/auth/register";
import {
    validateName,
    validateEmail, 
    validateCity,
    validatePassword,
    validateConfirmPassword,
} from "@/utils/validators.ts";
import { pernambucoCities } from "@/utils/pernambucoCities.ts";

// Componentes 
export default function RegisterCommon() {
// Estados de formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cidade, setCidade] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
}

return (
    <LinearGradient
        colors={["#0D5C52", "#0D8C78", "#12B899", "#4ED8C0" ]}
        locations={[0, 0.3, 0.65, 1]}
        style={styles.gradient}
    >
        <StatusBar barStyle="Light-content" />
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer}>
                    <AquaSenseLogo />
                </View>

                <Text style={styles.title}> CADASTRE-SE NO {"\n"} AQUASENSE</Text>

                <View style={styles.formWrapper}>
                    <FieldLabel label="Seu nome: " />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome..."
                        placeholderTextColor="rgba(255, 255, 255, 0.78)"
                        value={nome}
                        onChangeText={setNome}
                        onBlur={() => handleBlur("nome")}
                        maxLength={80}
                        returnKeyType="next"
                    />

                    <FieldLabel label="Seu Email:" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email..."
                        placeholderTextColor="rgba(255, 255, 255, 0.78)"
                        value={email}
                        onBlur={() => handleBlur("email")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        returnKeyType="next"
                    />
                    <FieldLabel label="Cidade:" />
                    <TouchableOpacity
                        style={[
                            styles.input,
                            styles.selectRow,
                        ]}
                        onPress={() => setCityModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.selectText,
                                !cidade && styles.placeholderText,
                            ]}
                        >
                            {cidade || "Selecione sua cidade..."}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="rgba(255, 255, 255, 0.78)" />
                    </TouchableOpacity>

                    <FieldLabel label="Senha:" />
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[
                                styles.input,
                                styles.passwordInput,
                            ]}
                            placeholder="Senha..."
                            placeholderTextColor="rgba(255, 255, 255, 0.78)"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={!showPassword}
                            onBlur={() => handleBlur("senha")}
                            onFocus={() => setPasswordInfoVisible(true)}
                            returnKeyType="next"
                        />
                        <TouchableOpacity
                            style={styles.infoIcon}
                            onPress={() => setPasswordInfoVisible(true)}
                            hitSlop={{ top: 10. bottom: 8, left: 8, right: 8}}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="rgba(255, 255, 255, 0.80)"
                            />
                        </TouchableOpacity>
                    </View>
                            
                    <FieldLabel label="Confirme senha:" />
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[
                                styles.input,
                                styles.passwordInput,
                            ]}
                            placeholder="Confirme sua senha..."
                            placeholderTextColor="rgba(255, 255, 255, 0.78)"
                            value={confirmSenha}
                            onChangeText={setConfirmSenha}
                            secureTextEntry={!showPassword}
                            onBlur={() => handleBlur("confirmSenha")}
                            retunrKeyType="done"
                        />
                        <TouchableOpacity
                            style={styles.infoIcon}
                            onPress={() => setPasswordInfoVisible(true)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8}}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="rgba(255, 255, 255, 0.80)"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setShowPassword((v) => !v)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[styles.checkbox, showPassword && styles.checkboxChecked]}
                        >
                            {showPassword && (
                                <Ionicons name="checkmark" size={13} color="#fff" />
                            )}
                        </View>
                        <Text style={styles.checkboxLabel}>Mostrar senha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        activeOpacity={loading}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


function FieldLabel({ label }: { message?: string }) {
    return <Text style={styles.fieldLabel}>{label}</Text>;
}

function AquaSenseLogo() {
    return (
        <View style={styles.logoWrapper}>
            <Image
                source={require("@assets/images/aquasense-logo.pnsg ")}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>
    );
}

const TEAL = "#0D8C78";
const INPUT_BG = "rgba(255, 255, 255, 0.78)";
const BORDER_RADIUS = 25;

const styles = Style.Sheet.create({
    flex: { flex: 1 },
    gradient: { flex: 1 },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingBottom: 40,
        alignItems: "center",
    },

    logoContainer: { marginBottom: 10 },
    logoWrapper: { alignItems: "center" },
    logoIconOuter: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2.5,
        borderColor: "rgba(255, 255, 255, 0.7)",
        alignItems: "center",
        justifyContent: "center",
    },
    logoIconInner: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.9)",
        borderTopWidth: 6,
        transform: [{ rotate: "45deg" }],
    },
    logoText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 3,
        marginTop: 5,
    },

    tittle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1.5,
        textAlign: "center",
        marginTop: 4,
        marginBottom: 22,
        lineHeight: 26,
    },

    formWrapper: { width: "100%" },
    fieldLabel: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
        marginLeft: 4,
        letterSpacing: 0.3,
    },

    input: {
        backgroundColor: INPUT_BG,
        borderRadius: BORDER_RADIUS,
        height: 46,
        paddingHorizontal: 18,
        fontSize: 14,
        color: "#1a2e2a",
        borderWidth: 1.5,
        borderColor: "transparent",
        marginBottom: 2,
    },

    inputError: {
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.96)",
    },
    errorText: {
        color: "#ffe0e0",
        fontSize: 11,
        marginLeft: 6,
        marginBottom: 6,
        marginTop: 1,
    },

    selectRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 14,
    },
    selectText: {
        fontSize: 14,
        color: "#1a2e2a",
        flex: 1,
        placeholderText: { color: "rgba(255, 255, 255, 0.78)" },
    },

    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    passwordInput: {
        flex: 1,
        marginBottom: 0,
    },
    infoIcon: {
        marginLeft: 8,
        marginTop: -2,
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        marginBottom: 18,
        marginLeft: 4,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.75)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: TEAL,
        borderColor: TEAL,
    },
    checkboxLabel: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
    },

    button: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: BORDER_RADIUS,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: TEAL,
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 2,
    },
});


          
                        
                    

      