import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use_request";

const signinPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    type="email" className="form-control" id="email" placeholder="name@example.com"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    type="password" className="form-control" id="password"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </form>
    );
};

export default signinPage;