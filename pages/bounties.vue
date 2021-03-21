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
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      :value="editedItem.title"
                      label="Title"
                      name="title"
                      @change="updateBountyField(editedItem.title)"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      :value="editedItem.description"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <Task
                      v-for="task in editedItem.tasksProduction"
                      :key="task.id"
                      :description="task.description"
                      @updateDescription="
                        updateTaskDescription(task.id, task.description, $event)
                      "
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <Task
                      v-for="task in editedItem.tasksSpecification"
                      :key="task.id"
                      :description="task.description"
                      @updateDescription="
                        updateTaskDescription(task.id, task.description, $event)
                      "
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <Task
                      v-for="task in editedItem.tasksQA"
                      :key="task.id"
                      :description="task.description"
                      @updateDescription="
                        updateTaskDescription(task.id, task.description, $event)
                      "
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <!--
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              -->
          </v-card>
        </v-dialog>
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.title }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
/*
import Bounties from '~/components/Bounties.vue'

export default {
  components: {
    Bounties,
  },
}
*/
import { mapGetters, mapActions } from 'vuex'
import Task from '~/components/Task.vue'

export default {
  name: 'BountiesPage',
  components: {
    Task,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      expanded: [],
      dataLoading: true,
      editedIndex: -1,
      editedItem: {
        id: '',
        title: '',
        description: '',
      },
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
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  created() {
    this.bindBounties().then(() => {
      console.log('DATA LOADED')
      this.dataLoading = false
    })
  },
  methods: {
    ...mapGetters(['getBounties']),
    ...mapActions([
      'bindBounties',
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
      this.editedItem = Object.assign({}, item)
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

    save() {
      /*
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        */
      this.close()
    },
    updateBountyField(original) {
      console.log('value:', original)
      console.log(
        'event:',
        event,
        'update :',
        event.target.name,
        ' value:',
        event.target.value
      )
      console.log('EDITED ITEM:', this.editedItem)
      console.log(
        'this.Bounties[this.editedIndex]:',
        this.Bounties[this.editedIndex]
      )

      // console.log('current bounty', this.bountyItem)

      const update = {
        key: event.target.name,
        value: event.target.value,
        originalValue: original,
      }

      console.log('update', update)
      // this.isEditing = false
      // this.bountyItem.title = this.$refs.bountyEditor.title.value
      // this.$emit('update', update)
      this.updateBounty({
        id: this.Bounties[this.editedIndex].id,
        change: update,
      })
    },

    updateTaskDescription(key, original, newValue) {
      // console.dir(newValue)
      // alert(`UPDATE DESCRIPTION of task ${key} from ${original} ${newValue}`)
      const update = {
        key: 'description',
        value: newValue,
        originalValue: original,
      }

      console.log('update', update)
      // this.isEditing = false
      // this.bountyItem.title = this.$refs.bountyEditor.title.value
      // this.$emit('update', update)

      this.updateTask({
        bountyId: this.Bounties[this.editedIndex].id,
        taskId: key,
        change: update,
      })
    },

    updateBountyTask(taskId, original) {
      console.log('taskId:', taskId)
      console.log('value:', original)
      console.log(
        'event:',
        event,
        'update :',
        event.target.name,
        ' value:',
        event.target.value
      )
      console.log('EDITED ITEM:', this.editedItem)
      console.log(
        'this.Bounties[this.editedIndex]:',
        this.Bounties[this.editedIndex]
      )

      // console.log('current bounty', this.bountyItem)

      const update = {
        key: event.target.name,
        value: event.target.value,
        originalValue: original,
      }

      console.log('update', update)
      // this.isEditing = false
      // this.bountyItem.title = this.$refs.bountyEditor.title.value
      // this.$emit('update', update)

      this.updateTask({
        bountyId: this.Bounties[this.editedIndex].id,
        taskId,
        change: update,
      })
    },
  },
}
</script>
