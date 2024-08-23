 
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;


///////////////////


module.exports = { session: process.env.SESSION_ID || 'Byte;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV012Mno2UG84TmZnbTBIb0Y0Y0JrYm5wcFFrc1ZXS09keU5sRVZJU1Ixcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibm1OYWZ3NlVkQlZGUlQxbVVjRkEwZ2tBWE5ZVWpQMFJobDFheVQ3T1htST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlTmNudnMwQUduVlU2dGtlWVN5QnhQdm9sbUZ3VEtUMUdCZy9WTURWdFhrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0YmxrZ05RTWY2T3ZaMUhaMmdaY3pvVGttMXBKcmttejJZeGJ0R3JUNG5FPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhDSm4xUE1JTlBBeWk3YkNHT05sR3Fwa3NGN05EOWFSNUo4Ri9FdjBSM2s9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFCbDVDc0VYY0pGU3ZBalpJUm5aVkNOMmpzRmp2U2hWTU5Kem56Yjlxbkk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUtseHQwYnJnMThveVYxKzFuQnhxYjFaV2pTQmVudTFNZXE5TlpPOGUzMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibjk5Vi9IZzQ5OXBaRXUrWk8ySEQwS2N3Z3ArU1FkY2FLRkJOU1JOQlJHND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZCUGVHMTEzUklWekREOGc5Ulo5bDJjUHdwVlA1VWlXY0ZkdC9QNFQ1R3pCUy91UUViQzJxRmlaeUdCbnNNNkNjdEl1bUhwTVoyUUJXVCt0c2hBRmdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjEyLCJhZHZTZWNyZXRLZXkiOiI3V1h5b1E2aTArc1Z3TFcyaDRZZVcyRnRhemEzRDZJM0YxbG1qQkE1WU9FPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIwbjFlRW5rbVRoT0hHMnN4WUt4MWtnIiwicGhvbmVJZCI6ImFhYmQ5ZTNmLTFhNjMtNDk4Mi1hOWM0LWZmMzdmNDkyMjUzZiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0UGh5ZTZUTkJqV2Y1ekZSMVBlN29PWEFFdU09In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR05lVlpTM2JzajdTTFpldWJlZXJ0V25PS2RNPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjVCNDJZUUhDIiwibWUiOnsiaWQiOiIyMzQ4MDU3NjI3OTQ2OjVAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiOWphbGF1Z2h0diJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTEQrOE44Q0VJdlBvTFlHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoic0I2Y3BCeWdGTHk2Ui9zZ3c5WlV6d3VQb0JzdStrVUFpdFdlRkFmVEhURT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiUGE2bmZ5RzM1VThPeVhOQU5CTUJtUXN5dTNxdmFNN3Zub3RhM1Z2NlBySVhnTkg1Zm5IVEx1bXpQMVVxdGZvcEEzcmFKcmwrU0s0RzhIYkF1d1ovQXc9PSIsImRldmljZVNpZ25hdHVyZSI6Imk2dzZ3Q2FyRzFaVmtwaHhoaUFjd04zSVhvY2pGamszUEVrSzAvWVhWVG8wa1YxTU5qN0NNWlpWZUlVWEhmZjExWHZURElwcVgyWW5QRW1aKzhNZWlBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODA1NzYyNzk0Njo1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmJBZW5LUWNvQlM4dWtmN0lNUFdWTThMajZBYkx2cEZBSXJWbmhRSDB4MHgifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjQzOTMzNjgsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTlFPIn0=',

////////////////////////////////



    PREFIXE: process.env.PREFIX || ".",



///////////////////////////
    A_REACT : process.env.AUTO_REACTION || 'on',
    CHATBOT: process.env.CHAT_BOT || "off",
    OWNER_NAME: process.env.OWNER_NAME || "9jaLaugh-Bot",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "2348057627946",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || '9jaLaugh Bot',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://raw.githubusercontent.com/HyHamza/HyHamza/main/Images/BYTE-MD-LITE.jpeg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
