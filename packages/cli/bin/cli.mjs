#!/usr/bin/env node
/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cac } from 'cac';
import 'dotenv/config';
import { registerInitCommand } from '../src/commands/init.mjs';
import { registerTranslateCommand } from '../src/commands/translate.mjs';
import { registerDevCommand } from '../src/commands/dev.mjs';
import { registerBuildCommand } from '../src/commands/build.mjs';
import { registerStartCommand } from '../src/commands/start.mjs';

const cli = cac('objectdocs');

registerInitCommand(cli);
registerTranslateCommand(cli);
registerDevCommand(cli);
registerBuildCommand(cli);
registerStartCommand(cli);

cli.help();
cli.version('0.0.1');

cli.parse();

