---
name: AutoKaraoke Cyberpunk Neon
description: Modern, high-energy, revenue-centric UI system for real-time vocal AI karaoke platform.
colors:
  primary: "#EC4899"
  primary-glow: "rgba(236, 72, 153, 0.4)"
  secondary: "#8B5CF6"
  secondary-glow: "rgba(139, 92, 246, 0.4)"
  accent-cyan: "#06B6D4"
  accent-cyan-glow: "rgba(6, 182, 212, 0.5)"
  accent-gold: "#F59E0B"
  accent-gold-glow: "rgba(245, 158, 11, 0.6)"
  bg-dark: "#090A0F"
  bg-card: "rgba(18, 20, 32, 0.75)"
  text-main: "#F8FAFC"
  text-muted: "#94A3B8"
typography:
  h1:
    fontFamily: "Outfit, sans-serif"
    fontSize: "3rem"
    fontWeight: "900"
  body-md:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
  label-mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  card-glass:
    backgroundColor: "{colors.bg-card}"
    rounded: "{rounded.lg}"
---

## Overview

AutoKaraoke Cyberpunk Neon une estética futurista de alta performance a princípios de **Revenue-Centric Design (RCD)**. O objetivo da interface é encantar o usuário no primeiro clique ("Aha! moment"), oferecer feedback em tempo real gratificante durante o canto e guiar a conversão/retenção através de gatilhos comportamentais claros (curva de maestria, gamificação de afinação, conquistas e placar).

---

## Colors

A paleta combina um fundo profundo modo escuro com acentos neon vibrantes para destacar métricas de afinação e botões de chamada para ação (CTA).

- **Primary (#EC4899):** Hot Pink — Ações principais (Iniciar Karaoke, Salvar Pontuação).
- **Secondary (#8B5CF6):** Neon Purple — Elementos secundários, degradês e bordas ativas.
- **Accent Cyan (#06B6D4):** Electric Cyan — Rastro de pitch do microfone ao vivo ("Perfeito!").
- **Accent Gold (#F59E0B):** Golden Notes e Badges de alta pontuação (Rank S/S+).
- **Background Dark (#090A0F):** Fundo escuro com sutil iluminação radial.

---

## Typography

- **Headings & Títulos:** `Outfit` (Bold / Black 800-900) para máxima energia e apelo visual moderno.
- **Métricas & Pitch:** `JetBrains Mono` para frequências (Hz), notas MIDI (C4, A4) e valores numéricos do Placar.
- **Body & Textos:** `Outfit` (400-600) para excelente legibilidade em fundos escuros.

---

## Layout & Spacing

- **Escala de Espaçamento:** Base 8px (8px, 16px, 24px, 32px).
- **Mapeamento de Leitura:** Foco visual centralizado no Piano Roll Canvas (gabarito de afinação) e nas letras sincronizadas em destaque.

---

## Elevation & Depth

- **Glassmorphic Cards:** Utilização de `backdrop-filter: blur(16px)` com bordas sutis `rgba(255, 255, 255, 0.08)`.
- **Glow Effects:** Sombra neon suave em estados de foco e botões ativos (`box-shadow: 0 0 25px rgba(236, 72, 153, 0.4)`).

---

## Shapes

- **Corner Radius Scale:**
  - Botões & Inputs: `12px` (`md`)
  - Cards & Painéis: `16px` (`lg`) a `24px` (`xl`)
  - Badges & Status: `9999px` (Pill shape)

---

## Revenue-Centric Design Principles Applied

1. **Value First, Ask Later (Aha! Moment Imediato):**
   - O usuário pode selecionar imediatamente músicas de demonstração prontas (*Evidências*, *Blinding Lights*) sem precisar fazer cadastro antes de cantar.
2. **Neutrality is Omission (Direcionamento Claro):**
   - A interface guia o usuário diretamente ao botão *"Cantar Agora"* e indica em tempo real o status do microfone e da afinação.
3. **Behavioral Gamification & Loss Aversion:**
   - Multiplicadores de Combo e efeito visual de nota dourada (*Golden Notes*) incentivam a manutenção da afinação perfeita.
4. **Default is the Decision You Made for the User:**
   - Músicas demo já vêm com microfone ativado por padrão para reduzir atrito de entrada.

---

## Do's and Don'ts

### Do:
- Use gradientes vibrantes para botões principais de ação.
- Forneça feedback imediato visual quando a afinação do usuário atingir a faixa ideal.
- Mantenha contrastes de texto conformes com as diretrizes WCAG AA sobre fundos escuros.

### Don't:
- Não use fundos pretos puros (#000000) sem gradientes ou profundidade.
- Não esconda o botão de ação principal dentro de menus de segundo nível.
- Não interrompa a música durante o canto com popups desnecessários.
