<template>
  <div>
    <div>
      <p>All work in the incubator starts with a concept.</p>
      <p>
        You can draft a concept and then submit for approval by admins when you
        are ready.
      </p>
      <p>You must be signed in as a member to create a concept.</p>
    </div>
    <div>
      <!-- data table-->
      <v-data-table
        :headers="headers"
        :items="Concepts"
        :items-per-page="5"
        group-by="worktype"
        show-group-by
        show-expand
        :expanded.sync="expanded"
        class="elevation-1"
      >
        <!--HEADER -->
        <template v-slot:top>
          <v-toolbar flat>
            <!--<v-toolbar-title>Concepts</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>-->
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="$store.getters.isAuthenticated"
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Draft new concept
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <div v-if="editedIndex == -1">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="concept.title"
                            label="Title"
                            name="title"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="concept.description"
                            label="Description"
                            name="description"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Next
                    </v-btn>
                  </v-card-actions>
                </div>
                <div v-else>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :value="editedItem.title"
                            label="Title"
                            name="title"
                            @change="updateConceptField(editedItem.title)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :value="editedItem.description"
                            label="Description"
                            name="description"
                            @change="updateConceptField(editedItem.description)"
                          ></v-text-field>
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
                </v-card-actions>
                --></div>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- EDIT AND DELETE BUTTONS IN ITEM ACTIONS SLOT -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <!--<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>-->
        </template>
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card>
              <v-card-title> More info about {{ item.title }} </v-card-title>
              <v-card-text>
                {{ item.description }}
              </v-card-text>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ConceptsPage',

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      expanded: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        title: '',
        description: '',
      },

      headers: [
        {
          text: 'concept Id',
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
        {
          text: '',
          value: 'data-table-expand',
          sortable: false,
          groupable: false,
        },
      ],
      concept: {
        title: '',
        description: '',
      },
    }
  },

  computed: {
    Concepts() {
      return this.getConcepts()
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Draft New Concept' : 'Edit Concept'
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
    this.bindConcepts()
  },
  methods: {
    ...mapGetters(['getConcepts']),
    ...mapActions([
      'bindConcepts',
      'addConcept',
      'updateConcept',
      'deleteConcept',
    ]),
    async doAdd() {
      // console.log(`doing ADD of this.concept ${this.concept}`)
      // TODO TRY/CATCH
      const result = await this.addConcept(this.concept)

      console.log('RESULT IN COMPONENT', result)
      this.clearModal()
      console.log('all concepts', this.Concepts)
      const index = this.Concepts.map((c) => c.id).indexOf(result)
      console.log('index of new item', index)
      // find this new element
      this.editedIndex = index // this.Concepts[index]
      this.editedItem = Object.assign({}, this.Concepts[index])
      this.dialog = true
    },
    openModal() {
      document.getElementById('conceptModal').style.display = 'block'
    },
    clearModal() {
      this.concept = {
        title: '',
        description: '',
      }
    },
    CloseModal() {
      this.clearModal()
      document.getElementById('conceptModal').style.display = 'none'
    },
    editItem(item) {
      console.log('item:', item)
      this.editedIndex = this.Concepts.indexOf(item)
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
      this.doAdd()
      this.close()
    },
    updateConceptField(original) {
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
      console.log(this.Concepts[this.editedIndex])

      const update = {
        key: event.target.name,
        value: event.target.value,
        originalValue: original,
      }

      console.log('update', update)
      this.updateConcept({
        id: this.Concepts[this.editedIndex].id,
        change: update,
      })
    },
  },
}
</script>
