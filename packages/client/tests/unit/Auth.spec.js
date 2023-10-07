import { shallowMount } from '@vue/test-utils'
import Auth from '@/views/Auth'

test('renders a Auth component', () => {
  const wrapper = shallowMount(Auth)
  expect(wrapper.find('.auth').exists()).toBeTruthy()
})
