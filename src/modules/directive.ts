import { DirectiveBinding  } from 'vue';
import { type UserModule } from '~/types'

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

// Setup directive
export const install: UserModule = ({ app }) => {
	// submit
	app.directive('submit', formSubmit);
}