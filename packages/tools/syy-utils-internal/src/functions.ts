import {
    ActionValue,
    DynamicValue,
    EditableValue,
    ListValue,
    ListAttributeValue,
    ListExpressionValue,
    ValueStatus,
    ObjectItem
} from "mendix";
import { SessionStorageKey } from "./constants";
import Big from "big.js";

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array: any[], key: string, value: string): any {
    if (!Array.isArray(array)) {
        return null;
    }
    return array.find(_ => _[key] === value);
}

export const executeAction = (action?: ActionValue): void => {
    if (action && action.canExecute && !action.isExecuting) {
        action.execute();
    }
};

export const getAttributeValueToString = (editable?: EditableValue<string | Big | any>, defaultValue = ""): string => {
    const value = getAttributeValue(editable);
    return value || defaultValue;
};

export const getAttributeValue = (editable?: EditableValue<string | Big | any>): string | undefined => {
    if (editable) {
        if (editable.value instanceof Big) {
            return editable.value.toString();
        } else {
            return editable.value;
        }
    }
    return undefined;
};

export const updateAttributeValue = (
    editable?: EditableValue<string | Big | any>,
    value?: string | string[] | any
): void => {
    if (!editable) {
        return;
    }

    // 修复 if (editable.value instanceof Big) 来做判断 时 editable.value 为空的bug
    if (editable.value instanceof Big || editable.formatter.type === "number") {
        editable.setValue(new Big(value));
    } else {
        let setValue = "";
        if (value instanceof Array) {
            setValue = value.join(",");
        } else {
            setValue = value;
        }
        editable.setValue(setValue);
    }
};

export const listIsLoading = (listValue?: ListValue): boolean => {
    return listValue !== undefined && listValue && listValue.status === ValueStatus.Loading;
};

export const listIsAvailable = (listValue?: ListValue): boolean => {
    return listValue !== undefined && listValue && listValue.status === ValueStatus.Available;
};

export const isAvailable = (property: DynamicValue<any> | EditableValue<any>): boolean => {
    return property && property.status === ValueStatus.Available && property.value;
};

export const isAvailableWithoutValue = (property: EditableValue<any>): boolean => {
    return property && property.status === ValueStatus.Available;
};

export const parseStyle = (style = ""): { [key: string]: string } => {
    try {
        return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (_) {
        return {};
    }
};

let userMenuPaths: string[] = [];

export interface UserMenuType {
    path: string;
}

/**
 * get image url
 * @param mxObject mendix object
 */
export const getImageUrl = (mxObject: mendix.lib.MxObject): Promise<string> => {
    return new Promise((resolve, reject) => {
        const url = mx.data.getDocumentUrl(mxObject.getGuid(), mxObject.get("changedDate") as number);
        mx.data.getImageUrl(url, objectUrl => resolve(objectUrl), reject);
    });
};

/**
 * get permission path from sessionStorage
 */
export const getAuthPaths = (): string[] => {
    if (userMenuPaths.length > 0) {
        return userMenuPaths;
    }

    const userMenu: UserMenuType[] = JSON.parse(window.sessionStorage.getItem(SessionStorageKey.userMenu) || "[]");

    userMenuPaths = userMenu.map(({ path }: UserMenuType) => path).filter(path => !!path);

    return userMenuPaths;
};

export const getUserRoleNames = (): string => {
    return mx.session.getConfig("roles");
};

export const hasSomeRole = (role: string[]): boolean => {
    if (undefined === role) {
        return !0;
    }
    const roleNames = getUserRoleNames();
    return role.some(role => roleNames.includes(role));
};

export const hasSomeAdminRole = (): boolean => {
    return hasSomeRole(["Administrator"]);
};

/**
 * check auth path
 * @param authPath auth path
 */
export const checkPathPermission = (authPath: string): boolean => {
    if (authPath === "") {
        return true;
    }

    // 判断是否超级管理员权限，直接显示所有权限按钮
    if (hasSomeAdminRole()) {
        return true;
    }

    const authPaths = getAuthPaths();
    // 本地没有权限资源时，不要放出权限按钮
    // if (!authPaths.length) {
    //     return true;
    // }

    return authPaths.indexOf(authPath) !== -1;
};

/**
 * 判断是否有值
 * @returns boolean true为有值
 */
export const valueIsEmpty = (value: string | string[] | undefined): boolean => {
    if (value instanceof Array) {
        return value.length <= 0;
    } else if ("undefined" === typeof value) {
        return true;
    } else {
        return value === "" || value.toString().trim() === "";
    }
};

export const valueConvertToString = (value: string | string[]): string => {
    let setValue = "";
    if (value instanceof Array) {
        setValue = value.join(",");
    } else if (value) {
        setValue = value.toString().trim();
    }

    return setValue;
};

export const valueConvertToArray = (value: string | string[]): string[] => {
    if (value instanceof Array) {
        return value;
    }

    let setValues: string[] = [];
    if (value) {
        setValues = [value.toString().trim()];
    }

    return setValues;
};

/**
 * 获取动态数据中指定属性的值
 * @param attr
 * @param item
 * @returns
 */
export const getListAttributeValue = (
    attr?: ListAttributeValue<string | Date | Big> | ListExpressionValue<string>,
    item?: ObjectItem
): any => {
    if (!attr || !item) {
        return undefined;
    }

    if (attr.get && typeof attr.get === "function") {
        return attr.get(item).value;
    }
    return attr(item).value;
};

/**
 * 获取Mendix的会话数据
 * @returns string 会话数据
 */
export const getSessionData = (): any => {
    let sessionData = {};
    try {
        if (localStorage.session) {
            sessionData = JSON.parse(localStorage.session);
        }
    } catch {
        sessionData = {};
    }

    return sessionData;
};

/**
 * 获取指定Key的会话数据
 * @returns string 指定Key的值
 */
export const getSessionDataByKey = (key: string): string | undefined | null => {
    let value = sessionStorage.getItem(key);
    if (!value) {
        const sessionData = getSessionData();
        value = sessionData[key];
    }

    return value;
};
