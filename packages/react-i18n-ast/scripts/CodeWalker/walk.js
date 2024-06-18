import path from "path";
import fs from "fs";
import {getCodeWalker} from "./CodeWalker.js";

const args = process.argv.slice(2);

const dir = args[0] || 'src';
const chineseCollections = []

const walk = (dir, parentRoute, deep) => {
    if (deep >= 2) {
        return
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath, path.join(parentRoute, file), deep + 1);
        } else if (/\.(tsx|jsx)$/.test(file)) {
            const path = parentRoute + '/' + file;

            const codeWalker = getCodeWalker(path, false);
            codeWalker.use({
                run({config}) {
                    config.chineseCollections && chineseCollections.push({
                        path,
                        collections: config.chineseCollections
                    })
                }
            });
        }
    });
}

walk(dir, dir, 0);
console.log("🚀  chineseCollections", chineseCollections)
fs.writeFileSync("public/locales/zh/translation.json", JSON.stringify(chineseCollections, null, 2), 'utf8');