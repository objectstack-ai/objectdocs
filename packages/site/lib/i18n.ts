/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { siteConfig } from './site-config';
import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: siteConfig.i18n.defaultLanguage,
  languages: siteConfig.i18n.languages,
  parser: 'dot',  
});
