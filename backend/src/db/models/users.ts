import { QueryResultRow } from "pg";
import { query } from "../../config/db";
import {
    findRecords,
    createRecords,
    updateRecords,
    deleteRecords,
} from "../query-builder/index";
import { tables } from "../tables";

import {
    FindOptions,
    UpdateOptions,
    DeleteOptions,
} from "../../types/dbServices.type";

async function getUsers(filter: FindOptions, returning: string[] = ["*"]) {
    try {
        const { text, params } = findRecords(tables.users, returning, filter);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}

async function createUser<T extends QueryResultRow>(data: T) {
    try {
        const { text, params } = createRecords<T>(tables.users, data);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}

async function updateUser<T extends QueryResultRow>(
    data: Partial<T>,
    options: UpdateOptions
) {
    try {
        const { text, params } = updateRecords<T>(tables.users, data, options);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}

async function deleteUser<T extends QueryResultRow>(options: DeleteOptions) {
    try {
        const { text, params } = deleteRecords<T>(tables.users, options);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}
export { getUsers, createUser, updateUser, deleteUser };
