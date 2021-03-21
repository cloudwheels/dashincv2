import { mount } from '@vue/test-utils'
import Task from '@/components/Task.vue'

describe('Task', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Task)
    expect(wrapper.vm).toBeTruthy()
  })
})
