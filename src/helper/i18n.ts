import i18n from 'i18n';
import path from 'path';

i18n.configure({
    locales: ['en', 'de', 'fr'],
    directory: path.join(__dirname, '../locales'),
    header: 'accept-language',
    register: global
})

export default i18n 