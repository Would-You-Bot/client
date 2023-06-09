import { Translations } from '@typings/translations';

import bot from './bot';
import core from './core';
import game from './game';

const translations: Translations = {
  ...core,
  ...bot,
  ...game,
};

export default translations;
