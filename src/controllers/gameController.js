const crypto = require("crypto");
const wordList = require("../utils/wordList");
const Game = require("../models/gameModel");

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = crypto.randomBytes(16);

let currentGame = null;

const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const decrypt = (text) => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.startGame = (req, res) => {
  const fiveLetterWords = wordList.filter((word) => word.length === 5);
  const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
  const word = fiveLetterWords[randomIndex];
  const encryptedWord = encrypt(word);
  currentGame = new Game(word);
  const encryptedAttempts = encrypt(currentGame.attempts.toString());
  res.cookie("word", JSON.stringify(encryptedWord), {
    httpOnly: false,
    sameSite: "None",
    domain: req.hostname,
    secure: true,
  });
  res.cookie("attempts", JSON.stringify(encryptedAttempts), {
    httpOnly: false,
    domain: req.hostname,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Game started", domain: req.hostname });
};

exports.guessWord = (req, res) => {
  const toAttempt = "raios";
  const { word } = req.body;

  const currentGame = new Game(toAttempt);
  currentGame.attempts = parseInt(attempts);

  if (!word || word.length !== 5) {
    return res
      .status(400)
      .json({ message: "Invalid word length, please provide a 5-letter word" });
  }

  const result = currentGame.guess(word);
  if (attempts > 6) {
    return res.status(400).json({ message: "No attempts left" });
  }

  // Atualiza a quantidade de tentativas no cookie
  // const updatedAttempts = encrypt(currentGame.attempts.toString());
  // res.cookie('attempts', JSON.stringify(updatedAttempts), { httpOnly: true });

  res.status(200).json(result);
};
