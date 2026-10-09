# Design Brief: AutoKaraoke AI (Spotify/Apple Dark Luxe Edition)

## Problem

O usuário deseja uma experiência de Karaoke por IA profissional e intuitiva. Interfaces tradicionais de karaoke sofrem com acúmulo de efeitos visuais poluídos ("AI Slop" — sombras neon excessivas, botões sobrepostos e layouts desalinhados) que prejudicam o foco nas letras, no ritmo e na precisão de afinação.

## Solution

Criar uma plataforma de Karaoke em formato de **Dashboard Spotify / Apple Music Dark Luxe**, com barra lateral fixa (Sidebar) à esquerda, tipografia limpa e legível, espaçamentos generosos e um player de afinação minimalista e preciso.

## Experience Principles

1. **Clareza de Estúdio sobre Brilho Desnecessário** — Eliminar glows neon quebrados e focar em contraste WCAG limpo, sombras suaves e bordas de vidro acetinado.
2. **Navegação Contínua via Sidebar (Spotify Style)** — Manter o usuário a 1 clique de distância da biblioteca, do microfone e da partida de Karaoke.
3. **Feedback Instantâneo sem Poluição** — O Piano Roll e o medidor de afinação devem reagir à voz com precisão matemática sem cobrir a letra da música.

## Aesthetic Direction

- **Philosophy**: Spotify / Apple Dark Luxe Minimalist.
- **Tone**: Profissional, elegante, audiófilo e moderno.
- **Reference points**: Spotify Web Player, Apple Music Desktop, Vercel Dashboard, Ableton Live / Logic Pro.
- **Anti-references**: Neon cyberpunk poluído, sombras neon rosa quebradas, botões sobrepostos, layouts desalinhados ("AI slop").

## Existing Patterns

- **Typography**: `Inter` / `Outfit` (limpo, peso 400 a 700) e `JetBrains Mono` para notas e frequências.
- **Colors**:
  - Background: Deep Obsidian (`#0b0d14` / `#121520`).
  - Cards & Panels: Matte Glass (`rgba(255, 255, 255, 0.03)` com bordas `rgba(255, 255, 255, 0.08)`).
  - Accent Color: Emerald / Cyan (`#10b981` / `#06b6d4`) para afinação e destaques ativos.
  - Text Primary: White (`#ffffff`), Text Secondary: Muted Gray (`#94a3b8`).

## Component Inventory

| Component | Status | Notes |
| --- | --- | --- |
| `SidebarNav` | **New** | Sidebar estilo Spotify à esquerda com navegação, mic indicator e acervo rápido |
| `SongSearch` | **Modify** | Remodelado em formato de grid limpo com barra de pesquisa minimalista |
| `KaraokePlayer` | **Modify** | Dashboard de áudio com Piano Roll ajustado e letras legíveis |
| `PianoRoll` | **Modify** | Canvas dark estúdio com linhas de nota sutis e indicador de voz limpo |
| `LyricsDisplay` | **Modify** | Destaque de letra limpo em tipografia expansiva |
| `Leaderboard` | **Modify** | Tabela de alta resolução com posições e ranks |

## Responsive Behavior

- **Desktop (>= 1024px)**: Sidebar fixa de 260px à esquerda + área de conteúdo dinâmico à direita.
- **Mobile (< 1024px)**: Sidebar colapsa em uma barra inferior de navegação (Bottom Bar).

## Accessibility Requirements

- Contraste mínimo WCAG AA em todos os textos.
- Foco de teclado visível em botões e barras de busca.

## Out of Scope

- Efeitos e sombras neon saturadas.
