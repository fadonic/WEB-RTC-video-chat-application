import { IMessage } from '../types/chat';
import { ADD_MESSAGE, ADD_HISTORY } from './chatActions';
export type chatState = {
	messages: IMessage[];
};
export type chatAction =
	| {
			type: typeof ADD_MESSAGE;
			payload: { message: IMessage };
	  }
	| {
			type: typeof ADD_HISTORY;
			payload: { history: IMessage[] };
	  };

export const chatReducer = (state: chatState, action: chatAction) => {
	switch (action.type) {
		case ADD_MESSAGE:
			return {
				...state,
				messages: [...state.messages, action.payload.message],
			};

		case ADD_HISTORY:
			return {
				...state,
				messages: action.payload.history,
			};

		default:
			return { ...state };
	}
};
