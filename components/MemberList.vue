<template>
  <v-card max-width="450" class="mx-auto">
    <v-toolbar flat color="transparent">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search Members"
        single-line
      ></v-text-field>
    </v-toolbar>

    <v-list>
      <template v-for="(item, index) in searching">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.username">
          <v-list-item-avatar>
            <v-img :src="item.avatarURL"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.username"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MemberList',

  data() {
    return {
      search: '',
    }
  },
  computed: {
    items() {
      return this.getMembers()
    },
    keywords() {
      if (!this.search) return []

      const keywords = []

      for (const search of this.searching) {
        keywords.push(search.keyword)
      }

      return keywords
    },
    searching() {
      if (!this.search) return this.items

      const search = this.search.toLowerCase()

      return this.items.filter((item) => {
        const text = item.username.toLowerCase()

        return text.includes(search)
      })
    },
  },
  created() {
    this.bindProfiles()
  },
  methods: {
    ...mapGetters(['getMembers']),
    ...mapActions(['bindProfiles']),
  },
}
</script>
