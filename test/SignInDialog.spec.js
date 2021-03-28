import { mount } from '@vue/test-utils'
import SignInDialog from '@/components/SignInDialog.vue'



describe('SignInDialog', () => {
 
  describe('Simple mount instance', () => {
    const wrapper = mount(SignInDialog,{})

    test('is a Vue instance', () => {    
      expect(wrapper.vm).toBeTruthy()
    })
  

  })
 
})
