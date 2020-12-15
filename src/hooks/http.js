import { useReducer, useCallback } from "react";

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    method: null,
};

const httpStateReducer = (currHttpState, action) => {
    switch (action.type) {
        case "SEND":
            return {
                loading: true,
                error: null,
                data: null,
            };
        case "RESPONSE":
            return {
                ...currHttpState,
                loading: false,
                data: action.responseData,
                extra: action.extra,
                method: action.method,
            };
        case "ERROR":
            return { loading: false, error: action.errorMessage };
        case "CLEAR":
            return initialState;
        default:
            throw new Error("Never going here!!");
    }
};
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(
        httpStateReducer,
        initialState
    );
    const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);
    const sendRequest = useCallback(async (url, method, body, reqExtra) => {
        try {
            dispatchHttp({ type: "SEND" });
            const res = await fetch(url, {
                method: method,
                body: body,
                headers: { "Content-Type": "application/json" },
            });
            const resData = await res.json();
            if (res.ok) {
                dispatchHttp({
                    type: "RESPONSE",
                    responseData: resData,
                    extra: reqExtra,
                    method: method,
                });
            }
        } catch (err) {
            dispatchHttp({
                type: "ERROR",
                errorMessage: "Something Were Wrong!!",
            });
        }
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        method: httpState.method,
        clear: clear,
    };
};

export default useHttp;
