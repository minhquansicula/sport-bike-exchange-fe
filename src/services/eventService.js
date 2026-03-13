import api from "../config/api";

let eventsCache = null;
let fetchEventsPromise = null;

export const eventService = {
  getAllEvents: async (forceRefresh = false) => {
    if (eventsCache && !forceRefresh) return eventsCache;
    if (fetchEventsPromise && !forceRefresh) return fetchEventsPromise;

    fetchEventsPromise = api
      .get("/events")
      .then((response) => {
        eventsCache = response.data;
        fetchEventsPromise = null;
        return eventsCache;
      })
      .catch((error) => {
        fetchEventsPromise = null;
        throw error;
      });

    return fetchEventsPromise;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    eventService.clearCache();
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    eventService.clearCache();
    return response.data;
  },

  cancelEvent: async (eventId) => {
    const response = await api.put(`/events/${eventId}/cancel`);
    eventService.clearCache();
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    eventService.clearCache();
    return response.data;
  },

  clearCache: () => {
    eventsCache = null;
    fetchEventsPromise = null;
  },
};
