import { join } from "path";

import * as fs from "fs";
import axios from "axios";

import crowdin, { GlossariesModel } from "@crowdin/crowdin-api-client";

import * as deepl from "deepl-node";

const csv = require("csv-parser");

axios.interceptors.response.use(
  (res) => {
    return Promise.resolve(res.data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

const { uploadStorageApi, glossariesApi } = new crowdin(
  {
    token: process.env.CROWDIN_API as string,
    // organization: "org",
  },
  { httpClient: axios }
);

export async function uploadCrowdinGlossary(
  languageId: string,
  name: string,
  fileName: string,
  fileContent: string,
  scheme: GlossariesModel.GlossaryFileScheme
): Promise<void> {
  const glossaryList = (await glossariesApi.listGlossaries())?.data;

  const glossary =
    glossaryList?.find((item) => item?.data.name === name)?.data ||
    (await glossariesApi.addGlossary({ languageId, name }))?.data;

  const storage = await uploadStorageApi.addStorage(fileName, fileContent);

  const importGlossary = await glossariesApi.importGlossaryFile(glossary?.id, {
    storageId: storage.data.id,
    scheme,
  });

  let status = importGlossary.data.status;
  while (status !== "finished") {
    const progress = await glossariesApi.checkGlossaryImportStatus(
      glossary.id,
      importGlossary.data.identifier
    );
    status = progress.data.status;
  }
}

export async function uploadDeeplGlossary(
  glossaryName: string,
  sourceLang: deepl.LanguageCode,
  targetLang: deepl.LanguageCode,
  entries?: Record<string, string>
) {
  const translator = new deepl.Translator(process.env.DEEPL_KEY as string);

  let glossaries = await translator?.listGlossaries();
  await Promise.all(
    glossaries
      .filter((glossary) => glossary.name == glossaryName)
      .map((glossary) => translator.deleteGlossary(glossary?.glossaryId))
  );

  const targetEntries = new deepl.GlossaryEntries({
    entries,
  });
  const glossaryEnToDe = await translator.createGlossary(
    glossaryName,
    sourceLang,
    targetLang,
    targetEntries
  );
  glossaries = await translator.listGlossaries();
  console.log("glossaries", glossaries);
  const glossary = glossaries.find((glossary) => glossary.name == glossaryName);
  console.log(
    `Glossary ID: ${glossary?.glossaryId}, source: ${glossary?.sourceLang}, ` +
      `target: ${glossary?.targetLang}, contains ${glossary?.entryCount} entries.`
  );
}

export const getGlossaryEntires = (filePath: string) => {
  const results: any = [];
  return new Promise((res) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header, index }: any) =>
            header.includes("Term:English") ? "Term:English" : header,
        })
      )
      .on("data", (data: any) => results.push(data))
      .on("end", () => {
        const entriesObj: any = {};
        results.forEach((res: any) => {
          entriesObj[res["Term:English"].trim()] = res["Term:English"].trim();
        });
        res(entriesObj);
      });
  });
};
