<template>
  <!-- ? import Bounties component?? -->
  <!--  <Bounties />-->
  <div>
    <div class="w3-top">
      <div class="w3-bar w3-indigo" style="letter-spacing: 4px">
        <h3 class="w3-bar-item">Bounty Actions</h3>
      </div>
    </div>

    <div class="w3-container">
      <v-data-table
        :headers="headers"
        :items="BountyActions"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.time="{ item }">
          {{ item.time.toDate() }}
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import BountyAction from '~/components/BountyAction.vue'
export default {
  name: 'BountyActionsPage',
  components: {
    // eslint-disable-next-line
    'bounty-action': BountyAction,
  },
  data() {
    return {
      headers: [
        {
          text: 'user Id',
          align: 'start',
          sortable: true,
          value: 'userId',
        },
        {
          text: 'bounty Id',
          align: 'start',
          sortable: true,
          value: 'bountyId',
        },
        {
          text: 'field',
          align: 'start',
          sortable: true,
          value: 'field',
        },
        {
          text: 'action',
          align: 'start',
          sortable: true,
          value: 'action',
        },
        {
          text: 'time',
          align: 'start',
          sortable: true,
          value: 'time',
        },
        {
          text: 'original value',
          align: 'start',
          sortable: false,
          value: 'originalValue',
        },
        {
          text: 'updated Value',
          align: 'start',
          sortable: false,
          value: 'newValue',
        },
      ],
      /*
      bountyAction: {
        userId: '',
      },
      */
    }
  },
  computed: {
    BountyActions() {
      return this.getBountyActions()
    },
  },
  created() {
    this.bindBountyActions()
  },
  methods: {
    ...mapGetters(['getBountyActions']),
    ...mapActions(['bindBountyActions']),
  },
}
</script>
