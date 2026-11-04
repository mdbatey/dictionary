import type { Language } from '../model';
import { koreanSwitchboards } from './korean-switchboards';
import { koreanWords } from './korean-words';

// Moved over as-is from reference/breakdowns/korean-13-sentences.html ("Korean in 13 Sentences"),
// renamed "The Korean Dozen" to match the other Sets. Intended changes only: site-wide colours,
// Phrase Types instead of the old box colours 1-5, and Markdown instead of HTML.
export const korean: Language = {
  id: 'ko',
  nativeName: '한국어',
  name: 'Korean',
  tag: 'ko',
  roles: {
    pronoun: { rule: "I, he, she, it. Korean drops these whenever context makes them clear." },
    noun: { rule: "A thing, person or place. Particles attach right after it." },
    time: { rule: "Words like 내일 (tomorrow) usually need no particle and sit near the front." },
    topic: { rule: "Marks what the sentence is about. 는 after a vowel, 은 after a consonant." },
    subject: { rule: "Marks the subject, often new or emphasized. 가 after a vowel, 이 after a consonant." },
    object: { rule: "Marks the direct object (the thing given, eaten). 를 after a vowel, 을 after a consonant." },
    recipient: { rule: "에게 means 'to' a person or animal. 한테 is the casual spoken version." },
    possessive: { label: "Possessive marker", rule: "의 works like English 's. It's usually pronounced 'e', not 'ui'." },
    plural: { rule: "들 makes a noun plural. It's optional and often left out when context makes the number clear." },
    verb: { label: "Verb / adjective stem", rule: "The dictionary form with -다 removed. Adjectives like 'red' conjugate exactly like verbs." },
    copula: { rule: "이에요 after a consonant, 예요 after a vowel. Attaches straight onto a noun." },
    connect: { rule: "Links the main verb to a helper verb that adds meaning, like 'want to' or 'must'." },
    negation: { rule: "Sits right before the verb. 못 = can't (unable). 안 = don't (choose not to)." },
    tense: { rule: "았/었 marks past. ㄹ 거 marks future. They slot in before the ending." },
    informal: { rule: "-아 after ㅏ/ㅗ stems, -어 after the rest. On its own this is casual speech." },
    polite: { rule: "요 on the end makes it informal polite, the safe default with most people." },
  },
  pronunciationSystems: [
    { id: 'rom', label: 'Romanization' },
    { id: 'rr', label: 'Revised Romanization' },
    { id: 'ipa', label: 'IPA' },
  ],
  defaultPronunciation: 'rom',
  sets: [
    {
      id: 'korean-dozen',
      name: 'The Korean Dozen',
      sentences: [
        {
          id: '1',
          translation: "The apple is red.",
          explanation: "Adjectives act like verbs, so 'is red' is one word. There are no articles, so no word for 'the'. The sentence ends with the verb.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "가", pron: { rom: "-ga" }, gloss: "subj", role: 'subject' },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "빨개", pron: { rom: "ppal-gae" }, gloss: "red", role: 'verb', note: "빨갛다 'to be red'. It's ㅎ-irregular: 빨갛 + 아 becomes 빨개." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '2',
          translation: "It is John's apple.",
          explanation: "Possession works like English: owner + 의 + thing. 'Is' is the copula, glued directly onto the noun.",
          parts: [
            { type: 'subject', caption: "topic", pieces: [
              { script: "그것", pron: { rom: "geu-geos" }, gloss: "it", role: 'pronoun', note: "In speech 그것은 usually contracts to 그건 (geu-geon)." },
              { script: "은", pron: { rom: "-eun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'modifier', caption: "owner", pieces: [
              { script: "존", pron: { rom: "jon" }, gloss: "John", role: 'noun' },
              { script: "의", pron: { rom: "-ui" }, gloss: "'s", role: 'possessive' },
            ] },
            { type: 'verb-phrase', caption: "apple + is", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "예요", pron: { rom: "-ye-yo" }, gloss: "is", role: 'copula', note: "사과 ends in a vowel, so the copula is 예요, not 이에요." },
            ] },
            ".",
          ],
        },
        {
          id: '3',
          translation: "I give John the apple.",
          explanation: "Giving uses two particles. 에게 marks who receives, 를 marks what is given. Their order can swap, because the particles carry the meaning.",
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "존", pron: { rom: "jon" }, gloss: "John", role: 'noun' },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "를", pron: { rom: "-leul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "줘", pron: { rom: "jwo" }, gloss: "give", role: 'verb', note: "주다 'to give'. 주 + 어 contracts to 줘." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '4',
          translation: "We give him the apple.",
          explanation: "Verbs don't change for person or number. I give, we give, he gives: all 줘요.",
          compareWith: '3',
          parts: [
            { type: 'subject', caption: "we (topic)", pieces: [
              { script: "우리", pron: { rom: "u-li" }, gloss: "we", role: 'pronoun', note: "Changed from 나 (I). The verb 줘요 stays the same.", changed: true },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "그", pron: { rom: "geu" }, gloss: "he", role: 'pronoun', note: "그 for 'he' is mostly written. In speech people say 그 사람 (that person) or use the name." },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "를", pron: { rom: "-leul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "줘", pron: { rom: "jwo" }, gloss: "give", role: 'verb', note: "주다 'to give'. 주 + 어 contracts to 줘." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '5',
          translation: "He gives it to John.",
          explanation: "'It' is a full noun phrase (그것 + 을) that takes a particle like any other object.",
          parts: [
            { type: 'subject', caption: "he (topic)", pieces: [
              { script: "그", pron: { rom: "geu" }, gloss: "he", role: 'pronoun', note: "Mostly written. In speech: 그 사람 or the person's name." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "그것", pron: { rom: "geu-geos" }, gloss: "it", role: 'pronoun', note: "Literally 'that thing'. In speech it's often 그거 (geu-geo)." },
              { script: "을", pron: { rom: "-eul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "존", pron: { rom: "jon" }, gloss: "John", role: 'noun' },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "줘", pron: { rom: "jwo" }, gloss: "give", role: 'verb', note: "주다 'to give'. 주 + 어 contracts to 줘." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '6',
          translation: "She gives it to him.",
          explanation: "Pronouns don't change form for subject or object (he/him, she/her). Only the particle changes: 그는 vs 그에게.",
          compareWith: '5',
          parts: [
            { type: 'subject', caption: "she (topic)", pieces: [
              { script: "그녀", pron: { rom: "geu-nyeo" }, gloss: "she", role: 'pronoun' },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "그것", pron: { rom: "geu-geos" }, gloss: "it", role: 'pronoun', note: "Literally 'that thing'. In speech it's often 그거 (geu-geo)." },
              { script: "을", pron: { rom: "-eul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "그", pron: { rom: "geu" }, gloss: "he", role: 'pronoun', note: "그 for 'he' is mostly written. In speech people say 그 사람 (that person) or use the name." },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "줘", pron: { rom: "jwo" }, gloss: "give", role: 'verb', note: "주다 'to give'. 주 + 어 contracts to 줘." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '7',
          translation: "Is the apple red?",
          explanation: "In informal polite speech a yes/no question has the same form as the statement. You just raise your voice at the end.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "가", pron: { rom: "-ga" }, gloss: "subj", role: 'subject' },
            ] },
            { type: 'verb-phrase', caption: "is red?", pieces: [
              { script: "빨개", pron: { rom: "ppal-gae" }, gloss: "red", role: 'verb' },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite', note: "Same word as the statement. Only the rising voice and the ? make it a question.", changed: true },
            ] },
            "?",
          ],
        },
        {
          id: '8',
          translation: "The apples are red.",
          explanation: "Plural is optional and marked with 들. The verb doesn't change. Adding 들 also switched 가 to 이, because 들 ends in a consonant.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "들", pron: { rom: "-deul" }, gloss: "pl.", role: 'plural', note: "Added. Without 들 the sentence still works and could mean one apple or many.", changed: true },
              { script: "이", pron: { rom: "-i" }, gloss: "subj", role: 'subject', note: "들 ends in a consonant, so the subject marker switches from 가 to 이." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "빨개", pron: { rom: "ppal-gae" }, gloss: "red", role: 'verb', note: "빨갛다 'to be red'. It's ㅎ-irregular: 빨갛 + 아 becomes 빨개." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '9',
          translation: "I must give it to him.",
          explanation: "Helper meanings like 'must' come after the main verb, not before it. The main verb takes a connecting ending (-야), then 하다 carries the tense and politeness.",
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "그것", pron: { rom: "geu-geos" }, gloss: "it", role: 'pronoun', note: "Literally 'that thing'. In speech it's often 그거 (geu-geo)." },
              { script: "을", pron: { rom: "-eul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "그", pron: { rom: "geu" }, gloss: "he", role: 'pronoun', note: "그 for 'he' is mostly written. In speech people say 그 사람 (that person) or use the name." },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'verb-phrase', caption: "must give", pieces: [
              { script: "줘", pron: { rom: "jwo" }, gloss: "give", role: 'verb' },
              { script: "야", pron: { rom: "-ya" }, gloss: "must", role: 'connect', note: "-어야/-아야 + 하다 = 'must'. Literally 'only if I give, it does'." },
              { script: "해", pron: { rom: "hae" }, gloss: "do", role: 'verb', note: "하다 'to do' acts as the helper verb here. 하 + 여 contracts to 해." },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '10',
          translation: "I want to give it to her.",
          explanation: "Same pattern as 'must': main verb + connector + helper verb. Only the connector and the helper change (-고 싶다 instead of -야 하다).",
          compareWith: '9',
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "the thing given", pieces: [
              { script: "그것", pron: { rom: "geu-geos" }, gloss: "it", role: 'pronoun', note: "Literally 'that thing'. In speech it's often 그거 (geu-geo)." },
              { script: "을", pron: { rom: "-eul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'indirect-object', caption: "recipient", pieces: [
              { script: "그녀", pron: { rom: "geu-nyeo" }, gloss: "she", role: 'pronoun', note: "Like 그, 그녀 is mostly written Korean." },
              { script: "에게", pron: { rom: "-e-ge" }, gloss: "to", role: 'recipient' },
            ] },
            { type: 'verb-phrase', caption: "want to give", pieces: [
              { script: "주", pron: { rom: "ju" }, gloss: "give", role: 'verb' },
              { script: "고", pron: { rom: "-go" }, gloss: "", role: 'connect', note: "-고 싶다 = 'want to ~'. The main verb keeps its bare stem 주." },
              { script: "싶", pron: { rom: "sip" }, gloss: "want", role: 'verb' },
              { script: "어", pron: { rom: "-eo" }, gloss: "inf", role: 'informal' },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '11',
          translation: "I'm going to know tomorrow.",
          explanation: "The future is a pattern, not an ending: stem + ㄹ 거예요. Time words like 내일 sit near the front and need no particle. A closer match to 'come to know' is 알게 될 거예요.",
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'modifier', caption: "when", pieces: [
              { script: "내일", pron: { rom: "nae-il" }, gloss: "tomorrow", role: 'time' },
            ] },
            { type: 'verb-phrase', caption: "will know", pieces: [
              { script: "알", pron: { rom: "al" }, gloss: "know", role: 'verb', note: "알다 'to know'. The stem already ends in ㄹ, so the future ㄹ merges into it." },
              { script: "거", pron: { rom: "geo" }, gloss: "will", role: 'tense', note: "-(으)ㄹ 거예요 is the everyday future. Literally 'it's the thing that will ~'." },
              { script: "예요", pron: { rom: "-ye-yo" }, gloss: "is", role: 'copula' },
            ] },
            ".",
          ],
        },
        {
          id: '12',
          translation: "I can't eat the apple.",
          explanation: "Negation goes right before the verb. Korean splits 'not' in two: 못 for can't and 안 for won't.",
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "thing eaten", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "를", pron: { rom: "-leul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'verb-phrase', caption: "can't eat", pieces: [
              { script: "못", pron: { rom: "mot" }, gloss: "can't", role: 'negation', note: "Placed right before the verb. Swap in 안 (an) and it means 'don't / won't eat'.", changed: true },
              { script: "먹", pron: { rom: "meog" }, gloss: "eat", role: 'verb', note: "먹다 'to eat'. Its vowel is ㅓ, so it takes -어." },
              { script: "어", pron: { rom: "-eo" }, gloss: "inf", role: 'informal' },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
        {
          id: '13',
          translation: "I have eaten the apple.",
          explanation: "There's no separate perfect tense. 'I ate' and 'I have eaten' are both 먹었어요.",
          compareWith: '12',
          parts: [
            { type: 'subject', caption: "I (topic)", pieces: [
              { script: "나", pron: { rom: "na" }, gloss: "I", role: 'pronoun', note: "With -요 endings, many speakers use the humbler 저 (jeo) instead of 나." },
              { script: "는", pron: { rom: "-neun" }, gloss: "topic", role: 'topic' },
            ] },
            { type: 'object', caption: "thing eaten", pieces: [
              { script: "사과", pron: { rom: "sa-gwa" }, gloss: "apple", role: 'noun' },
              { script: "를", pron: { rom: "-leul" }, gloss: "d.o.", role: 'object' },
            ] },
            { type: 'verb-phrase', caption: "ate", pieces: [
              { script: "먹", pron: { rom: "meog" }, gloss: "eat", role: 'verb' },
              { script: "었", pron: { rom: "-eoss" }, gloss: "past", role: 'tense', note: "Slotted in before the ending. 먹 has ㅓ, so it's 었, not 았.", changed: true },
              { script: "어", pron: { rom: "-eo" }, gloss: "inf", role: 'informal' },
              { script: "요", pron: { rom: "-yo" }, gloss: "pol", role: 'polite' },
            ] },
            ".",
          ],
        },
      ],
      summary: [
        { text: "Word order is subject, object, verb, and the verb always comes last.", sentences: ["1", "3"] },
        { text: "Particles mark each noun's job, so the nouns can move around while the verb stays last.", sentences: ["3"] },
        { text: "There are no articles. Plural 들 is optional.", sentences: ["1", "8"] },
        { text: "Verbs don't change for I / we / he. Pronouns don't change for he / him either. Only the particle changes.", sentences: ["4", "6"] },
        { text: "Adjectives are verbs, so 'is red' is one conjugated word.", sentences: ["1"] },
        { text: "Questions use the statement form with a rising voice.", sentences: ["7"] },
        { text: "'Must' and 'want to' are helper verbs that come after the main verb.", sentences: ["9", "10"] },
        { text: "Tense is marked inside the verb: 었 for past, ㄹ 거예요 for future. There's no separate perfect.", sentences: ["11", "13"] },
        { text: "Negation sits right before the verb: 못 means can't, 안 means won't.", sentences: ["12"] },
      ],
    },
  ],
  words: koreanWords,
  switchboards: koreanSwitchboards,
};
