import Vtrim      from './src/components/Vtrim.vue';


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vtrim);
}


export { Vtrim };
export default {
  install(Vue) {
    Vue.component('vtrim', Vtrim);
  }
};
