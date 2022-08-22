import axios from 'axios';

const client = ({ req }) => {
    if (typeof window === 'undefined') {
        // Server
        // http://ServiceName.Namespace.svc.cluster.local
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // Client
        return axios.create({
            baseURL: '/'
        });
    }
};

export default client;