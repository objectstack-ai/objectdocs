/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loader } from 'fumadocs-core/source';
import { docs, meta } from '../.source/server'; // Relative import to .source in root
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { i18n } from './i18n';

const mainSource = toFumadocsSource(docs, meta);

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: [
      ...mainSource.files,
    ],
  },
  i18n,
});
