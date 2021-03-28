import { mount } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'
import Task from '@/components/Task.vue'

describe('TaskList', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TaskList,
      {
        created() {
          //need to mock lang & theme for v-badge??
          this.$vuetify.lang = {
            t: () => {},
        };
        this.$vuetify.theme = { dark: false };
      },
        propsData: {
          tasks: [{id:'1234', description:'test task', completed: false, due: null}]
        }
      })
  })
  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('contains a single Task Component when passed in props', () => {
      const tasks = wrapper.findAllComponents(Task)
      expect(tasks).toHaveLength(1)
  })

  test('reports total tasks as 1', () => {
    expect(wrapper.vm.totalTasks).toBe(1)
})

})


