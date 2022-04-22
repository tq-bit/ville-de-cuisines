import { UserTheme } from '../@types/commons';
import { computed } from 'vue';
import useActiveUserStore from '../store/activeUserStore';

export default function useAppTheme() {
	const activeUserStore = useActiveUserStore();

	const getMediaPreference = (): UserTheme => {
		const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (hasDarkPreference) {
			return 'dark';
		} else {
			return 'light';
		}
	};

	const userTheme = computed<UserTheme>(() => {
		return activeUserStore.prefs.theme || getMediaPreference();
	});

	const setTheme = (theme: UserTheme) => {
		document.documentElement.className = theme;
	};

	return { userTheme, setTheme };
}
