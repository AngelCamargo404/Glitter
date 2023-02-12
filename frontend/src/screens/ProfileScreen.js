import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import { Store } from '../Store';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false };
  
      default:
        return state;
    }
  };

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [lastname, setLastName] = useState(userInfo.lastname);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState(userInfo.password);
    const [confirmPassword, setConfirmPassword] = useState(userInfo.confirmPassword);

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    const submitHandler = async (e) => {
        e.preventDefault();
    
        try {
            const { data } = await axios.put(
            '/api/users/profile',
            {
                name,
                lastname,
                email,
                password,
            },
            {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            }
            );
            dispatch({
            type: 'UPDATE_SUCCESS',
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('User updated successfully');
        } catch (error) {
            dispatch({
                type: 'FETCH_FAIL',
            });
            toast.error(getError(error));
        }

    }
  
    return (
    <div className='container small-container'>
        <Helmet>
            <title>User Profile</title>
        </Helmet>
        <h1 className='my-3'>User Profile</h1>
        <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastname">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>
            <div className="mb-3">
                <Button type="submit">Update</Button>
            </div>
        </form>
    </div>
  )
}
