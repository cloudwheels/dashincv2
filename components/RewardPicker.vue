<template>
  <v-container>
    <v-row>
      <v-col cols="5"
        ><label @click="setInteger">{{ integer }}</label></v-col
      >
      <v-col cols="2">.</v-col>
      <v-col cols="5"
        ><label @click="setDecimal">{{
          '.' + padLeadingZeros(decimal, 2)
        }}</label></v-col
      >
    </v-row>
    <v-row>
      <v-col v-if="settingInteger"
        ><v-slider
          v-model="integer"
          step="1"
          ticks
          thumb-label="always"
          :min="0"
          :max="maxInteger"
        >
          ></v-slider
        >
      </v-col>
      <v-col v-else
        ><v-slider
          v-model="decimal"
          step="5"
          ticks
          thumb-label="always"
          :min="0"
          :max="maxDecimal"
        >
          >
          <template v-slot:thumb-label="{ value }">
            {{ '.' + padLeadingZeros(value, 2) }}
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row
      ><v-col>{{ amount }}</v-col></v-row
    >
  </v-container>
</template>
<script>
export default {
  name: 'RewardPicker',
  data() {
    return {
      integer: 0,
      decimal: 0,
      settingInteger: true,
    }
  },
  computed: {
    amount() {
      this.$emit('amount', this.integer + this.decimal / 100)
      return this.integer + this.decimal / 100
    },
    maxInteger() {
      if (this.decimal === 0) {
        return 20
      } else {
        return 19
      }
    },
    maxDecimal() {
      if (this.integer === 20) {
        return 0
      } else {
        return 95
      }
    },
  },
  methods: {
    setInteger() {
      return (this.settingInteger = true)
    },
    setDecimal() {
      return (this.settingInteger = false)
    },
    padLeadingZeros(num, size) {
      let s = num + ''
      while (s.length < size) s = '0' + s
      return s
    },
  },
}
</script>
