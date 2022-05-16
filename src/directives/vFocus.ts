import { Directive } from 'vue';

const vFocus: Directive = {
  mounted(el, binding) {
    console.log(binding);
    if (binding.value === true) {
      el.focus();
    }
  },
};

export default vFocus;
