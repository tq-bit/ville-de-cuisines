import { UserTheme } from '../@types/commons';
import { ref, toRefs } from 'vue';
import activeUserStore from '../store/activeUserStore';

export default function useAppTheme() {
	const { prefs } = toRefs(activeUserStore());

	const setTheme = (theme: UserTheme) => {
		prefs.value.theme = theme;
		document.documentElement.className = theme;
	};

	const getTheme = (): UserTheme => {
		return prefs.value.theme;
	};

	const toggleTheme = (): void => {
		const activeTheme = getTheme()
		if (activeTheme === 'light') {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	};

	const getMediaPreference = (): UserTheme => {
		const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (hasDarkPreference) {
			return 'dark';
		} else {
			return 'light';
		}
	};

	const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

	return { userTheme, setTheme, toggleTheme };
}
