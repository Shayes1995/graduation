import React from 'react';
import Logincomponent from '../components/login/Logincomponent';
import Registercomponent from '../components/login/Registercomponent';

const LoginRegister = () => {
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <Logincomponent />
                    </div>
                    <div className="col-md-6">
                        <Registercomponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;