import API from './api';

export const getKantorDetail = async (id) => {
    const response = await API.get(`/kantor/${id}`);
    return response.data;
};

export const updateKantor = async (id, data) => {
    const response = await API.put(`/kantor/${id}`, data);
    return response.data;
};