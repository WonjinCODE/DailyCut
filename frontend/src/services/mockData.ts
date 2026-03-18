import { Content } from '../types';

export const MOCK_POSTERS = [
  'https://image.tmdb.org/t/p/w500/pFlaoHTZbs6YvVpSAVCfwZiy1Ex.jpg',
  'https://image.tmdb.org/t/p/w500/6oom5QYv7ny6vznIbsA6qCq69IR.jpg',
  'https://image.tmdb.org/t/p/w500/7WsyChQZajSspS30j06pQ7D6ouE.jpg',
  'https://image.tmdb.org/t/p/w500/uS9mY76SshfR7NmiC89Y9uO2v19.jpg',
  'https://image.tmdb.org/t/p/w500/vFvAn8K4XNq8KshP44Q0Kz6UAnM.jpg',
  'https://image.tmdb.org/t/p/w500/iiZZuS1fLh6S9q9L7MGMLRv9A7u.jpg',
  'https://image.tmdb.org/t/p/w500/77S99Xp9W3U965YAF9T89vUo9Xv.jpg',
  'https://image.tmdb.org/t/p/w500/7x7WpM3X8kR9P9r8L0Y0Iu3WJ3r.jpg',
];

export const MOCK_CONTENTS: Content[] = [
  { id: '1', title: '너의 이름은.', runtime: 106, platforms: ['netflix', 'tving'], type: 'movie', rating: 8.5, posterUrl: MOCK_POSTERS[0] },
  { id: '2', title: '스파이더맨: 뉴 유니버스', runtime: 117, platforms: ['disneyplus', 'netflix'], type: 'movie', rating: 8.4, posterUrl: MOCK_POSTERS[1] },
  { id: '3', title: '브루클린 나인-나인', runtime: 22, platforms: ['netflix'], type: 'drama', rating: 8.2, posterUrl: MOCK_POSTERS[2] },
  { id: '4', title: '비밀의 숲', runtime: 70, platforms: ['tving', 'netflix'], type: 'drama', rating: 8.6, posterUrl: MOCK_POSTERS[3] },
  { id: '5', title: '라따뚜이', runtime: 111, platforms: ['disneyplus'], type: 'movie', rating: 8.0, posterUrl: MOCK_POSTERS[4] },
  { id: '6', title: '블랙 미러', runtime: 45, platforms: ['netflix'], type: 'drama', rating: 8.8, posterUrl: MOCK_POSTERS[5] },
  { id: '7', title: '미드소마', runtime: 147, platforms: ['wavve', 'tving'], type: 'movie', rating: 7.1, posterUrl: MOCK_POSTERS[6] },
  { id: '8', title: '술꾼도시여자들', runtime: 35, platforms: ['tving'], type: 'drama', rating: 7.9, posterUrl: MOCK_POSTERS[7] },
  { id: '9', title: '기생충', runtime: 132, platforms: ['netflix', 'wavve'], type: 'movie', rating: 8.9, posterUrl: MOCK_POSTERS[0] },
  { id: '10', title: '어벤져스: 엔드게임', runtime: 181, platforms: ['disneyplus'], type: 'movie', rating: 8.4, posterUrl: MOCK_POSTERS[1] },
];
