import React from 'react';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { Link } from 'react-router-dom';

const ExtraNeeds = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-emerald-700 mb-6">Extra Needs</h1>

            <div className="space-y-3">
                <p className="text-xl font-semibold text-red-600 uppercase">Important</p>
                <p>Add your extra needs here.</p>
                <p>This will help you get a room according to your requirements.</p>
                <p>
                    Please note, the warden must approve your request for you to be assigned a room based on your needs.
                </p>
                <p>
                    If the warden does not approve your request, you will be assigned a room automatically like others.
                </p>
            </div>

            <div className="mt-4">
                <Link to={'/Dashboard/CreateExtraNeeds'}>
                    <DefaultBtn 
                        type='button'
                        label='Add Your Requirements'
                    />
                </Link>
            </div>
        </div>
    );
};

export default ExtraNeeds;
