import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

// document.querySelector == $
autocomplete( document.querySelector('#address'), document.querySelector('#lat'), document.querySelector('#lng') );
// autocomplete( $('#address'), $('#lat'), $('#lng') );
