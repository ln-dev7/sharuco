import { getExtensionByName } from '@/constants/languages';
import sdk, { Project } from '@stackblitz/sdk';

import { TemplateName } from '@/types/templatStackblitzName';
import indentCode from './indentCode';

async function embedProject(
  templateName: TemplateName,
  code: string,
  language: string,
  pseudo: string,
  description?: string,
  idCode?: string
) {
  const extension = getExtensionByName(language);
  let files: { [fileName: string]: string } = {};
  switch (templateName) {
    case 'angular-cli':
      files = {
        'index.html': `<div id="app"></div>`,
        'main.ts': `console.log("Angular app")`,
        [`main${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'create-react-app':
      files = {
        'index.html': `<div id="root"></div>`,
        'index.js': `console.log("React app")`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'html':
      files = {
        'index.html': `<div>Hello, HTML!</div>`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'javascript':
      files = {
        'index.html': `<div id="app"></div>`,
        'index.js': `console.log("Hello, JavaScript!")`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'typescript':
      files = {
        'index.html': `<div id="app"></div>`,
        'index.ts': `console.log("Hello, Typescript!")`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'vue':
      files = {
        'public/index.html': `<div id="app"></div>`,
        'src/main.js': `console.log("Hello, JavaScript!")`,
        [`src/main${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'node':
      files = {
        'index.js': `console.log("Hello, Node!")`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    case 'polymer':
      files = {
        'index.html': `<div id="app"></div>`,
        [`index${extension}`]: `${indentCode(code)}`,
      };
      break;
    default:
      // Cas par défaut si le templateName n'est pas reconnu
      console.error('Template not recognized');
      return;
  }

  const descriptionDefault = 'Test your code online with Stackblitz';
  const idCodeDefault = 'stackblitz';

  sdk.embedProject(
    'embed-stackblitz',
    {
      title: `${pseudo} - code : ${idCode || idCodeDefault}`,
      description: description || descriptionDefault,
      template: templateName,
      files: files,
      settings: {
        compile: {
          trigger: 'auto',
          clearConsole: false,
        },
      },
    },
    {
      height: 500,
      showSidebar: true,
      openFile: `index${extension}`,
      terminalHeight: 50,
    }
  );
}

export default embedProject;
