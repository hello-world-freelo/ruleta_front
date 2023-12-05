import * as cookieparser from 'cookieparser'
import * as Cookie from 'js-cookie'
import { protectedService }          from "@/plugins/axios"

function getCookie(ctx, name) {
  if (process.server && !ctx.req) {
    return
  }
  // Get and parse cookies
  const cookieStr = process.client ? document.cookie : ctx.req.headers.cookie
  const cookies = cookieparser.parse(cookieStr || '') || {}

  return cookies[name]
}


export const state = () => {
  return {
    token: null,
    user: {
      name: "",
      email: "",
      email_verified_at: "",
      avatar: "",
      idUsuario: ""
    },
    loading: 0
  }
}


export const getters = {
  getToken: state => {
    return state.token
  },
  getIdUser: state => {
    return state.user.idUsuario
  },
  sessionAvatar: state => {
    return state.user.avatar ? state.user.avatar : ''
  },
}

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_SESSION_MAIN_DATA(state, payload) {
    state.user.name = payload.nombres
    state.user.email = payload.correo
    state.user.idUsuario = payload.idUsuario
    // state.user.email_verified_at = payload.email_verified_at
    // state.user.avatar = payload.avatar
  },
  SET_SHOW_LOADING(state) {
    state.loading = state.loading + 1
  },
  SET_HIDE_LOADING(state) {
    state.loading = state.loading - 1
  },
}


export let actions = {

  async initSessionMain({ dispatch, commit, state }, { token, res }) {
    // solo entra aqui si tiene un token
    // se guarda el token en la cookie y en el store
    // res = context app
    if(process.server && res) {
      res.setHeader('Set-Cookie', [`jwt_main=${token}; path=/;`]) //Set cookie ServerSide
    } else {
      Cookie.set("jwt_main", token)
    }

    commit('SET_TOKEN', token)

    try {

      const { data: authData } = await protectedService.get('/eventos/login', {
        headers: {
          'Authorization': 'Bearer ' + state.token
        }
      })

      commit('SET_SESSION_MAIN_DATA', authData[0])

    } catch (e) {
      console.log(e)
      // dispatch('resetSessionStoreAll')
    }
  },


  async nuxtClientInit({ dispatch, commit }, ctx) {
    // actualmente solo se guarda jwt_main en las Cookies
    const token = getCookie(ctx, 'jwt_main') || ''
    if(token) {
      //significa que estoy logueado
      protectedService.defaults.headers.common['Authorization'] = 'Bearer ' +token
      await dispatch('initSessionMain', { token })
    } else {
      delete protectedService.defaults.headers.common['Authorization']
    }
  }
}
