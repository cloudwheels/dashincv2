<template>
  <div>
    <div v-if="editedDate === null">
      <v-icon @click.stop="openDialogSetDue()">mdi-timetable</v-icon>
    </div>
    <div v-else>
      <v-btn x-small @click.stop="openDialogSetDue()">{{ editedDate }}</v-btn>
      <v-btn v-if="canEdit" outlined x-small fab @click.stop="remove()"
        >X</v-btn
      >
    </div>

    <v-dialog v-model="dialogSetDue" max-width="500px">
      <v-card>
        <v-card-title>Set Due Date</v-card-title>
        <v-card-text
          ><v-row justify="center">
            <v-date-picker v-model="editedDate"></v-date-picker> </v-row
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
          <v-btn color="blue darken-1" text @click="cancel()">Cancel</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DueDatePicker',
  props: {
    selectedDate: { type: Object, default: () => {} },
    canEdit: { type: Boolean, default: false },
  },
  data() {
    return {
      dialogSetDue: false,
      editedDate: '',
      originalDate: '',
    }
  },
  mounted() {
    this.editedDate =
      this.selectedDate === null ? null : this.formatDate(this.selectedDate)
  },
  methods: {
    openDialogSetDue() {
      if (!this.canEdit) {
        return
      }
      this.originalDate = this.editedDate
      this.dialogSetDue = true
    },
    closeDialogSetDue() {
      this.dialogSetDue = false
    },
    isUndefined(val) {
      return typeof val === 'undefined'
    },
    remove() {
      this.editedDate = null
      this.$emit('dateUpdated', this.editedDate)
    },
    save() {
      this.$emit('dateUpdated', this.editedDate)
      this.closeDialogSetDue()
    },
    cancel() {
      this.editedDate = this.originalDate
      this.closeDialogSetDue()
    },
    formatDate(timestamp) {
      const date = timestamp.toDate().toDateString()
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },
  },
}
</script>

<style></style>
