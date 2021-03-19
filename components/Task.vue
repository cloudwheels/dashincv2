<style scoped>
.completed {
  text-decoration: line-through;
}
.textEdit {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.textEditCol {
  padding-top: 10px !important;
}
</style>
<template>
  <div>
    <v-container>
      <v-row
        ><v-col>editing? {{ editing }}</v-col></v-row
      >
      <v-row align="start">
        <v-col cols="1">
          <v-simple-checkbox></v-simple-checkbox>
        </v-col>
        <v-col v-if="editing" cols="8" class="textEditCol">
          <v-textarea :value="description" class="textEdit"></v-textarea>
        </v-col>
        <v-col v-else cols="8"
          ><div :class="{ completed: completed }" @click="editDescription()">
            {{ description }}
          </div></v-col
        >

        <v-col cols="1">
          <v-icon @click="openDialogSetDue()">mdi-timetable</v-icon>
        </v-col>

        <v-col cols="1">
          <v-avatar color="red" size="32" @click="openDialogSetAssigned()">
            <span>NW</span>
          </v-avatar>
        </v-col>
        <v-col cols="1">
          <!--<v-icon>mdi-dots-vertical</v-icon>-->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, i) in menuItems" :key="i">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-row v-if="editing">
        <v-col cols="1"></v-col>
        <v-col cols="11"><v-btn @click="cancelEdit()">cancel</v-btn></v-col>
      </v-row>
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="11"
          ><v-chip color="primary" @click="openDialogSetReward()"
            ><v-icon>mdi-bitcoin</v-icon> {{ dashAmount }}
          </v-chip></v-col
        >
      </v-row>
      <v-row v-if="editing">
        <v-col cols="1"></v-col>
        <v-col cols="11">
          <v-combobox
            v-model="skillChips"
            :items="skills"
            chips
            clearable
            label="Required skills"
            multiple
            solo
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="removeSkill(item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="1"></v-col>
        <v-col cols="11">
          <template v-for="(item, index) in skillChips">
            <v-chip :key="index">
              <strong>{{ item }}</strong
              ><v-spacer></v-spacer>
            </v-chip>
          </template>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialogSetReward" max-width="500px">
      <v-card>
        <v-card-title>Set Dash Reward</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogSetReward()"
            >Cancel</v-btn
          >
          <!--
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Archive</v-btn
              >
              -->
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSetDue" max-width="500px">
      <v-card>
        <v-card-title>Set Due Date Reward</v-card-title>
        <v-card-text
          ><v-row justify="center">
            <v-date-picker v-model="picker"></v-date-picker> </v-row
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogSetDue()"
            >Cancel</v-btn
          >
          <!--
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Archive</v-btn
              >
              -->
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--TODO create member/admin picker component-->
    <v-dialog v-model="dialogSetAssigned" max-width="500px">
      <v-card>
        <v-card-title>Assign Member</v-card-title>
        <v-card-text><MemberList></MemberList></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogSetAssigned()"
            >Cancel</v-btn
          >
          <!--
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Archive</v-btn
              >
              -->
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import MemberList from '~/components/MemberList.vue'
export default {
  name: 'Task',
  components: {
    memberList: MemberList,
  },
  data() {
    return {
      description: 'my task',
      dashAmount: 2,
      canEdit: true,
      editing: false,
      completed: true,
      dialogSetReward: false,
      dialogSetDue: false,
      dialogSetAssigned: false,
      picker: new Date().toISOString().substr(0, 10),
      skillChips: ['Platform'],
      skills: ['javascript', 'front-end', 'vue', 'react', 'database', 'golang'],
      menuItems: [{ title: 'View Id' }],
    }
  },
  methods: {
    editDescription() {
      this.editing = true
      // return (this.editing = true)
    },
    cancelEdit() {
      this.editing = false
      // return this.editing
    },
    openDialogSetReward() {
      this.dialogSetReward = true
    },
    closeDialogSetReward() {
      this.dialogSetReward = false
    },
    openDialogSetDue() {
      this.dialogSetDue = true
    },
    closeDialogSetDue() {
      this.dialogSetDue = false
    },
    openDialogSetAssigned() {
      this.dialogSetAssigned = true
    },
    closeDialogSetAssigned() {
      this.dialogSetAssigned = false
    },
    removeSkill(item) {
      this.skillChips.splice(this.skillChips.indexOf(item), 1)
      this.skillChips = [...this.skillChips]
    },
  },
}
</script>
