'use client';

import { useState } from 'react';
import dictionary from '../../public/ipa_dictionary.json';

export default function Home() {
  const [inputWord, setInputWord] = useState('');
  const [phoneticResult, setPhoneticResult] = useState('');
  const [result, setResult] = useState('');

  const phoneticMap: { [key: string]: string } = {
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
    if (!inputWord) return;

    // Split input into words
    const words = inputWord.toLowerCase().split(' ');
    const allPhonetics = [];
    const allResults = [];

    for (const word of words) {
      // Get IPA for each word
      const phoneticValue = (dictionary as { [key: string]: string })[word] || 'Word not found';
      allPhonetics.push(phoneticValue);
      
      if (phoneticValue !== 'Word not found') {
        const sortedKeys = Object.keys(phoneticMap).sort((a, b) => b.length - a.length);
        let transformed = phoneticValue;
        const processedIndices = new Set();
        
        for (const from of sortedKeys) {
          let match;
          const regex = new RegExp(from, 'g');
          
          while ((match = regex.exec(transformed)) !== null) {
            if (!processedIndices.has(match.index)) {
              const before = transformed.slice(0, match.index);
              const after = transformed.slice(match.index + from.length);
              transformed = before + phoneticMap[from] + after;
              
              for (let i = match.index; i < match.index + from.length; i++) {
                processedIndices.add(i);
              }
            }
          }
        }
        allResults.push(transformed);
      } else {
        allResults.push('Word not found');
      }
    }

    setPhoneticResult(allPhonetics.join(' '));
    setResult(allResults.join(' '));
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
