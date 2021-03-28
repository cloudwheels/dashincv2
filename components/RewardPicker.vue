<template>
  <div>
    <div>
      <v-chip color="primary" @click="openDialogSetReward()">
        <!--<v-icon>mdi-bitcoin</v-icon>-->
        {{ amountString }} DASH
      </v-chip>

      <v-dialog v-model="dialogSetReward" max-width="500px">
        <v-card>
          <v-card-title>Set Dash Reward</v-card-title>
          <v-card-text>
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
              <!--
              <v-row
                ><v-col>{{ amount }}</v-col></v-row
              >
              -->
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
            <v-btn color="blue darken-1" text @click="cancel()">Cancel</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RewardPicker',
  props: {
    setAmount: { type: String, default: '0' },
    canEdit: { type: Boolean, default: false },
  },
  data() {
    return {
      integer: 0,
      decimal: 0,
      settingInteger: true,
      dialogSetReward: false,
      originalInteger: 0,
      originalDecimal: 0,
    }
  },
  computed: {
    amount() {
      this.$emit('amount', this.integer + this.decimal / 100)
      return this.integer + this.decimal / 100
    },
    amountString() {
      return (
        this.integer.toString() + '.' + this.padLeadingZeros(this.decimal, 2)
      )
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
  mounted() {
    if (!this.setAmount.includes('.')) {
      this.integer = parseInt(this.setAmount)
      this.decimal = 0
    } else {
      this.integer = parseInt(this.setAmount.split('.')[0])
      this.decimal = parseInt(this.setAmount.split('.')[1])
    }
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
    cancel() {
      this.integer = this.originalInteger
      this.decimal = this.originalDecimal
      this.closeDialogSetReward()
    },
    save() {
      this.$emit('amountUpdated', this.amount)
      this.closeDialogSetReward()
    },
    openDialogSetReward() {
      if (!this.canEdit) {
        return
      }
      this.originalInteger = this.integer
      this.originalDecimal = this.decimal
      this.dialogSetReward = true
    },
    closeDialogSetReward() {
      this.dialogSetReward = false
    },
  },
}
</script>
