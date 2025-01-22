'use client';
  
import React, { useState } from 'react';
import { Download, Book, Sparkles, RefreshCw, Chrome, Puzzle, Music } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dictionary from '../../public/json/en_US.json';

export default function Home() {
  const [inputWord, setInputWord] = useState('');
  const [phoneticResult, setPhoneticResult] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ipaToMetaMap: { [key: string]: string } = {
    'ɑ': 'A',
    'æ': 'E',
    'ʌ': 'u',
    'ɔ': 'ɔ',
    'aʊ': 'aU',
    'aɪ': 'aI',
    'b': 'b',
    'tʃ': 'C',
    'd': 'd',
    'ð': 'D',
    'ɛ': 'E',
    'ər': 'R',
    'eɪ': 'eI',
    'f': 'f',
    'g': 'g',
    'h': 'h',
    'ɪ': 'I',
    'i': 'i',
    'dʒ': 'J',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'N',
    'ŋ': 'G',
    'oʊ': 'oU',
    'ɔɪ': 'oI',
    'p': 'p',
    'ɹ': 'R',
    's': 's',
    'ʃ': 'S',
    't': 't',
    'θ': 'T',
    'ʊ': 'U',
    'u': 'u',
    'v': 'v',
    'w': 'w',
    'j': 'y',
    'z': 'z',
    'ʒ': 'Z',
    'ə': 'u'
};

const transformWord = () => {
    if (!inputWord) return;
    
    console.log('Starting word transformation for:', inputWord);
    setIsLoading(true);
    try {
      const words = inputWord.toLowerCase().split(' ');
      const allPhonetics = [];
      const allResults = [];

      for (const word of words) {
        const phoneticValue = (dictionary as { [key: string]: string })[word] || 'Word not found';
        allPhonetics.push(phoneticValue);
        
        if (phoneticValue !== 'Word not found') {
          // Remove stress marks and slashes
          let transformed = phoneticValue.replace(/[ˈˌ\/]/g, '');
          let currentIndex = 0;
          
          // Sort by length to handle multi-character symbols first (like 'dʒ')
          const sortedKeys = Object.keys(ipaToMetaMap).sort((a, b) => b.length - a.length);
          
          while (currentIndex < transformed.length) {
            let matchFound = false;
            
            for (const from of sortedKeys) {
              if (transformed.slice(currentIndex).startsWith(from)) {
                transformed = 
                  transformed.slice(0, currentIndex) + 
                  ipaToMetaMap[from] + 
                  transformed.slice(currentIndex + from.length);
                currentIndex += ipaToMetaMap[from].length;
                matchFound = true;
                break;
              }
            }
            
            if (!matchFound) {
              currentIndex++;
            }
          }
          
          allResults.push(transformed);
        } else {
          allResults.push('Word not found');
        }
      }

      const finalPhonetics = allPhonetics.join(' ');
      const finalResult = allResults.join(' ');
      
      setPhoneticResult(finalPhonetics);
      setResult(finalResult);
    } catch (error) {
      console.error('Error during transformation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadGuide = async () => {
    try {
      // In Next.js, files in the public directory are served from the root URL
      const response = await fetch('/Meta_Script_Beta_.pdf');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Meta Script Guide.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading guide:', error);
      // You might want to add user feedback here
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
        <p className="text-blue-300/80 text-lg font-light mb-4">
          Transform English into its purest form
        </p>
        
        {/* Coming Soon Pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 text-sm px-3 py-1.5 rounded-full border border-blue-500/20">
            <Chrome className="w-4 h-4" />
            <span>Chrome Extension Coming Soon</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 text-sm px-3 py-1.5 rounded-full border border-blue-500/20">
            <Puzzle className="w-4 h-4" />
            <span>Scrabble Pieces in Development</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 text-sm px-3 py-1.5 rounded-full border border-blue-500/20">
            <Music className="w-4 h-4" />
            <span>Alphabet Song Coming Soon</span>
          </div>
        </div>
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
                    <div className="text-white text-2xl font-mono tracking-wide">{result}</div>
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
                    variant="outline"
                    size="sm"
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
