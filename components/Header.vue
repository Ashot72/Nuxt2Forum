<template>
  <div>
    <b-navbar toggleable type="dark" variant="primary" fixed="top">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">Vue 2.0 Forum</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">              
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <em v-show="!isAuth">Sign In</em>
              <em v-show="isAuth">Welcome, <i>{{ email }}</i></em>
            </template>                 
            <b-dropdown-item @click="$refs.signin.show()" v-show="!isAuth">Sign In</b-dropdown-item>
            <b-dropdown-item @click="$refs.signup.show()" v-show="!isAuth">Sign Up</b-dropdown-item>
            <b-dropdown-item  v-show="isAuth" @click="logOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <app-signin ref='signin'></app-signin>
    <app-signup ref='signup'></app-signup>
  </div>
</template>

<script>
import Signin from '@/components/auth/signin/Signin';
import Signup from '@/components/auth/signup/Signup';

import { mapState, mapGetters, mapActions } from 'vuex';
import { AUTH } from '@/store/auth/getter-types';
import { SIGNOUT } from '@/store/auth/action-types';

export default {
  name: 'Header',
  computed: {
    ...mapState('auth', ['email']),
    ...mapGetters('auth', { isAuth: AUTH }),
  },
  methods: {
    ...mapActions('auth', { signOut: SIGNOUT }),
    logOut() {
      this.signOut();
      this.$router.replace('/');
    },
  },
  components: {
    appSignin: Signin,
    appSignup: Signup,
  },
};
</script>
