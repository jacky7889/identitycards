// only change for these 2//

export const server = process.env.server;
export const local = process.env.local;

//No need to change//
export const DOMAIN_URL = `${server}`;
export const BASE_URL = `${server}/images`;
export const IMG_URL = `${local}/public/images`;
export const PHP_URL = `${local}/auth`;
//frontend
export const CREATE_URL = `${local}/create`;
export const READ_URL = `${local}/read`;
export const UPDATE_URL = `${local}/update`;
export const DELETE_URL = `${local}/delete`;
//backend
export const CREATE_ADMIN_URL = `${local}/admin/create`;
export const READ_ADMIN_URL = `${local}/admin/read`;
export const UPDATE_ADMIN_URL = `${local}/admin/update`;
export const DELETE_ADMIN_URL = `${local}/admin/delete`;
