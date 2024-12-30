'use client';

import { useState } from 'react';
import dictionary from '../../public/ipa_dictionary.json';

export default function Home() {
  const [inputWord, setInputWord] = useState('');
  const [phoneticResult, setPhoneticResult] = useState('');
  const [result, setResult] = useState('');

  const phoneticMap = {
    'p': 'p',
    'b': 'B',
    't': 'T',
    'd': 'd',
    'k': 'K',
    'g': 'g',
    'm': 'm',
    'n': 'N',
    'ŋ': 'n',
    'tʃ': 'c',
    'dʒ': 'J',
    'f': 'Φ',
    'v': 'v',
    'θ': 'θ',
    'ð': 'Ð',
    's': 's',
    'z': 'z',
    'ʃ': 'ʃ',
    'ʒ': 'ʒ',
    'h': 'h',
    'w': 'w',
    'j': 'Y',
    'r': 'R',
    'l': 'L',
    'i': 'E',
    'ɪ': 'i',
    'e': 'A',
    'ɛ': 'e',
    'æ': 'a',
    'ʌ': 'u',
    'ə': 'u',
    'u': 'y',
    'ʊ': 'ʊ',
    'oʊ': 'O',
    'ɔ': 'ɔ',
    'ɑ': 'ɔ',
    'aɪ': 'I',
    'aʊ': 'aw',
    'ɔɪ': 'OY',
    'ʔ': 'ʔ',
    'ər': 'r'
  };

  const transformWord = () => {
    console.log('transformWord', inputWord);

    if (!inputWord) return;

    // 1. Get IPA from dictionary
    const word = inputWord.toLowerCase();
    const phoneticValue = (dictionary as { [key: string]: string })[word] || 'Word not found';
    setPhoneticResult(phoneticValue);
    
    if (phoneticValue !== 'Word not found') {
      // 2. Transform using your mapping
      const sortedKeys = Object.keys(phoneticMap).sort((a, b) => b.length - a.length);
      
      // Start with the phonetic result
      let transformed = phoneticValue;
      
      // Apply each transformation in sequence
      for (const from of sortedKeys) {
        const to = (phoneticMap as { [key: string]: string })[from];
        transformed = transformed.replaceAll(from, to);
      }
      setResult(transformed.toLowerCase());
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Phonetics
        </h1>
        <p className="text-white/90 text-xl font-light tracking-wide mb-12">
          Explore the science of speech sounds
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-xl mx-auto">
          <div className="flex flex-row gap-4">
            <input 
              type="text" 
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Enter a word..."
              className="w-full bg-white/20 text-white rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyUp={(e) => e.key === 'Enter' && transformWord()}
            />
            
            <button 
              onClick={transformWord}
              className="w-fit bg-blue-500 text-white rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Transcribe
            </button>
          </div>
          
          {result && (
            <div className="text-2xl text-white mt-6">
              <div className="mb-2">Phonetic: {phoneticResult}</div>
              <div>Transcription: {result}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
