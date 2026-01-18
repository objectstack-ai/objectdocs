import { loader } from 'fumadocs-core/source';
import { core, platform } from '@/.source/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { i18n } from './i18n';

const coreSource = toFumadocsSource(core.docs, core.meta);
const platformSource = toFumadocsSource(platform.docs, platform.meta);

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: [
      ...coreSource.files.map((file) => ({
        ...file,
        path: `core/${file.path}`,
      })),
      ...platformSource.files.map((file) => ({
        ...file,
        path: `platform/${file.path}`,
      })),
    ],
  },
  i18n,
});
