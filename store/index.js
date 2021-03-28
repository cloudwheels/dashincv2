import { vuexfireMutations, firestoreAction } from 'vuexfire'

export const state = () => ({
  user: null,
  concepts: [],
  bounties: [],
  tasks: [],
  bountyActions: [],
  members: [],
  editingBounty: {},
  editingTask: {},
  myTasks: [],
})
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    // Set user when firebase auth state changes
    console.log('AUTH STATE CHANGED')
    if (authUser) {
      // auth user
      const { uid, email, emailVerified } = authUser
      const { admin } = claims
      const { superadmin } = claims
      state.user = { uid, email, emailVerified, admin, superadmin }
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
  bindBounties: firestoreAction(function ({ bindFirestoreRef }) {
    const ref = this.$fire.firestore.collection('bounty-cards')
    return bindFirestoreRef('bounties', ref, { wait: true })
  }),
  unbindBounties: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('bounties', false)
  }),

  bindBountyDoc: firestoreAction(function ({ bindFirestoreRef }, bountyId) {
    console.log(`vuexfire bind to bountydoc ${bountyId}`)
    const ref = this.$fire.firestore.collection('bounty-cards').doc(bountyId)
    return bindFirestoreRef('editingBounty', ref, { wait: true })
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
  updateBounty: firestoreAction(async function (context, payload) {
    console.log('vuex update action called with payload:')
    console.dir(payload)
    // console.log
    const isTasksUpdate = payload.change.key.substr(0, 5) === 'tasks'
    if (isTasksUpdate) {
      console.log('Updating a tasks array - need to fetch value first')
      const ref = this.$fire.firestore
        .collection('bounty-cards')
        .doc(payload.id)
      const querySnapshot = await ref.get()
      // console.log(`query snapshot ${JSON.stringify(querySnapshot.data())}`)
      const doc = querySnapshot.data()
      const currentTaskArray = doc[payload.change.key]
      console.log(`current array of ${payload.change.key} is:`)
      console.dir(currentTaskArray)
      /*
      if (typeof currentTaskArray !== typeof Array) {
        currentTaskArray = []
      }
      */

      // push new task
      currentTaskArray.push(payload.change.value)
      payload.change.value = currentTaskArray
    }

    console.log(`update ${payload.change.key} to:`)
    console.dir(payload.change.value)
    return this.$fire.firestore
      .collection('bounty-cards')
      .doc(payload.id)
      .update({ [payload.change.key]: payload.change.value })
      .then(() => {
        console.log('bounty updated! Adding to log')
        // should be a transaction??
        let newValue = payload.change.value
        if (isTasksUpdate) {
          newValue = payload.newTaskId
        }
        context.dispatch('addBountyAction', {
          userId: context.state.user.uid,
          bountyId: payload.bountyId,
          field: payload.change.key,
          action: 'update',
          originalValue: payload.change.originalValue,
          newValue,
          time: this.$fireModule.firestore.Timestamp.now(),
        })
      })
    // console.log('update action completed')
  }),

  bindTasks: firestoreAction(function ({ bindFirestoreRef }) {
    console.log(`vuexfire bind to tasks`)
    const ref = this.$fire.firestore.collection('tasks')
    return bindFirestoreRef('tasks', ref, { wait: true })
  }),
  unbindTasks: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('tasks', false)
  }),

  bindTaskDoc: firestoreAction(function ({ bindFirestoreRef }, taskId) {
    console.log(`vuexfire bind to task doc ${taskId}`)
    const ref = this.$fire.firestore.collection('tasks').doc(taskId)
    return bindFirestoreRef('editingTask', ref, { wait: true })
  }),

  addTask: firestoreAction(async function (context, payload) {
    console.log('ADD TASK. PAYLOAD:', payload)
    const newTaskRef = await this.$fire.firestore.collection('tasks').add({
      assignedMemberId: null,
      complete: false,
      description: 'New Task',
      due: null,
      number: -1,
      rewardDash: null,
    })
    const newTaskId = newTaskRef.id
    console.log(`created a new task with id ${JSON.stringify(newTaskId)}`)
    const bountyUpdatePayload = {}
    bountyUpdatePayload.id = payload.bountyId
    bountyUpdatePayload.bountyId = payload.bountyId
    bountyUpdatePayload.newTaskId = newTaskId
    bountyUpdatePayload.change = {}
    bountyUpdatePayload.change.originalValue = null
    bountyUpdatePayload.change.key = payload.taskType // eg 'tasksProduction
    // const newTaskDocRef = new this.$fireModule.firestore.DocumentReference(
    const newTaskDocRef = this.$fire.firestore.doc(`tasks/${newTaskId}`)
    console.log(`newTaskDocRef:`)
    console.dir(newTaskDocRef)
    bountyUpdatePayload.change.value = newTaskDocRef // doc ref to newly created task
    console.log(
      `Dispatch Update Bounty with payload ${JSON.stringify(
        bountyUpdatePayload
      )}`
    )

    context.dispatch('updateBounty', bountyUpdatePayload).then(() => {
      console.log(`Bounty Updated returning newTaskId ${newTaskId}`)
      return newTaskId
    })
  }),

  updateTask: firestoreAction(function (context, payload) {
    console.log('vuex update task action called with payload:', payload)
    let valToUpdate = payload.change.value
    if (payload.change.key === 'due' && payload.change.value != null) {
      // process date as timestamp
      console.log('process due date as timestamp')
      const ts = this.$fireModule.firestore.Timestamp.fromDate(
        new Date(payload.change.value)
      )
      console.log('created timestamp', ts)

      // change original to date for logs if not null
      // TODO - ? check it was a Timestamp type
      if (payload.change.originalValue != null) {
        payload.change.originalValue = payload.change.originalValue.toDate()
      }

      valToUpdate = ts
    }
    // console.log
    this.$fire.firestore
      .collection('tasks')
      .doc(payload.taskId)
      .update({ [payload.change.key]: valToUpdate })
      .then(() => {
        console.log('task updated! Adding to log')
        // should be a transaction??
        context.dispatch('addBountyAction', {
          userId: context.state.user.uid,
          bountyId: payload.bountyId,
          field: `tasks/${payload.taskId}/${payload.change.key}`,
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
    const ref = this.$fire.firestore
      .collection('roles')
      .orderBy('username', 'asc')
    await bindFirestoreRef('members', ref, { wait: true })
  }),
  unbindProfiles: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('members', false)
  }),

  // MyTasks
  bindMyTasks: firestoreAction(function ({ bindFirestoreRef }) {
    const user = this.getters.user
    console.log(`my tasks user:`)
    console.dir(user)
    const ref = this.$fire.firestore
      .collection('tasks')
      .where('assignedMemberId', '==', user.uid)
    return bindFirestoreRef('myTasks', ref, { wait: true })
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

  getTasks(state) {
    return state.tasks
  },

  getMyTasks(state) {
    return state.myTasks
  },

  getEditingBounty(state) {
    return state.editingBounty
  },

  getEditingTask(state) {
    return state.editingTask
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
