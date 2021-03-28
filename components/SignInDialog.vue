<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
    min-width="360px"
    @click:outside="dialog = false"
  >
    <div>
      <v-card class="px-4">
        <v-card-actions>
          <v-btn color="primary" text @click.stop="dialog = false">Close</v-btn>
        </v-card-actions>
        <v-card-text>
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="loginEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="loginPassword"
                  :append-icon="show1 ? 'eye' : 'eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
              <v-spacer></v-spacer>
              <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                <v-btn
                  x-large
                  block
                  :disabled="!valid"
                  color="success"
                  @click="validate"
                >
                  Login
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data: () => ({
    valid: true,

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verify: '',
    loginPassword: '',
    loginEmail: '',
    loginEmailRules: [
      (v) => !!v || 'Required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    emailRules: [
      (v) => !!v || 'Required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],

    show1: false,
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => (v && v.length >= 8) || 'Min 8 characters',
    },
  }),
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    passwordMatch() {
      return () => this.password === this.verify || 'Password must match'
    },
  },
  methods: {
    validate() {
      console.log('validating signin')
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
        console.log('validated - do sign in')
        this.userSignIn()
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    userSignIn(/* err */) {
      console.log(
        `signing in using email ${this.loginEmail} & password ${this.loginPassword}`
      )
      this.$store
        .dispatch('signInWithEmail', {
          email: this.loginEmail,
          password: this.loginPassword,
        })
        .then(() => {
          this.loginEmail = ''
          this.loginPassword = ''
          console.log('USER SIGNED IN')
          this.dialog = false
          // redirect after sign in?
        })
      /*
        .catch((err) => {
          alert(err.message)
        })
        */
    },
  },
}
</script>
