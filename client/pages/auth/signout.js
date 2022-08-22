import { useEffect } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use_request";

const signoutPage = () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, []);
};

export default signoutPage;