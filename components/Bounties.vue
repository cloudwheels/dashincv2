<template>
  <div class="w3-col w3-container w3-margin-top">
    <div class="w3-card-2 w3-round-large">
      <div v-if="!isEditing">
        <header class="w3-container mineader headerStyle">
          <h3 class="w3-text-indigo">{{ bountyItem.title }}</h3>
        </header>
        <div class="w3-container minContainer">
          <p>{{ bountyItem.description }}</p>
          <hr />
          <div class="w3-rest">
            <button
              class="w3-right w3-margin-left w3-margin-bottom"
              @click="removeBounty"
            >
              <i class="fa fa-trash" aria-hidden="true"></i>delete
            </button>
            <button
              class="w3-right w3-margin-left w3-margin-bottom"
              @click="editBounty"
            >
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>edit
            </button>
          </div>
        </div>
      </div>

      <div v-if="isEditing">
        <v-container>
          <!--
    <v-row

      justify="space-between"
    >
      <v-col
        cols="12"
        md="4"
      > -->
          <v-form ref="bountyEditor" @submit.prevent="updateBounty">
            <div class="w3-container">
              <p>
                <!--
              <input
                v-model="bountyItem.title"
                required
                placeholder="Title"
                type="text"
                class="w3-input w3-padding w3-border w3-round-large"
              />
                -->

                <v-text-field
                  name="title"
                  :value="bountyItem.title"
                  required
                  placeholder="Title"
                  type="text"
                  class="w3-padding w3-border w3-round-large"
                  @change="updateBountyField(bountyItem.title)"
                />
              </p>
            </div>
            <div class="w3-container">
              <v-textarea
                name="description"
                :value="bountyItem.description"
                required
                placeholder="Description"
                class="w3-input w3-border w3-round-large"
                cols="30"
                rows="3"
                @change="updateBountyField(bountyItem.description)"
              />
              <hr />
              <div class="w3-rest">
                <button class="w3-right w3-margin-left w3-margin-bottom">
                  <i
                    class="fa fa-floppy-o w3-text-indigo"
                    aria-hidden="true"
                  ></i
                  >save
                </button>
                &nbsp;
                <button
                  class="w3-right w3-margin-left w3-margin-bottom"
                  @click="cancelEdit"
                >
                  <i
                    class="fa fa-floppy-o w3-text-indigo"
                    aria-hidden="true"
                  ></i
                  >cancel
                </button>
              </div>
            </div>
          </v-form>
        </v-container>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['bountyItem'],
  data() {
    return {
      isEditing: false,
    }
  },
  methods: {
    removeBounty() {
      this.$emit('remove')
    },
    editBounty() {
      this.isEditing = true
    },
    cancelEdit() {
      this.isEditing = false
    },
    updateBounty() {
      console.log(
        'update called on Bounty Component, the form value is :',
        this.$refs.bountyEditor
      )
      // this.isEditing = false
      // this.bountyItem.title = this.$refs.bountyEditor.title.value
      this.$emit('update')
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
      console.log('current bounty', this.bountyItem)

      const update = {
        key: event.target.name,
        value: event.target.value,
        originalValue: original,
      }

      console.log('update', update)
      // this.isEditing = false
      // this.bountyItem.title = this.$refs.bountyEditor.title.value
      this.$emit('update', update)
    },
  },
}
</script>
