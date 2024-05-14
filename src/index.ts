import {
  uploadCrowdinGlossary,
  uploadDeeplGlossary,
  getGlossaryEntires,
} from "./uploadGlossary";
import { validateEnv } from "./utils/validateEnv";
import * as deepl from "deepl-node";

import { join } from "path";

import * as fs from "fs";

type langKeys = "en" | "zh-CN" | "ru" | "ko" | "pl" | "uk";

(async () => {
  validateEnv();
  var readDirFiles = fs
    .readdirSync(process.cwd() + "/glossaries")
    .filter(
      (fileName) => fileName.includes(".csv") && !fileName.includes("test")
    );

  const sourceLang = "en";
  // const targetLangs = ["zh-CN", "ru", "ko", "pl", "uk"];
  // deepl is not support uk yet
  const targetLangs = ["zh-CN", "ru", "ko", "pl"];

  targetLangs.forEach((targetLang) => {
    Promise.all(
      readDirFiles.map((fileName) =>
        getGlossaryEntires(
          sourceLang,
          targetLang as langKeys,
          join(process.cwd() + `/glossaries/${fileName}`)
        )
      )
    ).then((totalEntires) => {
      const totalEntiresObj = totalEntires.reduce(
        (a: any, b: any) => ({ ...a, ...b }),
        {}
      );

      uploadDeeplGlossary(
        `${sourceLang} to ${targetLang} glossary`,
        sourceLang,
        (targetLang === "zh-CN" ? "zh" : targetLang) as deepl.LanguageCode,
        totalEntiresObj as Record<string, string>
      );
    });
  });

  readDirFiles.forEach((fileName: string) => {
    const targetFileName = join(process.cwd() + `/glossaries/${fileName}`);
    const fileContent = fs.readFileSync(targetFileName, "utf-8");
    // ['en', 'zh-CN', 'ru', 'ko', 'pl', 'uk'],
    const schema = {
      term_en: 0,
      description_en: 1,
      "term_zh-CN": 2,
      term_ru: 3,
      term_ko: 4,
      term_pl: 5,
      term_uk: 6,
    };
    uploadCrowdinGlossary(
      "en",
      `TownSquare-${fileName?.replace(".csv", "")}-i18n-Glossary`,
      fileName,
      fileContent,
      schema
    );
  });
})();
