import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    gamesDetail: []
  }
}

export const getters = {
  gamesDetail ({ gamesDetail }) {
    return gamesDetail || []
  },
  gamesDetailById: (state) => (id) => {
    return state.gamesDetail.find(product => product.id === id)
  }
}

export const mutations = {
  SET_GAMES_DETAIL(state, payload) {
    state.gamesDetail = payload.data || []
  },
  UPDATE_GAME_DETAIL (state, award) {
    const index = state.gamesDetail.findIndex(e => e.id === ad.id)
    state.gamesDetail.splice(index, 1, award)
  },
}

export let actions = {

  async initialize ({ dispatch }) {
    try {
      const response = await dispatch('get')
      return { success: !response.error, response }
    } catch (error) {
      return { success: false, error }
    }
  },

  async get ({ commit }) {
    try {
      const response = await protectedService.get('/eventos/lista-detalle-juego')
      if (response.data) commit('SET_GAMES_DETAIL', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-detalle-juego/${id}`)
      console.log("getOne", response.data);
      if (response?.data) commit('UPDATE_GAME_DETAIL', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
