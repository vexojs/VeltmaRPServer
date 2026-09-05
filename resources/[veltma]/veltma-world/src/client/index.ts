import { createWorldConfig } from '../shared/config/index.js';
import { createWorldController } from './world/index.js';

const config = createWorldConfig();
const world = createWorldController(config);
world.start();
