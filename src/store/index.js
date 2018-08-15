import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userEditFormVisible: false,
        selectUser:{}
      },
      mutations: {
        toggleUserEditFormVisible: state => state.userEditFormVisible=!state.userEditFormVisible,
        loadSelectUser:(state,user) => state.selectUser=user
      }
});
