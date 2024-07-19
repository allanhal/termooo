function normalizeWord(word) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

class Game {
  constructor(word) {
    this.word = word;
    this.attempts = 6;
    this.guessedWords = [];
  }

  guess(word) {
    if (this.attempts > 0 && !this.guessedWords.includes(word)) {
      this.guessedWords.push(word);
      this.attempts--;
      return this.checkWord(word);
    }
    return null;
  }

  checkWord(word) {
    const normalizedInput = normalizeWord(word);
    const normalizedWord = normalizeWord(this.word);

    if (normalizedInput === normalizedWord) {
      return { status: 'correct', word: this.word };
    }

    let result = [];
    for (let i = 0; i < normalizedInput.length; i++) {
      if (normalizedInput[i] === normalizedWord[i]) {
        result.push({ letter: word[i], status: 'correct' });
      } else if (normalizedWord.includes(normalizedInput[i])) {
        result.push({ letter: word[i], status: 'present' });
      } else {
        result.push({ letter: word[i], status: 'absent' });
      }
    }
    return result;
  }
}

module.exports = Game;
