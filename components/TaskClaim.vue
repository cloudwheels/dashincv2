<template>
  <v-card>
    <v-card-title>Claim Task</v-card-title>
    <v-card-text>
      <v-row><v-col>You are claiming the following task:</v-col></v-row>
      <v-row
        ><v-col>Task ID:</v-col><v-col>{{ task.id }}</v-col>
      </v-row>
      <v-row
        ><v-col>Description:</v-col><v-col>{{ task.description }}</v-col>
      </v-row>
      <v-row
        ><v-col>Reward:</v-col><v-col>{{ task.rewardDash }} DASH</v-col>
      </v-row>
      <v-row
        ><v-col><v-text-field v-model="claim.source" label="source" /></v-col
      ></v-row>
      <v-row
        ><v-col><v-text-field v-model="claim.deploy" label="deploy" /></v-col
      ></v-row>
      <v-row
        ><v-col><v-text-field v-model="claim.address" label="address" /></v-col
      ></v-row>
      <v-row
        ><v-col
          ><v-text-field
            v-model="claim.claimAmount"
            label="amount claimed" /></v-col
      ></v-row>
      <v-row
        ><v-col><v-textarea v-model="claim.comment" label="comment" /></v-col
      ></v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="submitClaim()">claim</v-btn>
      <v-btn text @click="cancel()">cancel</v-btn></v-card-actions
    >
    <template>
      <v-dialog v-model="claimConfirmDialog">
        <v-card
          ><v-card-title>Claim Submitted</v-card-title>
          <v-card-text>
            <p>
              Your claim has been submitted amnd will be reviewed by the task
              admnin.
            </p>
            <p>Claim reference: {{ newClaimId }}</p>
          </v-card-text>
          <v-card-actions
            ><v-btn @click="dismissClaimConfirm">OK</v-btn></v-card-actions
          ></v-card
        >
      </v-dialog>
    </template>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'TaskClaim',
  props: { task: { type: Object, default: () => {} } },
  data() {
    return {
      claim: {
        claimAmount: 0,
        source: '',
        deploy: '',
        address: '',
        comment: '',
      },
      claimConfirmDialog: false,
      newClaimId: '',
    }
  },
  computed: {
    payload() {
      return {
        status: 'submitted',
        claimDateTime: Date.now(),
        taskId: this.task.id,
        memberId: this.$store.state.user.uid,
        ...this.claim,
      }
    },
  },
  methods: {
    ...mapActions(['addClaim']),
    submitClaim() {
      console.log(`submit payload:`)
      console.dir(this.payload)
      this.addClaim(this.payload).then((result) => {
        console.log(`claim added:`)
        console.dir(result.id)
        this.newClaimId = result.id
        this.claimConfirmDialog = true
      })
    },
    dismissClaimConfirm() {
      this.claimConfirmDialog = false
      this.cancel()
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>
