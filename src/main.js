import Vtrim      from './components/Vtrim.vue';


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vtrim);
}


export default {
  install(Vue) {
    Vue.component('vtrim', Vtrim);
  }
};
export { Vtrim };
