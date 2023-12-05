import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    participants: []
  }
}

export const getters = {
  participants ({ participants }) {
    return participants || []
  },
  participantById: (state) => (id) => {
    return state.participants.find(participant => participant.id === id)
  }
}

export const mutations = {
  SET_PARTICIPANTS(state, payload) {
    state.participants = payload
  },
  UPDATE_PARTICIPANT (state, participant) {
    const index = state.participants.findIndex(e => e.id === ad.id)
    state.participants.splice(index, 1, participant)
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
      const response = await protectedService.get('/eventos/lista-participantes/10000')
      if (response.data) commit('SET_PARTICIPANTS', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-premio/${id}`)
      if (response?.data) commit('UPDATE_AWARD', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
