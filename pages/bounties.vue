<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <!--table-->
    <v-data-table
      :headers="headers"
      :items="Bounties"
      :items-per-page="20"
      :search="search"
      show-group-by
      show-expand
      loading="dataLoading"
      loading-text="Loading... Please wait"
      :expanded.sync="expanded"
      class="elevation-1"
    >
      <!--HEADER -->
      <template v-slot:top>
        <!-- BountyCard editig component-->

        <BountyCard v-model="dialog" :bountyid="editedItem" />

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to archive this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Archive</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- EDIT AND DELETE BUTTONS IN ITEM ACTIONS SLOT -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <!--<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>-->
      </template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.title }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import BountyCard from '~/components/BountyCard.vue'

export default {
  name: 'BountiesPage',
  components: {
    BountyCard,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      expanded: [],
      dataLoading: true,
      editedIndex: -1,
      editedItem: '',
      search: '',

      headers: [
        {
          text: 'bounty Id',
          align: 'start',
          sortable: true,
          value: 'id',
          groupable: false,
        },
        {
          text: 'title',
          align: 'start',
          sortable: false,
          value: 'title',
          groupable: false,
          filterable: true,
        },
        {
          text: 'type',
          align: 'start',
          sortable: true,
          value: 'worktype',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          groupable: false,
        },
        { text: '', value: 'data-table-expand', groupable: false },
      ],
      bounty: {
        title: '',
        description: '',
      },
    }
  },

  computed: {
    Bounties() {
      return this.getBounties() // .filter((b) => b.worktype === 'project')  //is filter a mutation of state??
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    /*
    dialog(val) {
      val || this.close()
    },
    */
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  created() {
    this.bindProfiles().then(() => {
      console.log('member data loaded')
      this.bindTasks().then(() => {
        console.log('TASK DATA LOADED')
        // this.dataLoading = false
        this.bindBounties().then(() => {
          console.log('DATA LOADED')
          this.dataLoading = false
        })
      })
    })
  },
  methods: {
    ...mapGetters(['getBounties']),
    ...mapActions([
      'bindBounties',
      'bindTasks',
      'bindProfiles',
      'addBounty',
      'updateBounty',
      'deleteBounty',
      'updateTask',
    ]),
    doAdd() {
      this.addBounty(this.bounty)
    },
    openModal() {
      document.getElementById('bountyModal').style.display = 'block'
    },
    clearModal() {
      this.bounty = {
        title: '',
        description: '',
      }
    },
    CloseModal() {
      this.clearModal()
      document.getElementById('bountyModal').style.display = 'none'
    },
    editItem(item) {
      console.log('item:', item)
      this.editedIndex = this.Bounties.indexOf(item)
      // this.editedItem = Object.assign({}, item)

      this.editedItem = this.Bounties[this.editedIndex].id
      this.dialog = true
    },
    deleteItem(item) {
      /*
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        */
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      // this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
