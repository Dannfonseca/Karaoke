# 🎤 Requerimentos Centrais - AutoKaraoke AI

Este documento detalha os requerimentos centrais da plataforma de Karaoke automatizado por IA, concebida a partir da ideia de extração automática de playlists/músicas do YouTube, separação de voz/instrumental, sincronização de letras e avaliação por afinação em tempo real.

---

## 1. Visão Geral da Ideia

O sistema é uma plataforma de Karaoke interativa em que o usuário insere uma URL do YouTube/YouTube Music (ou busca por uma música/playlist). O sistema processa a mídia de forma 100% automatizada:
1. **Baixa/Ingere o áudio** da fonte.
2. **Separa as faixas (Stems)**: Isola os vocais e o áudio instrumental (playback).
3. **Obtém a Letra Sincronizada (Lyrics/LRC)**: Busca no LrcLib / fontes de legenda com marcação temporal de linhas e palavras.
4. **Extrai a Curva de Pitch de Referência**: Analisa a faixa vocal isolada para identificar as notas e frequências cantadas originalmente.
5. **Engine de Karaoke & Jogo**: Toca o instrumental enquanto exibe a letra sincronizada e os blocos de notas (estilo *UltraStar Deluxe* / *SingStar*).
6. **Captura & Avaliação em Tempo Real**: Captura o microfone do usuário, detecta a afinação usando o **Pitchy** e calcula a pontuação final de precisão (Score).

---

## 2. Divisão de Módulos e Requerimentos

### 🧩 Módulo 1: Pipeline de Ingestão e Separação de Áudio (Backend)
- **Extração de Áudio**: Suporte a URLs do YouTube (via `yt-dlp` / streams de áudio).
- **Separação de Voz & Instrumental (Vocal Separation)**:
  - Integração/Suporte ao **Demucs** / **Ultimate Vocal Remover (UVR)**.
  - Fallback local/cliente para testes imediatos (ex: inversão de fase/filtros de áudio Web Audio API se o processamento pesado de IA não for acionado).
  - Produção dos arquivos `instrumental.wav/mp3` e `vocals.wav/mp3`.

---

### 🎼 Módulo 2: Motor de Letras & Sincronização (Lyrics & Timing)
- **Busca na LrcLib API**:
  - Busca automatizada de letras por título/artista ou hash.
  - Leitura de marcas de tempo LRC em milissegundos (`[mm:ss.xx]`).
- **Conversão para Formato de Notas (UltraStar Standard / LRC extended)**:
  - Mapeamento de sílabas e palavras aos intervalos de tempo.
  - Fallback visual para sincronia por linha caso a sincronia por nota individual não esteja disponível.

---

### 🎯 Módulo 3: Extração de Pitch & Avaliação do Cantor (Pitch Detection & Scoring)
- **Pitch Extraction de Referência**:
  - Análise da faixa de áudio vocal isolada usando a biblioteca **Pitchy** (algoritmo YIN) ou análise espectral para extrair o gabarito de frequências/notas MIDI ao longo do tempo.
- **Captura do Microfone em Tempo Real**:
  - Captura do fluxo de áudio via `getUserMedia` no navegador com cancelamento de eco e supressão de ruído.
- **Detecção de Afinação ao Vivo (Live Pitchy Integration)**:
  - Extração contínua da frequência do usuário (Hz) e conversão para Nota MIDI + desvio em Cents.
- **Engine de Pontuação (Scoring System)**:
  - Comparação entre o pitch cantado e o pitch de referência no mesmo milissegundo.
  - Métrica de tolerância a variações de oitava (homens cantando músicas femininas e vice-versa).
  - Sistema de pontuação: Pontos por nota acertada, multiplicador de Combo, notas douradas (Golden Notes), classificação final (S+, A, B, C, F).

---

### 💻 Módulo 4: UI/UX & Player do Karaoke (Frontend & Visuals)
- **Interface Estilo UltraStar/Modern Web**:
  - **Piano Roll Visualizador**: Barra de rolagem temporal exibindo as notas esperadas e a linha de afinação do usuário se movendo ao vivo.
  - **Letras Animadas**: Destaque estilo letreiro de karaoke (glow/fill progressivo).
  - **Visualizador de Espectro/Pitch**: Feedback visual instantâneo ("Muito agudo", "Perfeito!", "Muito grave").
  - **Painel de Resultados**: Dashboard de performance no final da música com gráfico de precisão ao longo do tempo e pontuação máxima.
- **Design System Premium**:
  - Modo escuro cyberpunk/neon karaoke.
  - Efeitos de glassmorphism, micro-animações fluidas e design responsivo.

---

## 3. Arquitetura Tecnológica Desejada

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **Runtime & Servidor** | **Bun** | Execução ultra-rápida de scripts, pacotes e runtime TypeScript |
| **Backend API Framework** | **Elysia.js** | Framework web veloz no Bun para rotas de áudio, busca de letras e gerenciamento de sessões |
| **Banco de Dados & Storage** | **Supabase / MongoDB** | Armazenamento de pontuações (Leaderboard), histórico de partidas e metadados de faixas |
| **Frontend Framework** | **React + Vite** (TypeScript) | Interface rica de alta performance para renderização Canvas/WebAudio |
| **Gerenciamento de Estado & Data Fetching** | **TanStack Query (v5)** | Fetching e cache para busca de músicas, letras do LrcLib e status do pipeline |
| **Detecção de Pitch** | **Pitchy** | Biblioteca TypeScript/JS para cálculo do pitch do microfone e da voz isolada |
| **Fontes de Referência** | **USDX / UVR / Demucs / LrcLib** | Lógica inspirada nos repositórios para scoring, separação de voz e letras sincronizadas |

---

## 4. Próximos Passos de Implementação

1. **Configuração da Estrutura Inicial**: Projeto Monorepo/Vite + Elysia com Bun.
2. **Implementação da API Elysia**: Endpoints para pesquisa na LrcLib, download/simulação de áudio e pré-processamento.
3. **Desenvolvimento do Motor WebAudio + Pitchy**: Algoritmo no navegador para ler o microfone e calcular notas MIDI ao vivo.
4. **Construção do Canvas Player (Estilo UltraStar)**: Renderização das notas, linha de tempo e barra de progresso da música.
5. **Validação & Ajustes Fine-Tuning**: Testes com faixas demo e validação da pontuação.
