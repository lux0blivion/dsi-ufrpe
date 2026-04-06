import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

// ==========================================
// USUÁRIO COMUM
// ==========================================
export interface RegisterCommonPayload {
    nome: string;
    email: string;
    cidade: string;
    senha: string;
}

export async function registerCommonUser(
    payload: RegisterCommonPayload
): Promise<void> {
    const { nome, email, cidade, senha } = payload;

    // O email e senha são usados para criar a conta no Firebase Authentication
    const credential = await createUserWithEmailAndPassword(auth, email, senha);
    const { uid } = credential.user;

    // Verificação de email
    await sendEmailVerification(credential.user);

    // Persistir dados de perfil no Firestore usando o uid como ID do documento
    await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        cidade,
        tipoUsuario: "comum",
        statusConta: "pendente_verificacao",
        dataCriacao: serverTimestamp(),
    });
}

// ==========================================
// USUÁRIO COLABORADOR
// ==========================================
export interface RegisterCollaboratorPayload {
    nome: string;
    email: string;
    cidade: string;
    organizacao: string;
    senha: string;
}

export async function registerCollaboratorUser(
    payload: RegisterCollaboratorPayload
): Promise<void> {
    const { nome, email, cidade, organizacao, senha } = payload;

    // O email e senha são usados para criar a conta no Firebase Authentication
    const credential = await createUserWithEmailAndPassword(auth, email, senha);
    const { uid } = credential.user;

    // Verificação de email
    await sendEmailVerification(credential.user);

    // Persistir dados de perfil no Firestore usando o uid como ID do documento
    await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        cidade,
        organizacao: organizacao.trim(),
        tipoUsuario: "colaborador",
        statusConta: "pendente_verificacao",
        dataCriacao: serverTimestamp(),
    });
}

// ==========================================
// USUÁRIO TÉCNICO
// ==========================================
export interface RegisterTechnicianPayload {
    nome: string;
    email: string;
    codigoEquipe: string; 
    senha: string;
}

export async function registerTechnician(
    payload: RegisterTechnicianPayload
): Promise<void> {
    const { nome, email, codigoEquipe, senha } = payload;

    // Criar a conta no Firebase Authentication
    const credential = await createUserWithEmailAndPassword(auth, email, senha);
    const { uid } = credential.user;

    // Enviar verificação de email
    await sendEmailVerification(credential.user);

    // Persistir dados no Firestore
    await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        codigoEquipe: codigoEquipe.trim(),
        tipoUsuario: "tecnico",
        statusConta: "pendente_verificacao",
        dataCriacao: serverTimestamp(),
    });
}

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================
// Mapeia códigos de erro do Firebase Auth para mensagens legíveis.
export function parseFirebaseAuthError(code: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.";
        case "auth/invalid-email":
            return "O endereço de e-mail é invalido. Verifique e tente novamente.";
        case "auth/weak-password": // Corrigi um pequeno typo aqui de "weak=password" para "weak-password"
            return "A senha escolhida é muito fraca. Use pelo menos 8 caracteres.";
        case "auth/too-many-requests":
            return "Muitas tentativas de cadastro. Aguarde um momento e tente novamente.";
        default:
            return "Ocorreu um erro inesperado. Por favor, tente novamente.";
    }
}