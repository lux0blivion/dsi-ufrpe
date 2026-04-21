/**
 * AquaSense — Registrar Observação
 * Arquivo: app/register_observation.tsx  (ou screens/RegisterObservation.tsx)
 *
 * Fluxo em duas etapas dentro de um único arquivo:
 *   STEP 1 → Seleção do corpo hídrico (busca + lista)
 *   STEP 2 → Formulário de observação (Cor, Odor, Animais, Lixo)
 *
 * Padrão visual 100% consistente com HomeComum.tsx
 */

import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform,
    Animated,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Questrial_400Regular } from "@expo-google-fonts/questrial";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

// ─────────────────────────────────────────────
// TOKENS (mesmas da Home)
// ─────────────────────────────────────────────
const PRIMARY = "#004d48";
const TEAL_MID = "#0d9080";
const TEAL_LIGHT = "#3ff3e7";
const SURFACE = "#F5F9F8";
const BORDER_LIGHT = "#e0f2f1";
const TEXT_MUTED = "#6b7a7a";

// ─────────────────────────────────────────────
// DADOS MOCK — substituir por chamada ao backend
// ─────────────────────────────────────────────
const MOCK_WATER_BODIES = [
    { id: "1", name: "Rio Capibaribe" },
    { id: "2", name: "Rio Beberibe" },
    { id: "3", name: "Açude X" },
    { id: "4", name: "Lago do Araçá" },
    { id: "5", name: "Riacho Fundo" },
];

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
type Step = "select" | "form";

interface WaterBody {
    id: string;
    name: string;
}

type CorOption = "Incolor" | "Verde" | "Turva" | "Marrom" | "Outra" | null;
type OdorOption = "Sem odor" | "Cheiro químico" | "Cheiro de esgoto" | "Outro" | null;
type YesNo = "sim" | "nao" | null;

interface FormState {
    cor: CorOption;
    corDesc: string;
    odor: OdorOption;
    odorDesc: string;
    animais: YesNo;
    animaisDesc: string;
    lixo: YesNo;
    lixoDesc: string;
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function RegisterObservation() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({ Questrial_400Regular });
    const questrial = fontsLoaded ? "Questrial_400Regular" : undefined;

    const [step, setStep] = useState<Step>("select");
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<WaterBody | null>(null);
    const [form, setForm] = useState<FormState>({
        cor: null, corDesc: "",
        odor: null, odorDesc: "",
        animais: null, animaisDesc: "",
        lixo: null, lixoDesc: "",
    });

    // Animação de entrada (mesma lógica da Home)
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(18)).current;
    const cardFade  = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(18);
        cardFade.setValue(0);
        cardSlide.setValue(24);
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim,  { toValue: 1, duration: 550, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(cardFade,  { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(cardSlide, { toValue: 0, duration: 450, useNativeDriver: true }),
            ]),
        ]).start();
    }, [step]);

    // Filtragem da lista
    const filtered = MOCK_WATER_BODIES.filter((wb) =>
        wb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const noResults = searchQuery.trim().length > 0 && filtered.length === 0;

    function handleSelect(wb: WaterBody) {
        setSelected(wb);
    }

    function handleGoToForm() {
        if (!selected) return;
        setStep("form");
    }

    function handleBack() {
        if (step === "form") {
            setStep("select");
        } else {
            router.back();
        }
    }

    function handlePublish() {
        // TODO: integrar com Firebase / backend
        console.log("Publicar:", { waterBody: selected, form });
        router.back();
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.root}>
                {/* ══ HEADER GRADIENT (igual à Home) ══ */}
                <LinearGradient
                    colors={["#004d48", "#0a6b5e"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerGradient}
                >
                    <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
                        <Animated.View
                            style={[
                                styles.headerRow,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                            ]}
                        >
                            {/* Botão voltar */}
                            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                                <Ionicons name="arrow-back-outline" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={[styles.headerTitle, { fontFamily: questrial }]}>
                                Registrar observação
                            </Text>
                            {/* Espaçador para centralizar o título */}
                            <View style={styles.headerSpacer} />
                        </Animated.View>
                    </SafeAreaView>
                </LinearGradient>

                {/* ══ FAIXA TEAL com onda ══ */}
                <LinearGradient
                    colors={["#0d9080", "#1fc8b4", "#3ff3e7"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.tealBand}
                >
                    {step === "select" ? (
                        /* Barra de busca na faixa teal */
                        <Animated.View
                            style={[
                                styles.searchWrapper,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                            ]}
                        >
                            <Ionicons name="search-outline" size={18} color={TEXT_MUTED} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { fontFamily: questrial }]}
                                placeholder="Buscar corpo hídrico..."
                                placeholderTextColor={TEXT_MUTED}
                                value={searchQuery}
                                onChangeText={(t) => {
                                    setSearchQuery(t);
                                    setSelected(null); // reset seleção ao digitar
                                }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => { setSearchQuery(""); setSelected(null); }}>
                                    <Ionicons name="close-circle" size={18} color={TEXT_MUTED} />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    ) : (
                        /* Corpo hídrico selecionado como badge na faixa teal */
                        <Animated.View
                            style={[
                                styles.selectedBadge,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                            ]}
                        >
                            <Ionicons name="water" size={20} color={TEAL_MID} />
                            <Text style={[styles.selectedBadgeText, { fontFamily: questrial }]}>
                                {selected?.name}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color={TEXT_MUTED} />
                        </Animated.View>
                    )}

                    {/* Onda branca de transição */}
                    <View style={styles.waveWhite} />
                </LinearGradient>

                {/* ══ CONTEÚDO BRANCO ══ */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    {step === "select" ? (
                        <SelectStep
                            filtered={filtered}
                            noResults={noResults}
                            searchQuery={searchQuery}
                            selected={selected}
                            onSelect={handleSelect}
                            onRegisterNew={() => router.push("/register_water_body" as any)}
                            onNext={handleGoToForm}
                            questrial={questrial}
                            cardFade={cardFade}
                            cardSlide={cardSlide}
                        />
                    ) : (
                        <FormStep
                            form={form}
                            setForm={setForm}
                            onPublish={handlePublish}
                            questrial={questrial}
                            cardFade={cardFade}
                            cardSlide={cardSlide}
                        />
                    )}
                </KeyboardAvoidingView>
            </View>
        </>
    );
}

// ─────────────────────────────────────────────
// STEP 1: SELEÇÃO DO CORPO HÍDRICO
// ─────────────────────────────────────────────
function SelectStep({
    filtered, noResults, searchQuery, selected,
    onSelect, onRegisterNew, onNext, questrial,
    cardFade, cardSlide,
}: {
    filtered: WaterBody[];
    noResults: boolean;
    searchQuery: string;
    selected: WaterBody | null;
    onSelect: (wb: WaterBody) => void;
    onRegisterNew: () => void;
    onNext: () => void;
    questrial?: string;
    cardFade: Animated.Value;
    cardSlide: Animated.Value;
}) {
    const isEnabled = selected !== null;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.whiteBody}
                contentContainerStyle={styles.whiteBodyContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }] }}>

                    {/* Lista de resultados */}
                    {filtered.length > 0 && (
                        <View style={styles.listCard}>
                            {filtered.map((wb, idx) => {
                                const isSelected = selected?.id === wb.id;
                                return (
                                    <React.Fragment key={wb.id}>
                                        <TouchableOpacity
                                            style={[styles.listItem, isSelected && styles.listItemSelected]}
                                            onPress={() => onSelect(wb)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.waterBodyIconCircle, isSelected && styles.waterBodyIconCircleActive]}>
                                                <Ionicons name="water" size={16} color={isSelected ? "#FFFFFF" : TEAL_MID} />
                                            </View>
                                            <Text style={[styles.listItemText, { fontFamily: questrial }, isSelected && styles.listItemTextSelected]}>
                                                {wb.name}
                                            </Text>
                                            <Ionicons
                                                name={isSelected ? "checkmark-circle" : "chevron-forward"}
                                                size={18}
                                                color={isSelected ? PRIMARY : TEXT_MUTED}
                                            />
                                        </TouchableOpacity>
                                        {idx < filtered.length - 1 && <View style={styles.listDivider} />}
                                    </React.Fragment>
                                );
                            })}
                        </View>
                    )}

                    {/* Nenhum resultado encontrado */}
                    {noResults && (
                        <View style={styles.noResultsCard}>
                            <View style={styles.noResultsIconCircle}>
                                <Ionicons name="search-outline" size={24} color={TEAL_MID} />
                            </View>
                            <Text style={[styles.noResultsTitle, { fontFamily: questrial }]}>
                                Corpo hídrico não encontrado
                            </Text>
                            <Text style={[styles.noResultsDesc, { fontFamily: questrial }]}>
                                "{searchQuery}" não está cadastrado no sistema.
                            </Text>
                            <TouchableOpacity
                                style={styles.noResultsButton}
                                onPress={onRegisterNew}
                                activeOpacity={0.82}
                            >
                                <Ionicons name="add-circle-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                                <Text style={[styles.noResultsButtonText, { fontFamily: questrial }]}>
                                    Cadastrar novo corpo hídrico
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Estado inicial sem busca */}
                    {!noResults && filtered.length === 0 && searchQuery.trim().length === 0 && (
                        <View style={styles.emptyHint}>
                            <Ionicons name="water-outline" size={36} color={BORDER_LIGHT} />
                            <Text style={[styles.emptyHintText, { fontFamily: questrial }]}>
                                Digite para pesquisar um corpo hídrico
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Botão fixo no rodapé */}
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={[styles.primaryButton, !isEnabled && styles.primaryButtonDisabled]}
                    onPress={onNext}
                    activeOpacity={isEnabled ? 0.85 : 1}
                    disabled={!isEnabled}
                >
                    <Text style={[styles.primaryButtonText, { fontFamily: questrial }, !isEnabled && styles.primaryButtonTextDisabled]}>
                        Registrar observação
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─────────────────────────────────────────────
// STEP 2: FORMULÁRIO
// ─────────────────────────────────────────────
function FormStep({
    form, setForm, onPublish, questrial, cardFade, cardSlide,
}: {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    onPublish: () => void;
    questrial?: string;
    cardFade: Animated.Value;
    cardSlide: Animated.Value;
}) {
    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const COR_OPTIONS: NonNullable<FormState["cor"]>[] = ["Incolor", "Verde", "Turva", "Marrom", "Outra"];
    const ODOR_OPTIONS: NonNullable<FormState["odor"]>[] = ["Sem odor", "Cheiro químico", "Cheiro de esgoto", "Outro"];

    return (
        <ScrollView
            style={styles.whiteBody}
            contentContainerStyle={[styles.whiteBodyContent, { paddingBottom: 32 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }] }}>

                {/* ── Seção COR ── */}
                <SectionCard title="Cor" questrial={questrial}>
                    <RadioGroup
                        options={COR_OPTIONS}
                        selected={form.cor}
                        onSelect={(v) => update("cor", v as FormState["cor"])}
                        questrial={questrial}
                        columns={3}
                    />
                    <DescriptionInput
                        value={form.corDesc}
                        onChange={(v) => update("corDesc", v)}
                        placeholder="Descreva melhor a cor observada..."
                        questrial={questrial}
                    />
                </SectionCard>

                {/* ── Seção ODOR ── */}
                <SectionCard title="Odor" questrial={questrial}>
                    <RadioGroup
                        options={ODOR_OPTIONS}
                        selected={form.odor}
                        onSelect={(v) => update("odor", v as FormState["odor"])}
                        questrial={questrial}
                        columns={2}
                    />
                    <DescriptionInput
                        value={form.odorDesc}
                        onChange={(v) => update("odorDesc", v)}
                        placeholder="Descreva melhor o odor observado..."
                        questrial={questrial}
                    />
                </SectionCard>

                {/* ── Seção ANIMAIS ── */}
                <SectionCard title="Presença de animais" questrial={questrial}>
                    <YesNoToggle
                        value={form.animais}
                        onChange={(v) => {
                            update("animais", v);
                            if (v === "nao") update("animaisDesc", "");
                        }}
                        questrial={questrial}
                    />
                    {form.animais === "sim" && (
                        <>
                            <View style={styles.subLabelRow}>
                                <Ionicons name="paw-outline" size={16} color={TEAL_MID} style={{ marginRight: 6 }} />
                                <Text style={[styles.subLabel, { fontFamily: questrial }]}>
                                    Quais animais você observou?
                                </Text>
                            </View>
                            <DescriptionInput
                                value={form.animaisDesc}
                                onChange={(v) => update("animaisDesc", v)}
                                placeholder="Descreva melhor os animais observados..."
                                questrial={questrial}
                            />
                        </>
                    )}
                </SectionCard>

                {/* ── Seção LIXO ── */}
                <SectionCard title="Presença de lixo" questrial={questrial}>
                    <YesNoToggle
                        value={form.lixo}
                        onChange={(v) => {
                            update("lixo", v);
                            if (v === "nao") update("lixoDesc", "");
                        }}
                        questrial={questrial}
                    />
                    {form.lixo === "sim" && (
                        <>
                            <View style={styles.subLabelRow}>
                                <Ionicons name="trash-outline" size={16} color={TEAL_MID} style={{ marginRight: 6 }} />
                                <Text style={[styles.subLabel, { fontFamily: questrial }]}>
                                    O que você observou?
                                </Text>
                            </View>
                            <DescriptionInput
                                value={form.lixoDesc}
                                onChange={(v) => update("lixoDesc", v)}
                                placeholder="Descreva melhor a presença de lixo observada..."
                                questrial={questrial}
                            />
                        </>
                    )}
                </SectionCard>

                {/* Botão Publicar */}
                <TouchableOpacity
                    style={styles.publishButton}
                    onPress={onPublish}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={["#004d48", "#0d9080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.publishGradient}
                    >
                        <Text style={[styles.publishButtonText, { fontFamily: questrial }]}>
                            Publicar registro
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

            </Animated.View>
        </ScrollView>
    );
}

// ─────────────────────────────────────────────
// SUB-COMPONENTES REUTILIZÁVEIS
// ─────────────────────────────────────────────

/** Card de seção do formulário */
function SectionCard({
    title, questrial, children,
}: {
    title: string; questrial?: string; children: React.ReactNode;
}) {
    return (
        <View style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { fontFamily: questrial }]}>{title}</Text>
            <View style={styles.sectionDivider} />
            {children}
        </View>
    );
}

/** Grupo de opções de rádio */
function RadioGroup({
    options, selected, onSelect, questrial, columns = 2,
}: {
    options: string[];
    selected: string | null;
    onSelect: (v: string) => void;
    questrial?: string;
    columns?: number;
}) {
    // Divide em linhas de `columns` itens
    const rows: string[][] = [];
    for (let i = 0; i < options.length; i += columns) {
        rows.push(options.slice(i, i + columns));
    }
    return (
        <View style={{ marginBottom: 10 }}>
            {rows.map((row, ri) => (
                <View key={ri} style={styles.radioRow}>
                    {row.map((opt) => {
                        const active = selected === opt;
                        return (
                            <TouchableOpacity
                                key={opt}
                                style={styles.radioItem}
                                onPress={() => onSelect(opt)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.radioCircle, active && styles.radioCircleActive]}>
                                    {active && <View style={styles.radioDot} />}
                                </View>
                                <Text style={[styles.radioLabel, { fontFamily: questrial }, active && styles.radioLabelActive]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

/** Toggle Sim / Não */
function YesNoToggle({
    value, onChange, questrial,
}: {
    value: "sim" | "nao" | null;
    onChange: (v: "sim" | "nao") => void;
    questrial?: string;
}) {
    return (
        <View style={styles.yesNoWrapper}>
            {(["sim", "nao"] as const).map((opt) => {
                const active = value === opt;
                return (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.yesNoButton, active && styles.yesNoButtonActive]}
                        onPress={() => onChange(opt)}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.yesNoText,
                            { fontFamily: questrial },
                            active && styles.yesNoTextActive,
                        ]}>
                            {opt === "sim" ? "Sim" : "Não"}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/** Campo de texto complementar */
function DescriptionInput({
    value, onChange, placeholder, questrial,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    questrial?: string;
}) {
    return (
        <TextInput
            style={[styles.descInput, { fontFamily: questrial }]}
            placeholder={placeholder}
            placeholderTextColor={TEXT_MUTED}
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={2}
        />
    );
}

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFFFF" },

    // ── Header ──
    headerGradient: {},
    headerSafeArea: { paddingBottom: 14 },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center", justifyContent: "center",
        marginRight: 12,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    headerSpacer: { width: 36 },

    // ── Faixa teal ──
    tealBand: {
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 0,
        overflow: "hidden",
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: "#333" },

    selectedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    selectedBadgeText: {
        flex: 1,
        fontSize: 15,
        color: PRIMARY,
        fontWeight: "600",
    },

    waveWhite: {
        height: 28,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },

    // ── Fundo branco ──
    whiteBody: { flex: 1, backgroundColor: "#FFFFFF" },
    whiteBodyContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },

    // ── Lista de corpos hídricos ──
    listCard: {
        backgroundColor: SURFACE,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 18,
        gap: 12,
    },
    listItemSelected: {
        backgroundColor: "rgba(63,243,231,0.10)",
    },
    waterBodyIconCircle: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: "rgba(31,200,180,0.15)",
        alignItems: "center", justifyContent: "center",
    },
    waterBodyIconCircleActive: {
        backgroundColor: TEAL_MID,
    },
    listItemText: {
        flex: 1,
        fontSize: 15,
        color: "#333",
        fontWeight: "600",
    },
    listItemTextSelected: {
        color: PRIMARY,
    },
    listDivider: {
        height: 1,
        backgroundColor: BORDER_LIGHT,
        marginLeft: 62,
    },

    // ── Sem resultados ──
    noResultsCard: {
        backgroundColor: SURFACE,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    noResultsIconCircle: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: "rgba(63,243,231,0.15)",
        alignItems: "center", justifyContent: "center",
        marginBottom: 12,
    },
    noResultsTitle: {
        fontSize: 16,
        color: PRIMARY,
        fontWeight: "700",
        marginBottom: 6,
        textAlign: "center",
    },
    noResultsDesc: {
        fontSize: 13,
        color: TEXT_MUTED,
        textAlign: "center",
        marginBottom: 18,
        lineHeight: 20,
    },
    noResultsButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: PRIMARY,
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    noResultsButtonText: {
        fontSize: 13,
        color: PRIMARY,
        fontWeight: "600",
    },

    // ── Dica estado vazio ──
    emptyHint: {
        alignItems: "center",
        paddingTop: 40,
        gap: 12,
    },
    emptyHintText: {
        fontSize: 14,
        color: TEXT_MUTED,
        textAlign: "center",
    },

    // ── Botão principal (Step 1) ──
    footerContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === "ios" ? 28 : 20,
        paddingTop: 12,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: BORDER_LIGHT,
    },
    primaryButton: {
        backgroundColor: PRIMARY,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    primaryButtonDisabled: {
        backgroundColor: "#c8d6d5",
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    primaryButtonTextDisabled: {
        color: "#8fafad",
    },

    // ── Seções do formulário ──
    sectionCard: {
        backgroundColor: SURFACE,
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        color: PRIMARY,
        fontWeight: "700",
        marginBottom: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: BORDER_LIGHT,
        marginBottom: 14,
    },

    // ── Radio ──
    radioRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
        gap: 8,
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
        minWidth: 90,
    },
    radioCircle: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2,
        borderColor: "#b0c4c2",
        alignItems: "center", justifyContent: "center",
    },
    radioCircleActive: {
        borderColor: PRIMARY,
    },
    radioDot: {
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: PRIMARY,
    },
    radioLabel: {
        fontSize: 13,
        color: "#555",
    },
    radioLabelActive: {
        color: PRIMARY,
        fontWeight: "600",
    },

    // ── Yes/No toggle ──
    yesNoWrapper: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14,
    },
    yesNoButton: {
        flex: 1,
        borderRadius: 50,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#E8F4F2",
    },
    yesNoButtonActive: {
        backgroundColor: PRIMARY,
    },
    yesNoText: {
        fontSize: 14,
        color: TEXT_MUTED,
        fontWeight: "600",
    },
    yesNoTextActive: {
        color: "#FFFFFF",
    },

    // ── Sub-label (animais/lixo) ──
    subLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 13,
        color: TEAL_MID,
        fontWeight: "600",
    },

    // ── Descrição / textarea ──
    descInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER_LIGHT,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 13,
        color: "#444",
        minHeight: 48,
        textAlignVertical: "top",
    },

    // ── Botão publicar ──
    publishButton: {
        borderRadius: 50,
        marginTop: 6,
        overflow: "hidden",
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 10,
        elevation: 6,
    },
    publishGradient: {
        paddingVertical: 16,
        alignItems: "center",
    },
    publishButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});