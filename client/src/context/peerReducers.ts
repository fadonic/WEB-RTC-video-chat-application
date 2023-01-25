import { ADD_PEER, REMOVE_PEER } from './peerActions';
export type peerState = Record<string, { stream: MediaStream }>;
export type peerAction =
	| {
			type: string;
			payload: { peerId: string; stream?: MediaStream };
	  }
	| {
			type: string;
			payload: { peerId: string; stream?: null };
	  };

export const peerReducer = (state: peerState, action: peerAction) => {
	switch (action.type) {
		case ADD_PEER:
			return {
				...state,
				[action.payload.peerId]: { stream: action.payload.stream },
			};

		case REMOVE_PEER:
			const { [action.payload.peerId]: deleted, ...rest } = state;
			return rest;

		default:
			return state;
	}
};
