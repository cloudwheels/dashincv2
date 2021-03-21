// src/pages/load-trello
<template>
  <div>
    <form @submit.prevent="importUsers">
      <button type="submit" class="btn btn-primary">Import Users</button>
    </form>
    <form @submit.prevent="importTasks">
      <button type="submit" class="btn btn-primary">Import Tasks</button>
    </form>
    <form @submit.prevent="importBounties">
      <button type="submit" class="btn btn-primary">Import Bounties</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'LoadTrello',

  methods: {
    onSubmit() {
      const loadTrello = this.$fire.functions.httpsCallable('transfer')

      loadTrello()
        .then((result) => {
          console.log(`LOAD TRELLO DATA`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },

    importUsers() {
      const users = this.$fire.functions.httpsCallable('importUsers')

      users()
        .then((result) => {
          console.log(`IMPORTED USERS`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
    importTasks() {
      const tasks = this.$fire.functions.httpsCallable('importTasks')

      tasks()
        .then((result) => {
          console.log(`IMPORTED TASKS`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
    importBounties() {
      const bounties = this.$fire.functions.httpsCallable('importBounties')

      bounties()
        .then((result) => {
          console.log(`IMPORTED BOUNTIES`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
  },
}
</script>
