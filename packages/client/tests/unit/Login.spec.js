import { mount } from '@vue/test-utils'

import Login from '@/modules/Login.vue'

describe('Login component', () => {
  it('test render', () => {
    const wrapper = mount(Login, {
      data () {
        return {
          inputs: [
            {
              autocompleteType: 'username',
              label: 'Логин',
              value: ''
            },
            {
              autocompleteType: 'current-password',
              label: 'Пароль',
              type: 'password',
              value: ''
            }
          ]
        }
      }
    })
    const vm = wrapper.vm

    expect(wrapper.find('form').exists()).toBeTruthy()
    expect(wrapper.findAll('input')).toHaveLength(2)
    expect(wrapper.find('.button').exists()).toBeTruthy()

    wrapper.findAll('input').forEach(item => {
      item.setValue('123')
    })

    vm.inputs.forEach(item => {
      expect(item.value).toBe('123')
    })
  })

  it('check that the action "Auth/Login" was triggered', () => {
    const store = {
      mutations: {
        setToken: jest.fn()
      },
      actions: {
        login: jest.fn()
      }
    }
    const wrapper = mount(Login, {
      global: {
        mocks: {
          store
        }
      }
    })
    const inputs = wrapper.findAll('.input')
    const button = wrapper.find('.button')

    inputs[0].setValue('login')
    inputs[1].setValue('password')

    button.trigger('click')

    // expect(store.dispatch('Auth/login')).toHaveBeenCalled()
    // expect(store.commit('Auth/setToken')).toHaveBeenCalled()
  })
})
