import { getRequest } from "../api";

export const sharedWebRTCApi = {
    getIceConfig: () => getRequest("/shared/webrtc/ice-config"),
};
