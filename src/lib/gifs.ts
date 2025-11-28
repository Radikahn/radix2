const TOAST_GIFS = [
    "https://c.tenor.com/G2TWpYRPBmsAAAAd/baklang-aso-rikithewor-id.gif", // Bee Dog.
    "https://media.tenor.com/BuSEbkm9aAIAAAAj/hi-otag.gif", // Cat Hello.
    "https://media1.tenor.com/m/bGlWD2esQqsAAAAd/dog-silly.gif", // Take-out Dog.
    "https://media1.tenor.com/m/hvFIBvUYL_4AAAAd/shy-xiaopang-xiaopang-dog.gif", // Xiaopang.
    "https://media1.tenor.com/m/nf8ma3H42sUAAAAd/jerry-meme-tom-and-jerry-meme.gif", // Jerry.
    "https://media1.tenor.com/m/zrpyKEyxZGwAAAAd/fat-cat-laser-eyes.gif", // Laser Cat.
    "https://media1.tenor.com/m/GyePVCjO8CUAAAAd/veeunus-dog.gif", // Scared Dog.
    "https://media1.tenor.com/m/3FJyILf2UTkAAAAd/touch-you.gif", // Greg.
    "https://media1.tenor.com/m/IQcYOoTEuXYAAAAd/holy-moly.gif", // Holy Moly.
    "https://media1.tenor.com/m/lSHTHwjvbrUAAAAd/ai-dog.gif", // Dog Dance.
    "https://media1.tenor.com/m/y0nx7OoKImsAAAAd/cat-fade.gif", // Cat Fade.
];

export const getToastGif = () =>
    TOAST_GIFS[Math.floor(Math.random() * TOAST_GIFS.length)];
