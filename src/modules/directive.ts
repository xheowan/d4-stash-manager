import { DirectiveBinding  } from 'vue';
import { type UserModule } from '~/types'
import { validateNumber } from '~/utils';

const showErrorMessage = function (error: string) {
	alert(error);
}

// form submit
const formSubmit = {
	mounted(el: HTMLFormElement, binding: DirectiveBinding) {
		if (el.nodeName != 'FORM')
			return;
		
		el.addEventListener('submit', (event) => {
			event.preventDefault();
			event.stopPropagation();

			el.classList.add('was-validated');

			if (el.checkValidity() && typeof binding.value === 'function') {
				binding.value(showErrorMessage);

				setTimeout(() => {
					el.classList.remove('was-validated');
				}, 500);
			}
		}, false);
	}
}

const inputFilterNumber = {
	mounted(el: HTMLInputElement) {
		if (el.nodeName != 'INPUT')
			return;
		
		el.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;

			if (!validateNumber(value)) {
				event.preventDefault();
				return false;
			}

			// const regex = /^[0-9.]*$/; // 正則表達式，只允許數字和小數點
			// const value = (event.target as HTMLInputElement).value;

			// if (!regex.test(value)) {
			// 	event.preventDefault();
			// 	return false;
			// }
		});
	}
}

// Setup directive
export const install: UserModule = ({ app }) => {
	// form submit
	app.directive('submit', formSubmit);
	// input
	app.directive('filterNumber', inputFilterNumber);
}