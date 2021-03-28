import { mount } from '@vue/test-utils'
import Task from '@/components/Task.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'


describe('Task', () => {
 let wrapper
  beforeEach(() => {
     wrapper = mount(Task,
      {
        created() {
          //need to mock lang & theme for v-badge??
          this.$vuetify.lang = {
            t: () => {},
        };
        this.$vuetify.theme = { dark: false };
      },
        propsData: {
          task: {id:'1234', description:'test task', completed: false, due: null}
        }
      })
  })

  test('is a Vue instance', () => {    
    expect(wrapper.vm).toBeTruthy()
  })
})
