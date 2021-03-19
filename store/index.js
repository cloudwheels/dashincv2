import { vuexfireMutations, firestoreAction } from 'vuexfire'

export const state = () => ({
  user: null,
  concepts: [],
  bounties: [],
  bountyActions: [],
  members: [],
})
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    // Set user when firebase auth state changes
    console.log('AUTH STATE CHANGED')
    if (authUser) {
      // auth user
      const { uid, email, emailVerified } = authUser
      const { admin } = claims
      state.user = { uid, email, emailVerified, admin }
    } else {
      // no auth user
      state.user = null
    }
  },
  ...vuexfireMutations,
  /*
  SET_COUNT_DOCUMENT: (state, countDocument) => {
    // Only needed for SSR/Universal Mode
    state.countDocument = countDocument
  },
  */
}

export const actions = {
  // firebase auth actions
  signUp({ commit }, { email, password }) {
    return this.$fire.auth.createUserWithEmailAndPassword(email, password)
  },

  signInWithEmail({ commit }, { email, password }) {
    return this.$fire.auth.signInWithEmailAndPassword(email, password)
  },

  signOut() {
    return this.$fire.auth.signOut()
  },

  // concepts
  bindConcepts: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.$fire.firestore.collection('concepts')
    await bindFirestoreRef('concepts', ref, { wait: true })
  }),
  unbindConcepts: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('concepts', false)
  }),
  addConcept: firestoreAction(async function (context, payload) {
    console.log('ADD CONCEPT. PAYLOAD:', payload)
    const result = await this.$fire.firestore
      .collection('concepts')
      .add(payload)
    console.log('concept added', result.id)
    return result.id
  }),

  updateConcept: firestoreAction(function (context, payload) {
    console.log('vuex update concept action called with payload:', payload)
    // console.log
    this.$fire.firestore
      .collection('concepts')
      .doc(payload.id)
      .update({ [payload.change.key]: payload.change.value })
      .then(() => {
        console.log('concept updated')

        /*
        // ? Log changes to concepts??
        // should be a transaction??
        context.dispatch('addBountyAction', {
          userId: context.state.user.uid,
          bountyId: payload.id,
          field: payload.change.key,
          action: 'update',
          originalValue: payload.change.originalValue,
          newValue: payload.change.value,
          time: this.$fireModule.firestore.Timestamp.now(),
        })
        */
      })
    // console.log('update action completed')
  }),

  // bounty-cards
  // firestore bindings
  bindBounties: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.$fire.firestore.collection('bounty-cards')
    await bindFirestoreRef('bounties', ref, { wait: true })
  }),
  unbindBounties: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('bounties', false)
  }),
  addBounty: firestoreAction(async function (context, payload) {
    console.log('ADD BOUNTY. PAYLOAD:', payload)
    await this.$fire.firestore.collection('bounty-cards').add(payload)
  }),
  deleteBounty: firestoreAction(function (context, payload) {
    console.log('vuex deleting bounty...')
    this.$fire.firestore
      .collection('bounty-cards')
      .doc(payload)
      .delete()
      .then(() => {
        console.log('bounty deleted!')
      })
  }),
  updateBounty: firestoreAction(function (context, payload) {
    console.log('vuex update action called with payload:', payload)
    // console.log
    this.$fire.firestore
      .collection('bounty-cards')
      .doc(payload.id)
      .update({ [payload.change.key]: payload.change.value })
      .then(() => {
        console.log('bounty updated! Adding to log')
        // should be a transaction??
        context.dispatch('addBountyAction', {
          userId: context.state.user.uid,
          bountyId: payload.id,
          field: payload.change.key,
          action: 'update',
          originalValue: payload.change.originalValue,
          newValue: payload.change.value,
          time: this.$fireModule.firestore.Timestamp.now(),
        })
      })
    // console.log('update action completed')
  }),

  updateTask: firestoreAction(function (context, payload) {
    console.log('vuex update action called with payload:', payload)
    // console.log
    this.$fire.firestore
      .collection('tasks')
      .doc(payload.taskId)
      .update({ [payload.change.key]: payload.change.value })
      .then(() => {
        console.log('task updated! Adding to log')
        // should be a transaction??
        context.dispatch('addBountyAction', {
          userId: context.state.user.uid,
          bountyId: payload.bountyId,
          field: `tasks/${payload.taskId}`,
          action: 'update',
          originalValue: payload.change.originalValue,
          newValue: payload.change.value,
          time: this.$fireModule.firestore.Timestamp.now(),
        })
      })
    // console.log('update action completed')
  }),

  // bounty actions
  bindBountyActions: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.$fire.firestore.collection('bounty-actions')
    await bindFirestoreRef('bountyActions', ref, { wait: true })
  }),
  unbindBountyActions: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('bountyActions', false)
  }),
  addBountyAction: firestoreAction(async function (context, payload) {
    console.log('ADD BOUNTY ACTION. PAYLOAD:', payload)
    await this.$fire.firestore.collection('bounty-actions').add(payload)
    console.log('bounty Action added')
  }),

  // profiles (currently roles)
  bindProfiles: firestoreAction(async function ({ bindFirestoreRef }) {
    const ref = this.$fire.firestore.collection('roles')
    await bindFirestoreRef('members', ref, { wait: true })
  }),
  unbindProfiles: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('members', false)
  }),
}
export const getters = {
  user(state) {
    return state.user
  },

  isAuthenticated(state) {
    return !!state.user
  },

  getBounties(state) {
    return state.bounties
  },

  getBountyActions(state) {
    return state.bountyActions
  },

  getMembers(state) {
    return state.members
  },

  getConcepts(state) {
    return state.concepts
  },
  /*
  count(state) {
    return state.countDocument.count
  },
  */
}
