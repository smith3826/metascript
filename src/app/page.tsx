'use client';

import React, { useState } from 'react';
import { Download, Book, Sparkles, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Types
interface Dictionary {
  [key: string]: string;
}

interface PhoneticMap {
  [key: string]: string;
}

interface FileSystem {
  readFile(path: string, options?: { encoding?: string }): Promise<Uint8Array | string>;
}

declare global {
  interface Window {
    fs: FileSystem;
  }
}

const dictionary: Dictionary = {}; // Import your dictionary here

export default function Home() {
  const [inputWord, setInputWord] = useState('');
  const [phoneticResult, setPhoneticResult] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const phoneticMap: PhoneticMap = {
    'p': 'p', 'b': 'B', 't': 'T', 'd': 'd', 'k': 'K',
    'g': 'g', 'm': 'm', 'n': 'N', 'ŋ': 'n', 'tʃ': 'c',
    'dʒ': 'J', 'f': 'Φ', 'v': 'v', 'θ': 'θ', 'ð': 'Ð',
    's': 's', 'z': 'z', 'ʃ': 'ʃ', 'ʒ': 'ʒ', 'h': 'h',
    'w': 'w', 'j': 'Y', 'r': 'R', 'l': 'L', 'i': 'E',
    'ɪ': 'i', 'e': 'A', 'ɛ': 'e', 'æ': 'a', 'ʌ': 'u',
    'ə': 'u', 'u': 'y', 'ʊ': 'ʊ', 'oʊ': 'O', 'ɔ': 'ɔ',
    'ɑ': 'ɔ', 'aɪ': 'I', 'aʊ': 'aw', 'ɔɪ': 'OY', 'ʔ': 'ʔ',
    'ər': 'r', 'eɪ': 'A'
  };

  const transformWord = () => {
    if (!inputWord) return;
    setIsLoading(true);

    try {
      const words = inputWord.toLowerCase().split(' ');
      const allPhonetics = [];
      const allResults = [];

      for (const word of words) {
        const phoneticValue = dictionary[word] || '?';
        allPhonetics.push(phoneticValue);
        
        if (phoneticValue !== '?') {
          const sortedKeys = Object.keys(phoneticMap).sort((a, b) => b.length - a.length);
          let transformed = phoneticValue;
          let currentIndex = 0;
          
          while (currentIndex < transformed.length) {
            let matchFound = false;
            
            for (const from of sortedKeys) {
              if (transformed.slice(currentIndex).startsWith(from)) {
                transformed = 
                  transformed.slice(0, currentIndex) + 
                  phoneticMap[from] + 
                  transformed.slice(currentIndex + from.length);
                currentIndex += phoneticMap[from].length;
                matchFound = true;
                break;
              }
            }
            
            if (!matchFound) currentIndex++;
          }
          
          allResults.push(transformed);
        } else {
          allResults.push('?');
        }
      }

      setPhoneticResult(allPhonetics.join(' '));
      setResult(allResults.join(' '));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadGuide = async () => {
    try {
      const response = await window.fs.readFile('guide.docx');
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meta-script-guide.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading guide:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Meta Script
            </h1>
            <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium border border-blue-500/20">
              BETA
            </span>
          </div>
          <p className="text-blue-300/80 text-lg font-light">
            Transform English into its purest form
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Transcriber</CardTitle>
              <CardDescription className="text-blue-300/70">
                Enter text to convert it to Meta Script notation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && transformWord()}
                    placeholder="Type any word..."
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                  />
                  <Button 
                    onClick={transformWord}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Convert'
                    )}
                  </Button>
                </div>

                {result && (
                  <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-blue-300/70 mb-2">IPA Notation</p>
                      <p className="text-white text-lg font-mono">{phoneticResult}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-blue-300/70 mb-2">Meta Script</p>
                      <div className="text-white text-2xl font-mono tracking-wide">
                        {result.split('').map((char, index) => (
                          <span 
                            key={index} 
                            className={`inline-block ${
                              /[A-Z]/.test(char) ? 'text-blue-400 text-3xl' : ''
                            }`}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Resources</CardTitle>
              <CardDescription className="text-blue-300/70">
                Learn more about Meta Script notation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Book className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-medium">User Guide</h3>
                    </div>
                    <Button
                      className="border-blue-500/20 hover:border-blue-500/40 text-blue-400"
                      onClick={handleDownloadGuide}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-sm text-blue-300/70">
                    Comprehensive guide explaining Meta Script notation, 
                    including examples and best practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}