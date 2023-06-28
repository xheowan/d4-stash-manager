import type { UserModule } from '~/types'
import { createI18n } from 'vue-i18n'
import { useNavigatorLanguage } from '@vueuse/core'
import messages from '@intlify/unplugin-vue-i18n/messages'

export const install: UserModule = ({ isClient, app }) => {
	let locale = 'en';

	if (isClient) {
		const { language } = useNavigatorLanguage();
		if (language.value && messages[language.value]) {
			locale = language.value;
		}
	}

	const i18n = createI18n({
		legacy: true,
		locale,
		messages,
		globalInjection: true,
		strategy: 'no_prefix',
	});

	app.use(i18n);
}