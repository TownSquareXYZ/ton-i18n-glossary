# TON-i18n-glossary

This repository serves as our single source of truth for the Crowdin and DeepL glossaries. We should no longer be adding terms through the Crowdin interface.

## Editing A Glossary

Glossaries are stored in the `glossaries` directory. Each glossary is a `.csv` file, which is the format Crowdin accepts. To edit a glossary, open the file using your editor of choice. Because these are large files, you might have a better experience with a spreadsheet programme such as OpenOffice.

### Existing Terms

The English form of existing terms is found in the very first column. To add a translation to an existing term, find your language's columns as `Term:<lang>`. The `Term` column is where your translation should go.

### New Terms

If you are adding a new term, you will need to add it in a new row. The English form will need the `Term` and `Description`.

### Important Notes

- The `Description` field cannot contain a `,` character, or any line breaks.

## Creating A Glossary

To add a new glossary to this project, use the `npm run generate` command and pass the name of the glossary. For example, `npm run generate -- nhcarrigan` would create a new CSV template as `glossaries/nhcarrigan.csv`.

This tool will prepare all of the column headers for you so you do not have to manually fill them in, and will include all of our currently supported languages.

Then you can follow the process above to add your terms.

## Glossary Details

| Glossary Name           | Crowdin Project                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| `internet.csv`          | words usually used in internet                                          |
| `program-languages.csv` | all program languages                                                   |
| `ton.csv`               | TON glossary, keep it update                                            |
| `wikics.csv`            | computer science terms in wiki                                          |

## Questions

If you have any questions, feel free to open an issue in our [**repo**](https://github.com/TownSquareXYZ/ton-i18n-glossary/issues/new).
