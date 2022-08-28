import axios from 'axios';

const client = ({ req }) => {
    if (typeof window === 'undefined') {
        // Server
        // http://ServiceName.Namespace.svc.cluster.local
        return axios.create({
            baseURL: 'http://www.ticketing-by-xx.xyz',
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