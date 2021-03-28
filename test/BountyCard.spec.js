import { mount } from '@vue/test-utils'
import BountyCard from '@/components/BountyCard.vue'


describe('BountyCard', () => {
 
    describe('Simple mount instance', () => {
      const wrapper = mount(BountyCard,{})
  
      test('is a Vue instance', () => {    
        expect(wrapper.vm).toBeTruthy()
      })
    
  
    })

    describe('Mount with props', () => {
        let wrapper
         beforeEach(() => {
            wrapper = mount(BountyCard,
             {
               created() {
                 //need to mock lang & theme for v-badge??
                 this.$vuetify.lang = {
                   t: () => {},
               };
               this.$vuetify.theme = { dark: false };
             },
               propsData: {
                 bounties: [{}]
               }
             })
         })
         
       })
   
  })
  

