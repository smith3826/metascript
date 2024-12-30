import nltk
from nltk.corpus import cmudict
import json

nltk.download('cmudict')

# ARPAbet to IPA mapping
arpa_to_ipa = {
    'AA': 'ɑ',
    'AE': 'æ',
    'AH': 'ʌ',
    'AO': 'ɔ',
    'AW': 'aʊ',
    'AY': 'aɪ',
    'B': 'b',
    'CH': 'tʃ',
    'D': 'd',
    'DH': 'ð',
    'EH': 'ɛ',
    'ER': 'ər',
    'EY': 'eɪ',
    'F': 'f',
    'G': 'g',
    'HH': 'h',
    'IH': 'ɪ',
    'IY': 'i',
    'JH': 'dʒ',
    'K': 'k',
    'L': 'l',
    'M': 'm',
    'N': 'n',
    'NG': 'ŋ',
    'OW': 'oʊ',
    'OY': 'ɔɪ',
    'P': 'p',
    'R': 'r',
    'S': 's',
    'SH': 'ʃ',
    'T': 't',
    'TH': 'θ',
    'UH': 'ʊ',
    'UW': 'u',
    'V': 'v',
    'W': 'w',
    'Y': 'j',
    'Z': 'z',
    'ZH': 'ʒ'
}

def convert_to_ipa(arpa_pronunciation):
    ipa = ''
    for phone in arpa_pronunciation:
        base_phone = ''.join([c for c in phone if not c.isdigit()])
        if base_phone in arpa_to_ipa:
            ipa += arpa_to_ipa[base_phone]
    return ipa

# Generate complete dictionary
d = cmudict.dict()
ipa_dictionary = {}

for word, pronunciations in d.items():
    ipa_dictionary[word] = convert_to_ipa(pronunciations[0])

# Save to JSON
with open('public/ipa_dictionary.json', 'w', encoding='utf-8') as f:
    json.dump(ipa_dictionary, f, ensure_ascii=False)