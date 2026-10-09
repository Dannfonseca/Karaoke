import { Song, NoteSpan, LrcLine } from '../../src/types/karaoke';
import { parseLrcString } from './lrclib';

// Pre-built high quality demo songs with LRC lyrics & melodic pitch spans
export const DEMO_SONGS: Song[] = [
  {
    id: 'demo-evidencias',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    album: 'Cowboy do Asfalto',
    duration: 120,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-melody-112398.mp3', // Synth playback demo
    isDemo: true,
    ...parseLrcString(`
[00:05.00]Quando eu digo que não quero mais você
[00:09.50]É porque eu te quero
[00:14.00]Eu finjo que não posso mais viver sem o teu amor
[00:20.00]E digo que não ligo, mas eu me desespero
[00:27.00]Nessa loucura de dizer que não te quero
[00:32.00]Vou negando as aparências
[00:36.50]Disfarçando as evidências
[00:41.00]Mas pra que viver fingindo
[00:45.50]Se eu não posso enganar meu coração?
[00:51.00]Eu sei que te amo!
[00:55.00]Chega de mentiras, de me negar os meus desejos
[01:01.00]Eu te quero mais que tudo, eu preciso do seu beijo!
`),
  },
  {
    id: 'demo-blinding-lights',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 110,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73373.mp3?filename=synthwave-80s-110045.mp3', // Synthwave demo track
    isDemo: true,
    ...parseLrcString(`
[00:04.00]I've been tryna call
[00:07.50]I've been on my own for long enough
[00:12.00]Maybe you can show me how to love, maybe
[00:18.00]I'm going through withdrawals
[00:22.00]You don't even have to do too much
[00:26.50]You can turn me on with just a touch, baby
[00:32.00]I look around and Sin City's cold and empty
[00:37.00]No one's around to judge me
[00:41.00]I can't see clearly when you're gone
[00:46.00]I said, ooh, I'm blinded by the lights
[00:52.00]No, I can't sleep until I feel your touch!
`),
  },
  {
    id: 'demo-bohemian-rhapsody',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 130,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=epic-rock-10384.mp3',
    isDemo: true,
    ...parseLrcString(`
[00:03.00]Is this the real life? Is this just fantasy?
[00:09.00]Caught in a landslide, no escape from reality
[00:16.00]Open your eyes, look up to the skies and see
[00:23.00]I'm just a poor boy, I need no sympathy
[00:29.00]Because I'm easy come, easy go, little high, little low
[00:36.00]Any way the wind blows doesn't really matter to me
[00:43.00]Mama, just killed a man
[00:48.00]Put a gun against his head, pulled my trigger, now he's dead
[00:55.00]Mama, life had just begun
[01:00.00]But now I've gone and thrown it all away!
`),
  },
];
